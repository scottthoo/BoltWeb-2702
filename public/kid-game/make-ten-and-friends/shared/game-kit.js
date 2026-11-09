/* =========================================================================
 * GameKit — shared toolkit for every game in this portal.
 *
 * Provides the consistent kid-friendly look & feel so each game only has to
 * implement its own teaching logic:
 *   - GameKit.COLORS / BUTTON_COLORS  : the shared palette
 *   - GameKit.boot(opts)              : standard Phaser config (Scale.FIT)
 *   - GameKit.drawBackground(scene)   : sky + clouds + grass
 *   - GameKit.makeButton(...)         : chunky tappable rounded button
 *   - GameKit.addMuteButton(scene)    : 🔊 toggle (top-right)
 *   - GameKit.addHomeButton(scene)    : 🏠 back to the games hub (top-left)
 *
 * Sizing helpers read the canvas size from scene.scale, so games just pick
 * their own width/height in boot() and everything lines up.
 * Depends on SoundFX (shared/audio.js).
 * ====================================================================== */
window.GameKit = (function () {
  // Friendly, high-contrast palette reused across games.
  const COLORS = {
    skyTop: 0x7ec8f0,
    skyBottom: 0xbfe9ff,
    grass: 0x8fd36b,
    grassDark: 0x73c14f,
    panel: 0xffffff,
    frame: 0x2d5b86,
    ink: 0x2d3a4a,
    accent: 0x2d5b86,
    star: 0xffd23f,
    good: 0x4cc36b,
    warn: 0xff7a59
  };

  // Bright button colors, cycled so choices always look distinct.
  const BUTTON_COLORS = [0xff6b9d, 0x6c8cff, 0xffa53f, 0x9d6cff, 0x46c8b2];

  // Where the games hub lives, relative to a game page at games/<slug>/.
  const HUB_URL = '../../index.html';

  // How large the drawing buffer is allowed to get, as a multiple of the logical
  // game size. Guards against pathological buffers on huge, very dense displays
  // (e.g. a maximised window on a 6K monitor) while staying crisp everywhere real.
  const MAX_ZOOM = 4;

  // Standard Phaser game config. opts = { width, height, scenes, parent?, backgroundColor? }
  function boot(opts) {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: opts.width,
      height: opts.height,
      parent: opts.parent || 'game-container',
      backgroundColor: opts.backgroundColor || '#7ec8f0',
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      render: { antialias: true, antialiasGL: true, roundPixels: false },
      scene: opts.scenes
    });

    // Keep the game crisp on Retina/high-DPI screens at ANY window size.
    //
    // Scale.FIT keeps the logical opts.width x opts.height coordinate system but
    // stretches the canvas via CSS to fill the parent. On a high-DPI display that
    // CSS size is then drawn across 2x+ physical pixels, so a buffer rendered at
    // the logical size looks blurry. Fix: render the drawing buffer at the canvas's
    // true on-screen device-pixel size by setting the Scale Manager zoom to
    //   (cssDisplayWidth * devicePixelRatio) / logicalWidth
    // i.e. exactly enough pixels for a 1:1 mapping. Because game code only ever
    // uses logical coordinates, nothing else has to change. Recomputed on resize
    // (window resize, rotation, or a DPR change from dragging between monitors).
    function syncResolution() {
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = game.scale.displaySize.width;
      if (!cssWidth) return;
      const target = Math.min((cssWidth * dpr) / opts.width, MAX_ZOOM);
      // Guard prevents an infinite resize<->setZoom loop (setZoom re-emits resize).
      if (Math.abs(game.scale.zoom - target) > 0.01) game.scale.setZoom(target);
    }
    game.scale.on(Phaser.Scale.Events.RESIZE, syncResolution);
    game.events.once(Phaser.Core.Events.READY, syncResolution);

    return game;
  }

  // Sky gradient + drifting clouds + grass strip. Reused by every scene.
  function drawBackground(scene) {
    const W = scene.scale.width, H = scene.scale.height;
    const g = scene.add.graphics();
    g.fillGradientStyle(COLORS.skyTop, COLORS.skyTop, COLORS.skyBottom, COLORS.skyBottom, 1);
    g.fillRect(0, 0, W, H);

    g.fillStyle(COLORS.grassDark, 1);
    g.fillRect(0, H - 90, W, 90);
    g.fillStyle(COLORS.grass, 1);
    g.fillRect(0, H - 90, W, 60);

    for (let i = 0; i < 4; i++) {
      const cloud = scene.add.graphics();
      cloud.fillStyle(0xffffff, 0.85);
      cloud.fillCircle(0, 0, 30);
      cloud.fillCircle(34, 6, 24);
      cloud.fillCircle(-32, 6, 22);
      cloud.fillCircle(6, -16, 22);
      const y = 70 + i * 60 + Phaser.Math.Between(-15, 15);
      cloud.setPosition(Phaser.Math.Between(0, W), y);
      scene.tweens.add({
        targets: cloud,
        x: '+=' + (W + 120),
        duration: Phaser.Math.Between(28000, 46000),
        repeat: -1,
        onRepeat: () => cloud.setX(-120)
      });
    }
  }

  // Build a chunky, tappable rounded button as a Container.
  // Call container.setEnabled(false) to lock it.
  function makeButton(scene, x, y, w, h, label, fill, onClick) {
    const container = scene.add.container(x, y);
    const radius = Math.min(24, h / 2);

    const g = scene.add.graphics();
    const draw = function (color, offset) {
      g.clear();
      g.fillStyle(0x000000, 0.18);
      g.fillRoundedRect(-w / 2, -h / 2 + 6, w, h, radius);
      g.fillStyle(color, 1);
      g.fillRoundedRect(-w / 2, -h / 2 + offset, w, h, radius);
      g.fillStyle(0xffffff, 0.22);
      g.fillRoundedRect(-w / 2 + 6, -h / 2 + offset + 5, w - 12, h * 0.42, radius);
    };
    draw(fill, 0);

    const txt = scene.add.text(0, 0, label, {
      fontFamily: 'Fredoka, sans-serif',
      fontSize: Math.round(h * 0.5) + 'px',
      fontStyle: '700',
      color: '#ffffff'
    }).setOrigin(0.5);
    txt.setShadow(0, 2, 'rgba(0,0,0,0.25)', 2);

    container.add([g, txt]);
    container.setSize(w, h);
    container.enabled = true;
    container.label = txt;

    container.setEnabled = function (on) {
      container.enabled = on;
      container.setAlpha(on ? 1 : 0.45);
      if (on) container.setInteractive(new Phaser.Geom.Rectangle(0, 0, w, h), Phaser.Geom.Rectangle.Contains);
      else container.disableInteractive();
      return container;
    };

    container.setInteractive(new Phaser.Geom.Rectangle(0, 0, w, h), Phaser.Geom.Rectangle.Contains);

    container.on('pointerdown', function () {
      if (!container.enabled) return;
      draw(fill, 4);
      scene.tweens.add({ targets: container, scale: 0.94, duration: 70 });
      SoundFX.tap();
    });
    const release = function () {
      draw(fill, 0);
      scene.tweens.add({ targets: container, scale: 1, duration: 90, ease: 'Back.easeOut' });
    };
    container.on('pointerup', function () {
      if (!container.enabled) return;
      release();
      if (onClick) onClick();
    });
    container.on('pointerout', release);

    return container;
  }

  // Confetti burst from a point. Returns nothing; pieces clean themselves up.
  function confetti(scene, x, y, count) {
    const W = scene.scale.width, H = scene.scale.height;
    const colors = [0xff6b9d, 0x6c8cff, 0xffd23f, 0x4cc36b, 0xff7a59, 0x9d6cff];
    for (let i = 0; i < (count || 16); i++) {
      const px = x + Phaser.Math.Between(-220, 220);
      const piece = scene.add.rectangle(
        px, y, Phaser.Math.Between(10, 18), Phaser.Math.Between(10, 18),
        colors[i % colors.length]
      ).setAngle(Phaser.Math.Between(0, 360)).setDepth(50);
      scene.tweens.add({
        targets: piece,
        y: H + 40,
        x: px + Phaser.Math.Between(-80, 80),
        angle: piece.angle + Phaser.Math.Between(180, 540),
        duration: Phaser.Math.Between(1100, 1900),
        ease: 'Quad.easeIn',
        onComplete: () => piece.destroy()
      });
    }
  }

  // Small speaker toggle in the top-right of any scene.
  function addMuteButton(scene) {
    const W = scene.scale.width;
    const label = () => (SoundFX.isMuted() ? '🔇' : '🔊');
    const btn = scene.add.text(W - 40, 36, label(), { fontSize: '46px' })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => {
      SoundFX.setMuted(!SoundFX.isMuted());
      if (!SoundFX.isMuted()) { SoundFX.resume(); SoundFX.tap(); }
      btn.setText(label());
    });
    return btn;
  }

  // 🏠 button (top-left) that returns to the games hub with a soft fade.
  function addHomeButton(scene, x, y) {
    const btn = scene.add.text(x || 42, y || 36, '🏠', { fontSize: '44px' })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => {
      SoundFX.tap();
      scene.cameras.main.fadeOut(220, 255, 255, 255);
      scene.time.delayedCall(230, () => { window.location.href = HUB_URL; });
    });
    return btn;
  }

  return {
    COLORS, BUTTON_COLORS, HUB_URL,
    boot, drawBackground, makeButton, confetti, addMuteButton, addHomeButton
  };
})();
