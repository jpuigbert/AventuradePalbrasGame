# 📖 Com utilitzar aquesta wiki

Aquesta pàgina explica **com accedir, navegar, editar i pujar canvis** a la wiki d'Aventura de Palabras.

---

## 👀 1. Consultar la wiki

La wiki està publicada a GitHub i es pot llegir **sense instal·lar res**:

🔗 **https://github.com/jpuigbert/AventuradePalbrasGame/wiki**

- **`Home`** és la portada: conté l'índex amb tots els enllaços.
- A la **barra lateral** tens la llista de totes les pàgines.
- Al capdamunt hi ha un **cercador** per trobar qualsevol pàgina pel títol.
- Cada pàgina acaba amb **enllaços de navegació** (⬅️ tornada / ➡️ següent).

### Per a què serveix cada pàgina?

| Si vols… | Ves a |
|----------|-------|
| Entendre com es juga | [Com jugar](Com-jugar) |
| Saber què fa cada casella | [Caselles del tauler](Caselles-del-tauler) |
| Conèixer els tipus de pregunta | [Categories de preguntes](Categories-de-preguntes) |
| Veure les 15 medalles | [Medalles](Medalles) |
| Crear preguntes per a classe | [Editor de preguntes](Editor-de-preguntes) |
| Instal·lar el joc | [Instal·lació](Instalacio) |
| Preparar una sessió a classe | [Guia per a docents](Guia-per-a-docents) |
| Arreglar un problema | [Solució de problemes](Solucio-de-problemes) |
| Modificar/ampliar el codi | [Desenvolupament](Desenvolupament) |

---

## ✏️ 2. Editar la wiki directament a GitHub (el camí fàcil)

Qualsevol persona amb accés al repositori pot editar una pàgina **sense tocar el Terminal**:

1. Obre la pàgina a la wiki.
2. Prem la pestanya **«Edit»** (a la part superior dreta de la pàgina).
3. Modifica el text en **Markdown**.
4. Prem **«Preview changes»** per comprovar-ho.
5. Escriu un missatge i prem **«Save page»**.

També pots crear una pàgina nova des de **«New page»** i esborrar-ne una amb **«Delete»**.

---

## 🔄 3. Editar en local i pujar els canvis

Els fitxers de la wiki viuen a la carpeta `wiki/` del projecte (un `.md` per pàgina). Per editar-los al teu editor preferit i publicar-los:

```bash
cd aventuradepalbras
# 1) Edita els .md de la carpeta wiki/ (o afegeix-ne de nous)
# 2) Puja-ho tot a GitHub:
./pujar-wiki.sh
```

El script **clona la wiki, copia els `.md`, fa commit i push** automàticament. Si la wiki encara no existeix a GitHub, **la crea**.

### Opcions útils

```bash
# Fer servir SSH (evita escriure la contrasenya cada vegada)
WIKI_URL="git@github.com:jpuigbert/AventuradePalbrasGame.wiki.git" ./pujar-wiki.sh

# Personalitzar l'autor del commit
GIT_USER_NAME="Nom" GIT_USER_EMAIL="correu@example.com" ./pujar-wiki.sh
```

> 📌 **Requisits:** tenir `git` instal·lat i accés d'escriptura al repositori (contrasenya, token o clau SSH del compte `jpuigbert` o d'un col·laborador).

### Mètode manual (equivalent al script)

```bash
git clone https://github.com/jpuigbert/AventuradePalbrasGame.wiki.git
cp wiki/*.md AventuradePalbrasGame.wiki/
cd AventuradePalbrasGame.wiki
git add -A && git commit -m "Actualitza la wiki" && git push
```

---

## 🧾 4. Convencions de noms i enllaços

- El **nom del fitxer sense `.md`** és el nom de la pàgina: `Com-jugar.md` → URL `/wiki/Com-jugar`.
- Els enllaços interns es fan **sense extensió**: `[Com jugar](Com-jugar)`.
- Els **espais** als noms de pàgina es converteixen en **guionets**; per això els fitxers ja usen guionets.
- `Home.md` és sempre la **portada** de la wiki.
- Els noms dels fitxers han de ser **ASCII** (sense accents ni punt volat `·`): per això `Instalacio.md` i `Solucio-de-problemes.md`. El títol *dins* de la pàgina sí que pot portar accents.

---

## ⏳ 5. Historial i desfer canvis

Cada pàgina té la pestanya **«History»**, on es veuen totes les versions amb el seu autor i data. Per restaurar una versió anterior, copia el contingut d'aquella versió i desa'l com una edició nova.

Si has fet push amb el script, també pots usar git directament sobre el repo `.wiki.git` (`git log`, `git revert`…).

---

## 💡 6. Consells

- **Edita sempre des del lloc canònic** (la carpeta `wiki/` del projecte) i puja amb el script: així el contingut queda versionat juntament amb el joc.
- Després d'editar una pàgina a GitHub *web*, fes un **pull dels canvis** cap a `wiki/` abans de tornar a editar en local, o les dues edicions es poden desincronitzar (el script només **afegeix i substitueix** fitxers, no esborra el que hi hagi a la wiki).
- Afegeix pàgines noves creant el `.md` a `wiki/` i enllaçant-les des del [Home](Home).

[⬅️ Tornar a l'inici](Home)
