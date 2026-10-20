/* ============================================================
   JUGADORES.JS — Gestió de jugadors (1-8) i avatars
   ============================================================ */

const Jugadores = (() => {
  const NAMES = ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4',
                 'Jugador 5', 'Jugador 6', 'Jugador 7', 'Jugador 8'];

  // Crea la llista de jugadors per a una partida nova
  function createPlayers(count) {
    const players = [];
    for (let i = 0; i < count; i++) {
      players.push({
        id: i,
        name: NAMES[i],
        avatar: State.selection.avatars[i] || CONFIG.AVATARS[i],
        color: CONFIG.PLAYER_COLORS[i % CONFIG.PLAYER_COLORS.length],
        pos: 0,
        stars: 0,
        finished: false
      });
    }
    return players;
  }

  // Torna un avatar lliure (no usat per altres jugadors)
  function freeAvatar(selectedIdx) {
    const used = State.selection.avatars.filter((a, i) => i !== selectedIdx);
    const available = CONFIG.AVATARS.filter(a => !used.includes(a));
    return available.length ? available : CONFIG.AVATARS;
  }

  function setAvatar(idx, emoji) {
    if (idx < 0 || idx >= CONFIG.MAX_PLAYERS) return;
    State.selection.avatars[idx] = emoji;
  }

  return { createPlayers, setAvatar, freeAvatar, NAMES };
})();
