/* =========================================================================
 * Bridge to Ten 🌉 — the "make a ten" addition strategy for ~5 to 7 year olds.
 *
 * Teaching idea: to add facts that cross ten (like 8 + 5), first fill a
 * ten-frame up to 10, then count on the rest. Two ten-frames make this
 * concrete and the round is guided in two taps:
 *
 *   1. "Fill the ten!"  -> tap how many MORE make 10  (here 8 + 2)
 *      The dots fly from the tray: some finish the first frame to 10, the
 *      leftover hop into the second frame. Now the child SEES 10 and a few more.
 *   2. "How many in all?" -> tap the total  (10 + 3 = 13)
 *
 * Uses the shared GameKit (../../shared/game-kit.js) for the look & feel:
 * background, buttons, confetti, mute + home buttons. No image/audio assets.
 * ====================================================================== */

const GAME_W = 960;
const GAME_H = 720;

// Game-specific colors (the shared palette lives in GameKit.COLORS).
const BR = {
  cell: 0xffffff,
  cellLine: 0x3a6ea5,
  given: 0xff7a59,   // the first number, already in frame A (orange)
  bridge: 0x4cc36b,  // the second number's dots, split across the ten (green)
  frame: 0x2d5b86,
  full: 0x4cc36b     // glow when a frame reaches ten
};

// Ten-frame geometry.
const CELL = 54, CGAP = 8;
const FRAME_W = 5 * CELL + 4 * CGAP; // one ten-frame, two rows of five
const FRAME_H = 2 * CELL + CGAP;
const GAP_BETWEEN = 64;
const FRAMES_Y = 236;

// Difficulty knobs — kept obvious so they are easy to tune.
const FIRST_MIN = 6, FIRST_MAX = 9; // the first addend (always bridges 10)
const MAX_SUM = 15;                 // cap the total so leftovers stay small
const ROUNDS_PER_CELEBRATION = 5;

/* ======================================================================= *
 *  MenuScene — title + start button
 * ======================================================================= */
class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    GameKit.drawBackground(this);

    const bridge = this.add.text(GAME_W / 2, 235, '🌉', { fontSize: '140px' }).setOrigin(0.5);
    this.tweens.add({ targets: bridge, y: 215, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const title = this.add.text(GAME_W / 2, 400, 'Bridge to Ten!', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '76px', fontStyle: '700', color: '#ffffff'
    }).setOrigin(0.5);
    title.setShadow(0, 5, 'rgba(0,0,0,0.25)', 6);

    this.add.text(GAME_W / 2, 478, 'Make ten first, then add the rest 🌟', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '30px', color: '#2d3a4a'
    }).setOrigin(0.5);

    GameKit.makeButton(this, GAME_W / 2, 580, 300, 110, 'Play ▶', 0x6c8cff, () => {
      SoundFX.resume();
      this.cameras.main.fadeOut(250, 255, 255, 255);
      this.time.delayedCall(260, () => this.scene.start('Game'));
    });

    GameKit.addMuteButton(this);
    GameKit.addHomeButton(this);

    const frog = this.add.text(150, 560, '🐸', { fontSize: '90px' }).setOrigin(0.5);
    this.tweens.add({ targets: frog, y: 535, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    const owl = this.add.text(GAME_W - 150, 540, '🦉', { fontSize: '86px' }).setOrigin(0.5);
    this.tweens.add({ targets: owl, angle: 7, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.cameras.main.fadeIn(250, 255, 255, 255);
  }
}

/* ======================================================================= *
 *  GameScene — the guided two-step bridging rounds
 * ======================================================================= */
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    GameKit.drawBackground(this);

    this.stars = 0;
    this.roundCount = 0;
    this.roundLayer = null;

    // The two empty ten-frames, drawn once. Dots are added per round.
    this.cellsA = [];
    this.cellsB = [];
    const totalW = FRAME_W * 2 + GAP_BETWEEN;
    this.aX = (GAME_W - totalW) / 2;
    this.bX = this.aX + FRAME_W + GAP_BETWEEN;
    this.buildFrame(this.aX, FRAMES_Y, this.cellsA);
    this.buildFrame(this.bX, FRAMES_Y, this.cellsB);

    // Prompt doubles as the feedback line (changes per step / on a miss).
    this.prompt = this.add.text(GAME_W / 2, 96, '', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '36px', fontStyle: '600', color: '#2d3a4a'
    }).setOrigin(0.5);

    // The fact we are solving, shown up top:  8 + 5 = ?
    this.eqText = this.add.text(GAME_W / 2, 156, '', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '48px', fontStyle: '700', color: '#2d5b86'
    }).setOrigin(0.5);

    this.mascot = this.add.text(150, 100, '🐸', { fontSize: '60px' }).setOrigin(0.5);

    // Top bar: home (left), star counter (next to it), mute (right).
    GameKit.addHomeButton(this, 42, 36);
    this.starText = this.add.text(80, 36, '⭐ 0', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '44px', fontStyle: '700', color: '#2d5b86'
    }).setOrigin(0, 0.5);
    this.starText.setShadow(0, 2, 'rgba(255,255,255,0.8)', 2);
    GameKit.addMuteButton(this);

    // Buttons live in their own layer so steps can swap them out.
    this.optionLayer = this.add.container(0, 0);

    this.cameras.main.fadeIn(250, 255, 255, 255);
    this.newRound();
  }

  // Draw one empty ten-frame (two rows of five) and record its cell centers.
  buildFrame(x0, y0, cellsArr) {
    const plate = this.add.graphics();
    plate.fillStyle(0xffffff, 0.55);
    plate.fillRoundedRect(x0 - 14, y0 - 14, FRAME_W + 28, FRAME_H + 28, 18);
    plate.lineStyle(5, BR.frame, 1);
    plate.strokeRoundedRect(x0 - 14, y0 - 14, FRAME_W + 28, FRAME_H + 28, 18);

    const g = this.add.graphics();
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 5; c++) {
        const x = x0 + c * (CELL + CGAP);
        const y = y0 + r * (CELL + CGAP);
        g.fillStyle(BR.cell, 1);
        g.fillRoundedRect(x, y, CELL, CELL, 10);
        g.lineStyle(3, BR.cellLine, 1);
        g.strokeRoundedRect(x, y, CELL, CELL, 10);
        cellsArr.push({ x: x + CELL / 2, y: y + CELL / 2 });
      }
    }
  }

  newRound() {
    if (this.roundLayer) this.roundLayer.destroy(true);
    this.roundLayer = this.add.container(0, 0);
    this.optionLayer.removeAll(true);

    // Pick a fact that bridges ten: a in [6,9], total in [11, MAX_SUM].
    this.a = Phaser.Math.Between(FIRST_MIN, FIRST_MAX);
    const lo = Math.max(2, 11 - this.a);
    const hi = Math.min(9, MAX_SUM - this.a);
    this.b = Phaser.Math.Between(lo, hi);
    this.total = this.a + this.b;
    this.toTen = 10 - this.a;            // step 1 answer: more to fill the ten
    this.leftover = this.total - 10;     // hops into the second frame
    this.step = 1;

    this.mascot.setText('🐸');
    this.eqText.setText(this.a + ' + ' + this.b + ' = ?');
    this.prompt.setColor('#2d3a4a').setText('First, fill the ten! Tap how many more 👆');

    this.drawGivenDots();
    this.drawTray();
    this.showOptions(this.toTen, 0, 9);
  }

  // The first number, already sitting in frame A (orange).
  drawGivenDots() {
    const r = CELL * 0.34;
    for (let i = 0; i < this.a; i++) {
      const c = this.cellsA[i];
      const dot = this.makeDot(c.x, c.y, r, BR.given);
      this.tweens.add({ targets: dot, scale: 1, duration: 240, delay: i * 60, ease: 'Back.easeOut' });
    }
  }

  // The second number waits as loose dots in a tray under the frames.
  drawTray() {
    const r = CELL * 0.34;
    const trayY = 452;
    const spacing = 50;
    const startX = GAME_W / 2 - (this.b - 1) * spacing / 2;

    const panel = this.add.graphics();
    const pw = this.b * spacing + 40;
    panel.fillStyle(0xffffff, 0.5);
    panel.fillRoundedRect(GAME_W / 2 - pw / 2, trayY - 38, pw, 76, 20);
    panel.lineStyle(4, BR.bridge, 0.8);
    panel.strokeRoundedRect(GAME_W / 2 - pw / 2, trayY - 38, pw, 76, 20);
    this.roundLayer.add(panel);

    this.trayDots = [];
    for (let i = 0; i < this.b; i++) {
      const dot = this.makeDot(startX + i * spacing, trayY, r, BR.bridge);
      this.tweens.add({ targets: dot, scale: 1, duration: 240, delay: 300 + i * 70, ease: 'Back.easeOut' });
      this.trayDots.push(dot);
    }
  }

  // A glossy dot graphic (full size, ready to slide between frames).
  makeDot(x, y, r, color) {
    const dot = this.add.graphics();
    dot.fillStyle(color, 1);
    dot.fillCircle(0, 0, r);
    dot.fillStyle(0xffffff, 0.3);
    dot.fillCircle(-r * 0.3, -r * 0.3, r * 0.35);
    dot.setPosition(x, y).setScale(0);
    this.roundLayer.add(dot);
    return dot;
  }

  // Swap in three answer buttons: the correct value + two nearby distractors.
  showOptions(correct, lo, hi) {
    this.optionLayer.removeAll(true);
    const options = this.buildOptions(correct, lo, hi);

    const w = 158, h = 112, gap = 44;
    const totalW = options.length * w + (options.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2 + w / 2;
    const y = 622;

    this.answerButtons = [];
    options.forEach((val, i) => {
      const color = GameKit.BUTTON_COLORS[i % GameKit.BUTTON_COLORS.length];
      const btn = GameKit.makeButton(this, startX + i * (w + gap), y, w, h, String(val), color, () => {
        this.onAnswer(val, btn, correct);
      });
      btn.setScale(0);
      this.tweens.add({ targets: btn, scale: 1, duration: 300, delay: 150 + i * 90, ease: 'Back.easeOut' });
      this.optionLayer.add(btn);
      this.answerButtons.push(btn);
    });
  }

  buildOptions(correct, lo, hi) {
    const set = new Set([correct]);
    let guard = 0;
    while (set.size < 3 && guard++ < 50) {
      const candidate = correct + Phaser.Math.Between(-2, 2);
      if (candidate >= lo && candidate <= hi && candidate !== correct) set.add(candidate);
    }
    // Fallback if the window was too tight to find 3 distinct values.
    let extra = lo;
    while (set.size < 3) { if (extra !== correct) set.add(extra); extra++; }
    return Phaser.Utils.Array.Shuffle(Array.from(set));
  }

  onAnswer(value, btn, correct) {
    if (value !== correct) { this.handleWrong(btn); return; }
    if (this.step === 1) this.completeStepOne();
    else this.completeRound();
  }

  handleWrong(btn) {
    SoundFX.wrong();
    this.mascot.setText('🤔');
    if (this.step === 1) {
      this.prompt.setColor('#e0772b').setText('Count the empty boxes in the first ten 👆');
      this.flashEmptyA();
    } else {
      this.prompt.setColor('#e0772b').setText('Ten and a few more... count them all 👇');
    }
    this.tweens.add({ targets: btn, x: btn.x - 10, duration: 60, yoyo: true, repeat: 3 });
  }

  flashEmptyA() {
    for (let i = this.a; i < 10; i++) {
      const c = this.cellsA[i];
      const ring = this.add.graphics();
      ring.lineStyle(5, 0xffd23f, 1);
      ring.strokeRoundedRect(c.x - CELL / 2, c.y - CELL / 2, CELL, CELL, 10);
      this.roundLayer.add(ring);
      this.tweens.add({ targets: ring, alpha: 0, duration: 700, repeat: 1, yoyo: true, onComplete: () => ring.destroy() });
    }
  }

  // Step 1 solved: slide the tray dots — some finish the ten, the rest hop over.
  completeStepOne() {
    this.answerButtons.forEach(b => b.setEnabled(false));
    this.mascot.setText('😃');
    this.prompt.setColor('#2d8f4f').setText(this.a + ' + ' + this.toTen + ' = 10!  Now count on 🌉');
    SoundFX.correct();

    let delay = 0;
    const step = 170;
    const emptyA = this.cellsA.slice(this.a); // the cells that complete the ten

    for (let i = 0; i < this.toTen; i++) {
      const dot = this.trayDots[i];
      const target = emptyA[i];
      this.tweens.add({
        targets: dot, x: target.x, y: target.y, duration: 360, delay: delay,
        ease: 'Cubic.easeInOut', onStart: () => SoundFX.pop(i)
      });
      delay += step;
    }
    for (let j = 0; j < this.leftover; j++) {
      const dot = this.trayDots[this.toTen + j];
      const target = this.cellsB[j];
      this.tweens.add({
        targets: dot, x: target.x, y: target.y, duration: 360, delay: delay,
        ease: 'Cubic.easeInOut', onStart: () => SoundFX.pop(this.toTen + j)
      });
      delay += step;
    }

    this.time.delayedCall(delay + 250, () => {
      this.glowTen();
      this.step = 2;
      this.prompt.setColor('#2d3a4a').setText('Ten and ' + this.leftover + ' more. How many in all?');
      this.showOptions(this.total, 10, 18);
    });
  }

  // A green halo + "10" tag celebrating the filled first frame.
  glowTen() {
    const x0 = this.aX, y0 = FRAMES_Y;
    const glow = this.add.graphics();
    glow.lineStyle(6, BR.full, 1);
    glow.strokeRoundedRect(x0 - 14, y0 - 14, FRAME_W + 28, FRAME_H + 28, 18);
    this.roundLayer.add(glow);
    this.tweens.add({ targets: glow, alpha: 0.3, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const tag = this.add.text(x0 + FRAME_W / 2, y0 - 40, '10', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '40px', fontStyle: '700', color: '#2d8f4f'
    }).setOrigin(0.5).setScale(0);
    this.roundLayer.add(tag);
    this.tweens.add({ targets: tag, scale: 1, duration: 300, ease: 'Back.easeOut' });
  }

  // Step 2 solved: the round is complete.
  completeRound() {
    this.answerButtons.forEach(b => b.setEnabled(false));
    this.mascot.setText('🎉');
    this.eqText.setText(this.a + ' + ' + this.b + ' = ' + this.total);
    this.prompt.setColor('#2d8f4f').setText('Yes! ' + this.a + ' + ' + this.b + ' = ' + this.total + ' 🎉');
    SoundFX.correct();

    this.stars += 1;
    this.roundCount += 1;
    this.bumpStar();
    GameKit.confetti(this, GAME_W / 2, 280, 16);

    this.time.delayedCall(1500, () => {
      if (this.roundCount % ROUNDS_PER_CELEBRATION === 0) this.celebrate();
      else this.newRound();
    });
  }

  bumpStar() {
    this.starText.setText('⭐ ' + this.stars);
    this.tweens.add({ targets: this.starText, scale: 1.35, duration: 150, yoyo: true, ease: 'Quad.easeOut' });

    const star = this.add.text(GAME_W / 2, 280, '⭐', { fontSize: '60px' }).setOrigin(0.5);
    this.tweens.add({
      targets: star, x: 100, y: 36, scale: 0.6, duration: 650, ease: 'Cubic.easeIn',
      onComplete: () => star.destroy()
    });
  }

  // Every few rounds, a quick full-screen "great job" moment.
  celebrate() {
    SoundFX.fanfare();
    const overlay = this.add.container(0, 0).setDepth(100);
    const dim = this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x2d5b86, 0.45);
    overlay.add(dim);

    const card = this.add.graphics();
    card.fillStyle(0xffffff, 1);
    card.fillRoundedRect(GAME_W / 2 - 320, GAME_H / 2 - 200, 640, 400, 30);
    overlay.add(card);

    const cheers = ['Amazing! 🌟', 'Super Star! ⭐', 'You did it! 🎉', 'Ten Master! 🌉', 'Math Hero! 🚀'];
    overlay.add(this.add.text(GAME_W / 2, GAME_H / 2 - 110,
      Phaser.Utils.Array.GetRandom(cheers), {
        fontFamily: 'Fredoka, sans-serif', fontSize: '64px', fontStyle: '700', color: '#2d5b86'
      }).setOrigin(0.5));

    overlay.add(this.add.text(GAME_W / 2, GAME_H / 2 - 20,
      'You bridged ten ' + this.roundCount + ' times!', {
        fontFamily: 'Fredoka, sans-serif', fontSize: '34px', color: '#2d3a4a'
      }).setOrigin(0.5));

    const trophy = this.add.text(GAME_W / 2, GAME_H / 2 + 55, '🏆', { fontSize: '90px' }).setOrigin(0.5);
    overlay.add(trophy);
    this.tweens.add({ targets: trophy, scale: 1.15, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const keepGoing = GameKit.makeButton(this, GAME_W / 2, GAME_H / 2 + 150, 280, 90, 'Keep Going ▶', 0x4cc36b, () => {
      overlay.destroy(true);
      this.newRound();
    });
    overlay.add(keepGoing);

    for (let k = 0; k < 4; k++) this.time.delayedCall(k * 220, () => GameKit.confetti(this, GAME_W / 2, 120, 20));
  }
}

/* ---------- boot --------------------------------------------------------- */
GameKit.boot({ width: GAME_W, height: GAME_H, scenes: [MenuScene, GameScene] });
