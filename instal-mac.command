#!/bin/bash
# ============================================================
# INSTAL·LAR MAC — Crea "Aventura de Palabras.app" al teu Mac
# Doble clic a aquest fitxer i llest: tindràs el joc com una
# app normal (finestra independent, amb la seva icona).
# ============================================================

set -e
cd "$(dirname "$0")"
SRC="$(pwd)"

APP_NAME="Aventura de Palabras"
APP="$SRC/$APP_NAME.app"
BIN="aventura-palabras"

echo "🌈 Aventura de Palabras — instal·lador per a macOS"
echo "-----------------------------------------------------"

# --- Neteja una instal·lació anterior ---
rm -rf "$APP"

# --- Estructura del bundle ---
mkdir -p "$APP/Contents/MacOS"
mkdir -p "$APP/Contents/Resources/www"

# --- Copia els fitxers del joc dins l'app (autònoma) ---
cp index.html manifest.json service-worker.js "$APP/Contents/Resources/www/" 2>/dev/null || true
cp -R css js icons "$APP/Contents/Resources/www/"

# --- Icona .icns (a partir dels PNG generats) ---
ICON_SRC="$SRC/icons/icon-source.png"
[ -f "$ICON_SRC" ] || ICON_SRC="$SRC/icons/icon-512.png"
ICONSET="$SRC/.appicon.iconset"
rm -rf "$ICONSET"; mkdir -p "$ICONSET"
if command -v sips >/dev/null && [ -f "$ICON_SRC" ]; then
  sips -z 16 16     "$ICON_SRC" --out "$ICONSET/icon_16x16.png"      >/dev/null 2>&1 || true
  sips -z 32 32     "$ICON_SRC" --out "$ICONSET/icon_16x16@2x.png"   >/dev/null 2>&1 || true
  sips -z 32 32     "$ICON_SRC" --out "$ICONSET/icon_32x32.png"      >/dev/null 2>&1 || true
  sips -z 64 64     "$ICON_SRC" --out "$ICONSET/icon_32x32@2x.png"   >/dev/null 2>&1 || true
  sips -z 128 128   "$ICON_SRC" --out "$ICONSET/icon_128x128.png"    >/dev/null 2>&1 || true
  sips -z 256 256   "$ICON_SRC" --out "$ICONSET/icon_128x128@2x.png" >/dev/null 2>&1 || true
  sips -z 256 256   "$ICON_SRC" --out "$ICONSET/icon_256x256.png"    >/dev/null 2>&1 || true
  sips -z 512 512   "$ICON_SRC" --out "$ICONSET/icon_256x256@2x.png" >/dev/null 2>&1 || true
  sips -z 512 512   "$ICON_SRC" --out "$ICONSET/icon_512x512.png"    >/dev/null 2>&1 || true
  cp "$ICON_SRC" "$ICONSET/icon_512x512@2x.png" 2>/dev/null || true
  if command -v iconutil >/dev/null; then
    iconutil -c icns "$ICONSET" -o "$APP/Contents/Resources/AppIcon.icns" 2>/dev/null || true
  fi
  rm -rf "$ICONSET"
fi

# --- Info.plist ---
cat > "$APP/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key>            <string>$APP_NAME</string>
  <key>CFBundleDisplayName</key>     <string>$APP_NAME</string>
  <key>CFBundleIdentifier</key>      <string>cat.escola.aventurapalabras</string>
  <key>CFBundleVersion</key>         <string>1.0</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>CFBundlePackageType</key>     <string>APPL</string>
  <key>CFBundleExecutable</key>      <string>$BIN</string>
  <key>CFBundleIconFile</key>        <string>AppIcon</string>
  <key>LSMinimumSystemVersion</key>  <string>10.12</string>
  <key>NSHighResolutionCapable</key> <true/>
  <key>LSApplicationCategoryType</key><string>public.app-category.education</string>
</dict>
</plist>
PLIST

# --- Llancer (executable): servidor local + finestra independent ---
cat > "$APP/Contents/MacOS/$BIN" <<'LAUNCHER'
#!/bin/bash
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
WWW="$APP_DIR/Resources/www"
PROFILE="$HOME/.aventurapalabras-app"
PORT=8765

# busca un port lliure
while lsof -iTCP -sTCP:LISTEN -P -n 2>/dev/null | grep -q ":$PORT "; do
  PORT=$((PORT+1))
done
URL="http://localhost:$PORT/index.html"

cleanup() { [ -n "$PID" ] && kill "$PID" 2>/dev/null; }
trap cleanup EXIT INT TERM

# servidor local (perquè funcione el mode PWA / service worker)
if command -v python3 >/dev/null 2>&1; then
  ( cd "$WWW" && python3 -m http.server "$PORT" >/dev/null 2>&1 ) &
  PID=$!
  sleep 1
  SERVED=1
else
  # sense python3: obre directe (el joc funciona igual, sense PWA)
  URL="file://$WWW/index.html"
  SERVED=0
fi

# obri una finestra INDEPENDENT (sense barra del navegador)
opened=0
if [ "$SERVED" = "1" ]; then
  if [ -d "/Applications/Google Chrome.app" ]; then
    open -W -na "Google Chrome" --args --app="$URL" --user-data-dir="$PROFILE" --no-first-run
    opened=1
  elif [ -d "/Applications/Microsoft Edge.app" ]; then
    open -W -na "Microsoft Edge" --args --app="$URL" --user-data-dir="$PROFILE" --no-first-run
    opened=1
  elif [ -d "/Applications/Chromium.app" ]; then
    open -W -na "Chromium" --args --app="$URL" --user-data-dir="$PROFILE" --no-first-run
    opened=1
  fi
fi

if [ "$opened" = "0" ]; then
  open "$URL"
fi

cleanup
LAUNCHER

chmod +x "$APP/Contents/MacOS/$BIN"

# --- Codi de signatura ad-hoc (evita avisos de Gatekeeper) ---
if command -v codesign >/dev/null 2>&1; then
  codesign --force --deep --sign - "$APP" >/dev/null 2>&1 || true
fi

echo "✅ App creada: $APP_NAME.app"

# ============================================================
#  DMG D'INSTAL·LACIÓ (arrossegar l'app a Aplicacions)
# ============================================================
VOLNAME="$APP_NAME"
DMG="$SRC/AventuraPalabras-instalador.dmg"
STAGING="$SRC/.dmg-staging"
RWDMG="$SRC/.dmg-rw.dmg"

echo "️  Preparant l'instal·lador (DMG)…"

# --- muntatge de preparació ---
rm -rf "$STAGING"; mkdir -p "$STAGING/.background"
cp -R "$APP" "$STAGING/"
ln -s /Applications "$STAGING/Aplicacions"

# --- imatge de fons del DMG ---
if command -v python3 >/dev/null 2>&1; then
  python3 "$SRC/tools_gen_dmg_bg.py" "$STAGING/.background/dmdbg.png" >/dev/null 2>&1 || true
fi
if [ -f "$STAGING/.background/dmdbg.png" ] && command -v sips >/dev/null 2>&1; then
  sips -s format tiff "$STAGING/.background/dmdbg.png" \
       --out "$STAGING/.background/dmdbg.tiff" >/dev/null 2>&1 || true
fi

build_dmg_simple() {
  rm -f "$DMG"
  hdiutil create -volname "$VOLNAME" -srcfolder "$STAGING" \
    -ov -format UDZO "$DMG" >/dev/null 2>&1
}

FANCY=1
if command -v hdiutil >/dev/null 2>&1; then
  # 1) DMG modificable
  rm -f "$RWDMG"
  hdiutil create -volname "$VOLNAME" -srcfolder "$STAGING" \
    -ov -format UDRW "$RWDMG" >/dev/null 2>&1 || FANCY=0

  if [ "$FANCY" = "1" ]; then
    # 2) munta
    MOUNT=$(hdiutil attach -noclobber -noautoopen "$RWDMG" 2>/dev/null \
            | grep -o '/Volumes/.*' | tail -1)
    # 3) ordena icones + fons amb Finder (millora estètica)
    if [ -n "$MOUNT" ] && command -v osascript >/dev/null 2>&1; then
      osascript >/dev/null 2>&1 <<AS || true
tell application "Finder"
  tell disk "$VOLNAME"
    open
    set current view of container window to icon view
    set toolbar visible of container window to false
    set statusbar visible of container window to false
    set the bounds of container window to {120, 120, 780, 540}
    set theViewOptions to icon view options of container window
    set arrangement of theViewOptions to not arranged
    set icon size of theViewOptions to 110
    try
      set background picture of theViewOptions to file ".background:dmdbg.tiff"
    end try
    try
      set position of item "$APP_NAME.app" of container window to {170, 170}
      set position of item "Aplicacions" of container window to {470, 170}
    end try
    update without registering applications
    close
  end tell
end tell
AS
    fi
    # 4) desmunta
    [ -n "$MOUNT" ] && hdiutil detach "$MOUNT" -force >/dev/null 2>&1 || true
    # 5) converteix a DMG comprimit final
    rm -f "$DMG"
    hdiutil convert "$RWDMG" -format UDZO -o "$DMG" >/dev/null 2>&1 || FANCY=0
  fi
else
  FANCY=0
fi

# si el mètode fi no ha funcionat, DMG bàsic (funcional igualment)
if [ ! -f "$DMG" ]; then build_dmg_simple; fi

rm -rf "$STAGING" "$RWDMG"

if [ -f "$DMG" ]; then
  echo "📦 Instal·lador creat: AventuraPalabras-instalador.dmg"
  echo "   S'obri la finestra: arrossega la icona cap a 'Aplicacions'."
  open "$DMG" 2>/dev/null || true
else
  echo "⚠️  No s'ha pogut crear el DMG. Pots arrossegar manualment:"
  echo "   '$APP'  →  carpeta Aplicacions."
fi

echo "-----------------------------------------------------"
echo "🎮 Un cop a Aplicacions, obri '$APP_NAME.app' per jugar."
echo "   (Si macOS es queixa el primer cop: clic dret → Obrir.)"
