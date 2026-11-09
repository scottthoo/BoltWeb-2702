import {
  BoxGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  DynamicDrawUsage,
  Group,
  HemisphereLight,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Quaternion,
  Raycaster,
  Scene,
  ShadowMaterial,
  SphereGeometry,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/*
 * "Fig. 02 · Made after hours."
 *
 * Two small things left on the top edge of the footer, which doubles as a shelf:
 *
 * - A seed head for Math·beauty: a sand ball whose face is covered in beads
 *   placed one golden angle (137.5°) apart, the rule behind a sunflower head.
 *   It turns slowly like a pinwheel. On hover the angle drifts a fraction of a
 *   degree either side, and the spiral arms dissolve and re-form.
 * - Three toy blocks, A B C, for the kid games. On hover they hop in turn.
 *
 * The shelf itself is an invisible plane that only shows the shadows it
 * receives. The camera is offset so the shelf's front edge lands exactly on the
 * footer's top edge, `below` CSS pixels above the bottom of the canvas.
 */

const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const SEEDS = 170;
const SEED_RADIUS = 0.56; // the sand ball
const CAP = 1.22; // the seeded face reaches this far (radians) from its centre
const BEAD = 0.042; // the outermost bead's radius; beads grow from the centre out
const FACE_TILT = -0.22; // tips the seeded face up toward the camera
const SAND = "#E6D7BE";
const INK = "#3E2F23";
const SEED_CLAY = "#B0684A";

const BLOCK = 0.5;
const BLOCKS = [
  // letter, block colour, letter colour, position (x, y on the shelf), yaw
  { letter: "A", body: "#A84A24", ink: "#FAF6EE", at: [0.0, 0], yaw: -0.18 },
  { letter: "B", body: "#E6D7BE", ink: "#A84A24", at: [0.56, 0], yaw: 0.16 },
  { letter: "C", body: "#3E2F23", ink: "#EBE1CF", at: [0.29, 1], yaw: 0.42 },
];

const SHELF_FRONT = 0.42; // z of the shelf's front edge: the footer's top edge
const SEED_GAP = 1.16; // from the seed head's centre to the blocks' origin
const BLOCKS_RIGHT = 0.86; // from the blocks' origin to their right-hand edge
// World units to fit across the canvas: both objects, plus room on the left for
// the shadows, which fall left because the light comes from the right (as on
// the hero bolt). The objects are right-aligned, flush with the caption below.
const CONTENT_WIDTH = 3.0;
const CONTENT_HEIGHT = 1.55; // tallest thing above the shelf, with its hover lift

const approach = (value, target, rate, dt) => value + (target - value) * (1 - Math.exp(-dt * rate));

function letterTexture(letter, ink) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${size * 0.74}px Fraunces, Georgia, serif`;
  ctx.fillText(letter, size / 2, size * 0.54);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export class AfterHoursScene {
  constructor(container, { reducedMotion = false, below = 18, onHover, onPick } = {}) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.below = below;
    this.onHover = onHover;
    this.onPick = onPick;
    this.active = null; // "math" | "kids" | null, set by the page (hover, focus or tap)
    this.hoverId = null;
    this.time = 0;
    this.lastFrame = 0;
    this.visible = false;
    this.running = false;
    this.dirty = true;
    this.bloom = 0;
    this.lift = { math: 0, kids: 0 };
    this.hopStart = -10;

    // Throws when WebGL is unavailable; the React wrapper then shows plain links.
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
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

    this.camera = new PerspectiveCamera(22, 1, 0.1, 100);

    // The same warm studio light as the hero bolt.
    scene.add(new HemisphereLight("#FFF8EE", "#CDB38E", 1.1));
    const key = new DirectionalLight("#FFF2DE", 2.4);
    key.position.set(4, 6, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 6;
    key.shadow.bias = -0.0008;
    key.shadow.normalBias = 0.02;
    Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 20 });
    scene.add(key);

    // The shelf: a horizontal plane from the footer's edge back, shadows only.
    this.shelf = new Mesh(new PlaneGeometry(12, 6), new ShadowMaterial({ color: "#5B3A1E", opacity: 0.2 }));
    this.shelf.rotation.x = -Math.PI / 2;
    this.shelf.position.z = SHELF_FRONT - 3;
    this.shelf.receiveShadow = true;
    scene.add(this.shelf);

    this.#buildSeedBall();
    this.#buildBlocks();

    this.raycaster = new Raycaster();
    this.ndc = new Vector2();
    this.#bindEvents();
    this.#resize();
  }

  #buildSeedBall() {
    const group = new Group();
    group.position.set(0, SEED_RADIUS, -0.05); // x is set in #resize
    group.rotation.x = FACE_TILT;
    this.seedGroup = group;
    this.scene.add(group);

    const ball = new Mesh(new SphereGeometry(SEED_RADIUS, 48, 32), new MeshStandardMaterial({ color: SAND, roughness: 0.7 }));
    ball.castShadow = true;
    ball.receiveShadow = true;
    group.add(ball);

    // The seeded face turns about its own centre, like a pinwheel.
    const spin = new Group();
    group.add(spin);
    this.seedSpin = spin;

    const mesh = new InstancedMesh(
      new SphereGeometry(1, 12, 8),
      new MeshStandardMaterial({ roughness: 0.42, metalness: 0 }),
      SEEDS
    );
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    mesh.castShadow = true;
    const ink = new Color(INK);
    const clay = new Color(SEED_CLAY);
    for (let i = 0; i < SEEDS; i++) {
      // Seeds 13 apart are neighbours along one spiral (13 is a Fibonacci
      // number), so colouring every 13th in clay picks out a single arm.
      mesh.setColorAt(i, i % 13 === 0 ? clay : ink);
    }
    spin.add(mesh);
    this.seeds = mesh;

    // An invisible ball to hover and click.
    this.seedHit = new Mesh(new SphereGeometry(SEED_RADIUS * 1.15, 16, 12), new MeshBasicMaterial({ visible: false }));
    this.seedHit.userData.id = "math";
    group.add(this.seedHit);

    this.tmpMatrix = new Matrix4();
    this.tmpPos = new Vector3();
    this.tmpScale = new Vector3();
    this.identity = new Quaternion();
    this.#layoutSeeds(GOLDEN, 0);
  }

  /**
   * Vogel's sunflower model on the ball's face: seed i sits `angle` further
   * round than seed i - 1, at the distance that gives every seed an equal
   * share of the face, so the face fills evenly from the centre out.
   */
  #layoutSeeds(angle, bloom) {
    const capArea = 1 - Math.cos(CAP);
    for (let i = 0; i < SEEDS; i++) {
      const share = (i + 0.5) / SEEDS;
      const psi = Math.acos(1 - share * capArea);
      const theta = i * angle;
      const s = BEAD * (0.5 + 0.5 * Math.sqrt(share)) * (1 + bloom * 0.1);
      const r = SEED_RADIUS + s * 0.45;
      this.tmpPos.set(Math.sin(psi) * Math.cos(theta) * r, Math.sin(psi) * Math.sin(theta) * r, Math.cos(psi) * r);
      this.tmpScale.set(s, s, s);
      this.seeds.setMatrixAt(i, this.tmpMatrix.compose(this.tmpPos, this.identity, this.tmpScale));
    }
    this.seeds.instanceMatrix.needsUpdate = true;
  }

  #buildBlocks() {
    const group = new Group();
    group.position.set(0, 0, -0.02); // x is set in #resize
    this.blockGroup = group;
    this.scene.add(group);

    const geometry = new RoundedBoxGeometry(BLOCK, BLOCK, BLOCK, 3, 0.07);
    const face = new PlaneGeometry(BLOCK * 0.8, BLOCK * 0.8);
    this.blocks = BLOCKS.map((spec) => {
      const block = new Group();
      const body = new Mesh(geometry, new MeshStandardMaterial({ color: spec.body, roughness: 0.68 }));
      body.castShadow = true;
      body.receiveShadow = true;
      block.add(body);
      const letter = new Mesh(
        face,
        new MeshStandardMaterial({ map: letterTexture(spec.letter, spec.ink), transparent: true, roughness: 0.6 })
      );
      letter.position.z = BLOCK / 2 + 0.003;
      block.add(letter);
      const [x, row] = spec.at;
      block.userData.rest = new Vector3(x, BLOCK / 2 + row * BLOCK, 0);
      block.position.copy(block.userData.rest);
      block.rotation.y = spec.yaw;
      group.add(block);
      return block;
    });

    // An invisible box around the little stack to hover and click.
    this.blockHit = new Mesh(new BoxGeometry(BLOCK * 2.4, BLOCK * 2.3, BLOCK * 1.4), new MeshBasicMaterial({ visible: false }));
    this.blockHit.position.set(0.28, BLOCK * 1.1, 0);
    this.blockHit.userData.id = "kids";
    group.add(this.blockHit);
  }

  #bindEvents() {
    const el = this.container;
    this.onPointerMove = (e) => {
      const id = this.#pick(e);
      if (id !== this.hoverId) {
        this.hoverId = id;
        el.style.cursor = id ? "pointer" : "";
        this.onHover?.(id);
      }
    };
    this.onPointerLeave = () => {
      if (this.hoverId === null) return;
      this.hoverId = null;
      el.style.cursor = "";
      this.onHover?.(null);
    };
    this.onPointerDown = (e) => {
      this.pointerType = e.pointerType;
    };
    this.onClick = (e) => {
      const id = this.#pick(e);
      if (id) this.onPick?.(id, this.pointerType || "mouse");
    };
    el.addEventListener("pointermove", this.onPointerMove);
    el.addEventListener("pointerleave", this.onPointerLeave);
    el.addEventListener("pointercancel", this.onPointerLeave);
    el.addEventListener("pointerdown", this.onPointerDown);
    el.addEventListener("click", this.onClick);

    this.resizeObserver = new ResizeObserver(() => this.#resize());
    this.resizeObserver.observe(el);

    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.#updateLoop();
    });
    this.intersectionObserver.observe(el);

    this.onContextLost = (e) => {
      e.preventDefault();
      this.renderer.setAnimationLoop(null);
    };
    this.renderer.domElement.addEventListener("webglcontextlost", this.onContextLost);
  }

  #pick(e) {
    const rect = this.container.getBoundingClientRect();
    this.ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const [hit] = this.raycaster.intersectObjects([this.seedHit, this.blockHit], false);
    return hit ? hit.object.userData.id : null;
  }

  #resize() {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(w, h, false);
    const camera = this.camera;
    camera.aspect = w / h;

    // Far enough back that the content fits across the canvas and, above the
    // shelf line, inside the strip of page between the footer and the text above it.
    const tanHalf = Math.tan((camera.fov * Math.PI) / 360);
    const above = h - this.below;
    const byWidth = (CONTENT_WIDTH * h) / (0.94 * w * 2 * tanHalf);
    const byHeight = (CONTENT_HEIGHT * h) / ((above - 4) * 2 * tanHalf);
    const dist = Math.max(byWidth, byHeight);
    const pitch = 0.16; // a little from above, so the shadows on the shelf read
    camera.position.set(0, 0.6 + Math.sin(pitch) * dist, Math.cos(pitch) * dist);
    camera.lookAt(0, 0.6, 0);

    // Right-align the objects with the canvas edge (the caption's right edge).
    const halfWidth = dist * tanHalf * camera.aspect;
    this.blockGroup.position.x = halfWidth * 0.97 - BLOCKS_RIGHT;
    this.seedGroup.position.x = this.blockGroup.position.x - SEED_GAP;

    camera.clearViewOffset();
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    // Shift the view so the shelf's front edge sits `below` px above the canvas bottom.
    const edge = new Vector3(0, 0, SHELF_FRONT).project(camera);
    const edgeRow = ((1 - edge.y) / 2) * h;
    camera.setViewOffset(w, h, 0, edgeRow - above, w, h);
    camera.updateProjectionMatrix();
    this.dirty = true;
    if (!this.running) this.#render();
  }

  /** The page says which object is in focus (hover, keyboard focus or a tap). */
  setActive(id) {
    if (id === this.active) return;
    if (id === "kids") this.hopStart = this.time;
    this.active = id;
    this.dirty = true;
    if (!this.running) this.#render();
  }

  #frame = (now) => {
    const dt = this.lastFrame ? Math.min((now - this.lastFrame) / 1000, 1 / 20) : 1 / 60;
    this.lastFrame = now;
    this.time += dt;
    const t = this.time;
    const calm = this.reducedMotion;

    // Seed ball: a slow turn, a lift and a bloom when it is the active one.
    const mathOn = this.active === "math" ? 1 : 0;
    const kidsOn = this.active === "kids" ? 1 : 0;
    const before = this.bloom + this.lift.math + this.lift.kids;
    this.bloom = calm ? mathOn : approach(this.bloom, mathOn, 3, dt);
    this.lift.math = calm ? mathOn : approach(this.lift.math, mathOn, 6, dt);
    this.lift.kids = calm ? kidsOn : approach(this.lift.kids, kidsOn, 6, dt);
    const settling = Math.abs(this.bloom + this.lift.math + this.lift.kids - before) > 1e-4;

    if (!calm) this.seedSpin.rotation.z -= dt * (0.12 + this.bloom * 0.3);
    this.seedGroup.position.y = SEED_RADIUS + this.lift.math * 0.08;
    // The golden angle, drifting up to half a degree either side while hovered:
    // the spiral arms (the Fibonacci parastichies) dissolve and re-form.
    const drift = calm ? 0 : this.bloom * 0.0085 * Math.sin(t * 0.8);
    this.#layoutSeeds(GOLDEN + drift, this.bloom);

    // Blocks: hop in turn, A then B then C, every 1.6 s while active.
    this.blocks.forEach((block, i) => {
      const rest = block.userData.rest;
      let hop = 0;
      if (!calm && this.lift.kids > 0.01) {
        const phase = ((t - this.hopStart) % 1.6) - i * 0.12;
        hop = phase > 0 && phase < 0.42 ? Math.sin((phase / 0.42) * Math.PI) * 0.16 : 0;
      }
      block.position.y = rest.y + this.lift.kids * 0.05 + hop * this.lift.kids;
      block.rotation.z = hop * 0.4 * (i % 2 ? -1 : 1);
    });

    // With reduced motion nothing moves on its own, so only draw while settling.
    if (calm && !this.dirty && !settling) return;
    this.dirty = settling;
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
    this.#render();
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
    el.removeEventListener("click", this.onClick);
    this.renderer.domElement.removeEventListener("webglcontextlost", this.onContextLost);

    this.scene.traverse((object) => {
      if (!object.isMesh) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        material.map?.dispose();
        material.dispose();
      }
    });
    this.seeds.dispose();
    this.envTexture.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}
