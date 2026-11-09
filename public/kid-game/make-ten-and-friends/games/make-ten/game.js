/* =========================================================================
 * Make Ten! — a number-bonds-to-10 game for ~5 year olds.
 *
 * Teaching idea: kids see a "ten-frame" (2 rows of 5 boxes) with some dots
 * already placed, and choose how many MORE dots are needed to fill all ten.
 * The empty boxes are right there to count, so the math is always visible.
 *
 * Uses the shared GameKit (../../shared/game-kit.js) for the look & feel:
 * background, buttons, confetti, mute + home buttons. No image/audio assets.
 * ====================================================================== */

const GAME_W = 960;
const GAME_H = 720;

// Game-specific colors (the shared palette lives in GameKit.COLORS).
const MT = {
  cell: 0xffffff,
  cellLine: 0x3a6ea5,
  dotGiven: 0xff7a59, // dots already in the frame (orange)
  dotNew: 0x4cc36b,   // dots the child adds to make ten (green)
  frame: 0x2d5b86
};

const ROUNDS_PER_CELEBRATION = 5;

/* ======================================================================= *
 *  MenuScene — title + start button
 * ======================================================================= */
class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    GameKit.drawBackground(this);

    // Bouncing "10" badge.
    const badge = this.add.container(GAME_W / 2, 230);
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1);
    bg.fillCircle(0, 0, 95);
    bg.lineStyle(10, MT.frame, 1);
    bg.strokeCircle(0, 0, 95);
    const ten = this.add.text(0, 0, '10', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '110px', fontStyle: '700', color: '#2d5b86'
    }).setOrigin(0.5);
    badge.add([bg, ten]);
    this.tweens.add({ targets: badge, y: 210, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const title = this.add.text(GAME_W / 2, 400, 'Make Ten!', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '88px', fontStyle: '700', color: '#ffffff'
    }).setOrigin(0.5);
    title.setShadow(0, 5, 'rgba(0,0,0,0.25)', 6);

    this.add.text(GAME_W / 2, 478, 'Tap the number that makes ten 🎈', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '30px', color: '#2d3a4a'
    }).setOrigin(0.5);

    GameKit.makeButton(this, GAME_W / 2, 580, 300, 110, 'Play ▶', 0x4cc36b, () => {
      SoundFX.resume();
      this.cameras.main.fadeOut(250, 255, 255, 255);
      this.time.delayedCall(260, () => this.scene.start('Game'));
    });

    GameKit.addMuteButton(this);
    GameKit.addHomeButton(this);

    // Floating mascots for friendliness.
    const fox = this.add.text(150, 560, '🦊', { fontSize: '90px' }).setOrigin(0.5);
    this.tweens.add({ targets: fox, angle: -8, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    const bear = this.add.text(GAME_W - 150, 540, '🐻', { fontSize: '90px' }).setOrigin(0.5);
    this.tweens.add({ targets: bear, y: 520, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.cameras.main.fadeIn(250, 255, 255, 255);
  }
}

/* ======================================================================= *
 *  GameScene — the actual "make ten" rounds
 * ======================================================================= */
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    GameKit.drawBackground(this);

    this.stars = 0;
    this.roundCount = 0;
    this.cellRects = []; // centers of the 10 ten-frame cells
    this.roundLayer = null;

    this.buildTenFrameCells();

    this.promptText = this.add.text(GAME_W / 2, 120, 'How many more to make 10?', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '40px', fontStyle: '600', color: '#2d3a4a'
    }).setOrigin(0.5);

    // Reacting mascot beside the prompt.
    this.mascot = this.add.text(GAME_W / 2 - 320, 130, '🦊', { fontSize: '64px' }).setOrigin(0.5);

    // Top bar: home (left), star counter (next to it), mute (right).
    GameKit.addHomeButton(this, 42, 36);
    this.starText = this.add.text(80, 36, '⭐ 0', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '44px', fontStyle: '700', color: '#2d5b86'
    }).setOrigin(0, 0.5);
    this.starText.setShadow(0, 2, 'rgba(255,255,255,0.8)', 2);
    GameKit.addMuteButton(this);

    this.feedback = this.add.text(GAME_W / 2, 470, '', {
      fontFamily: 'Fredoka, sans-serif', fontSize: '38px', fontStyle: '700', color: '#2d5b86'
    }).setOrigin(0.5);

    this.cameras.main.fadeIn(250, 255, 255, 255);
    this.newRound();
  }

  // Draw the 10 empty boxes once; dots are added per round.
  buildTenFrameCells() {
    const cell = 78, gap = 12;
    const cols = 5, rows = 2;
    const totalW = cols * cell + (cols - 1) * gap;
    const totalH = rows * cell + (rows - 1) * gap;
    const startX = (GAME_W - totalW) / 2;
    const startY = 200;

    const plate = this.add.graphics();
    plate.fillStyle(0xffffff, 0.55);
    plate.fillRoundedRect(startX - 18, startY - 18, totalW + 36, totalH + 36, 22);
    plate.lineStyle(6, MT.frame, 1);
    plate.strokeRoundedRect(startX - 18, startY - 18, totalW + 36, totalH + 36, 22);

    const g = this.add.graphics();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (cell + gap);
        const y = startY + r * (cell + gap);
        g.fillStyle(MT.cell, 1);
        g.fillRoundedRect(x, y, cell, cell, 14);
        g.lineStyle(4, MT.cellLine, 1);
        g.strokeRoundedRect(x, y, cell, cell, 14);
        this.cellRects.push({ x: x + cell / 2, y: y + cell / 2 });
      }
    }
    this.cellSize = cell;
  }

  newRound() {
    if (this.roundLayer) this.roundLayer.destroy(true);
    this.roundLayer = this.add.container(0, 0);

    // given dots already placed (1..9); answer = how many more to reach 10.
    this.given = Phaser.Math.Between(1, 9);
    this.answer = 10 - this.given;

    this.mascot.setText('🦊');
    this.feedback.setText('');

    this.drawGivenDots();
    this.drawEquation();
    this.drawAnswerButtons();
  }

  // Fill the first `given` cells with orange dots.
  drawGivenDots() {
    const r = this.cellSize * 0.34;
    for (let i = 0; i < this.given; i++) {
      const c = this.cellRects[i];
      const dot = this.makeDot(c.x, c.y, r, MT.dotGiven);
      this.tweens.add({ targets: dot, scale: 1, duration: 260, delay: i * 70, ease: 'Back.easeOut' });
    }
  }

  // A glossy dot graphic starting at scale 0 (ready to pop in).
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

  // Equation strip:  given + ? = 10
  drawEquation() {
    const y = 410;
    const eq = this.add.container(GAME_W / 2, y);
    const plate = this.add.graphics();
    plate.fillStyle(0xffffff, 0.85);
    plate.fillRoundedRect(-230, -42, 460, 84, 20);
    eq.add(plate);

    const style = { fontFamily: 'Fredoka, sans-serif', fontSize: '56px', fontStyle: '700', color: '#2d3a4a' };
    eq.add(this.add.text(-150, 0, String(this.given), style).setOrigin(0.5));
    eq.add(this.add.text(-80, 0, '+', style).setOrigin(0.5));

    // The mystery box the child is solving for.
    const box = this.add.graphics();
    box.fillStyle(0xffe27a, 1);
    box.fillRoundedRect(-32, -32, 64, 64, 14);
    box.lineStyle(4, 0xe0a92b, 1);
    box.strokeRoundedRect(-32, -32, 64, 64, 14);
    eq.add(box);
    this.qMark = this.add.text(0, 0, '?', { ...style, color: '#b9831f' }).setOrigin(0.5);
    eq.add(this.qMark);
    this.tweens.add({ targets: this.qMark, scale: 1.15, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    eq.add(this.add.text(80, 0, '=', style).setOrigin(0.5));
    eq.add(this.add.text(150, 0, '10', style).setOrigin(0.5));

    this.roundLayer.add(eq);
    this.equationBox = eq;
  }

  // Three answer choices: the correct one + two nearby distractors.
  drawAnswerButtons() {
    const options = this.buildOptions();
    const w = 170, h = 130, gap = 40;
    const totalW = options.length * w + (options.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2 + w / 2;
    const y = 600;

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
      const candidate = Phaser.Math.Between(0, 10);
      if (candidate !== this.answer) set.add(candidate);
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
    this.feedback.setColor('#e0772b').setText('Try again! Count the empty boxes 👇');
    // gentle shake, never punishing
    this.tweens.add({ targets: btn, x: btn.x - 10, duration: 60, yoyo: true, repeat: 3 });
    this.flashEmptyCells();
  }

  flashEmptyCells() {
    for (let i = this.given; i < 10; i++) {
      const c = this.cellRects[i];
      const ring = this.add.graphics();
      ring.lineStyle(6, 0xffd23f, 1);
      ring.strokeRoundedRect(c.x - this.cellSize / 2, c.y - this.cellSize / 2, this.cellSize, this.cellSize, 14);
      this.roundLayer.add(ring);
      this.tweens.add({
        targets: ring, alpha: 0, duration: 700, repeat: 1, yoyo: true,
        onComplete: () => ring.destroy()
      });
    }
  }

  handleCorrect() {
    // lock buttons so the round can't be answered twice
    this.answerButtons.forEach(b => b.setEnabled(false));
    this.mascot.setText('🎉');
    this.qMark.setText(String(this.answer)).setColor('#3a8f4f');
    this.feedback.setColor('#2d8f4f').setText('Yes! ' + this.given + ' + ' + this.answer + ' = 10 🎉');
    SoundFX.correct();

    // Animate green dots filling the remaining boxes, one pop at a time.
    const r = this.cellSize * 0.34;
    for (let i = 0; i < this.answer; i++) {
      const c = this.cellRects[this.given + i];
      const dot = this.makeDot(c.x, c.y, r, MT.dotNew);
      this.tweens.add({
        targets: dot, scale: 1, duration: 230, delay: i * 160, ease: 'Back.easeOut',
        onStart: () => SoundFX.pop(i)
      });
    }

    // Award a star.
    this.stars += 1;
    this.roundCount += 1;
    this.bumpStar();
    GameKit.confetti(this, GAME_W / 2, 250, 14);

    const wait = 700 + this.answer * 160 + 500;
    this.time.delayedCall(wait, () => {
      if (this.roundCount % ROUNDS_PER_CELEBRATION === 0) this.celebrate();
      else this.newRound();
    });
  }

  bumpStar() {
    this.starText.setText('⭐ ' + this.stars);
    this.tweens.add({ targets: this.starText, scale: 1.35, duration: 150, yoyo: true, ease: 'Quad.easeOut' });

    // A star flies from the frame up to the counter.
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

    const cheers = ['Amazing! 🌟', 'Super Star! ⭐', 'You did it! 🎉', 'Wonderful! 🦊', 'Math Hero! 🚀'];
    overlay.add(this.add.text(GAME_W / 2, GAME_H / 2 - 110,
      Phaser.Utils.Array.GetRandom(cheers), {
        fontFamily: 'Fredoka, sans-serif', fontSize: '64px', fontStyle: '700', color: '#2d5b86'
      }).setOrigin(0.5));

    overlay.add(this.add.text(GAME_W / 2, GAME_H / 2 - 20,
      'You made ten ' + this.roundCount + ' times!', {
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
