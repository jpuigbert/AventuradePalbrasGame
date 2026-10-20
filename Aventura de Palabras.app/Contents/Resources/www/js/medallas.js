/* ============================================================
   MEDALLAS.JS — Sistema de 15 medalles offline
   ============================================================ */

const Medallas = (() => {
  const MIN = 60 * 1000;

  // Les 15 medalles i condició per aconseguir-les
  const MEDALS = [
    { id: 'primer_pas',  icon: '🎮', name: 'Primer pas',      desc: 'Juga 1 partida',            check: s => s.gamesPlayed >= 1 },
    { id: 'campeon',     icon: '🏆', name: 'Campió',          desc: 'Guanya 1 partida',          check: s => s.wins >= 1 },
    { id: 'diez',        icon: '⭐', name: 'Diez aciertos',   desc: '10 encerts totals',         check: s => s.totalCorrect >= 10 },
    { id: 'veinte',      icon: '🌟', name: 'Veinte aciertos', desc: '20 encerts totals',         check: s => s.totalCorrect >= 20 },
    { id: 'cincuenta',   icon: '💫', name: 'Medio centenar',  desc: '50 encerts totals',         check: s => s.totalCorrect >= 50 },
    { id: 'cien',        icon: '✨', name: 'Centenario',      desc: '100 encerts totals',        check: s => s.totalCorrect >= 100 },
    { id: 'racha',       icon: '🔥', name: 'En racha',        desc: '5 encerts seguidos',        check: s => s.bestStreak >= 5 },
    { id: 'imparable',   icon: '⚡', name: 'Imparable',       desc: '10 encerts seguidos',       check: s => s.bestStreak >= 10 },
    { id: 'perfecto',    icon: '💯', name: 'Perfecto',        desc: 'Guanya sense fallar',       check: s => s.perfectGames >= 1 },
    { id: 'velocista',   icon: '⏱️', name: 'Velocista',       desc: 'Guanya en menos de 5 min',  check: s => s.fastestWinMs !== null && s.fastestWinMs < 5 * MIN },
    { id: 'completo',    icon: '🎯', name: 'Completo',        desc: 'Totes les categories',      check: s => Object.keys(s.categories).length >= 4 },
    { id: 'explorador',  icon: '🗺️', name: 'Explorador',      desc: '3 fons diferents',          check: s => s.fondos.length >= 3 },
    { id: 'editor',      icon: '✏️', name: 'Editor',          desc: 'Afegeix 1 pregunta',        check: s => s.customQuestionsAdded >= 1 },
    { id: 'memoria',     icon: '🧠', name: 'Buena memoria',   desc: 'Guanya 3 partides',         check: s => s.wins >= 3 },
    { id: 'maestro',     icon: '👑', name: 'Maestro',         desc: 'Guanya 10 partides',        check: s => s.wins >= 10 }
  ];

  let earned = loadEarned();

  function loadEarned() {
    try {
      const raw = localStorage.getItem(CONFIG.KEYS.MEDALS);
      if (raw) return new Set(JSON.parse(raw));
    } catch (e) { /* memòria */ }
    return new Set();
  }

  function saveEarned() {
    try {
      localStorage.setItem(CONFIG.KEYS.MEDALS, JSON.stringify([...earned]));
    } catch (e) { /* ignora */ }
  }

  // AVALUA totes les medalles i retorna les NOVES guanyades
  function evaluateAll() {
    const stats = Progreso.get();
    const fresh = [];
    for (const m of MEDALS) {
      if (!earned.has(m.id) && m.check(stats)) {
        earned.add(m.id);
        fresh.push(m);
      }
    }
    if (fresh.length) saveEarned();
    return fresh;
  }

  return {
    list: MEDALS,
    evaluateAll,
    isEarned: id => earned.has(id),
    earnedCount: () => earned.size,
    reset: () => { earned = new Set(); saveEarned(); }
  };
})();
