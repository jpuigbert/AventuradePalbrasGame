# ⚙️ Configuració i dades

Aquesta pàgina explica les **opcions del joc** i **què es desa** (i on) al teu navegador.

---

## 🎛️ Opcions configurables

| Opció | Valors | On es canvia |
|-------|--------|--------------|
| 🔊 **Sons (SFX)** | ON / OFF | Menú inicial |
| 🎶 **Música de fons** | ON / OFF (off per defecte) | Menú inicial |
| 🎨 **Fons** | cielo, bosque, mar, desierto, espacio | Menú inicial |
| 🗺️ **Llargada del tauler** | 20 (curta), 30 (mitjana), 40 (llarga) | Menú inicial |
| 👥 **Nombre de jugadors** | 2 a 8 | Menú inicial |
| 🐾 **Avatars** | 12 disponibles (🦊🐼🦁🐸🐵🐰🐷🎃🦄🐙🦖🐝) | Menú inicial |

Els valors per defecte: `sfxOn: true`, `musicOn: false`, `fondo: 'cielo'`, `boardLength: 30`, `playerCount: 2`.

> ⏱️ **Temps de pregunta:** el joc ve **sense límit de temps** (`QUESTION_TIME = 0`). Es pot posar un temporitzador modificant aquest valor a `js/config.js`.

---

## 💾 On es desen les dades?

**Tot es desa localment al navegador** amb `localStorage`. **No s'envia res a cap servidor.** Aquestes són les claus que utilitza el joc:

| Clau localStorage | Contingut |
|-------------------|-----------|
| `avp_progreso` | Estadístiques i progrés (partides, victòries, encerts, ratxes…) |
| `avp_medallas` | Llista d'IDs de medalles aconseguides |
| `avp_preguntes_editor` | Preguntes pròpies creades a l'editor |
| `avp_config` | Configuració (so, música, fons, llargada) |

---

## 📊 Què registra el progrés?

Dins de `avp_progreso` es guarden, entre d'altres:

- `gamesPlayed` — partides jugades
- `wins` — victòries
- `totalCorrect` / `totalWrong` — encerts i falles totals
- `currentStreak` / `bestStreak` — ratxa actual i millor ratxa
- `perfectGames` — partides guanyades sense faltes
- `fastestWinMs` — victòria més ràpida
- `categories` — categories on has encertat
- `fondos` — fons que has fet servir
- `customQuestionsAdded` — preguntes pròpies creades
- `lastPlayed` — data de l'última partida

Aquestes dades són les que **alimenten les 15 medalles**.

---

## 🔄 Reiniciar les dades

Pots esborrar tot el progrés i les medalles des del propi joc (propi de cada pantalla de Progrés / Medalles), o bé buidant el `localStorage` del navegador per a aquest lloc:

- **Chrome/Edge:** Desenvolupador (F12) → *Application* → *Local Storage* → esborra les claus `avp_*`.
- **Safari:** *Develop* → *Show Page Storage*.

> ⚠️ **Les preguntes de l'editor també s'esborraran.** Fes una **exportació** (`⬇ Exportar`) abans si vols conservar-les.

---

## 🎵 Sobre el so

Els efectes de so i la música es generen amb la **Web Audio API** (no hi ha fitxers d'àudio externs). Per això:

- El navegador pot **bloquejar el so** fins que facis el **primer clic** a la pàgina.
- Si el so no apareix, clica qualsevol botó del joc per activar-lo.

[⬅️ Tornar a l'inici](Home) · [Solució de problemes ➡️](Solucio-de-problemes)
