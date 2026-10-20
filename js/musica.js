/* ============================================================
   MUSICA.JS — 3 melodies de fons generades amb Web Audio API
   Cada melodia sona a 3 veus: melodia + baix + espit (arpegi)
   ============================================================ */

const Musica = (() => {
  let ctx = null;
  let schedulerId = null;
  let currentMelody = 0;
  let step = 0;
  let nextTime = 0;

  /* ---------- Notes: nom = semitons des de C4 (MIDI 60) ---------- */
  const N = {
    C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11
  };

  // n('A', 4) -> la de la 4a octava
  function n(name, oct) {
    const semis = N[name] + (oct - 4) * 12;
    return 261.6256 * Math.pow(2, semis / 12);
  }

  /* ---------- Melodies ----------
     lead/harp: [freq, durBuits] | null = silenci
     bass:      [freq, durBuits]                                   */

  // 1) Aventura — allegro en Do major
  const AVENTURA = {
    name: '🎶 Aventura', bpm: 116, waves: 32,
    leadType: 'triangle', leadVol: 0.16,
    bassType: 'sine',     bassVol: 0.13,
    harpType: 'sine',     harpVol: 0.055,
    lead: [
      [n('E',4),1],[n('G',4),1],[n('C',5),2], null,[n('B',4),1],[n('G',4),1],[n('E',4),2],
      [n('A',4),1],[n('C',5),1],[n('E',5),2], null,[n('D',5),1],[n('C',5),1],[n('G',4),2],
      [n('E',4),1],[n('G',4),1],[n('C',5),2], null,[n('B',4),1],[n('C',5),1],[n('D',5),2],
      [n('E',5),2], null,[n('C',5),2], null,[n('G',4),2], null,[n('C',5),4]
    ],
    bass: [
      [n('C',3),4],[n('G',3),4], [n('A',2),4],[n('E',3),4],
      [n('F',2),4],[n('C',3),4], [n('G',2),4],[n('D',3),4],
      [n('C',3),4],[n('G',3),4], [n('A',2),4],[n('E',3),4],
      [n('F',2),4],[n('G',2),4], [n('C',3),4],[n('G',2),4]
    ],
    // arpegi C-E-G / A-C-E / F-A-C / G-B-D
    harpChords: [[n('C',4),n('E',4),n('G',4)], [n('A',3),n('C',4),n('E',4)],
                 [n('F',3),n('A',3),n('C',4)], [n('G',3),n('B',3),n('D',4)]]
  };

  // 2) Calma — andante en Fa major
  const CALMA = {
    name: '🌙 Calma', bpm: 78, waves: 32,
    leadType: 'sine', leadVol: 0.14,
    bassType: 'sine', bassVol: 0.10,
    harpType: 'triangle', harpVol: 0.05,
    lead: [
      [n('A',4),4], null,[n('C',5),2],[n('B',4),2],
      [n('A',4),3],[n('G',4),1],[n('F',4),4],
      [n('D',5),4], null,[n('C',5),2],[n('A',4),2],
      [n('G',4),6], null,[n('F',4),8]
    ],
    bass: [
      [n('F',2),8], [n('C',3),8], [n('D',2),8], [n('C',3),8],
      [n('F',2),8], [n('C',3),8], [n('B',2),8], [n('F',2),8]
    ],
    harpChords: [[n('F',3),n('A',3),n('C',4)], [n('C',4),n('E',4),n('G',4)],
                 [n('D',3),n('F',3),n('A',3)], [n('C',4),n('E',4),n('G',4)]]
  };

  // 3) Marxa — moderato marxa militar en Sol major
  const MARXA = {
    name: '🚀 Marxa', bpm: 100, waves: 32,
    leadType: 'square', leadVol: 0.085,
    bassType: 'triangle', bassVol: 0.12,
    harpType: 'sine', harpVol: 0.045,
    lead: [
      [n('G',4),1],[n('G',4),1],[n('G',4),2],[n('A',4),1],[n('B',4),1],[n('G',4),2],
      [n('B',4),2],[n('D',5),2],[n('B',4),2],[n('G',4),2],
      [n('C',5),1],[n('C',5),1],[n('C',5),2],[n('D',5),1],[n('B',4),1],[n('G',4),2],
      [n('A',4),2],[n('B',4),2],[n('C',5),4]
    ],
    bass: [
      [n('G',2),4],[n('D',3),4], [n('C',3),4],[n('G',2),4],
      [n('G',2),4],[n('D',3),4], [n('C',3),4],[n('G',2),4],
      [n('D',3),4],[n('G',2),4], [n('C',3),4],[n('G',2),4],
      [n('D',2),4],[n('D',3),4], [n('G',2),4],[n('G',2),4]
    ],
    harpChords: [[n('G',3),n('B',3),n('D',4)], [n('C',4),n('E',4),n('G',4)],
                 [n('D',3),n('F#',3),n('A',3)], [n('G',3),n('B',3),n('D',4)]]
  };

  const MELODIES = [AVENTURA, CALMA, MARXA];

  /* ---------- Motor d'àudio ---------- */
  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function voice(freq, start, dur, type, vol) {
    if (!freq || !ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const attack = 0.02;
    const release = Math.min(0.12, dur * 0.4);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(vol, start + attack);
    gain.gain.setValueAtTime(vol, Math.max(start + attack, start + dur - release));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.03);
  }

  function durBuit() { return 60 / MELODIES[currentMelody].bpm / 4; }

  // Longitud de bucle = la veu més llarga (en beats)
  function loopLen(mel) {
    return Math.max(mel.lead.length, mel.bass.length);
  }

  // Programa els 3 veus d'un pas (anar per lookahead = sense forats de temps)
  function scheduleStep(t) {
    const mel = MELODIES[currentMelody];
    const db = durBuit();
    const beat = step % 4;

    const lead = mel.lead[step % mel.lead.length];
    if (lead) voice(lead[0], t, lead[1] * db * 0.95, mel.leadType, mel.leadVol);

    const bass = mel.bass[step % mel.bass.length];
    if (bass) voice(bass[0], t, bass[1] * db * 0.9, mel.bassType, mel.bassVol);

    // espit: 1 nota de l'acord a cada temps (canvia d'acord cada 8 beats)
    const chord = mel.harpChords[Math.floor(step / 8) % mel.harpChords.length];
    if (chord) voice(chord[beat % chord.length], t, db * 0.8, mel.harpType, mel.harpVol);

    step++;
  }

  function scheduler() {
    const mel = MELODIES[currentMelody];
    const horizon = ctx.currentTime + 0.35;
    while (nextTime < horizon) {
      scheduleStep(nextTime);
      nextTime += durBuit();
    }
    // Reinici suau quan acaba una volta completa de veus
    if (step >= loopLen(mel)) step = 0;
  }

  /* ---------- API ---------- */
  return {
    isPlaying: () => !!schedulerId,

    start(melodyIdx = null) {
      const c = ensureCtx();
      if (!c) return;
      this.stop();
      // Si no es indica melodia, repren l'ultima triada (o Aventura)
      const idx = (melodyIdx === null)
        ? (State.settings.musicIdx || 0)
        : melodyIdx;
      currentMelody = ((idx % MELODIES.length) + MELODIES.length) % MELODIES.length;
      State.settings.musicIdx = currentMelody;
      step = 0;
      nextTime = ctx.currentTime + 0.1;
      scheduler();
      schedulerId = setInterval(scheduler, 100);
      State.settings.musicOn = true;
      State.saveSettings();
    },

    next() {
      this.start((currentMelody + 1) % MELODIES.length);
      return MELODIES[currentMelody].name;
    },

    stop() {
      if (schedulerId) { clearInterval(schedulerId); schedulerId = null; }
      State.settings.musicOn = false;
      State.saveSettings();
    },

    toggle() {
      if (this.isPlaying()) { this.stop(); return false; }
      this.start(currentMelody);
      return true;
    },

    melodyName() { return MELODIES[currentMelody].name; },
    currentIdx: () => currentMelody,
    melodies: () => MELODIES.map(m => m.name)
  };
})();
