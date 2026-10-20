#!/bin/bash
# ============================================================
# GENERADOR INSTAL·LADOR LINUX — Aventura de Palabras
# Crea AventuraPalabras-linux.run : un únic fitxer executable
# que s'autoextreu i instal·la (sense privilegis d'administrador).
# Cal·labs: bash, python3 (http server) i un navegador (Chrome/
# Chromium/Edge/Firefox). Provat a Ubuntu/Debian/Fedora/Mint.
# ============================================================

set -e
cd "$(dirname "$0")"
SRC="$(pwd)"

STAGING="$SRC/.linux-staging"
RUN="$SRC/AventuraPalabras-linux.run"

echo "🐧 Aventura de Palabras — instal·lador per a Linux"
echo "----------------------------------------------------"

rm -rf "$STAGING" "$RUN"
mkdir -p "$STAGING/www"

# --- 1) Copia el joc ---
cp index.html manifest.json service-worker.js "$STAGING/www/" 2>/dev/null || true
cp -R css js icons "$STAGING/www/"

# --- 2) launch.sh: servidor local + finestra de joc ---
cat > "$STAGING/launch.sh" <<'LAUNCH'
#!/bin/bash
# Aventura de Palabras — llançador (funciona des de la instal·lació o portàtil)
DIR="$(cd "$(dirname "$0")" && pwd)"
WWW="$DIR/www"
[ -d "$WWW" ] || WWW="$DIR"          # mode portàtil: fitxers al costat
PROFILE="$HOME/.aventurapalabras-browser"
PORT=8765

# cerca un port lliure
port_busy() { (echo >/dev/tcp/127.0.0.1/"$1") >/dev/null 2>&1; }
while port_busy "$PORT"; do
  PORT=$((PORT+1))
  [ "$PORT" -gt 8795 ] && break
done
URL="http://localhost:$PORT/index.html"

cleanup() { [ -n "$PID" ] && kill "$PID" 2>/dev/null; }
trap cleanup EXIT INT TERM

if command -v python3 >/dev/null 2>&1; then
  ( cd "$WWW" && python3 -m http.server "$PORT" >/dev/null 2>&1 ) &
  PID=$!
  sleep 0.8
else
  URL="file://$WWW/index.html"        # sense python3: obri directe (sense PWA)
fi

# navegador en mode app (finestra independent)
opened=0
for B in google-chrome google-chrome-stable chromium chromium-browser microsoft-edge; do
  if command -v "$B" >/dev/null 2>&1; then
    "$B" --app="$URL" --user-data-dir="$PROFILE" --no-first-run >/dev/null 2>&1
    opened=1
    break
  fi
done

if [ "$opened" = "0" ]; then
  if command -v firefox >/dev/null 2>&1; then
    firefox --new-window "$URL" >/dev/null 2>&1; opened=1
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL" >/dev/null 2>&1; opened=1
  elif command -v open >/dev/null 2>&1; then
    open "$URL" >/dev/null 2>&1; opened=1   # macOS (per provar el script)
  fi
fi

[ "$opened" = "0" ] && echo "No s'ha trobat cap navegador. Obri manualment: $URL"

# espera mentre el joc estigui obert (si el navegador es dimite en background)
sleep 2
cleanup
LAUNCH
chmod +x "$STAGING/launch.sh"

# --- 3) .desktop (menú d'aplicacions) ---
cat > "$STAGING/AventuradePalabras.desktop" <<'DESK'
[Desktop Entry]
Type=Application
Name=Aventura de Palabras
Comment=Joc de taula educatiu per aprendre castellà (offline)
Exec=bash -c '~/.local/share/AventuraPalabras/launch.sh'
Icon=aventurapalabras
Terminal=false
Categories=Education;Game;KidsGame;
DESK

# --- 4) install.sh (s'executa dins del payload extret) ---
cat > "$STAGING/install.sh" <<'INSTALL'
#!/bin/bash
# Instal·lador Linux: sense sudo, tot a nivell d'usuari
set -e
SRC="$1"
DEST="$HOME/.local/share/AventuraPalabras"

echo "🌈 Aventura de Palabras — instal·lant a Linux"
echo "   Creador: Joan Puigbert Carreras"

mkdir -p "$DEST"
cp -R "$SRC/www"      "$DEST/"
cp    "$SRC/launch.sh" "$DEST/"
cp    "$SRC/desinstalar.sh" "$DEST/" 2>/dev/null || true
chmod +x "$DEST/launch.sh" "$DEST/desinstalar.sh" 2>/dev/null || true

# icona
mkdir -p "$HOME/.local/share/icons"
cp "$SRC/www/icons/icon-512.png" "$HOME/.local/share/icons/aventurapalabras.png" 2>/dev/null || true

# entrada del menú d'aplicacions
mkdir -p "$HOME/.local/share/applications"
cp "$SRC/AventuradePalabras.desktop" "$HOME/.local/share/applications/"
chmod +x "$HOME/.local/share/applications/AventuradePalabras.desktop" 2>/dev/null || true
command -v update-desktop-database >/dev/null 2>&1 && update-desktop-database "$HOME/.local/share/applications" 2>/dev/null || true

# drecera a l'escriptori (si existeix ~/Desktop o ~/Escritorio)
for D in "$HOME/Desktop" "$HOME/Escritorio" "$HOME/Escriptori"; do
  if [ -d "$D" ]; then
    cp "$SRC/AventuradePalabras.desktop" "$D/Aventura de Palabras.desktop" 2>/dev/null || true
    chmod +x "$D/Aventura de Palabras.desktop" 2>/dev/null || true
    # Fedora/GNOME: cal marcar-la com a "trustable" (confiable)
    command -v gio >/dev/null 2>&1 && gio set "$D/Aventura de Palabras.desktop" metadata::trusted true 2>/dev/null || true
    break
  fi
done

echo "✅ Instal·lat!"
echo "   ▶  Menú d'aplicacions → 'Aventura de Palabras'"
echo "   ▶  o eixecuta:  $DEST/launch.sh"
INSTALL
chmod +x "$STAGING/install.sh"

# --- 5) desinstalar.sh (inclòs al payload i copiat a la instal·lació) ---
cat > "$STAGING/desinstalar.sh" <<'UNINST'
#!/bin/bash
rm -rf "$HOME/.local/share/AventuraPalabras"
rm -f  "$HOME/.local/share/applications/AventuradePalabras.desktop"
rm -f  "$HOME/.local/share/icons/aventurapalabras.png"
rm -f  "$HOME/Desktop/Aventura de Palabras.desktop" 2>/dev/null
echo "Desinstal·lat (el progrés del navegador no s'ha esborrat)."
UNINST
chmod +x "$STAGING/desinstalar.sh"

# --- 6) Empaquetat .run: capçalera shell + tar.gz ---
TARBALL="$SRC/.linux-payload.tar.gz"
(cd "$STAGING" && tar -czf "$TARBALL" www launch.sh install.sh desinstalar.sh AventuradePalabras.desktop)

cat > "$RUN" <<'HEADER'
#!/bin/bash
# ============================================================
# Aventura de Palabras — instal·lador autoextraïble per a Linux
# Ús:  chmod +x AventuraPalabras-linux.run && ./AventuraPalabras-linux.run
# Creador: Joan Puigbert Carreras
# ============================================================
set -e
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
echo "📦 Extraient…"
tail -n +$(( $(awk '/^__PAYLOAD__$/{print NR; exit}' "$0") + 1 )) "$0" | tar -xz -C "$TMP"
bash "$TMP/install.sh" "$TMP"
exit 0
__PAYLOAD__
HEADER
cat "$TARBALL" >> "$RUN"
chmod +x "$RUN"

rm -rf "$STAGING" "$TARBALL"

echo "✅ Creado: $(basename "$RUN") ($(stat -f%z "$RUN" 2>/dev/null || stat -c%s "$RUN") bytes)"
echo "----------------------------------------------------"
echo "📤 Enviament: chmod +x AventuraPalabras-linux.run && ./AventuraPalabras-linux.run"
