# 🏅 Medalles

Aventura de Palabras té **15 medalles** que es desbloquegen automàticament segons el teu progrés. Es mostren al menú principal amb el botó **🏅 Medalles**.

> ℹ️ Les medalles es desen al navegador (`localStorage`) i es **revisen després de cada pregunta i al final de cada partida**. Un cop aconseguida, una medalla **no es perd**.

---

## 📋 Llista completa

| # | Medalla | Com aconseguir-la |
|---|---------|------------------|
| 1 | 🎮 **Primer pas** | Juga 1 partida |
| 2 | 🏆 **Campió** | Guanya la teva primera partida |
| 3 | ⭐ **Diez aciertos** | Encerta 10 preguntes en total |
| 4 | 🌟 **Veinte aciertos** | Encerta 20 preguntes en total |
| 5 | 💫 **Medio centenar** | Encerta 50 preguntes en total |
| 6 | ✨ **Centenario** | Encerta 100 preguntes en total |
| 7 | 🔥 **En racha** | Encerta 5 preguntes **seguides** (sense fallar cap) |
| 8 | ⚡ **Imparable** | Encerta 10 preguntes **seguides** |
| 9 | 💯 **Perfecto** | Guanya una partida **sense fallar cap pregunta** |
| 10 | ⏱️ **Velocista** | Guanya una partida en **menys de 5 minuts** |
| 11 | 🎯 **Completo** | Respon correctament preguntes de **les 4 categories** |
| 12 | 🗺️ **Explorador** | Juga amb **3 fons diferents** |
| 13 | ✏️ **Editor** | Afegeix **1 pregunta propia** a l'editor |
| 14 | 🧠 **Buena memoria** | Guanya **3 partides** |
| 15 | 👑 **Maestro** | Guanya **10 partides** |

---

## 🧠 Com funciona el registre?

El joc guarda un **historial d'estadístiques** (a `progreso.js`) que alimenta les medalles:

| Estadística | Descripció |
|-------------|------------|
| `gamesPlayed` | Total de partides jugades |
| `wins` | Total de victòries |
| `totalCorrect` / `totalWrong` | Encerts i falles acumulats |
| `currentStreak` / `bestStreak` | Ratxa actual i millor ratxa d'encerts seguits |
| `perfectGames` | Partides guanyades sense cap falta |
| `fastestWinMs` | Temps de la victòria més ràpida |
| `categories` | Categories on has encertat almenys 1 vegada |
| `fondos` | Fons que has fet servir |
| `customQuestionsAdded` | Preguntes pròpies creades |

La **ratxa** (`currentStreak`) es trenca cada cop que falles una pregunta. El **millor registre** (`bestStreak`) no es reinicia mai.

---

## 🎉 Celebració

Quan desbloqueges una medalla nova, el joc mostra una **animació de celebració a pantalla** amb la icona i el nom de la medalla.

---

## 🔄 Reiniciar medalles

Si vols tornar a començar de zero, les medalles es poden reiniciar (`Medallas.reset()`). Atenció: **perds tot el progrés de medalles**. El progrés general té el seu propi reinici.

[⬅️ Tornar a l'inici](Home) · [Editor de preguntes ➡️](Editor-de-preguntes)
