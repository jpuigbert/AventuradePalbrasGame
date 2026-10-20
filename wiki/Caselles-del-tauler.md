# 🗺️ Caselles del tauler

Cada partida genera un **tauler aleatori** de 20, 30 o 40 caselles. La primera és la **sortida** 🏁 i l'última és la **meta** 🏆. Les del mig es reparteixen segons unes **probabilitats (pesos)** definides a `config.js`.

---

## 📋 Taula de caselles

| Casella | Emoji | Què passa quan hi caus | Pes\* |
|---------|:-----:|------------------------|:---:|
| **Normal** | 🏁 | Res especial. Passes el torn al següent jugador. | 22 |
| **Comunicación** | 📘 | Respon una pregunta de situacions reals (saludar, agrair, demanar…). Si encertas: **+10 ⭐**. | 14 |
| **Sinónimos** | 📗 | Pregunta: quina paraula vol dir **el mateix**? **+10 ⭐** per encert. | 12 |
| **Antónimos** | 📙 | Pregunta: quina paraula vol dir **el contrari**? **+10 ⭐** per encert. | 12 |
| **Conversación** | 💬 | Parla **en veu alta** sobre el tema que et proposa i **autoavalua't**. Si ho fas: **+10 ⭐**. | 10 |
| **Bonus** | ⭐ | Guanyes **15 ⭐** estrelles de regal. | 7 |
| **Trampa** | 💀 | Perds **10 ⭐** estrelles (les estrelles mai baixen de 0). | 7 |
| **Coet** | 🚀 | El teu personatge enlaira: avança automàticament **3 caselles**. | 5 |
| **Torn extra** | 🎲 | **Tornes a tirar el dau** tu mateix (el torn no passa a ningú més). | 5 |
| **Intercambio** | 🔄 | **Intercanuries la teva posició** amb un altre jugador triat a l'atzar. | 4 |

\* El **pes** és la probabilitat relativa que aparegui cada casella. Com més alt, més freqüent. Per exemple, les caselles *normal* (22) surten molt més que les d'*intercambio* (4).

---

## 🔍 Detalls de les caselles especials

### 🚀 Coet
El teu personatge s'enlaira i avança automàticament **3 caselles** de cop (valor `COET_STEPS = 3`). Si amb el salt arribes a la meta, **guanyes**.

### 🎲 Torn extra
El jugador que hi cau **repeteix tirada**. És l'única casella que no passa el torn.

### 🔄 Intercambio
Busca un altre jugador a l'atzar i **bescanvien les posicions** al tauler. Si jugues sol (no hi ha ningú més), no passa res.

### 💀 Trampa
Resta **10 ⭐**, però el total d'estrelles **no pot baixar de 0** (les estrelles no esdevenen negatives).

### ⭐ Bonus
Afegeix **15 ⭐**, més del que dona encertar una pregunta (10 ⭐).

---

## 🏁 Sortida i 🏆 Meta

- **Sortida**: casella on comencen tots els jugadors. No genera cap efecte.
- **Meta**: última casella del camí. Qui hi arriba **guanya la partida** a l'instant, encara que li sobren punts del dau.

---

## 💡 Com es veuen al tauler

Cada casella mostra el seu **emoji** i una **etiqueta curta** (`sortida`, `comunica`, `sinónimos`, `antónimos`, `conversa`, `bonus`, `trampa`, `coet`, `intercambio`, `torn extra`, `meta`). La llegenda del tauler recorda què significa cada color.

[⬅️ Tornar a l'inici](Home) · [Següent: Categories de preguntes ➡️](Categories-de-preguntes)
