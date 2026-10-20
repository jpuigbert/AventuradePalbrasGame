/* ============================================================
   AUDIO.JS — Sons generats amb Web Audio API (sense fitxers)
   To sinusal + soroll (dau, coet, trampa) i jingles
   ============================================================ */

const Audio = (() => {
  let ctx = null;
  let masterGain = null;

  // Crea (o recupera) l'AudioContext després del primer gest de l'usuari
  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.55;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* Nota individual amb envolupament ADSR simple */
  function tone(freq, start, dur, type = 'sine', vol = 0.4) {
    const c = ensureCtx();
    if (!c || !State.settings.sfxOn) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime + start);
    const t0 = c.currentTime + start;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  /* Barrit d'una freqüència a una altra */
  function sweep(f1, f2, dur, type = 'sawtooth', vol = 0.3) {
    const c = ensureCtx();
    if (!c || !State.settings.sfxOn) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    const t0 = c.currentTime;
    osc.frequency.setValueAtTime(f1, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, f2), t0 + dur);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  /* Soroll blanc filtrat (per a dau, coet, trampa) */
  function noise(dur, { from = 800, to = from, filterQ = 1, vol = 0.3, type = 'lowpass' } = {}) {
    const c = ensureCtx();
    if (!c || !State.settings.sfxOn) return;
    const frames = Math.max(1, Math.floor(c.sampleRate * dur));
    const buffer = c.createBuffer(1, frames, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;

    const src = c.createBufferSource();
    src.buffer = buffer;

    const filter = c.createBiquadFilter();
    filter.type = type;
    filter.Q.value = filterQ;
    const t0 = c.currentTime;
    filter.frequency.setValueAtTime(from, t0);
    if (to !== from) filter.frequency.exponentialRampToValueAtTime(Math.max(40, to), t0 + dur);

    const gain = c.createGain();
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  /* Acord simultani */
  function chord(freqs, start, dur, type = 'triangle', vol = 0.25) {
    freqs.forEach(f => tone(f, start, dur, type, vol));
  }

  const sfx = {
    click: () => tone(660, 0, 0.07, 'square', 0.18),

    // soroll de dau: regrets secs de soroll + botigues
    dice: () => {
      for (let i = 0; i < 6; i++) {
        const t = i * 0.06 + Math.random() * 0.02;
        noise(0.05, { from: 1800 + Math.random() * 1500, vol: 0.22, type: 'bandpass', filterQ: 6 });
        tone(300 + Math.random() * 500, t, 0.05, 'triangle', 0.12);
      }
    },

    move: () => { tone(520, 0, 0.07, 'sine', 0.22); tone(660, 0.05, 0.06, 'sine', 0.14); },

    correct: () => {
      chord([523.3, 659.3, 784], 0, 0.22, 'triangle', 0.28);
      tone(1046.5, 0.16, 0.3, 'sine', 0.3);
    },

    wrong: () => {
      tone(311, 0, 0.16, 'sawtooth', 0.26);
      tone(233, 0.13, 0.32, 'sawtooth', 0.26);
      noise(0.15, { from: 300, vol: 0.08 });
    },

    bonus: () => {
      [659.3, 784, 987.8, 1318.5].forEach((f, i) => tone(f, i * 0.07, 0.22, 'triangle', 0.32));
      chord([1046.5, 1318.5], 0.3, 0.4, 'sine', 0.18);
    },

    trap: () => {
      sweep(420, 70, 0.55, 'sawtooth', 0.32);
      noise(0.4, { from: 900, to: 120, vol: 0.16 });
    },

    rocket: () => {
      sweep(180, 1200, 0.7, 'square', 0.22);
      noise(0.7, { from: 400, to: 3000, vol: 0.22, type: 'bandpass', filterQ: 2 });
    },

    swap: () => {
      tone(520, 0, 0.09, 'triangle', 0.26);
      tone(780, 0.09, 0.09, 'triangle', 0.26);
      tone(390, 0.18, 0.12, 'triangle', 0.22);
    },

    // torn extra: redoblament curt
    extraturn: () => {
      [784, 784, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.12, 'square', 0.16));
    },

    win: () => {
      // jingle de victòria: fanfàrria Do-Sol-Mi-Do aguda
      const seq = [[523.3, 0, 0.18], [659.3, 0.16, 0.18], [784, 0.32, 0.18],
                   [1046.5, 0.5, 0.42], [784, 0.5, 0.42], [659.3, 0.5, 0.42]];
      seq.forEach(([f, t, d]) => tone(f, t, d, 'triangle', 0.32));
      chord([261.6, 329.6, 392, 523.3], 0.5, 0.9, 'sine', 0.16);
      noise(0.5, { from: 5000, vol: 0.06, type: 'highpass' });   // confeti
    },

    medal: () => {
      [880, 1108.7, 1318.5, 1760].forEach((f, i) => tone(f, i * 0.09, 0.26, 'sine', 0.3));
      chord([1318.5, 1568, 2093], 0.36, 0.5, 'triangle', 0.12);
    }
  };

  return {
    unlock: ensureCtx,
    play(name) {
      if (sfx[name]) sfx[name]();
    }
  };
})();
