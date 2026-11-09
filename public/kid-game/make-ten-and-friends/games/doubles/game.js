/* =========================================================================
 * Doubles & Near Doubles 🐞 — an addition-strategy game for ~5 to 7 year olds.
 *
 * Teaching idea: a ladybug's two wings hold the two groups of spots.
 *   - A DOUBLE is the same amount on each wing (4 + 4). The symmetry is the
 *     whole point: "same on both sides", so the child sees it instantly.
 *   - A NEAR DOUBLE is one wing with a single extra spot (4 + 5). That extra
 *     spot is highlighted green, so the strategy is visible: "double 4 is 8,
 *     and 1 more is 9".
 * The spots are always right there to count, so the math stays concrete.
 *
 * Uses the shared GameKit (../../shared/game-kit.js) for the look & feel:
 * background, buttons, confetti, mute + home buttons. No image/audio assets.
 * ====================================================================== */

const GAME_W = 960;
const GAME_H = 720;

// Game-specific colors (the shared palette lives in GameKit.COLORS).
const LB = {
  body: 0xe5392f,     // ladybug red
  bodyShine: 0xff6b5e,
  belly: 0xc62828,
  black: 0x1f2733,    // head / legs / divider
  spot: 0x2d3a4a,     // a normal countable spot
  extra: 0x4cc36b,    // the single "+1" spot on a near double (green)
  cheek: 0xffffff
};

// Difficulty knobs — kept obvious so they are easy to tune.
const MAX_DOUBLE = 6;            // biggest equal group (doubles up to 6 + 6 = 12)
const NEAR_DOUBLE_CHANCE = 0.5;  // share of rounds that are near doubles
const ROUNDS_PER_CELEBRATION = 5;

/* ======================================================================= *
 *  MenuScene — title + start button
 * ======================================================================= */
class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    GameKit.drawBackground(this);

    // Bouncing ladybug hero.
    const bug = this.add.text(GAME_W / 2, 235, '🐞', { fontSize: '150px' }).setOrigin(0.5);
    this.tweens.add({ targets: bug, y: 210, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const title = this.add.text(GAME_W / 2, 400, 'Doubles!', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '88px', fontStyle: '700', color: '#ffffff'
    }).setOrigin(0.5);
    title.setShadow(0, 5, 'rgba(0,0,0,0.25)', 6);

    this.add.text(GAME_W / 2, 478, 'Count the spots on both wings 🐞', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '30px', color: '#2d3a4a'
    }).setOrigin(0.5);

    GameKit.makeButton(this, GAME_W / 2, 580, 300, 110, 'Play ▶', 0xff6b9d, () => {
      SoundFX.resume();
      this.cameras.main.fadeOut(250, 255, 255, 255);
      this.time.delayedCall(260, () => this.scene.start('Game'));
    });

    GameKit.addMuteButton(this);
    GameKit.addHomeButton(this);

    // Floating mascots for friendliness.
    const fox = this.add.text(150, 560, '🦊', { fontSize: '90px' }).setOrigin(0.5);
    this.tweens.add({ targets: fox, angle: -8, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    const bear = this.add.text(GAME_W - 150, 540, '🐝', { fontSize: '84px' }).setOrigin(0.5);
    this.tweens.add({ targets: bear, y: 520, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.cameras.main.fadeIn(250, 255, 255, 255);
  }
}

/* ======================================================================= *
 *  GameScene — the actual doubles / near-doubles rounds
 * ======================================================================= */
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    GameKit.drawBackground(this);

    this.stars = 0;
    this.roundCount = 0;
    this.roundLayer = null;

    this.drawLadybug();

    // Prompt doubles as the feedback line (changes color on a win / miss).
    this.prompt = this.add.text(GAME_W / 2, 86, 'How many spots in all?', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '36px', fontStyle: '600', color: '#2d3a4a'
    }).setOrigin(0.5);

    // Reacting mascot beside the prompt.
    this.mascot = this.add.text(150, 92, '🐞', { fontSize: '60px' }).setOrigin(0.5);

    // Top bar: home (left), star counter (next to it), mute (right).
    GameKit.addHomeButton(this, 42, 36);
    this.starText = this.add.text(80, 36, '⭐ 0', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '44px', fontStyle: '700', color: '#2d5b86'
    }).setOrigin(0, 0.5);
    this.starText.setShadow(0, 2, 'rgba(255,255,255,0.8)', 2);
    GameKit.addMuteButton(this);

    this.cameras.main.fadeIn(250, 255, 255, 255);
    this.newRound();
  }

  /* ---- the ladybug playfield (drawn once; spots are added per round) ---- */
  drawLadybug() {
    const cx = GAME_W / 2, bodyCy = 322, bodyW = 330, bodyH = 290;
    const headCy = 150, headR = 42;

    const g = this.add.graphics();

    // Antennae (drawn first, behind the head).
    g.lineStyle(7, LB.black, 1);
    g.beginPath(); g.moveTo(cx - 18, headCy - headR + 6); g.lineTo(cx - 50, 96); g.strokePath();
    g.beginPath(); g.moveTo(cx + 18, headCy - headR + 6); g.lineTo(cx + 50, 96); g.strokePath();
    g.fillStyle(LB.black, 1);
    g.fillCircle(cx - 50, 92, 9);
    g.fillCircle(cx + 50, 92, 9);

    // Little legs poking out from under the body.
    g.lineStyle(8, LB.black, 1);
    [-1, 1].forEach(s => {
      [0, 1, 2].forEach(i => {
        const ly = bodyCy - 60 + i * 70;
        g.beginPath();
        g.moveTo(cx + s * (bodyW / 2 - 24), ly);
        g.lineTo(cx + s * (bodyW / 2 + 36), ly + 18);
        g.strokePath();
      });
    });

    // Head.
    g.fillStyle(LB.black, 1);
    g.fillCircle(cx, headCy, headR);

    // Body.
    g.fillStyle(LB.body, 1);
    g.fillEllipse(cx, bodyCy, bodyW, bodyH);
    // Soft shine top-left.
    g.fillStyle(LB.bodyShine, 0.55);
    g.fillEllipse(cx - bodyW * 0.2, bodyCy - bodyH * 0.22, bodyW * 0.42, bodyH * 0.32);
    // Outline.
    g.lineStyle(6, LB.black, 1);
    g.strokeEllipse(cx, bodyCy, bodyW, bodyH);
    // Wing divider down the middle.
    g.lineStyle(7, LB.black, 1);
    g.beginPath();
    g.moveTo(cx, bodyCy - bodyH / 2 + 6);
    g.lineTo(cx, bodyCy + bodyH / 2 - 6);
    g.strokePath();

    // Face: two friendly eyes on the head.
    g.fillStyle(LB.cheek, 1);
    g.fillCircle(cx - 16, headCy - 2, 11);
    g.fillCircle(cx + 16, headCy - 2, 11);
    g.fillStyle(LB.black, 1);
    g.fillCircle(cx - 14, headCy, 5);
    g.fillCircle(cx + 18, headCy, 5);
    // Smile.
    g.lineStyle(4, LB.cheek, 1);
    g.beginPath();
    g.arc(cx, headCy + 10, 14, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(160));
    g.strokePath();

    // Remember the wing centers for spot placement.
    this.leftWing = { x: cx - 82, y: bodyCy + 2 };
    this.rightWing = { x: cx + 82, y: bodyCy + 2 };
    this.bodyCx = cx;
    this.bodyCy = bodyCy;
  }

  newRound() {
    if (this.roundLayer) this.roundLayer.destroy(true);
    this.roundLayer = this.add.container(0, 0);

    this.isNear = Math.random() < NEAR_DOUBLE_CHANCE;
    if (!this.isNear) {
      const base = Phaser.Math.Between(1, MAX_DOUBLE);
      this.a = base; this.b = base;
      this.smaller = base; this.bigSide = 'none';
    } else {
      const base = Phaser.Math.Between(1, MAX_DOUBLE - 1);
      this.smaller = base;
      const bigger = base + 1;
      if (Math.random() < 0.5) { this.a = bigger; this.b = base; this.bigSide = 'left'; }
      else { this.a = base; this.b = bigger; this.bigSide = 'right'; }
    }
    this.answer = this.a + this.b;

    this.mascot.setText('🐞');
    this.prompt.setColor('#2d3a4a').setText('How many spots in all?');

    this.drawSpots();
    this.drawEquation();
    this.drawAnswerButtons();
  }

  // Tidy, centered grid of spot positions for one wing (a lone last spot
  // is centered so the "+1" on a near double reads clearly).
  spotPositions(count, wx, wy) {
    const colGap = 56, rowGap = 52;
    const rows = Math.ceil(count / 2);
    const startY = wy - (rows - 1) * rowGap / 2;
    const pts = [];
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / 2);
      const lone = (count % 2 === 1) && (i === count - 1);
      const x = lone ? wx : wx + (i % 2 === 0 ? -colGap / 2 : colGap / 2);
      pts.push({ x: x, y: startY + row * rowGap });
    }
    return pts;
  }

  drawSpots() {
    const r = 17;
    const left = this.spotPositions(this.a, this.leftWing.x, this.leftWing.y);
    const right = this.spotPositions(this.b, this.rightWing.x, this.rightWing.y);

    const place = (pts, isBig) => {
      pts.forEach((p, i) => {
        const isExtra = this.isNear && isBig && i === pts.length - 1;
        const dot = this.makeSpot(p.x, p.y, r, isExtra ? LB.extra : LB.spot);
        this.tweens.add({ targets: dot, scale: 1, duration: 240, delay: i * 60, ease: 'Back.easeOut' });
        if (isExtra) this.glowExtra(p.x, p.y, r);
      });
    };
    place(left, this.bigSide === 'left');
    place(right, this.bigSide === 'right');
  }

  // A glossy spot graphic starting at scale 0 (ready to pop in).
  makeSpot(x, y, r, color) {
    const dot = this.add.graphics();
    dot.fillStyle(color, 1);
    dot.fillCircle(0, 0, r);
    dot.fillStyle(0xffffff, 0.3);
    dot.fillCircle(-r * 0.3, -r * 0.3, r * 0.35);
    dot.setPosition(x, y).setScale(0);
    this.roundLayer.add(dot);
    return dot;
  }

  // A soft pulsing ring to point out the single extra "+1" spot.
  glowExtra(x, y, r) {
    const ring = this.add.graphics();
    ring.lineStyle(4, 0xffffff, 0.95);
    ring.strokeCircle(x, y, r + 8);
    this.roundLayer.add(ring);
    this.tweens.add({ targets: ring, alpha: 0.2, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  // Equation strip:  a + b = ?
  drawEquation() {
    const eq = this.add.container(GAME_W / 2, 506);
    const plate = this.add.graphics();
    plate.fillStyle(0xffffff, 0.9);
    plate.fillRoundedRect(-230, -42, 460, 84, 20);
    eq.add(plate);

    const style = { fontFamily: 'Fredoka, sans-serif', fontSize: '52px', fontStyle: '700', color: '#2d3a4a' };
    eq.add(this.add.text(-150, 0, String(this.a), style).setOrigin(0.5));
    eq.add(this.add.text(-80, 0, '+', style).setOrigin(0.5));
    eq.add(this.add.text(-10, 0, String(this.b), style).setOrigin(0.5));
    eq.add(this.add.text(60, 0, '=', style).setOrigin(0.5));

    // The mystery box the child is solving for.
    const box = this.add.graphics();
    box.fillStyle(0xffe27a, 1);
    box.fillRoundedRect(110 - 32, -32, 64, 64, 14);
    box.lineStyle(4, 0xe0a92b, 1);
    box.strokeRoundedRect(110 - 32, -32, 64, 64, 14);
    eq.add(box);
    this.qMark = this.add.text(110, 0, '?', { ...style, color: '#b9831f' }).setOrigin(0.5);
    eq.add(this.qMark);
    this.tweens.add({ targets: this.qMark, scale: 1.15, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.roundLayer.add(eq);
  }

  // Three answer choices: the correct one + two nearby distractors.
  drawAnswerButtons() {
    const options = this.buildOptions();
    const w = 158, h = 116, gap = 44;
    const totalW = options.length * w + (options.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2 + w / 2;
    const y = 628;

    this.answerButtons = [];
    options.forEach((val, i) => {
      const color = GameKit.BUTTON_COLORS[i % GameKit.BUTTON_COLORS.length];
      const btn = GameKit.makeButton(this, startX + i * (w + gap), y, w, h, String(val), color, () => {
        this.onAnswer(val, btn);
      });
      btn.setScale(0);
      this.tweens.add({ targets: btn, scale: 1, duration: 300, delay: 200 + i * 90, ease: 'Back.easeOut' });
      this.roundLayer.add(btn);
      this.answerButtons.push(btn);
    });
  }

  buildOptions() {
    const set = new Set([this.answer]);
    while (set.size < 3) {
      const candidate = this.answer + Phaser.Math.Between(-3, 3);
      if (candidate >= 1 && candidate <= 18 && candidate !== this.answer) set.add(candidate);
    }
    return Phaser.Utils.Array.Shuffle(Array.from(set));
  }

  onAnswer(value, btn) {
    if (value === this.answer) this.handleCorrect();
    else this.handleWrong(btn);
  }

  handleWrong(btn) {
    SoundFX.wrong();
    this.mascot.setText('🤔');
    this.prompt.setColor('#e0772b').setText('Try again! Count the spots 👇');
    this.tweens.add({ targets: btn, x: btn.x - 10, duration: 60, yoyo: true, repeat: 3 });
    // Gently bounce the spots to nudge counting.
    this.tweens.add({ targets: this.roundLayer, y: -8, duration: 90, yoyo: true, repeat: 1 });
  }

  handleCorrect() {
    this.answerButtons.forEach(b => b.setEnabled(false));
    this.mascot.setText('🎉');
    this.qMark.setText(String(this.answer)).setColor('#3a8f4f');

    if (this.isNear) {
      this.prompt.setColor('#2d8f4f')
        .setText('Double ' + this.smaller + ' is ' + (this.smaller * 2) + ', and 1 more is ' + this.answer + '! 🎉');
    } else {
      this.prompt.setColor('#2d8f4f')
        .setText('Double ' + this.smaller + ' is ' + this.answer + '! 🎉');
    }
    SoundFX.correct();

    // Celebrate on the ladybug.
    this.stars += 1;
    this.roundCount += 1;
    this.bumpStar();
    GameKit.confetti(this, GAME_W / 2, 300, 16);
    this.tweens.add({ targets: this.roundLayer, scale: 1.06, duration: 180, yoyo: true, ease: 'Quad.easeOut' });

    this.time.delayedCall(1500, () => {
      if (this.roundCount % ROUNDS_PER_CELEBRATION === 0) this.celebrate();
      else this.newRound();
    });
  }

  bumpStar() {
    this.starText.setText('⭐ ' + this.stars);
    this.tweens.add({ targets: this.starText, scale: 1.35, duration: 150, yoyo: true, ease: 'Quad.easeOut' });

    const star = this.add.text(GAME_W / 2, 300, '⭐', { fontSize: '60px' }).setOrigin(0.5);
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

    const cheers = ['Amazing! 🌟', 'Super Star! ⭐', 'You did it! 🎉', 'Wonderful! 🐞', 'Math Hero! 🚀'];
    overlay.add(this.add.text(GAME_W / 2, GAME_H / 2 - 110,
      Phaser.Utils.Array.GetRandom(cheers), {
        fontFamily: 'Fredoka, sans-serif', fontSize: '64px', fontStyle: '700', color: '#2d5b86'
      }).setOrigin(0.5));

    overlay.add(this.add.text(GAME_W / 2, GAME_H / 2 - 20,
      'You solved ' + this.roundCount + ' doubles!', {
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
