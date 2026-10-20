/* ============================================================
   PREGUNTAS.JS — Combina preguntes offline + personalitzades
   ============================================================ */

const Preguntas = (() => {

  // Torna una pregunta per a la categoria donada.
  // Barreja el banc offline amb les preguntes de l'editor.
  function getForCategory(category) {
    const custom = Editor.getQuestionsByCategory(category);

    // 35% de probabilitat d'usar una pregunta pròpia si n'hi ha
    if (custom.length && Math.random() < 0.35) {
      const q = custom[Math.floor(Math.random() * custom.length)];
      return {
        category,
        text: q.text,
        options: q.options,
        correct: q.correct,
        source: 'custom'
      };
    }

    const q = GeneradorOffline.generate(category);
    q.source = q.source || 'offline';
    return q;
  }

  return { getForCategory };
})();
