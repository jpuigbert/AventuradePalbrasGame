#!/bin/bash
# ============================================================
# INICIAR.SH — Servidor local per a Linux (millor per a PWA)
# ============================================================

cd "$(dirname "$0")"

PORT=8080

echo "🌈 Aventura de Palabras"
echo "📂 Servidor local a http://localhost:$PORT"
echo "🛑 Prem Ctrl+C per aturar"

# Obre el navegador en segon pla després d'arrencar el servidor
( sleep 2; xdg-open "http://localhost:$PORT" 2>/dev/null || firefox "http://localhost:$PORT" 2>/dev/null ) &

# Detecta l'eina disponible
if command -v python3 &> /dev/null; then
  python3 -m http.server $PORT
elif command -v python &> /dev/null; then
  python -m http.server $PORT
elif command -v php &> /dev/null; then
  php -S localhost:$PORT
elif command -v npx &> /dev/null; then
  npx --yes http-server -p $PORT
else
  echo "⚠️ Cap servidor disponible. Obre index.html directament."
  xdg-open index.html 2>/dev/null
fi
