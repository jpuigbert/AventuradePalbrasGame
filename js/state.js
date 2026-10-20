/* ============================================================
   STATE.JS — Estat global del joc (mutable)
   ============================================================ */

const State = {
  // Configuració persistida
  settings: {
    sfxOn: true,
    musicOn: false,
    fondo: 'cielo',
    boardLength: 30,
    onlineApiUrl: ''   // URL API de preguntes (buit = per defecte Open Trivia DB)
  },

  // Dades de la partida actual
  game: {
    active: false,
    players: [],        // [{ id, name, avatar, pos, stars, finished }]
    turnIndex: 0,
    board: [],          // [{ index, type }]
    startedAt: null,
    extraTurn: false,
    correctThisGame: 0,
    wrongThisGame: 0
  },

  // Seleccions al menú (abans de jugar)
  selection: {
    avatars: ['🦊', '🐼', '🦁', '🐸', '🐵', '🐰', '🦄', '🐙'],  // fins a 8
    playerCount: 2
  },

  /* ---------- Persistència de configuració ---------- */
  loadSettings() {
    try {
      const raw = localStorage.getItem(CONFIG.KEYS.SETTINGS);
      if (raw) Object.assign(this.settings, JSON.parse(raw));
    } catch (e) { /* localStorage no disponible */ }
  },

  saveSettings() {
    try {
      localStorage.setItem(CONFIG.KEYS.SETTINGS, JSON.stringify(this.settings));
    } catch (e) { /* ignora errors de quota */ }
  },

  /* ---------- Utilitats de partida ---------- */
  resetGame() {
    this.game = {
      active: false,
      players: [],
      turnIndex: 0,
      board: [],
      startedAt: null,
      extraTurn: false,
      correctThisGame: 0,
      wrongThisGame: 0
    };
  },

  currentPlayer() {
    const p = this.game.players;
    if (!p.length) return null;
    return p[this.game.turnIndex % p.length];
  },

  nextTurn() {
    if (this.game.extraTurn) {
      this.game.extraTurn = false;   // el mateix jugador torna a tirar
      return;
    }
    this.game.turnIndex = (this.game.turnIndex + 1) % this.game.players.length;
  }
};
