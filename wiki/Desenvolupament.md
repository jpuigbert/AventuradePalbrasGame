# 🛠️ Desenvolupament

Per a persones que volguen entendre, modificar o ampliar el codi d'Aventura de Palabras.

---

## 🧱 Arquitectura

El projecte és una **SPA (Single Page Application)** de **vanilla JavaScript** (sense framework ni pas de build). Cada fitxer `.js` és un **mòdul** en forma de **IIFE** (Immediately Invoked Function Expression) que exporta un objecte global (`Config`, `State`, `Game`, `UI`, …). No hi ha dependències externes ni gestor de paquets.

Els scripts es carregen en un **ordre específic** a `index.html` perquè les dependències estiguin disponibles:

```
config → state → audio → musica → fondos → jugadores → tablero →
generador_offline → preguntas → progreso → medallas → online →
editor → ui → game → pwa → main
```

`main.js` és el **punt d'entrada**: inicialitza tots els mòduls en ordre (carrega configuració, aplica fons, marca medalles existents, munta la UI i activa la música després del primer clic).

---

## 📁 Estructura del projecte

```
aventuradepalbras/
├── index.html              Pantalla única (SPA)
├── manifest.json           PWA manifest
├── service-worker.js       Caché offline
├── README.md
├── iniciar.command/.bat/.sh/.ps1   Scripts d'arrencada per sistema
├── css/
│   ├── estilos.css         Estils principals
│   ├── animaciones.css     Animacions
│   └── medallas.css        Estils de medalles
├── icons/                  Icones de l'app (PWA)
└── js/
    ├── config.js           Constants i configuració global (CONFIG)
    ├── state.js            Estat mutable (State) + persistència de config
    ├── audio.js            Efectes de so (Web Audio API)
    ├── musica.js           Música de fons
    ├── fondos.js            Gestió dels 5 fons
    ├── jugadores.js        Creació de jugadors
    ├── tablero.js          Generació del tauler (caselles per pesos)
    ├── generador_offline.js Banc de paraules + generador de preguntes
    ├── preguntas.js        Combina offline + preguntes de l'editor
    ├── progreso.js         Registre d'estadístiques (localStorage)
    ├── medallas.js         Sistema de 15 medalles
    ├── online.js           Cerca Open Trivia DB (opcional)
    ├── editor.js           Preguntes pròpies + export/import
    ├── ui.js               Renderitzat i esdeveniments de la interfície
    ├── game.js             Lògica: torns, moviment, caselles, puntuació
    ├── pwa.js              Registre del service worker
    └── main.js             Punt d'entrada
```

---

## 🔑 Mòduls clau

### `CONFIG` (config.js)
Totes les constants del joc: categories, pesos de caselles (`CELL_WEIGHTS`), puntuació (`SCORE_CORRECT`, `SCORE_BONUS`, `SCORE_TRAP`, `COET_STEPS`), avatars, llargades permeses, claus de `localStorage`…

> Per **ajustar l'economia del joc** (punts, freqüència de caselles), edita aquest fitxer.

### `State` (state.js)
Estat global mutable: `settings` (persistents) i `game` (partida actual). Gestiona torns amb `nextTurn()` / `currentPlayer()` i respecta el `extraTurn`.

### `Tablero` (tablero.js)
`Tablero.create(llargada)` construeix el camí de caselles segons els **pesos** de `CONFIG.CELL_WEIGHTS`, amb sortida al principi i meta al final.

### `GeneradorOffline` (generador_offline.js)
Banc de paraules (24 sinònims, 24 antònims, 16 comunicación, 15 conversación). Genera preguntes **aleatòries** amb **distractors** i opcions barrejades.

### `Game` (game.js)
Orquestrador del joc:
- `rollDice()` → tira dau (1-6), mou la fitxa, gestiona la casella.
- `movePlayer()` / `jumpTo()` → moviment amb animació; si arriba a la meta, `finishGame()`.
- `handleCell()` → `switch` amb l'efecte de cada tipus de casella.
- `askQuestion()` / `askConversation()` → posa pregunta, suma estrelles, registra progrés i avalua medalles.
- `endTurn()` → passa (o no, en torn extra) el torn.

### `Progreso` + `Medallas`
`Progreso` acumula estadístiques a `avp_progreso`. `Medallas.evaluateAll()` compara les estadístiques amb les 15 condicions i retorna les **noves medalles guanyades**.

---

## 🎨 Estils i so

- **CSS**: `estilos.css` (base + layout + selector), `animaciones.css` (dau, fitxes, fx), `medallas.css`.
- **So**: 100% **Web Audio API** (sintetitzat, sense fitxers `.mp3`/`.wav`). Cada efecte (`dice`, `move`, `correct`, `wrong`, `bonus`, `trap`, `rocket`, `swap`, `extraturn`, `win`) es genera a `audio.js`.

---

## 🚀 Provar en local

```bash
cd aventuradepalbras
python3 -m http.server 8080
# obre http://localhost:8080
```

O simplement obre `index.html` amb el navegador (algunes funcions PWA requeriran servidor).

---

## ➕ Ampliar el joc

| Vull… | On tocar |
|-------|----------|
| Afegir una **categoria** nova | `CONFIG.CATEGORIES` + `CAT_INFO` + `CELL_WEIGHTS` + generador |
| Canviar la **puntuació** | `CONFIG.SCORE_*` i `COET_STEPS` |
| Afegir **preguntes** al banc offline | `generador_offline.js` (SINONIMS, ANTONIMS, COMUNICACION, CONVERSACION) |
| Posar un **temporitzador** de pregunta | `CONFIG.QUESTION_TIME` (ms; 0 = sense límit) |
| Noves **medalles** | Mòdul `MEDALS` a `medallas.js` |
| Nou **fons** | `fondos.js` + classe CSS a `estilos.css` |

---

## 📜 Llicència

Ús lliure per a ús personal i educatiu.

[⬅️ Tornar a l'inici](Home) · [FAQ ➡️](FAQ)
