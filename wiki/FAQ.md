# ❓ Preguntes freqüents (FAQ)

Respostes ràpides als dubtes més habituals.

---

### 🖥️ Necessito internet per jugar?
**No.** El joc és **100% offline**. L'única funció que necessita xarxa és la **cerca online** de l'editor (importar preguntes d'Open Trivia DB), i és **opcional**.

### 💾 On es desen el progrés, les medalles i les preguntes?
Al **`localStorage`** del navegador, només al teu ordinador. **No s'envia res a cap servidor.** Mira [Configuració i dades](Configuracio-i-dades).

### 👥 Quants jugadors poden jugar?
De **2 a 4** jugadors per tauler, amb torns rotatius.

### 🎲 Com guanyo una partida?
Arribant **primer a la casella meta** 🏆. Les **estrelles ⭐** són la puntuació acumulada (encerts + bonus), però la victòria es decideix per qui completa el camí abans.

### ⭐ Com s'aconsegueixen estrelles?
- Encertar una pregunta: **+10**
- Casella Bonus ⭐: **+15**
- Casella Trampa 💀: **−10** (mai baixen de 0)

### 🔄 Puc passar de la meta?
No. Si el dau et porta més enllà, la fitxa s'atura **just a la meta** i guanyes.

### 🎨 Quants fons i avatars hi ha?
**5 fons** (cielo, bosque, mar, desierto, espacio) i **12 avatars** (🦊🐼🦁🐸🐵🐰🐷🎃🦄🐙🦖🐝).

### ✏️ Puc afegir les meves preguntes?
**Sí!** Amb l'[Editor](Editor-de-preguntes). Podràs crear-les, exportar-les a **JSON**, importar-les i cercar-les online.

### 🔴 Què és la categoria "Conversación"?
Una **targeta per parlar en veu alta** sobre un tema i **autoavaluar-se**. No té resposta incorrecta: compta **atrever-se a parlar** (+10 ⭐ si t'autoevalues com a fet).

### 🏐 Puc posar un temps límit per respondre?
Per defecte **no hi ha límit** (`QUESTION_TIME = 0`). Es pot activar editant `js/config.js` (veure [Desenvolupament](Desenvolupament)).

### 🔊 Per què no se sent res?
El navegador bloqueja l'àudio fins al **primer clic**. Clica qualsevol botó del joc. Mira també que **Sons: ON**.

### 🍎 `iniciar.command` no arrenca al Mac
Executa `chmod +x iniciar.command` o obri'l amb **botó dret → Obrir**. Mira [Solució de problemes](Solucio-de-problemes).

### 🧹 Com trec tot el progrés i començo de zero?
Esborrant les dades `avp_*` del `localStorage`. **Exporta abans** les teves preguntes si les vols conservar.

### 📱 Puc jugar al mòbil o tauleta?
En ser una **PWA**, es pot obrir al navegador mòbil i instal·lar-la. Està pensada sobretot per a **pantalla d'ordinador/pissarra**.

### 💰 És gratuït?
**Sí.** Ús lliure per a ús personal i educatiu.

---

[⬅️ Tornar a l'inici](Home)
