/* ============================================================
   GAME.JS — Logica del joc: torns, moviment, caselles, puntuació
   ============================================================ */

const Game = (() => {

  const wait = ms => new Promise(res => setTimeout(res, ms));

  /* ---------- Inici ---------- */
  function startNewGame() {
    State.resetGame();
    State.game.players = Jugadores.createPlayers(State.selection.playerCount);
    State.game.board = Tablero.create(State.settings.boardLength);
    State.game.active = true;
    State.game.startedAt = Date.now();
    UI.renderBoard();
    UI.renderLegend();
    UI.renderPlayers();
    UI.updateTurnLabel();
    UI.showScreen('gameScreen');
  }

  /* ---------- Dau ---------- */
  async function rollDice() {
    if (!State.game.active || UI.busy) return;

    const value = 1 + Math.floor(Math.random() * 6);
    Audio.play('dice');
    await UI.animateDice(value);

    const player = State.currentPlayer();
    await movePlayer(player, value);
    await handleCell(player);
  }

  /* ---------- Moviment ---------- */
  async function movePlayer(player, steps) {
    const last = State.game.board.length - 1;
    for (let i = 0; i < steps; i++) {
      if (player.pos >= last) break;
      player.pos++;
      Audio.play('move');
      UI.renderBoard();
      await wait(260);
    }
    if (player.pos >= last) {
      player.pos = last;
      UI.renderBoard();
      await finishGame(player);
      return;
    }
    UI.renderBoard();
  }

  async function jumpTo(player, index) {
    const last = State.game.board.length - 1;
    player.pos = Math.max(0, Math.min(index, last));
    UI.renderBoard();
    if (player.pos >= last) await finishGame(player);
  }

  /* ---------- Casella ---------- */
  async function handleCell(player) {
    if (!State.game.active) return;

    const cell = State.game.board[player.pos];
    UI.highlightCell(player.pos);

    // Explicació què és aquesta casella abans de jugar-la
    UI.cellIntro(cell.type);
    await wait(1400);

    switch (cell.type) {
      case 'normal':
        endTurn();
        break;

      case 'comunicacion':
      case 'sinonimos':
      case 'antonimos':
        await askQuestion(cell.type, player);
        break;

      case 'conversacion':
        await askConversation(player);
        break;

      case 'bonus':
        player.stars += CONFIG.SCORE_BONUS;
        Audio.play('bonus');
        UI.toast(`⭐ Bonus! +${CONFIG.SCORE_BONUS} estrelles per a ${player.name}`, 'success');
        UI.floatScore(player.pos, `+${CONFIG.SCORE_BONUS}`);
        UI.renderPlayers();
        endTurn();
        break;

      case 'trampa':
        player.stars = Math.max(0, player.stars + CONFIG.SCORE_TRAP);
        Audio.play('trap');
        UI.toast(`💀 Trampa! ${CONFIG.SCORE_TRAP} estrelles per a ${player.name}`, 'error');
        UI.floatScore(player.pos, `${CONFIG.SCORE_TRAP}`);
        UI.shakePanel();
        UI.renderPlayers();
        endTurn();
        break;

      case 'coet': {
        Audio.play('rocket');
        UI.toast(`🚀 Coet! ${player.name} avança ${CONFIG.COET_STEPS} caselles`, 'info');
        UI.rocketFx(player.pos);
        await wait(500);
        await jumpTo(player, player.pos + CONFIG.COET_STEPS);
        if (State.game.active) endTurn();
        break;
      }

      case 'intercambio': {
        const others = State.game.players.filter(p => p !== player);
        const target = others[Math.floor(Math.random() * others.length)];
        if (target) {
          Audio.play('swap');
          const tmp = player.pos;
          player.pos = target.pos;
          target.pos = tmp;
          UI.toast(`🔄 ${player.name} intercanvia posició amb ${target.name}`, 'info');
          UI.renderBoard();
        } else {
          UI.toast('🔄 Ningú amb qui intercanviar!', 'info');
        }
        endTurn();
        break;
      }

      case 'tornextra':
        State.game.extraTurn = true;
        Audio.play('extraturn');
        UI.toast(`🎲 Torn extra per a ${player.name}!`, 'success');
        endTurn(false);   // no avança el torn: el mateix jugador repeteix
        break;

      default:
        endTurn();
    }
  }

  /* ---------- Preguntes ---------- */
  async function askQuestion(category, player) {
    const q = Preguntas.getForCategory(category);
    const ok = await UI.showQuestion(q);

    Progreso.recordAnswer(ok, category);
    if (ok) {
      player.stars += CONFIG.SCORE_CORRECT;
      State.game.correctThisGame++;
      Audio.play('correct');
      UI.floatScore(player.pos, `+${CONFIG.SCORE_CORRECT}`);
    } else {
      State.game.wrongThisGame++;
      Audio.play('wrong');
    }
    UI.renderPlayers();

    const newMedals = Medallas.evaluateAll();
    if (newMedals.length) UI.celebrateMedals(newMedals);

    endTurn();
  }

  /* Conversación: tria de tema + parlar amb temps + autoavaluació por criterios */
  async function askConversation(player) {
    const topicA = GeneradorOffline.generate('conversacion');
    const topicB = GeneradorOffline.generate('conversacion');
    const earned = await UI.showConversation(topicA, topicB);
    const ok = earned > 0;

    Progreso.recordAnswer(ok, 'conversacion');
    if (ok) {
      player.stars += earned;
      State.game.correctThisGame++;
      Audio.play('correct');
      UI.floatScore(player.pos, `+${earned}`);
      UI.toast(`🗣️ ${player.name} gana ${earned} ⭐ por conversar`, 'success');
    } else {
      State.game.wrongThisGame++;
    }
    UI.renderPlayers();

    const newMedals = Medallas.evaluateAll();
    if (newMedals.length) UI.celebrateMedals(newMedals);

    endTurn();
  }

  /* ---------- Torn i fi ---------- */
  function endTurn(advance = true) {
    if (!State.game.active) return;
    if (advance) State.nextTurn();
    UI.updateTurnLabel();
    UI.setDiceEnabled(true);
  }

  async function finishGame(winnerPlayer) {
    State.game.active = false;
    UI.setDiceEnabled(false);

    const timeMs = Date.now() - (State.game.startedAt || Date.now());
    const results = {
      won: true,                       // mode local: tots els jugadors són "guanyadors"
      timeMs,
      wrong: State.game.wrongThisGame
    };
    Progreso.recordGameEnd(results);

    Audio.play('win');
    const newMedals = Medallas.evaluateAll();
    if (newMedals.length) UI.celebrateMedals(newMedals);

    UI.showResult(winnerPlayer, timeMs);
  }

  function exitToMenu() {
    State.game.active = false;
    UI.showScreen('startScreen');
  }

  return { startNewGame, rollDice, exitToMenu };
})();
