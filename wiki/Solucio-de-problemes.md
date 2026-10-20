# 🔧 Solució de problemes

Els dubtes i errors més freqüents, amb la seva solució.

---

## 🔊 El joc no sona

Els navegadors **bloquegen l'àudio** fins que l'usuari interactua amb la pàgina.

**Solució:** fes clic a qualsevol botó del joc (per exemple *Començar a jugar*). A partir del primer clic, el so s'activa.

> Comprova també que **Sons: ON** al menú inicial. La **Música** ve desactivada per defecte: activa-la si la vols.

---

## 🍎 `iniciar.command` no s'obre al Mac

Pot ser un problema de **permisos** o de **Gatekeeper**.

**Solucions:**
```bash
# 1) Dona-li permís d'execució
chmod +x iniciar.command
```
o bé
> **2)** Botó dret sobre el fitxer → **Obrir amb** → **Altre…** → tria *Terminal* / navegador. (Això salta l'avís de Gatekeeper.)

---

## 💾 No es guarden les preguntes (ni el progrés)

El joc fa servir `localStorage`. Si el navegador el bloqueja, res no es desa.

**Comprova-ho:**
- **Safari:** Preferències → Privacitat → desmarca *Bloquejar totes les galetes/dades*.
- **Chrome:** Configuració → Privacitat → permet les galetes per a `localhost`.
- Evita el **mode incògnito**: en tancar la finestra, es perden totes les dades.

---

## 🐢 El joc va lent

El joc fa servir la **Web Audio API**, que consumeix CPU per sintetitzar els sons.

**Solucions:**
- Tanca altres pestanyes i aplicacions.
- Desactiva la **música de fons** (deixa només els efectes, o cap).
- Redueix la **llargada del tauler** a 20.

---

## 🌐 La cerca online no funciona

La cerca d'**Open Trivia DB** necessita **connexió a internet**.

- Si no hi ha xarxa o l'API no respon, **falla silenciosament** i el joc continua offline.
- Revisa la teva connexió i torna-ho a provar. No és un error del joc.

---

## ❌ No puc instal·lar com a app (PWA)

Perquè aparegui l'opció **Instal·lar**, normalment cal obrir el joc des d'un **servidor local** (`http://localhost:8080`), no des de `file://`.

**Solució:** arrenca el servidor (`./iniciar.sh`, `iniciar.ps1` o `python3 -m http.server 8080`) i obre l'adreça `localhost` al navegador.

---

## 🧹 Vull començar de zero

Esborra les dades `avp_*` del `localStorage` (mira [Configuració i dades](Configuracio-i-dades)). Abans, **exporta les teves preguntes** si les vols conservar.

---

## 📋 El joc es veu rar / espatllat

- Recarrega la pàgina (**F5** / **Cmd+R**).
- Buida la caché del *service worker* (Desenvolupador → *Application* → *Service Workers* → **Unregister**, i recarrega).
- Assegura't de fer servir un **navegador modern** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).

---

[⬅️ Tornar a l'inici](Home) · [Guia per a docents ➡️](Guia-per-a-docents)
