# 💾 Instal·lació

Aventura de Palabras **no cal instal·lar-lo** per jugar: funciona obrint un sol fitxer HTML. Tot i així, pots instal·lar-lo com a **app d'escriptori (PWA)** per tenir-ne una icona i obrir-lo com qualsevol programa.

---

## ⬇️ Descarregar l'instal·lador (recomanat)

Des de **[GitHub Releases](https://github.com/jpuigbert/AventuradePalbrasGame/releases/latest)** tens els instal·ladors llestos per a cada sistema:

| Sistema | Fitxer | Instal·lació |
|---------|--------|--------------|
| 🍎 **macOS** | `AventuraPalabras-instalador.dmg` | Obre el DMG i arrossega l'app a **Aplicacions** |
| 🪟 **Windows** | `AventuraPalabras-windows.zip` | Descomprimeix i doble clic a **`Instalar.bat`** |
| 🐧 **Linux** | `AventuraPalabras-linux.run` | `chmod +x AventuraPalabras-linux.run && ./AventuraPalabras-linux.run` |

> 🍎 Si macOS bloqueja l'app (no està notaritzada): **botó dret → Obrir**, o `xattr -cr "/Applications/Aventura de Palabras.app"`.

---

## 📥 1. Descarregar el joc (alternativa: codi font)

**Opció A — Git:**
```bash
git clone https://github.com/jpuigbert/AventuradePalbrasGame
```

**Opció B — ZIP:** a GitHub, **Code ⬇ Download ZIP** i descomprimeix la carpeta.

---

## ▶️ 2. Obrir-lo (forma ràpida)

| Sistema | Què obrir |
|---------|-----------|
| 🍎 **macOS** | Doble clic a **`iniciar.command`** |
| 🪟 **Windows** | Doble clic a **`iniciar.bat`** |
| 🐧 **Linux** | Doble clic a **`iniciar.command`** o executa `./iniciar.sh` |

**Alternativa universal:** obre **`index.html`** directament amb el navegador (doble clic).

> ⚠️ A macOS, si `iniciar.command` no s'obre, dona-li permís d'execució:
> ```bash
> chmod +x iniciar.command
> ```
> O bé: **botó dret → Obrir amb → Safari/Chrome** (per saltar Gatekeeper).

---

## 🖥️ 3. Servidor local (recomanat per a PWA)

Perquè el navegador permeti **instal·lar com a app** i funcioni la caché offline, cal un servidor local. Qualsevol d'aquests:

```bash
# Amb Python (macOS/Linux/Windows si tens Python instal·lat)
python3 -m http.server 8080

# Scripts del propi projecte
./iniciar.sh        # Linux/macOS
iniciar.ps1         # Windows
```

Després obre el navegador a: **`http://localhost:8080`**

---

## 📲 4. Instal·lar com a app d'escriptori (PWA)

El joc és una **PWA** (Progressive Web App), així que s'instal·la com una app normal:

### Chrome / Edge (Windows, Mac, Linux)
1. Obre el joc al navegador (idealment via `http://localhost:8080`).
2. A la barra d'adreces apareix una icona **⊕ Instal·lar**.
3. O bé: menú **⋮** → **Instal·lar Aventura de Palabras**.
4. Tindràs una **icona a l'escriptori / menú d'inici**.

### Safari (macOS)
1. Obre el joc.
2. Menú **Archivo** → **Añadir a Dock**.

### Firefox
Obre el navegador en mode app/kiosk:
```bash
firefox --kiosk index.html
```

---

## ✅ Requisits

- **Navegador modern**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Cap instal·lació addicional** (no cal Node, ni Python si uses `index.html` directe)
- **Cap connexió a internet** (l'únic mode que la necessita és la cerca online **opcional** de l'editor)

---

## 🧹 Desinstal·lar

- Si el vas instal·lar com a **PWA**: desinstal·la'l com qualsevol app (menú del navegador → **Gestionar aplicacions instal·lades** → Eliminar).
- Si només obries `index.html`: esborra la carpeta del projecte.
- Per netejar **les dades** (progrés, medalles, preguntes): buida el `localStorage` del navegador per a aquest lloc.

[⬅️ Tornar a l'inici](Home) · [Configuració i dades ➡️](Configuracio-i-dades)
