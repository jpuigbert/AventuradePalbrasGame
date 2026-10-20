#!/usr/bin/env bash
# ============================================================
# pujar-wiki.sh — Puja el contingut de ./wiki/ a la Wiki de GitHub
#
# La Wiki de GitHub es un repositori git a part:
#   https://github.com/<usuari>/<repo>.wiki.git
#
# Aquest script:
#   1) Clona la wiki (si no existeix, GitHub la crea al primer push)
#   2) Copia tots els .md de ./wiki/ dins del clone
#   3) Fa commit i push
#
# Cal tenir git instal·lat i accés (SSH o HTTPS) al repositori.
# ============================================================
set -euo pipefail

# --- Configuració (EDITA si cal) -----------------------------
# URL del repositori de la WIKI (acaba en .wiki.git)
WIKI_URL="${WIKI_URL:-https://github.com/jpuigbert/AventuradePalbrasGame.wiki.git}"

# Carpeta on són els .md de la wiki (relatiu a aquest script)
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/wiki"

# Branca de la wiki (normalment 'main'; GitHub usa la que existeixi)
# ------------------------------------------------------------

echo "🌐 Wiki URL : $WIKI_URL"
echo "📁 Origen    : $SRC_DIR"

if [ ! -d "$SRC_DIR" ]; then
  echo "❌ No trobo la carpeta '$SRC_DIR'." >&2
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "❌ Cal tenir 'git' instal·lat." >&2
  exit 1
fi

# Directori temporal per al clone
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

CLONE="$WORK/wiki"

echo "👇 Clonant la wiki a $CLONE ..."
if git clone "$WIKI_URL" "$CLONE" 2>/dev/null; then
  echo "   (wiki existent: s'ha clonat correctament)"
  cd "$CLONE"
  git checkout main 2>/dev/null || git checkout master 2>/dev/null || true
else
  echo "🆕 La wiki encara no existeix (o està buida). La crearem..."
  mkdir -p "$CLONE"
  cd "$CLONE"
  git init -q
  git remote add origin "$WIKI_URL"
fi

echo "📄 Copiant fitxers .md ..."
shopt -s nullglob
for f in "$SRC_DIR"/*.md; do
  cp "$f" "$CLONE/"
  echo "   + $(basename "$f")"
done

if [ -z "$(git status --porcelain)" ]; then
  echo "✅ No hi ha canvis per pujar (la wiki ja està al dia)."
  exit 0
fi

echo "📦 Fent commit ..."
git add -A
git -c user.name="${GIT_USER_NAME:-Aventura de Palabras}" \
    -c user.email="${GIT_USER_EMAIL:-aventuradepalbras@users.noreply.github.com}" \
    commit -m "Actualitza la wiki: docs de gameplay, medalles, editor i instal·lació"

echo "⬆️  Fent push a origin ..."
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
git push -u origin "$BRANCH"

echo ""
echo "🎉 Wiki pujada! Revisa-la a:"
echo "   ${WIKI_URL%.wiki.git}/wiki"
