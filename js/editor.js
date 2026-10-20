/* ============================================================
   EDITOR.JS — Preguntes pròpies (localStorage) + export/import
   ============================================================ */

const Editor = (() => {
  let questions = load();

  function load() {
    try {
      const raw = localStorage.getItem(CONFIG.KEYS.CUSTOM_QUESTIONS);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* memòria */ }
    return [];
  }

  function save() {
    try {
      localStorage.setItem(CONFIG.KEYS.CUSTOM_QUESTIONS, JSON.stringify(questions));
    } catch (e) { /* ignora quota */ }
  }

  /* Afegeix una pregunta. Retorna la pregunta creada o null si és invàlida. */
  function add({ category, text, options, correct }) {
    if (!text || !Array.isArray(options) || options.length < 2) return null;
    if (correct < 0 || correct >= options.length) return null;

    const q = {
      id: 'q' + Date.now() + Math.floor(Math.random() * 1000),
      category: category || 'comunicacion',
      text: String(text).trim(),
      options: options.map(o => String(o).trim()).filter(o => o.length),
      correct: Number(correct)
    };
    if (q.options.length < 2 || q.correct >= q.options.length) return null;

    questions.push(q);
    save();
    Progreso.markCustomQuestionAdded(1);
    const newMedals = Medallas.evaluateAll();
    if (newMedals.length) UI.celebrateMedals(newMedals);
    return q;
  }

  function remove(id) {
    questions = questions.filter(q => q.id !== id);
    save();
  }

  function all() { return questions.slice(); }

  function getQuestionsByCategory(category) {
    return questions.filter(q => q.category === category);
  }

  /* Afegeix un lot de preguntes (usat per la cerca online i la importació).
     Retorna quantes s'han afegit realment (evita duplicats). */
  function addMany(list) {
    let added = 0;
    for (const q of list) {
      const exists = questions.some(e => e.text === q.text);
      if (exists) continue;
      if (add(q)) added++;
    }
    return added;
  }

  /* ---------- Export / Import ---------- */
  function exportJson() {
    const blob = new Blob([JSON.stringify(questions, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'preguntes-aventura.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000);
  }

  function importJson(text) {
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) { return 0; }
    if (!Array.isArray(parsed)) return 0;
    return addMany(parsed);
  }

  return {
    add, remove, all, exportJson, importJson, addMany,
    getQuestionsByCategory,
    count: () => questions.length
  };
})();
