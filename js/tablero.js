/* ============================================================
   TABLERO.JS — Generació del tauler de joc (caselles)
   ============================================================ */

const Tablero = (() => {
  // Tria aleatòria ponderada d'un tipus de casella
  function weightedType() {
    const total = CONFIG.CELL_WEIGHTS.reduce((s, w) => s + w[1], 0);
    let r = Math.random() * total;
    for (const [type, weight] of CONFIG.CELL_WEIGHTS) {
      r -= weight;
      if (r <= 0) return type;
    }
    return 'normal';
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* Crea un tauler de `length` caselles:
     0 = salida, 1..length-2 = tipus aleatori (con les 4 categories garantides),
     length-1 = meta */
  function create(length) {
    const cells = [{ index: 0, type: 'normal' }];

    // Garanteix presència de totes les categories i efectes especials
    const guaranteed = shuffle([
      'comunicacion', 'sinonimos', 'antonimos', 'conversacion',
      'comunicacion', 'sinonimos', 'antonimos', 'conversacion',
      'bonus', 'trampa', 'coet', 'tornextra'
    ]);

    const middle = length - 2;
    for (let i = 0; i < middle; i++) {
      cells.push({ index: i + 1, type: i < guaranteed.length ? guaranteed[i] : weightedType() });
    }

    cells.push({ index: length - 1, type: 'meta' });
    return cells;
  }

  function cellAt(board, index) {
    if (index < 0) index = 0;
    if (index >= board.length) index = board.length - 1;
    return board[index];
  }

  return { create, cellAt, weightedType };
})();
