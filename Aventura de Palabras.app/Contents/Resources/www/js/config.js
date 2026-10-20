/* ============================================================
   CONFIG.JS — Constants i configuració global del joc
   ============================================================ */

const CONFIG = {
  VERSION: '1.0',

  // Claus de localStorage
  KEYS: {
    PROGRESS: 'avp_progreso',
    CUSTOM_QUESTIONS: 'avp_preguntes_editor',
    MEDALS: 'avp_medallas',
    SETTINGS: 'avp_config'
  },

  // Categories de preguntes
  CATEGORIES: {
    comunicacion:  { label: 'Comunicación',  emoji: '🔵', color: '#4A90D9' },
    sinonimos:     { label: 'Sinónimos',     emoji: '🟢', color: '#6BCB77' },
    antonimos:     { label: 'Antónimos',     emoji: '🟡', color: '#FFD93D' },
    conversacion:  { label: 'Conversación',  emoji: '🔴', color: '#FF6B6B' }
  },

  // Definicions per entendre cada categoria (es mostren a l'ajuda i a cada pregunta)
  CAT_INFO: {
    comunicacion: '🔵 COMUNICACIÓN · situacions reals: saludar, demanar, agrair, acomiadar-se…',
    sinonimos:    '🟢 SINÓNIMO = paraula que vol dir EL MATEIX · exemple: «veloz» = «rápido»',
    antonimos:    '🟡 ANTÓNIMO = paraula que vol dir EL CONTRARI · exemple: «frío» ⇄ «calor»',
    conversacion: '🔴 CONVERSACIÓN = parla EN VEU ALTA sobre el tema i després t’autoavalues'
  },

  // Explicació que es mostra en ATERRAR a cada tipus de casella (abans de jugar-la)
  CELL_INFO: {
    normal:        '⚪ Casella segura · no passa res, espera el següent torn',
    comunicacion:  '🔵 COMUNICACIÓN · una situació real: saludar, pedir, agradecer…',
    sinonimos:     '🟢 SINÓNIMS · paraules que volen dir EL MATEIX (veloz = rápido)',
    antonimos:     '🟡 ANTÓNIMS · paraules que volen dir EL CONTRARI (frío ⇄ calor)',
    conversacion:  '🔴 CONVERSACIÓN · parla 60 segons en veu alta i guanya fins a 12 ⭐',
    bonus:         '⭐ BONUS · regala 15 estrelles automaticament',
    trampa:        '💀 TRAMPA · et fa perdre 10 estrelles · compte!',
    coet:          '🚀 COET · et llança 3 caselles endavant',
    intercambio:   '🔄 INTERCAMBIO · canvia la teva posició amb un altre jugador',
    tornextra:     '🎲 TORN EXTRA · torna a tirar el dau de seguida',
    meta:          '🏆 META · el primer a arribar guanya la partida!'
  },

  // Tipus de casella: (pes relative de aparició)
  CELL_WEIGHTS: [
    ['comunicacion', 14],
    ['sinonimos',    12],
    ['antonimos',    12],
    ['conversacion', 10],
    ['normal',       22],
    ['bonus',         7],
    ['trampa',        7],
    ['coet',          5],
    ['intercambio',   4],
    ['tornextra',     5]
  ],

  CELL_EMOJIS: {
    normal: '🏁',
    comunicacion: '📘',
    sinonimos: '📗',
    antonimos: '📙',
    conversacion: '💬',
    bonus: '⭐',
    trampa: '💀',
    coet: '🚀',
    intercambio: '🔄',
    tornextra: '🎲',
    meta: '🏆'
  },

  // Etiquetes curtes que es veuen a cada casella del tauler
  CELL_LABELS: {
    normal: 'sortida',
    comunicacion: 'comunica',
    sinonimos: 'sinónimos',
    antonimos: 'antónimos',
    conversacion: 'conversa',
    bonus: 'bonus',
    trampa: 'trampa',
    coet: 'coet',
    intercambio: 'intercambio',
    tornextra: 'torn extra',
    meta: 'meta'
  },

  // Colors pròpis de cada jugador (fitxa + panell + torn) — fins a 8
  PLAYER_COLORS: ['#2f6db0', '#e83e8d', '#2f9e44', '#e8862e', '#7d3fbf', '#0e9aa7', '#d13438', '#b8901a'],

  // Nombre màxim de jugadors
  MAX_PLAYERS: 8,

  // Estrelles per cada criteri assolit a la Conversación
  SCORE_CONV_ITEM: 4,

  // Puntuació
  SCORE_CORRECT: 10,
  SCORE_BONUS: 15,
  SCORE_TRAP: -10,
  COET_STEPS: 3,

  // Estels del dau
  DICE_FACES: ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'],

  // Avatars disponibles (12)
  AVATARS: ['🦊', '🐼', '🦁', '🐸', '🐵', '🐰', '🐷', '🎃', '🦄', '🐙', '🦖', '🐝'],

  // Llargades de tauler permeses
  BOARD_LENGTHS: [20, 30, 40],

  // Temporitzador de pregunta (ms). 0 = sense límit
  QUESTION_TIME: 0
};
