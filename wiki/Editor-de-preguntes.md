# ✏️ Editor de preguntes

L'editor permet afegir **preguntes pròpies** al joc, ideals per a docents que vulguin adaptar el contingut al seu grup-classe. Es desa tot al **localStorage** del navegador.

---

## 🚀 Com obrir l'editor

Al menú principal, prem el botó **✏️ Editor**.

---

## ➕ Crear una pregunta

1. **Tria la categoria** (Comunicación, Sinónimos, Antónimos, Conversación).
2. **Escriu la pregunta** al camp de text.
3. **Afegeix 3 opcions** de resposta (mínim 2).
4. **Marca la correcta** fent clic al cerclet al costat de l'opció.
5. Prem **💾 Guardar**.

> ✅ Validació automàtica: el joc no deixa guardar si la pregunta és buida, hi ha menys de 2 opcions, o la posició de la resposta correcta no és vàlida.

---

## 🗑️ Eliminar una pregunta

A la llista de preguntes creades, cada pregunta té un botó d'eliminar.

---

## 📤 Exportar a JSON

Prem **⬇ Exportar** per descarregar un fitxer anomenat `preguntes-aventura.json` amb totes les teves preguntes. Útil per:
- **Fer còpia de seguretat**
- **Compartir** amb un altre ordinador o company/a

### Format del JSON

```json
[
  {
    "id": "q1699000000123",
    "category": "sinonimos",
    "text": "¿Cuál es un sinónimo de 'veloz'?",
    "options": ["rápido", "lento", "pesado"],
    "correct": 0
  }
]
```

| Camp | Descripció |
|------|------------|
| `category` | Una de: `comunicacion`, `sinonimos`, `antonimos`, `conversacion` |
| `text` | Enunciat de la pregunta |
| `options` | Array de textos d'opció (mínim 2) |
| `correct` | **Índex** (0-based) de l'opció correcta dins `options` |

---

## 📥 Importar des de JSON

Prem **⬆ Importar** i selecciona un fitxer `.json` amb el format anterior.

- Les preguntes **duplicades** (mateix text) **no s'afegeixen** de nou, així que pots importar diverses vegades sense omplir de repeticions.

---

## 🌐 Cerca online (opcional)

Al mateix editor hi ha el botó **🌐 Buscar online**. Consulta l'API pública **Open Trivia DB** en castellà i importa les preguntes directament.

> ⚠️ Aquesta opció **necessita connexió a internet** per importar. Si falla o no hi ha xarxa, simplement no s'afegeix res — el joc segueix funcionant offline.

Un cop importades, les preguntes es desen localment i es juguen **sense internet**.

---

## ⚡ Com afecten les preguntes pròpies al joc?

Quan el tauler demana una pregunta d'una categoria:
- Si **hi ha preguntes pròpies** de la categoria, hi ha **un 35%** de probabilitats que en surti una de teva.
- Si no n'hi ha, o no toca, surt una de **generada offline**.

D'aquesta manera les preguntes del docent **es barregen** amb les del joc sense desplaçar-les.

---

## 💡 Recomanacions per crear bones preguntes

- Fes-les **curtes** i clares, llegibles per a nens de 8-9 anys.
- Evita **trampes** òbvies; els distractors han de ser **plausibles**.
- Afegeix preguntes del **temari** que esteu treballant a classe.

[⬅️ Tornar a l'inici](Home) · [Configuració i dades ➡️](Configuracio-i-dades)
