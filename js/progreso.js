/* ============================================================
   PROGRESO.JS — Registre de progrés persistit (localStorage)
   ============================================================ */

const Progreso = (() => {
  const DEFAULT = {
    gamesPlayed: 0,
    wins: 0,
    totalCorrect: 0,
    totalWrong: 0,
    currentStreak: 0,
    bestStreak: 0,
    perfectGames: 0,
    fastestWinMs: null,
    categories: {},        // { sinonimos: true, ... } contestades correctament
    fondos: [],            // ids de fons usats
    customQuestionsAdded: 0,
    lastPlayed: null
  };

  let data = load();

  function load() {
    try {
      const raw = localStorage.getItem(CONFIG.KEYS.PROGRESS);
      if (raw) return Object.assign({}, DEFAULT, JSON.parse(raw));
    } catch (e) { /* localStorage no disponible: memòria */ }
    return Object.assign({}, DEFAULT);
  }

  function save() {
    try {
      localStorage.setItem(CONFIG.KEYS.PROGRESS, JSON.stringify(data));
    } catch (e) { /* ignora errors de quota */ }
  }

  function reset() {
    data = Object.assign({}, DEFAULT, { categories: {}, fondos: [] });
    save();
  }

  /* --- Registres --- */
  function recordAnswer(correct, category) {
    if (correct) {
      data.totalCorrect++;
      data.currentStreak++;
      if (data.currentStreak > data.bestStreak) data.bestStreak = data.currentStreak;
      if (category) data.categories[category] = true;
    } else {
      data.totalWrong++;
      data.currentStreak = 0;
    }
    save();
  }

  /* Anota una partida acabada.
     results = { won, timeMs, wrong } */
  function recordGameEnd(results) {
    data.gamesPlayed++;
    data.lastPlayed = new Date().toISOString();
    if (results.won) {
      data.wins++;
      if (results.wrong === 0) data.perfectGames++;
      if (results.timeMs && (!data.fastestWinMs || results.timeMs < data.fastestWinMs)) {
        data.fastestWinMs = results.timeMs;
      }
    }
    save();
  }

  function markFondoUsed(id) {
    if (!data.fondos.includes(id)) {
      data.fondos.push(id);
      save();
    }
  }

  function markCustomQuestionAdded(n = 1) {
    data.customQuestionsAdded += n;
    save();
  }

  return {
    get: () => data,
    save,
    reset,
    recordAnswer,
    recordGameEnd,
    markFondoUsed,
    markCustomQuestionAdded,
    categoriesCount: () => Object.keys(data.categories).length
  };
})();
