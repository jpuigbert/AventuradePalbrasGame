/* ============================================================
   GENERADOR_OFFLINE.JS — Serveix preguntes del BANC ESTÀTIC
   (banco_preguntas.js, ~300 per secció en castellà).
   Evita repeticions: records de preguntes ja sortides a
   localStorage; quan una secció s'esgota, es reinicia.
   100% offline.
   ============================================================ */

const GeneradorOffline = (() => {
  const KEY_USED = 'avp_preguntas_usadas';

  /* Historial: { categoria: [índexos ja usats] } */
  function loadUsed() {
    try {
      return JSON.parse(localStorage.getItem(KEY_USED)) || {};
    } catch (e) { return {}; }
  }

  function saveUsed(used) {
    try { localStorage.setItem(KEY_USED, JSON.stringify(used)); } catch (e) {}
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* Tria un índex no usat del banc; si tots ho estan, reinicia. */
  function pickIndex(category, total) {
    const used = loadUsed();
    let list = used[category] || [];
    if (list.length >= total) {          // banc esgotat -> tornar a començar
      list = [];
    }
    const free = [];
    for (let i = 0; i < total; i++) if (!list.includes(i)) free.push(i);
    const idx = free[Math.floor(Math.random() * free.length)];
    list.push(idx);
    used[category] = list;
    saveUsed(used);
    return idx;
  }

  function resetHistory() {
    try { localStorage.removeItem(KEY_USED); } catch (e) {}
  }

  function generate(category) {
    // Conversación: tema lliure, sense opcions
    if (category === 'conversacion') {
      const bank = BancoPreguntas.all('conversacion');
      const q = bank[pickIndex('conversacion', bank.length)];
      return { category: 'conversacion', type: 'conversation', text: q.text };
    }

    const bank = BancoPreguntas.all(category) || [];
    if (!bank.length) {
      return {
        category,
        text: '¿Cuál es un sinónimo de «veloz»?',
        options: ['rápido', 'lento', 'triste'],
        correct: 0
      };
    }
    const q = bank[pickIndex(category, bank.length)];

    // Barrejar opcions mantenint la resposta correcta al seu lloc
    const correctValue = q.options[q.correct];
    const options = shuffle(q.options);
    return {
      category,
      text: q.text,
      options,
      correct: options.indexOf(correctValue)
    };
  }

  return {
    generate,
    resetHistory,
    stats: () => BancoPreguntas.counts()
  };
})();
