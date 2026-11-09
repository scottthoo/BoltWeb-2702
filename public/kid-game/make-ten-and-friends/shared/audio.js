/*
 * SoundFX — tiny Web Audio helper shared by every game.
 *
 * All sounds are generated on the fly with oscillators, so games need zero
 * audio files and work straight from the filesystem. Kept deliberately simple
 * and "toy-like": short, bright, friendly blips.
 */
window.SoundFX = (function () {
  let ctx = null;
  let muted = false;

  // Browsers require audio to start from a user gesture, so we create the
  // AudioContext lazily on the first interaction.
  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Play a single tone. type = oscillator wave, gain = loudness.
  function tone(freq, startTime, duration, type, gain) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;

    // Quick attack, smooth decay so notes never "click".
    env.gain.setValueAtTime(0.0001, startTime);
    env.gain.exponentialRampToValueAtTime(gain || 0.2, startTime + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(env);
    env.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Play a sequence of [frequency, duration] notes one after another.
  function sequence(notes, type, gain) {
    if (muted || !ensureCtx()) return;
    let t = ctx.currentTime;
    notes.forEach(function (n) {
      tone(n[0], t, n[1] + 0.03, type, gain);
      t += n[1];
    });
  }

  // Musical note frequencies we reuse below.
  const N = {
    C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99,
    A5: 880.0, C6: 1046.5, E6: 1318.5, G6: 1567.98,
    G3: 196.0, C4: 261.63, E4: 329.63
  };

  return {
    setMuted: function (m) { muted = m; },
    isMuted: function () { return muted; },
    resume: function () { ensureCtx(); },

    // A soft tap when a button is pressed.
    tap: function () {
      sequence([[N.E5, 0.06]], 'triangle', 0.15);
    },

    // Happy rising arpeggio for a correct answer.
    correct: function () {
      sequence([[N.C5, 0.1], [N.E5, 0.1], [N.G5, 0.1], [N.C6, 0.18]], 'triangle', 0.22);
    },

    // Gentle, non-scary "not yet" sound. Low and short, never a harsh buzzer.
    wrong: function () {
      sequence([[N.E4, 0.12], [N.C4, 0.18]], 'sine', 0.18);
    },

    // A rising pop, e.g. as items appear one by one (pitch climbs with step).
    pop: function (step) {
      if (muted || !ensureCtx()) return;
      const base = 600 + (step || 0) * 45;
      tone(base, ctx.currentTime, 0.1, 'sine', 0.18);
    },

    // Big celebration fanfare.
    fanfare: function () {
      sequence(
        [[N.C5, 0.14], [N.E5, 0.14], [N.G5, 0.14], [N.C6, 0.16], [N.E6, 0.16], [N.G6, 0.32]],
        'triangle',
        0.24
      );
    }
  };
})();
