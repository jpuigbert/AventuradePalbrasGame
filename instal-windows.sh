#!/bin/bash
# ============================================================
# GENERADOR INSTAL·LADOR WINDOWS — Aventura de Palabras
# Crea AventuraPalabras-windows.zip: descomprimir i fer doble
# clic a "Instalar.bat" (o "Jugar.bat" per jugar sense instal·lar).
# Sense dependències: només PowerShell (ja ve amb Windows).
# ============================================================

set -e
cd "$(dirname "$0")"
SRC="$(pwd)"

STAGING="$SRC/.win-staging/AventuraPalabras"
ZIP="$SRC/AventuraPalabras-windows.zip"

echo "🪟 Aventura de Palabras — instal·lador per a Windows"
echo "------------------------------------------------------"

rm -rf "$SRC/.win-staging" "$ZIP"
mkdir -p "$STAGING"

# --- 1) Copia el joc dins www/ ---
mkdir -p "$STAGING/www"
cp index.html manifest.json service-worker.js "$STAGING/www/" 2>/dev/null || true
cp -R css js icons "$STAGING/www/"

# --- 2) Icona .ico per a la drecera (PNG dins contenidor ICO) ---
if command -v python3 >/dev/null; then
  mkdir -p "$STAGING/www/icons"
  python3 "$SRC/tools/make_win_ico.py" "$SRC/icons/icon-512.png" \
          "$STAGING/www/icons/app.ico" >/dev/null
fi

# --- 3) Jugar.bat (lançament sense instal·lar res) ---
cat > "$STAGING/Jugar.bat" <<'BAT'
@echo off
rem Aventura de Palabras - llancament directe
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor.ps1"
BAT

# --- 4) servidor.ps1: servidor local + finestra de joc ---
cat > "$STAGING/servidor.ps1" <<'PS1'
# Aventura de Palabras - servidor local + finestra del joc
$ErrorActionPreference = 'Continue'
$www = Join-Path $PSScriptRoot 'www'
$browserProfile = Join-Path $env:LOCALAPPDATA 'AventuraPalabrasBrowser'

# cerca port lliure entre 8765 i 8794
$listener = $null; $port = 0
for ($p = 8765; $p -lt 8795; $p++) {
  $l = New-Object System.Net.HttpListener
  try {
    $l.Prefixes.Add("http://localhost:$p/")
    $l.Start()
    $listener = $l; $port = $p
    break
  } catch {
    try { $l.Close() } catch {}
  }
}
if (-not $listener) { Write-Host 'Error: cap port disponible'; exit 1 }
$url = "http://localhost:$port/index.html"
Write-Host ('Joc iniciat a ' + $url + '  (tanca aquesta finestra per aturar-lo)')

# navegador: Chrome > Edge (finestra independent mode app)
$browser = $null
$candidates = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
)
foreach ($c in $candidates) { if (Test-Path $c) { $browser = $c; break } }

$proc = $null
if ($browser) {
  $proc = Start-Process -FilePath $browser `
    -ArgumentList "--app=$url", "--user-data-dir=`"$browserProfile`"", '--no-first-run' -PassThru
} else {
  Start-Process $url   # navegador per defecte (obri pestanya normal)
}

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css'
  '.js'   = 'application/javascript'
  '.json' = 'application/json'
  '.png'  = 'image/png'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
  '.webp' = 'image/webp'
  '.txt'  = 'text/plain'
  '.woff' = 'font/woff'
  '.woff2'= 'font/woff2'
  '.webmanifest' = 'application/manifest+json'
}

$wwwFull = [IO.Path]::GetFullPath($www)
try {
  while ($listener.IsListening) {
    $ar = $listener.BeginGetContext($null, $null)
    while (-not $ar.AsyncWaitHandle.WaitOne(400)) {
      if ($proc -and $proc.HasExited) { break }   # si es tanca el navegador, parem
    }
    if ($proc -and $proc.HasExited) { break }
    if (-not $ar.IsCompleted) { continue }
    $ctx = $listener.EndGetContext($ar)
    try {
      $path = $ctx.Request.Url.LocalPath
      if ($path -eq '/') { $path = '/index.html' }
      $file = Join-Path $wwwFull ($path.Substring(1) -replace '/', '\')
      $fileFull = [IO.Path]::GetFullPath($file)
      if ($fileFull.StartsWith($wwwFull) -and (Test-Path $fileFull -PathType Leaf)) {
        $bytes = [IO.File]::ReadAllBytes($fileFull)
        $ext = [IO.Path]::GetExtension($fileFull).ToLower()
        if ($mime.ContainsKey($ext)) { $ctx.Response.ContentType = $mime[$ext] }
        else { $ctx.Response.ContentType = 'application/octet-stream' }
        $ctx.Response.ContentLength64 = $bytes.Length
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      } else {
        $ctx.Response.StatusCode = 404
      }
    } catch {}
    $ctx.Response.Close()
  }
} finally {
  try { $listener.Stop(); $listener.Close() } catch {}
  Write-Host 'Servidor aturat. Fins aviat!'
}
PS1

# --- 5) Instalar.bat: copia a LOCALAPPDATA + dreceres ---
cat > "$STAGING/Instalar.bat" <<'BAT'
@echo off
echo Instal·lando Aventura de Palabras...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0crear-atajo.ps1"
echo.
echo Listo! Busca "Aventura de Palabras" en el Menu Inicio o en el Escritorio.
pause
BAT

# --- 6) crear-atajo.ps1: copia fitxers + dreceres (escriptori + menú Inici) ---
cat > "$STAGING/crear-atajo.ps1" <<'PS1'
$ErrorActionPreference = 'Stop'
$src  = $PSScriptRoot
$dest = Join-Path $env:LOCALAPPDATA 'AventuraPalabras'

# copia tota la carpeta del joc
if (-not (Test-Path (Join-Path $dest 'www'))) {
  Copy-Item -Path $src -Destination $dest -Recurse -Force
} else {
  Copy-Item -Path (Join-Path $src '*') -Destination $dest -Recurse -Force
}

$ps = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
$target  = $ps
$argline = '-NoProfile -WindowStyle Hidden -File "' + (Join-Path $dest 'servidor.ps1') + '"'
$icon    = Join-Path $dest 'www\icons\app.ico,0'

$ws = New-Object -ComObject WScript.Shell

function Make-Shortcut([string]$path) {
  $lnk = $ws.CreateShortcut($path)
  $lnk.TargetPath = $target
  $lnk.Arguments = $argline
  $lnk.WorkingDirectory = $dest
  if (Test-Path ($icon.Split(',')[0])) { $lnk.IconLocation = $icon }
  $lnk.Description = 'Juego de mesa educativo para aprender espanol'
  $lnk.Save()
}

# Escriptori
$desktop = [Environment]::GetFolderPath('Desktop')
Make-Shortcut (Join-Path $desktop 'Aventura de Palabras.lnk')

# Menú Inici (tots els usuaris no cal; només l'actual)
$start = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs'
Make-Shortcut (Join-Path $start 'Aventura de Palabras.lnk')

Write-Host 'Dreceres creades a l Escriptori i al Menu Inici.'
PS1

# --- 7) Desinstalar.bat ---
cat > "$STAGING/Desinstalar.bat" <<'BAT'
@echo off
echo Desinstal·lando Aventura de Palabras (los progresos guardados no se borran)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Remove-Item -Recurse -Force \"$env:LOCALAPPDATA\AventuraPalabras\" -ErrorAction SilentlyContinue; Remove-Item \"$env:USERPROFILE\Desktop\Aventura de Palabras.lnk\" -ErrorAction SilentlyContinue; Remove-Item \"$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Aventura de Palabras.lnk\" -ErrorAction SilentlyContinue"
echo Listo!
pause
BAT

# --- 8) LEE-ME.txt ---
cat > "$STAGING/LEE-ME.txt" <<'TXT'
AVENTURA DE PALABRAS — juego de mesa para aprender espanol
==========================================================

CREADOR: Joan Puigbert Carreras

COM JUGAR (dues opcions):

  1) SENSE INSTAL·LAR (portàtil):
     Doble clic a  Jugar.bat  i el joc s'obri en la seua pròpia finestra.

  2) INSTAL·LACIÓ NORMAL:
     Doble clic a  Instalar.bat
     Es crea la drecera "Aventura de Palabras" a l'Escriptori i al Menú Inici.
     Per a jugar, doble clic a la drecera.

DESINSTAL·LAR:
     Doble clic a  Desinstalar.bat

NOTES:
 - No cal internet. Funciona 100% offline.
 - Si Windows mostra un avís en el primer ús (SmartScreen):
   clic dret > Propiedades > Desbloquear > Aceptar, o "Mas información > Ejecutar".
 - Cal Chrome o Edge (qualsevol versio recent). Sense ells, usa el navegador per defecte.
 - El progrés i les preguntes es guarden en el perfil del navegador, no en esta carpeta.
TXT

# --- 9) CRLF als .bat (Windows ho necessita) ---
for f in "$STAGING"/*.bat; do
  sed -i '' 's/$/\r/' "$f"
done

# --- 10) Comprimeix a ZIP ---
cd "$SRC/.win-staging"
zip -qr "$ZIP" "AventuraPalabras"
cd "$SRC"
rm -rf "$SRC/.win-staging"

echo "✅ Creado: $(basename "$ZIP") ($(stat -f%z "$ZIP" 2>/dev/null || stat -c%s "$ZIP") bytes)"
echo "   Contingut:"
unzip -l "$ZIP" | tail -3
echo "------------------------------------------------------"
echo "📤 Envie el .zip: descomprimir i doble clic a Instalar.bat"
