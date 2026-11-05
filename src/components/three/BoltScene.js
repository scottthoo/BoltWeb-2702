import {
  Color,
  DirectionalLight,
  DynamicDrawUsage,
  Euler,
  Group,
  HemisphereLight,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  NeutralToneMapping,
  PCFShadowMap,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  PMREMGenerator,
  Quaternion,
  Raycaster,
  Scene,
  ShadowMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/*
 * "Scattered effort, assembled into one system."
 *
 * Clay blocks start scattered around the frame and assemble, top to bottom like
 * a lightning strike, into a voxel version of the Bolt logo (the Font Awesome 6
 * bolt used in the navbar). Once assembled the bolt sways gently, a soft current
 * of light runs down it, the cursor pushes blocks out of place (friction) and
 * they settle back, and a click sends a shockwave through it. Scrolling past the
 * hero slowly breaks the system apart again.
 */

// Font Awesome 6 "bolt" silhouette (viewBox 448x512, y down), reduced to its six corners.
const BOLT_POLYGON = [
  [345, 15],
  [40, 280],
  [176, 288],
  [100, 497],
  [410, 232],
  [272, 224],
];
const VIEWBOX = { w: 448, h: 512 };
const CELL = 25; // viewBox units per voxel; sets the bolt's resolution
const DEPTH = 2; // voxel layers front to back
const SPACING = 1;
const CUBE = 0.9;

const SAND = ["#EFE5D3", "#E6D7BE", "#DCC9AA", "#D1BB97"];
const CLAY = ["#9E4220", "#A84A24", "#8E3B1C"];
const CLAY_SHARE = 0.16;
const CURRENT = new Color("#FFF6E8");
const CLAY_CURRENT = new Color("#CF7447");

const INTRO_DELAY = 0.25;
const INTRO_SPREAD = 1.15; // seconds between the first (top) and last (bottom) block starting
const INTRO_DURATION = 1.3;
const WAVE_PERIOD = 6.5;
const WAVE_DURATION = 1.6;
const PUSH_RADIUS = 3.3;
const PULSE_RADIUS = 7;

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const easeOutBack = (x) => {
  const c1 = 1.25;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

function insidePolygon(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/** Rasterises the bolt polygon into voxel centres, centred on the origin. */
function buildVoxels() {
  const cols = Math.ceil(VIEWBOX.w / CELL);
  const rows = Math.ceil(VIEWBOX.h / CELL);
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (insidePolygon((c + 0.5) * CELL, (r + 0.5) * CELL, BOLT_POLYGON)) {
        cells.push([c, r]);
      }
    }
  }
  const minC = Math.min(...cells.map(([c]) => c));
  const maxC = Math.max(...cells.map(([c]) => c));
  const minR = Math.min(...cells.map(([, r]) => r));
  const maxR = Math.max(...cells.map(([, r]) => r));
  const cx = (minC + maxC) / 2;
  const cy = (minR + maxR) / 2;

  const voxels = [];
  for (const [c, r] of cells) {
    for (let k = 0; k < DEPTH; k++) {
      voxels.push(
        new Vector3(
          (c - cx) * SPACING,
          -(r - cy) * SPACING,
          (k - (DEPTH - 1) / 2) * SPACING
        )
      );
    }
  }
  return {
    voxels,
    width: (maxC - minC + 1) * SPACING,
    height: (maxR - minR + 1) * SPACING,
  };
}

// Small deterministic PRNG so the composition is identical on every visit.
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class BoltScene {
  constructor(container, { reducedMotion = false } = {}) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.elapsed = reducedMotion ? 1e4 : 0; // reduced motion starts fully assembled
    this.lastFrame = 0;
    this.visible = true;
    this.running = false;
    this.dirty = true;

    const compact = Math.min(container.clientWidth, container.clientHeight) < 560;

    // Throws when WebGL is unavailable; the React wrapper falls back to a static image.
    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2));
    renderer.toneMapping = NeutralToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;
    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.touchAction = "pan-y";
    container.appendChild(canvas);
    this.renderer = renderer;

    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    this.envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    scene.environment = this.envTexture;
    scene.environmentIntensity = 0.5;
    this.scene = scene;

    this.camera = new PerspectiveCamera(26, 1, 0.1, 200);

    scene.add(new HemisphereLight("#FFF8EE", "#CDB38E", 1.1));
    const key = new DirectionalLight("#FFF2DE", 2.3);
    key.position.set(7, 8, 11);
    key.castShadow = true;
    key.shadow.mapSize.set(compact ? 1024 : 2048, compact ? 1024 : 2048);
    key.shadow.radius = 7;
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.02;
    Object.assign(key.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 60 });
    scene.add(key);

    // An invisible "page" behind the bolt that only shows the shadow it receives,
    // so the object reads as floating just off the beige hero.
    this.backdrop = new Mesh(
      new PlaneGeometry(120, 120),
      new ShadowMaterial({ color: "#5B3A1E", opacity: 0.2 })
    );
    this.backdrop.position.z = -5;
    this.backdrop.receiveShadow = true;
    scene.add(this.backdrop);

    this.group = new Group();
    this.baseYaw = -0.32;
    this.group.rotation.y = this.baseYaw;
    scene.add(this.group);

    this.#buildBlocks();

    this.raycaster = new Raycaster();
    this.ndc = new Vector2();
    this.pointerPlane = new Plane(new Vector3(0, 0, 1), 0);
    this.pointerHit = new Vector3();
    this.pointerLocal = new Vector3();
    this.pointerActive = false;

    this.#bindEvents();
    this.#resize();
  }

  #buildBlocks() {
    const { voxels, width, height } = buildVoxels();
    this.boltWidth = width;
    this.boltHeight = height;
    const count = voxels.length;
    this.count = count;
    const rand = mulberry32(20260705);

    const geometry = new RoundedBoxGeometry(CUBE, CUBE, CUBE, 3, 0.13);
    const material = new MeshStandardMaterial({ roughness: 0.68, metalness: 0 });
    const mesh = new InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false; // scattered blocks sit far outside the geometry's bounds
    this.mesh = mesh;
    this.group.add(mesh);

    this.target = voxels;
    this.startPos = [];
    this.startQuat = [];
    this.spinAxis = [];
    this.delay = new Float32Array(count);
    this.offset = voxels.map(() => new Vector3());
    this.kick = voxels.map(() => new Vector3());
    this.scatterDir = [];
    this.baseColor = [];
    this.currentColor = [];

    const top = height / 2;
    const color = new Color();
    for (let i = 0; i < count; i++) {
      const t = voxels[i];

      // Start somewhere in a wide band around the frame, never behind the backdrop.
      const angle = rand() * Math.PI * 2;
      const radius = 11 + rand() * 9;
      this.startPos.push(
        new Vector3(
          Math.cos(angle) * radius * 1.25,
          Math.sin(angle) * radius * 0.8,
          -1.5 + rand() * 6.5
        )
      );
      this.startQuat.push(
        new Quaternion().setFromEuler(
          new Euler(rand() * Math.PI * 2, rand() * Math.PI * 2, rand() * Math.PI * 2)
        )
      );
      this.spinAxis.push(new Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize());

      // Strike from the top down.
      this.delay[i] = ((top - t.y) / height) * INTRO_SPREAD + rand() * 0.35;

      this.scatterDir.push(
        new Vector3(t.x + (rand() - 0.5) * 6, t.y + (rand() - 0.5) * 6, 2 + rand() * 5)
          .normalize()
          .multiplyScalar(0.6 + rand() * 0.8)
      );

      const isClay = rand() < CLAY_SHARE;
      const palette = isClay ? CLAY : SAND;
      color.set(palette[Math.floor(rand() * palette.length)]);
      this.baseColor.push(color.clone());
      // Lifting terracotta toward white turns it pink, so it brightens toward a lighter clay.
      this.currentColor.push(isClay ? CLAY_CURRENT : CURRENT);
      mesh.setColorAt(i, color);
    }
    mesh.instanceColor.setUsage(DynamicDrawUsage);
    this.waveActive = false;

    this.tmpPos = new Vector3();
    this.tmpQuat = new Quaternion();
    this.tmpWobble = new Quaternion();
    this.tmpMatrix = new Matrix4();
    this.tmpScale = new Vector3(1, 1, 1);
    this.tmpColor = new Color();
    this.identity = new Quaternion();
  }

  #bindEvents() {
    const el = this.container;
    this.onPointerMove = (e) => {
      const rect = el.getBoundingClientRect();
      this.ndc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      this.pointerActive = true;
      this.dirty = true;
    };
    this.onPointerLeave = () => {
      this.pointerActive = false;
      this.dirty = true;
    };
    this.onPointerDown = (e) => {
      this.onPointerMove(e);
      this.#pulse();
    };
    el.addEventListener("pointermove", this.onPointerMove);
    el.addEventListener("pointerleave", this.onPointerLeave);
    el.addEventListener("pointercancel", this.onPointerLeave);
    el.addEventListener("pointerdown", this.onPointerDown);

    this.resizeObserver = new ResizeObserver(() => this.#resize());
    this.resizeObserver.observe(el);

    // Only animate while the hero is on screen, and hold the intro until enough
    // of it is in view to be seen (on phones it starts below the fold).
    this.introArmed = this.reducedMotion;
    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
        if (entry.intersectionRatio >= 0.45) this.introArmed = true;
        this.#updateLoop();
      },
      { threshold: [0, 0.45] }
    );
    this.intersectionObserver.observe(el);

    this.onContextLost = (e) => {
      e.preventDefault();
      this.renderer.setAnimationLoop(null);
    };
    this.renderer.domElement.addEventListener("webglcontextlost", this.onContextLost);
  }

  #resize() {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    this.camera.aspect = aspect;

    // Fit the assembled bolt with breathing room, whatever the container's shape.
    const tanHalf = Math.tan((this.camera.fov * Math.PI) / 360);
    const fitH = (this.boltHeight * 0.5 * 1.32) / tanHalf;
    const fitW = (this.boltWidth * 0.5 * 1.5) / (tanHalf * aspect);
    const dist = Math.max(fitH, fitW);
    this.camera.position.set(0, dist * 0.06, dist);
    this.camera.lookAt(0, -0.4, 0);
    this.camera.updateProjectionMatrix();
    this.dirty = true;
    if (!this.running) this.#render();
  }

  #updatePointer() {
    if (!this.pointerActive) return false;
    this.raycaster.setFromCamera(this.ndc, this.camera);
    if (!this.raycaster.ray.intersectPlane(this.pointerPlane, this.pointerHit)) return false;
    this.group.updateMatrixWorld();
    this.pointerLocal.copy(this.pointerHit);
    this.group.worldToLocal(this.pointerLocal);
    return true;
  }

  #pulse() {
    if (!this.#updatePointer()) return;
    const p = this.pointerLocal;
    for (let i = 0; i < this.count; i++) {
      const t = this.target[i];
      const dx = t.x - p.x;
      const dy = t.y - p.y;
      const d = Math.hypot(dx, dy) || 1e-3;
      const f = Math.pow(clamp01(1 - d / PULSE_RADIUS), 1.5);
      if (f <= 0) continue;
      this.kick[i].x += (dx / d) * f * 2.4;
      this.kick[i].y += (dy / d) * f * 2.4;
      this.kick[i].z += f * 4.5;
    }
    this.dirty = true;
  }

  #scrollProgress() {
    if (this.reducedMotion) return 0;
    const rect = this.container.getBoundingClientRect();
    // Stay assembled until a third of the scene has scrolled away, then come apart.
    return clamp01((-rect.top - rect.height * 0.35) / (rect.height * 0.6));
  }

  #frame = (now) => {
    const dt = this.lastFrame ? Math.min((now - this.lastFrame) / 1000, 1 / 20) : 1 / 60;
    this.lastFrame = now;
    if (!this.reducedMotion && this.introArmed) this.elapsed += dt;
    const time = this.elapsed;

    const hasPointer = this.#updatePointer();
    const scatter = easeOutCubic(this.#scrollProgress()) * 5;

    const sway = this.reducedMotion ? 0 : 1;
    const targetYaw =
      this.baseYaw +
      sway * Math.sin(time * 0.32) * 0.22 +
      (hasPointer ? this.ndc.x * 0.12 : 0);
    const targetPitch = sway * Math.sin(time * 0.21) * 0.05 + (hasPointer ? -this.ndc.y * 0.05 : 0);
    const follow = 1 - Math.exp(-dt * 2.5);
    this.group.rotation.y += (targetYaw - this.group.rotation.y) * follow;
    this.group.rotation.x += (targetPitch - this.group.rotation.x) * follow;
    this.group.position.y = sway * Math.sin(time * 0.7) * 0.12;

    const spring = 1 - Math.exp(-dt * 7);
    const kickDecay = Math.exp(-dt * 2.6);
    const top = this.boltHeight / 2;
    let motion = 0;

    // A soft current of light runs down the assembled bolt every few seconds.
    const introEnd = INTRO_DELAY + INTRO_SPREAD + 0.35 + INTRO_DURATION;
    const waveClock = time - introEnd;
    const waveOn = !this.reducedMotion && waveClock > 0 && waveClock % WAVE_PERIOD < WAVE_DURATION;
    const waveY = top + 2 - ((waveClock % WAVE_PERIOD) / WAVE_DURATION) * (this.boltHeight + 4);

    for (let i = 0; i < this.count; i++) {
      const t = this.target[i];
      const off = this.offset[i];
      const kick = this.kick[i];

      const a = clamp01((time - INTRO_DELAY - this.delay[i]) / INTRO_DURATION);
      const ep = easeOutBack(a);
      const er = easeOutCubic(a);
      const pos = this.tmpPos.lerpVectors(this.startPos[i], t, ep);
      pos.z += Math.sin(Math.PI * er) * 2.2; // swoop toward the viewer on the way in

      // Friction: blocks near the cursor bulge out of place, then settle back.
      let gx = 0;
      let gy = 0;
      let gz = 0;
      if (hasPointer && a >= 1) {
        const dx = t.x - this.pointerLocal.x;
        const dy = t.y - this.pointerLocal.y;
        const d = Math.hypot(dx, dy) || 1e-3;
        const f = Math.pow(clamp01(1 - d / PUSH_RADIUS), 2);
        gx = (dx / d) * f * 1.4;
        gy = (dy / d) * f * 1.4;
        gz = f * 2.2;
      }
      off.x += (gx - off.x) * spring;
      off.y += (gy - off.y) * spring;
      off.z += (gz - off.z) * spring;
      kick.multiplyScalar(kickDecay);

      const s = this.scatterDir[i];
      pos.x += off.x + kick.x + s.x * scatter;
      pos.y += off.y + kick.y + s.y * scatter;
      pos.z += off.z + kick.z + s.z * scatter;

      const disturbance = off.length() + kick.length() + scatter * 0.6;
      motion = Math.max(motion, disturbance);

      const q = this.tmpQuat.slerpQuaternions(this.startQuat[i], this.identity, er);
      if (disturbance > 1e-4) {
        this.tmpWobble.setFromAxisAngle(this.spinAxis[i], disturbance * 0.55);
        q.multiply(this.tmpWobble);
      }
      this.mesh.setMatrixAt(i, this.tmpMatrix.compose(pos, q, this.tmpScale));

      if (waveOn) {
        const w = Math.exp(-((t.y - waveY) ** 2) / 2.2) * 0.5;
        this.mesh.setColorAt(i, this.tmpColor.copy(this.baseColor[i]).lerp(this.currentColor[i], w));
      }
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    if (waveOn || this.waveActive) {
      if (!waveOn) {
        for (let i = 0; i < this.count; i++) this.mesh.setColorAt(i, this.baseColor[i]);
      }
      this.mesh.instanceColor.needsUpdate = true;
      this.waveActive = waveOn;
    }

    // With reduced motion nothing moves on its own, so only draw while settling.
    if (this.reducedMotion && !this.dirty && motion < 1e-3) return;
    this.dirty = motion >= 1e-3;
    this.#render();
  };

  #render() {
    this.renderer.render(this.scene, this.camera);
  }

  #updateLoop() {
    const shouldRun = this.visible && !this.disposed;
    if (shouldRun === this.running) return;
    this.running = shouldRun;
    this.lastFrame = 0;
    this.renderer.setAnimationLoop(shouldRun ? this.#frame : null);
  }

  start() {
    this.#updateLoop();
  }

  dispose() {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    const el = this.container;
    el.removeEventListener("pointermove", this.onPointerMove);
    el.removeEventListener("pointerleave", this.onPointerLeave);
    el.removeEventListener("pointercancel", this.onPointerLeave);
    el.removeEventListener("pointerdown", this.onPointerDown);
    this.renderer.domElement.removeEventListener("webglcontextlost", this.onContextLost);

    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh.dispose();
    this.backdrop.geometry.dispose();
    this.backdrop.material.dispose();
    this.envTexture.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}
