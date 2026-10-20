# 🌈 Aventura de Palabras

Joc educatiu per aprendre **castellà** a **3r de Primària** (basat en "Un punto de español 3", Barcanova).
Funciona a **Windows, macOS i Linux**, és **100% offline** i es pot instal·lar com a **app d'escriptori** (PWA).

---

## ⬇️ Descarregar

Instal·ladors llestos per a cada sistema a **[Releases](https://github.com/jpuigbert/AventuradePalbrasGame/releases/latest)**:

| Sistema | Fitxer | Com instal·lar |
|---------|--------|----------------|
| 🍎 **macOS** | `AventuraPalabras-instalador.dmg` | Obre el DMG i arrossega l'app a **Aplicacions** |
| 🪟 **Windows** | `AventuraPalabras-windows.zip` | Descomprimeix i doble clic a **`Instalar.bat`** |
| 🐧 **Linux** | `AventuraPalabras-linux.run` | `chmod +x AventuraPalabras-linux.run && ./AventuraPalabras-linux.run` |

> 🍎 Si macOS bloqueja l'app (no notaritzada): **botó dret → Obrir**, o `xattr -cr "/Applications/Aventura de Palabras.app"`.

---

## 🚀 Instal·lació ràpida (des del codi font)

### 1. Descarrega el joc
Descarrega la carpeta `aventuradepalbras` sencera o clona-la:

```bash
git clone <URL_DEL_REPO>
```

### 2. Obre'l segons el teu sistema

| Sistema | Com fer-ho |
|---------|------------|
| 🍎 **macOS** | Doble clic a **`iniciar.command`** |
| 🪟 **Windows** | Doble clic a **`iniciar.bat`** |
| 🐧 **Linux** | Doble clic a **`iniciar.command`** o executa `./iniciar.sh` |

**Alternativa universal**: Obre `index.html` amb el navegador (doble clic).

> 💡 Per instal·lar-lo com a app (PWA) fa servir el servidor local:
> `./iniciar.sh` (Linux), `iniciar.ps1` (Windows) o `python3 -m http.server 8080` (macOS)
> i ves a `http://localhost:8080`.

---

## 📲 Instal·lar com a app d'escriptori

El joc és una **PWA** (Progressive Web App), així que es pot instal·lar com una app normal:

### Chrome / Edge (Windows, Mac, Linux)
1. Obre el joc al navegador.
2. A la barra d'adreces apareix una icona **⊕ Instal·lar**.
3. O bé: menú **⋮** → **Instal·lar Aventura de Palabras**.
4. Apareixerà una icona a l'escriptori / menú d'inici.

### Safari (macOS)
1. Obre el joc.
2. Menú **Arxiu** → **Afegir a la Dock**.

### Firefox
Utilitza el navegador en mode app:
```bash
firefox --kiosk index.html
```

---

## 🎮 Com jugar

1. Tria fons, avatars, jugadors i llargada.
2. Tira el dau per torns.
3. Segons la casella, respon o rep un efecte especial.
4. Guanya qui arribi primer a la meta 🏆.

### Tipus de casella

- 🔵 Comunicación · 🟢 Sinónimos · 🟡 Antónimos · 🔴 Conversación
- ⭐ Bonus (+15 ⭐) · 💀 Trampa (-10 ⭐)
- 🚀 Coet (+3 caselles) · 🔄 Intercanvi · 🎲 Torn extra

---

## 🏅 15 medalles per aconseguir

| Medalla | Com aconseguir-la |
|---------|-------------------|
| 🎮 Primer pas | Juga 1 partida |
| 🏆 Campió | Guanya 1 partida |
| ⭐ Diez aciertos | 10 encerts |
| 🌟 Veinte aciertos | 20 encerts |
| 💫 Medio centenar | 50 encerts |
| ✨ Centenario | 100 encerts |
| 🔥 En racha | 5 encerts seguits |
| ⚡ Imparable | 10 encerts seguits |
| 💯 Perfecto | Sense fallar |
| ⏱️ Velocista | <5 min |
| 🎯 Completo | Totes les categories |
| 🗺️ Explorador | 3 fons diferents |
| ✏️ Editor | Afegeix 1 pregunta |
| 🧠 Buena memoria | Guanya 3 partides |
| 👑 Maestro | Guanya 10 partides |

---

## ✏️ Afegir preguntes pròpies

1. Menú principal → **✏️ Editor**
2. Omple categoria, pregunta i 3 opcions.
3. Marca la correcta amb el cercle.
4. Prem **💾 Guardar**.

Es guarden al navegador (`localStorage`).

**Exportar**: botó **⬇ Exportar** → fitxer `.json`.
**Importar**: botó **⬆ Importar** → selecciona `.json`.

---

## 🌐 Cerca online (opcional)

Botó **🌐 Buscar online** a l'editor. Usa Open Trivia DB.
Necessita internet. Si falla, el joc continua offline.

---

## 🔧 Solució de problemes

### El joc no sona
Els navegadors bloquegen l'àudio fins al primer clic.
**Solució**: clica qualsevol botó del joc.

### `iniciar.command` no s'obre al Mac
Executa al Terminal:
```bash
chmod +x iniciar.command
```
O bé: **Botó dret → Obrir → Obrir** (per saltar Gatekeeper).

### No es guarden les preguntes
Comprova que el navegador permet `localStorage`:
- Safari: Preferències → Privacitat → desmarca "Bloquejar galetes"
- Chrome: Configuració → Privacitat → Cookies

### El joc va lent
Tanca altres pestanyes. El joc usa Web Audio API que consumeix CPU.

---

## 📁 Estructura del projecte

```
aventuradepalbras/
├── index.html              Pantalla única (SPA)
├── manifest.json           PWA manifest
├── service-worker.js       Cache offline
├── README.md               Aquest fitxer
├── iniciar.command         Inici Mac/Linux
├── iniciar.sh              Servidor Linux
├── iniciar.bat             Inici Windows
├── iniciar.ps1             Servidor Windows
├── css/
│   ├── estilos.css
│   ├── animaciones.css
│   └── medallas.css
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── favicon.ico
└── js/
    ├── config.js
    ├── state.js
    ├── audio.js
    ├── musica.js
    ├── fondos.js
    ├── jugadores.js
    ├── tablero.js
    ├── generador_offline.js
    ├── preguntas.js
    ├── progreso.js
    ├── medallas.js
    ├── online.js
    ├── pwa.js
    ├── editor.js
    ├── ui.js
    ├── game.js
    └── main.js
```

---

## 🛠️ Requisits

- **Navegador modern**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Cap instal·lació addicional**
- **Cap connexió a internet** (excepte mode online opcional)

---

## 📜 Llicència

Ús lliure per a ús personal i educatiu.

---

Fet amb ❤️ per aprendre jugant.
