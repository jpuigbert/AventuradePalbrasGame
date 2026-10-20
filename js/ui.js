/* ============================================================
   UI.JS — Interfície: pantalles, tauler, modals, toasts
   ============================================================ */

const UI = (() => {
  let busy = false;          // evita accions mentre hi ha un modal obert
  let activeAvatarSlot = 0;  // slot d'avatar seleccionat al menú

  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  function clear(el) { while (el && el.firstChild) el.removeChild(el.firstChild); }

  /* ================= PANTALLES ================= */
  function showScreen(id) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    const sc = $(`#${id}`);
    if (sc) sc.classList.add('active');
  }

  /* ================= TOASTS ================= */
  function toast(msg, type = 'info', ms = 2600) {
    const cont = $('#toastContainer');
    if (!cont) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    cont.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity .4s';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 420);
    }, ms);
  }

  /* ================= MENÚ: FONOS ================= */
  function renderFondoSelector() {
    const wrap = $('#fondoSelector');
    if (!wrap) return;
    clear(wrap);
    Fondos.list.forEach(f => {
      const chip = document.createElement('button');
      chip.className = 'fondo-chip' + (State.settings.fondo === f.id ? ' selected' : '');
      chip.style.background = f.color;
      chip.textContent = f.label;
      chip.addEventListener('click', () => {
        Audio.play('click');
        Fondos.apply(f.id);
        $$('.fondo-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
      });
      wrap.appendChild(chip);
    });
  }

  /* ================= MENÚ: JUGADORS ================= */
  function renderPlayerCount() {
    const label = $('#playerCountLabel');
    if (label) label.textContent = State.selection.playerCount;
  }

  function renderAvatarSelector() {
    const wrap = $('#avatarSelector');
    if (!wrap) return;
    clear(wrap);

    for (let i = 0; i < State.selection.playerCount; i++) {
      const slot = document.createElement('div');
      slot.className = 'avatar-slot filled' + (i === activeAvatarSlot ? ' current' : '');
      if (i === activeAvatarSlot) slot.style.borderColor = 'var(--rosa)';

      const em = document.createElement('div');
      em.className = 'avatar-emoji';
      em.textContent = State.selection.avatars[i];
      slot.appendChild(em);

      const nm = document.createElement('div');
      nm.className = 'avatar-name';
      nm.textContent = Jugadores.NAMES[i];
      slot.appendChild(nm);

      slot.addEventListener('click', () => {
        Audio.play('click');
        activeAvatarSlot = i;
        renderAvatarSelector();
      });
      wrap.appendChild(slot);
    }

    // Guardar slot actiu dins el límit
    if (activeAvatarSlot >= State.selection.playerCount) {
      activeAvatarSlot = State.selection.playerCount - 1;
    }
  }

  function renderAvatarPicker() {
    const wrap = $('#avatarPicker');
    if (!wrap) return;
    clear(wrap);
    CONFIG.AVATARS.forEach(emoji => {
      const opt = document.createElement('span');
      opt.className = 'avatar-option' + (State.selection.avatars[activeAvatarSlot] === emoji ? ' selected' : '');
      opt.textContent = emoji;
      opt.addEventListener('click', () => {
        Audio.play('click');
        Jugadores.setAvatar(activeAvatarSlot, emoji);
        renderAvatarSelector();
        renderAvatarPicker();
      });
      wrap.appendChild(opt);
    });
  }

  /* ================= TAULER ================= */
  function renderBoard() {
    const board = $('#board');
    if (!board) return;
    clear(board);

    const current = State.game.active ? State.currentPlayer() : null;

    State.game.board.forEach(cell => {
      const div = document.createElement('div');
      div.className = `cell type-${cell.type}`;
      div.dataset.index = cell.index;
      div.title = CONFIG.CELL_LABELS[cell.type] || '';

      const num = document.createElement('span');
      num.className = 'cell-num';
      num.textContent = cell.index;
      div.appendChild(num);

      const emoji = CONFIG.CELL_EMOJIS[cell.type] || '';
      if (emoji) {
        const icon = document.createElement('span');
        icon.className = 'cell-icon';
        icon.textContent = emoji;
        div.appendChild(icon);
      }

      const label = document.createElement('span');
      label.className = 'cell-label';
      label.textContent = CONFIG.CELL_LABELS[cell.type] || '';
      div.appendChild(label);

      // Piezas de los jugadores en esta casella: anell de color + número
      const here = State.game.players.filter(p => p.pos === cell.index);
      if (here.length) {
        const pieces = document.createElement('div');
        pieces.className = 'pieces';
        const MAX_VIS = 4;   // 2x2 dins la casella; la resta com a xip +N
        here.slice(0, MAX_VIS).forEach(p => {
          const pc = document.createElement('span');
          pc.className = 'piece';
          pc.style.setProperty('--pc', p.color);
          if (current && p.id === current.id) pc.classList.add('active-piece');
          pc.textContent = p.avatar;
          const pn = document.createElement('span');
          pn.className = 'piece-num';
          pn.textContent = p.id + 1;
          pc.appendChild(pn);
          pieces.appendChild(pc);
        });
        if (here.length > MAX_VIS) {
          const more = document.createElement('span');
          more.className = 'piece piece-more';
          more.textContent = '+' + (here.length - MAX_VIS);
          pieces.appendChild(more);
        }
        div.appendChild(pieces);
      }

      if (current && current.pos === cell.index) div.classList.add('current');
      board.appendChild(div);
    });
  }

  /* Banner que explica què és la casella en aterrar-hi (abans de jugar-la) */
  let cellIntroTimer = null;
  function cellIntro(type) {
    const el = $('#cellIntro'), txt = $('#cellIntroText');
    if (!el || !txt) return;
    const info = CONFIG.CELL_INFO && CONFIG.CELL_INFO[type];
    if (!info) return;
    txt.textContent = info;
    el.classList.add('hidden');
    el.classList.remove('show');
    void el.offsetWidth;            // reinicia l'animació
    el.classList.remove('hidden');
    el.classList.add('show');
    if (cellIntroTimer) clearTimeout(cellIntroTimer);
    cellIntroTimer = setTimeout(() => el.classList.add('hidden'), 1900);
  }

  /* Llegenda fixa sota el tauler per saber què és cada casella */
  function renderLegend() {
    const wrap = $('#legend');
    if (!wrap) return;
    clear(wrap);
    const items = [
      ['normal', '🏁', 'Sortida'],
      ['comunicacion', '📘', 'Comunicación'],
      ['sinonimos', '📗', 'Sinónimos (= mateix)'],
      ['antonimos', '📙', 'Antónimos (contrari)'],
      ['conversacion', '💬', 'Conversación'],
      ['bonus', '⭐', 'Bonus +15'],
      ['trampa', '💀', 'Trampa −10'],
      ['coet', '🚀', 'Coet +3'],
      ['intercambio', '🔄', 'Intercanvi'],
      ['tornextra', '🎲', 'Torn extra'],
      ['meta', '🏆', 'Meta']
    ];
    items.forEach(([type, icon, text]) => {
      const el = document.createElement('span');
      el.className = 'legend-item';
      const i = document.createElement('span');
      i.className = 'lg-icon';
      i.textContent = icon;
      const t = document.createElement('span');
      t.textContent = text;
      el.append(i, t);
      wrap.appendChild(el);
    });
  }

  function highlightCell(index) {
    const cell = $(`.cell[data-index="${index}"]`);
    if (!cell) return;
    cell.classList.add('hop');
    setTimeout(() => cell.classList.remove('hop'), 450);
  }

  function floatScore(index, text) {
    const cell = $(`.cell[data-index="${index}"]`);
    if (!cell) return;
    const el = document.createElement('span');
    el.className = 'float-score';
    el.textContent = text;
    cell.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  }

  function rocketFx(index) {
    const cell = $(`.cell[data-index="${index}"]`);
    if (!cell) return;
    cell.classList.add('rocket-fx');
    setTimeout(() => cell.classList.remove('rocket-fx'), 850);
  }

  function shakePanel() {
    const panel = $('.side-panel');
    if (!panel) return;
    panel.classList.add('shake');
    setTimeout(() => panel.classList.remove('shake'), 450);
  }

  /* ================= PANELL LATERAL ================= */
  function renderPlayers() {
    const wrap = $('#playersPanel');
    if (!wrap) return;
    clear(wrap);
    const current = State.currentPlayer();

    State.game.players.forEach(p => {
      const row = document.createElement('div');
      row.className = 'player-row' + (current && p.id === current.id ? ' active' : '');
      row.style.setProperty('--pc', p.color);
      const dot = document.createElement('span');
      dot.className = 'p-dot';
      const em = document.createElement('span');
      em.className = 'p-emoji';
      em.textContent = p.avatar;
      const nm = document.createElement('span');
      nm.className = 'p-name';
      nm.textContent = `${p.name} · casella ${p.pos}`;
      const st = document.createElement('span');
      st.className = 'p-stars';
      st.textContent = `⭐ ${p.stars}`;
      row.append(dot, em, nm, st);
      wrap.appendChild(row);
    });
  }

  function updateTurnLabel() {
    const label = $('#turnLabel');
    const p = State.currentPlayer();
    if (label && p) {
      label.textContent = `Turno de ${p.name}`;
      label.style.color = p.color;
    }
  }

  function setDiceEnabled(on) {
    const btn = $('#rollDiceBtn');
    if (btn) btn.disabled = !on;
    busy = !on;
  }

  /* Giro final del dau segons el valor (enrotllament acumulatiu) */
  const FACE_ROT = {
    1: [0, 0], 2: [90, 0], 3: [0, -90],
    4: [0, 90], 5: [-90, 0], 6: [0, 180]
  };
  let spinX = 0, spinY = 0;

  async function animateDice(value) {
    const cube = $('#diceCube');
    if (!cube) { await new Promise(r => setTimeout(r, 600)); return; }
    setDiceEnabled(false);

    // voltes ràpides mentre “roda”
    cube.style.transition = 'transform .18s linear';
    for (let i = 0; i < 10; i++) {
      spinX += 137 + Math.floor(Math.random() * 120);
      spinY += 205 + Math.floor(Math.random() * 140);
      cube.style.transform = `rotateX(${spinX}deg) rotateY(${spinY}deg)`;
      await new Promise(r => setTimeout(r, 130));
    }

    // aterratge suau sobre la cara del valor obtingut
    const [fx, fy] = FACE_ROT[value];
    spinX += 360 - (spinX % 360) + fx;
    spinY += 360 - (spinY % 360) + fy;
    cube.style.transition = 'transform .9s cubic-bezier(.2, .8, .3, 1.15)';
    cube.style.transform = `rotateX(${spinX}deg) rotateY(${spinY}deg)`;
    await new Promise(r => setTimeout(r, 950));
  }

  /* ================= MODALS (genèrics) ================= */
  function openModal(id) {
    const m = $(`#${id}`);
    if (m) m.classList.remove('hidden');
  }

  function closeModal(id) {
    const m = $(`#${id}`);
    if (m) m.classList.add('hidden');
  }

  /* Pregunta de tipus test -> Promise<boolean> encert */
  function showQuestion(q) {
    return new Promise(resolve => {
      openModal('questionModal');
      const badge = $('#questionCatBadge');
      const cat = CONFIG.CATEGORIES[q.category] || CONFIG.CATEGORIES.comunicacion;
      badge.textContent = `${cat.emoji} ${cat.label}`;
      badge.style.background = cat.color;

      // Explicació què significa aquesta categoria
      const def = $('#questionDef');
      def.textContent = CONFIG.CAT_INFO[q.category] || '';
      def.style.borderLeftColor = cat.color;

      $('#questionText').textContent = q.text;
      const feedback = $('#questionFeedback');
      feedback.className = 'question-feedback hidden';
      feedback.textContent = '';
      const nextBtn = $('#questionNextBtn');
      nextBtn.classList.add('hidden');

      const wrap = $('#questionOptions');
      clear(wrap);
      let answered = false;

      q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = `${String.fromCharCode(65 + i)}) ${opt}`;
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          const ok = i === q.correct;
          $$('.option-btn').forEach((b, bi) => {
            b.disabled = true;
            if (bi === q.correct) b.classList.add('correct');
          });
          if (!ok) btn.classList.add('wrong');
          feedback.textContent = ok
            ? `¡Correcto! +${CONFIG.SCORE_CORRECT} ⭐`
            : `¡Ups! La respuesta correcta era: ${q.options[q.correct]}`;
          feedback.className = `question-feedback ${ok ? 'ok' : 'no'}`;
          nextBtn.classList.remove('hidden');
        });
        wrap.appendChild(btn);
      });

      nextBtn.onclick = () => {
        closeModal('questionModal');
        resolve(answered);
      };
    });
  }

  /* Targeta de conversación -> Promise<estrellas 0-12>
     Fase 1 tria tema · Fase 2 parlar amb temps · Fase 3 autoavaluació */
  const CONV_CHALLENGES = [
    'Di la palabra «porque» al menos dos veces.',
    'Termina tu frase con «¿y tú?» para preguntar a un compañero.',
    'Usa tres adjetivos: por ejemplo «grande, divertido y bonito».',
    'Empieza cada frase con «A mí me gusta…» o «Yo prefiero…».',
    'Di una comparación: «más… que…» o «tan… como…».',
    'Acaba con una frase de cortesía: «¡Gracias por escucharme!»'
  ];

  function showConversation(topicA, topicB) {
    return new Promise(resolve => {
      openModal('conversationModal');
      const convDef = $('#conversationDef');
      if (convDef) convDef.textContent = CONFIG.CAT_INFO.conversacion;

      const phases = {
        choose: $('#convPhaseChoose'),
        talk:   $('#convPhaseTalk'),
        rate:   $('#convPhaseRate')
      };
      const show = name => Object.keys(phases).forEach(k =>
        phases[k].classList.toggle('hidden', k !== name));

      let timerId = null, left = 60;
      const stopTimer = () => { if (timerId) { clearInterval(timerId); timerId = null; } };

      const finish = stars => {
        stopTimer();
        closeModal('conversationModal');
        resolve(stars);
      };

      // --- Fase 1: tria de tema (dos targetes) ---
      $('#convTopic1').textContent = '🃏 ' + topicA.text;
      $('#convTopic2').textContent = '🎪 ' + topicB.text;
      $('#convTopic1').onclick = () => startTalk(topicA);
      $('#convTopic2').onclick = () => startTalk(topicB);

      // --- Fase 2: parlar amb temporitzador de 60 s ---
      function startTalk(topic) {
        $('#conversationPrompt').textContent = topic.text;
        $('#convChallenge').textContent = '🎯 Reto: ' +
          CONV_CHALLENGES[Math.floor(Math.random() * CONV_CHALLENGES.length)];
        show('talk');

        left = 60;
        const timeEl = $('#convTime'), ring = $('#convTimerRing');
        const paint = () => {
          timeEl.textContent = left;
          ring.classList.toggle('urgent', left <= 10);
        };
        paint();
        timerId = setInterval(() => {
          left--;
          paint();
          if (left === 30 || left === 10) Audio.play('move');
          if (left <= 0) {
            stopTimer();
            Audio.play('trap');
            goRate();
          }
        }, 1000);
      }

      // --- Fase 3: autoavaluació per criteris ---
      function goRate() {
        stopTimer();
        ['convR1', 'convR2', 'convR3'].forEach(id => { $('#' + id).checked = false; });
        show('rate');
      }
      $('#convFinish').onclick = () => { Audio.play('click'); goRate(); };
      $('#convConfirm').onclick = () => {
        const n = ['convR1', 'convR2', 'convR3'].filter(id => $('#' + id).checked).length;
        finish(n * CONFIG.SCORE_CONV_ITEM);
      };

      show('choose');
    });
  }

  /* Resultat final */
  function showResult(winner, timeMs) {
    openModal('resultModal');
    const mins = Math.floor(timeMs / 60000);
    const segs = Math.floor((timeMs % 60000) / 1000);

    const body = $('#resultBody');
    clear(body);

    const sorted = State.game.players.slice().sort((a, b) => b.stars - a.stars);
    sorted.forEach((p, i) => {
      const row = document.createElement('div');
      row.className = 'result-row' + (p.id === winner.id ? ' winner' : '');
      row.textContent = `${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🎖️'} ${p.avatar} ${p.name} — ⭐ ${p.stars}`;
      body.appendChild(row);
    });

    $('#resultTitle').textContent = `🏆 ¡${winner.name} ha arribat a la meta! (${mins}m ${segs}s)`;
  }

  /* Medalles noves */
  function celebrateMedals(newMedals) {
    Audio.play('medal');
    newMedals.forEach(m => toast(`🏅 Medalla nova: ${m.icon} ${m.name}`, 'success', 3400));
  }

  /* Graella de medalles */
  function renderMedalsGrid() {
    const grid = $('#medalsGrid');
    if (!grid) return;
    clear(grid);
    Medallas.list.forEach(m => {
      const earned = Medallas.isEarned(m.id);
      const card = document.createElement('div');
      card.className = 'medal-card' + (earned ? ' earned' : '');
      const icon = document.createElement('div');
      icon.className = 'medal-icon';
      icon.textContent = m.icon;
      const name = document.createElement('div');
      name.className = 'medal-name';
      name.textContent = m.name;
      const desc = document.createElement('div');
      desc.className = 'medal-desc';
      desc.textContent = earned ? '¡Conseguida!' : m.desc;
      card.append(icon, name, desc);
      grid.appendChild(card);
    });
  }

  /* Panell de progrés */
  function renderStats() {
    const body = $('#statsBody');
    if (!body) return;
    const s = Progreso.get();
    const accTotal = s.totalCorrect + s.totalWrong;
    const accuracy = accTotal ? Math.round((s.totalCorrect / accTotal) * 100) : 0;

    const items = [
      ['🎮 Partides jugades', s.gamesPlayed],
      ['🏆 Victòries', s.wins],
      ['✅ Encerts totals', s.totalCorrect],
      ['❌ Errors totals', s.totalWrong],
      ['🎯 Precisió', `${accuracy}%`],
      ['🔥 Millor ratxa', s.bestStreak],
      ['💯 Partides perfectes', s.perfectGames],
      ['⏱️ Victòria més ràpida', s.fastestWinMs ? `${Math.floor(s.fastestWinMs / 1000)} s` : '—'],
      ['🗺️ Fons descoberts', `${s.fondos.length}/5`],
      ['✏️ Preguntes pròpies', Editor.count()],
      ['📚 Categories cobertes', `${Progreso.categoriesCount()}/4`],
      ['🕒 Últim joc', s.lastPlayed ? new Date(s.lastPlayed).toLocaleString() : '—']
    ];

    clear(body);
    items.forEach(([label, val]) => {
      const row = document.createElement('div');
      row.className = 'stat-item';
      const l = document.createElement('span');
      l.textContent = label;
      const v = document.createElement('b');
      v.textContent = val;
      row.append(l, v);
      body.appendChild(row);
    });
  }

  /* Llista de l'editor */
  function renderEditorList() {
    const list = $('#editorList');
    const count = $('#editorCount');
    if (!list) return;
    clear(list);
    if (count) count.textContent = Editor.count();

    Editor.all().forEach(q => {
      const item = document.createElement('div');
      item.className = 'editor-item';
      const cat = CONFIG.CATEGORIES[q.category] || CONFIG.CATEGORIES.comunicacion;
      const txt = document.createElement('span');
      txt.className = 'ei-text';
      txt.textContent = `${cat.emoji} ${q.text} → ${q.options[q.correct]}`;
      const del = document.createElement('button');
      del.className = 'ei-del';
      del.textContent = '🗑️';
      del.addEventListener('click', () => {
        Audio.play('click');
        Editor.remove(q.id);
        renderEditorList();
        toast('Pregunta eliminada', 'info');
      });
      item.append(txt, del);
      list.appendChild(item);
    });
  }

  /* ================= AUDIO TOGGLES ================= */
  function updateAudioButtons() {
    const sfx = $('#toggleSfx');
    if (sfx) sfx.textContent = `🎵 Sons: ${State.settings.sfxOn ? 'ON' : 'OFF'}`;
    const mus = $('#toggleMusic');
    if (mus) mus.textContent = Musica.isPlaying()
      ? `🎶 ${Musica.melodyName()}`
      : '🎶 Música: OFF';
    const pm = $('#pauseMusicBtn');
    if (pm) pm.textContent = Musica.isPlaying()
      ? `🎵 ${Musica.melodyName()}`
      : '🎵 Posar música';
  }

  /* Selector de música: obre el modal i marca què està sonant */
  function openMusicPicker() {
    openModal('musicModal');
    refreshMusicOpts();
  }
  function refreshMusicOpts() {
    $$('.music-opt').forEach(b => {
      const idx = parseInt(b.dataset.mel, 10);
      const active = idx === -1 ? !Musica.isPlaying()
                                 : (Musica.isPlaying() && idx === Musica.currentIdx());
      b.classList.toggle('selected', active);
    });
  }

  /* ================= EVENTS ================= */
  /* Registres tolerants: si falta un element (HTML antic en caché),
     avisa per consa pero NO talla tota la inicialització */
  function addGuard(sel, ev, fn) {
    const el = $(sel);
    if (!el) { console.warn('[UI] element absent:', sel); return; }
    el.addEventListener(ev, fn);
  }

  function bindEvents() {
    // Desbloqueig de l'àudio al primer gest
    const unlock = () => {
      Audio.unlock();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);

    // Menú principal
    addGuard('#startGameBtn', 'click', () => {
      Audio.play('click');
      Game.startNewGame();
      setDiceEnabled(true);
    });
    addGuard('#minusPlayers', 'click', () => {
      Audio.play('click');
      if (State.selection.playerCount > 2) {
        State.selection.playerCount--;
        activeAvatarSlot = Math.min(activeAvatarSlot, State.selection.playerCount - 1);
        renderPlayerCount(); renderAvatarSelector(); renderAvatarPicker();
      }
    });
    addGuard('#plusPlayers', 'click', () => {
      Audio.play('click');
      if (State.selection.playerCount < CONFIG.MAX_PLAYERS) {
        State.selection.playerCount++;
        renderPlayerCount(); renderAvatarSelector(); renderAvatarPicker();
      }
    });
    $$('.length-btn').forEach(b => b.addEventListener('click', () => {
      Audio.play('click');
      State.settings.boardLength = Number(b.dataset.length);
      State.saveSettings();
      $$('.length-btn').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
    }));

    addGuard('#toggleSfx', 'click', () => {
      State.settings.sfxOn = !State.settings.sfxOn;
      State.saveSettings();
      updateAudioButtons();
      if (State.settings.sfxOn) Audio.play('click');
    });
    addGuard('#toggleMusic', 'click', () => {
      Audio.unlock();
      Audio.play('click');
      openMusicPicker();   // deixa TRIAR quina melodia sonarà
    });

    // Joc
    addGuard('#rollDiceBtn', 'click', () => Game.rollDice());
    addGuard('#exitGameBtn', 'click', () => {
      Audio.play('click');
      Game.exitToMenu();
    });
    addGuard('#pauseMusicBtn', 'click', () => {
      Audio.unlock();
      Audio.play('click');
      openMusicPicker();   // durant el joc també es pot triar
    });

    // Opcions del selector de música (les melodies arrenquen en elegir-les)
    $$('.music-opt').forEach(btn => btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.mel, 10);
      Audio.unlock();
      Audio.play('click');
      if (idx === -1) {
        Musica.stop();
        toast('🔇 Música apagada', 'info');
      } else {
        Musica.start(idx);
        toast(`${Musica.melodyName()} sonant`, 'info', 1600);
      }
      updateAudioButtons();
      refreshMusicOpts();
    }));

    // Botons de tancament genèrics (data-close-modal="id")
    $$('[data-close-modal]').forEach(b =>
      b.addEventListener('click', () => closeModal(b.dataset.closeModal)));

    // Botons del menú (modals)
    addGuard('#openEditorBtn', 'click', () => { Audio.play('click'); renderEditorList(); openModal('editorModal'); });
    addGuard('#openStatsBtn', 'click', () => { Audio.play('click'); renderStats(); openModal('statsModal'); });
    addGuard('#openMedalsBtn', 'click', () => { Audio.play('click'); renderMedalsGrid(); openModal('medalsModal'); });
    addGuard('#helpBtn', 'click', () => { Audio.play('click'); openModal('helpModal'); });
    addGuard('#openAboutBtn', 'click', () => { Audio.play('click'); openModal('aboutModal'); });

    addGuard('.editor-close-btn', 'click', () => closeModal('editorModal'));
    addGuard('.stats-close-btn', 'click', () => closeModal('statsModal'));
    addGuard('.medals-close-btn', 'click', () => closeModal('medalsModal'));
    addGuard('.help-close-btn', 'click', () => closeModal('helpModal'));

    addGuard('#resetStatsBtn', 'click', () => {
      if (!confirm('Segur que vols esborrar tot el progrés i les medalles?')) return;
      Progreso.reset();
      Medallas.reset();
      renderStats();
      toast('Dades reiniciades', 'info');
    });

    // Resultat
    addGuard('#playAgainBtn', 'click', () => {
      closeModal('resultModal');
      Game.startNewGame();
      setDiceEnabled(true);
    });
    addGuard('#resultMenuBtn', 'click', () => {
      closeModal('resultModal');
      Game.exitToMenu();
    });

    /* Editor: guardar pregunta */
    addGuard('#editorSaveBtn', 'click', () => {
      const category = $('#editorCategory').value;
      const text = $('#editorQuestion').value.trim();
      const options = [
        $('#editorOpt0').value.trim(),
        $('#editorOpt1').value.trim(),
        $('#editorOpt2').value.trim()
      ];
      const correct = Number(
        (document.querySelector('input[name="editorCorrect"]:checked') || { value: 0 }).value
      );

      if (!text || options.some(o => !o)) {
        toast('⚠️ Omple la pregunta i les 3 opcions', 'error');
        return;
      }
      const q = Editor.add({ category, text, options, correct });
      if (!q) {
        toast('⚠️ No s\'ha pogut guardar', 'error');
        return;
      }
      ['editorQuestion', 'editorOpt0', 'editorOpt1', 'editorOpt2'].forEach(id => $(`#${id}`).value = '');
      renderEditorList();
      toast('💾 Pregunta guardada!', 'success');
      Audio.play('correct');
    });

    /* Editor: cerca online amb URL opcional de l'usuari (o la per defecte) */
    const urlInput = $('#onlineUrlInput');
    if (urlInput) {
      urlInput.value = State.settings.onlineApiUrl || '';
      urlInput.addEventListener('change', () => {
        State.settings.onlineApiUrl = urlInput.value.trim();
        State.saveSettings();
      });
    }
    addGuard('#onlineUrlResetBtn', 'click', () => {
      if (urlInput) urlInput.value = '';
      State.settings.onlineApiUrl = '';
      State.saveSettings();
      toast('🌐 URL restablerta a Open Trivia DB (per defecte)', 'info');
    });
    addGuard('#editorOnlineBtn', 'click', () => {
      const custom = urlInput ? urlInput.value.trim() : '';
      toast(custom ? `🌐 Buscant en ${custom.slice(0, 48)}…` : '🌐 Buscant preguntes online…', 'info');
      Online.search(5, custom).then(list => {
        const added = Editor.addMany(list);
        renderEditorList();
        const from = custom ? 'la teua API' : "Open Trivia DB";
        toast(added ? `⬇ ${added} preguntes importades de ${from}` : 'Ja eren totes importades 😊', 'success');
      }).catch(err => {
        const m = err && err.message ? err.message : '';
        let msg;
        if (m === 'URL no vàlida') {
          msg = '⚠️ URL no vàlida · ha de començar per http:// o https://';
        } else if (m.includes('Failed to fetch') || m === 'Sense fetch') {
          msg = '⚠️ Sin internet o la API bloquea CORS · usa el banco local';
        } else {
          msg = `⚠️ Esta API no ha retornat preguntes vàlides (${m || 'buit'}) · revisa la URL o usa el banco local`;
        }
        toast(msg, 'error');
      });
    });

    /* Editor: exportar / importar */
    addGuard('#editorExportBtn', 'click', () => {
      if (!Editor.count()) { toast('No hi ha preguntes per exportar', 'info'); return; }
      Editor.exportJson();
      toast('⬇ Preguntes exportades', 'success');
    });
    addGuard('#editorImportBtn', 'click', () => $('#editorImportFile').click());
    addGuard('#editorImportFile', 'change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const added = Editor.importJson(String(reader.result));
        renderEditorList();
        toast(added ? `⬆ ${added} preguntes importades` : '⚠️ Fitxer no vàlid', added ? 'success' : 'error');
      };
      reader.readAsText(file);
      e.target.value = '';
    });
  }

  /* ================= INIT ================= */
  function init() {
    // Peu de pantalla d'inici: recompte real del banco de preguntas
    const foot = $('#footerBankInfo');
    if (foot && typeof BancoPreguntas !== 'undefined') {
      const c = BancoPreguntas.counts();
      const total = c.sinonimos + c.antonimos + c.comunicacion + c.conversacion;
      foot.textContent = `🧠 ${total} preguntes en castellà (${c.sinonimos} sinónimos · ${c.antonimos} antónimos · ${c.comunicacion} comunicación · ${c.conversacion} conversación) · 100% offline`;
    }

    // Lengüeta seleccionada segons configuració
    $$('.length-btn').forEach(b =>
      b.classList.toggle('selected', Number(b.dataset.length) === State.settings.boardLength));

    renderFondoSelector();
    renderPlayerCount();
    renderAvatarSelector();
    renderAvatarPicker();
    bindEvents();
    updateAudioButtons();
    setDiceEnabled(false);
  }

  return {
    init, showScreen, toast, renderBoard, renderLegend, renderPlayers, updateTurnLabel,
    cellIntro,
    setDiceEnabled, animateDice, highlightCell, floatScore, rocketFx, shakePanel,
    showQuestion, showConversation, showResult, celebrateMedals,
    openModal, closeModal, updateAudioButtons,
    get busy() { return busy; }
  };
})();
