#!/bin/bash
# ============================================================
# INICIAR.COMMAND — Obre el joc al navegador (macOS/Linux)
# ============================================================

cd "$(dirname "$0")"

# Detecta l'OS i obre el navegador
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  open index.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  if command -v xdg-open &> /dev/null; then
    xdg-open index.html
  elif command -v firefox &> /dev/null; then
    firefox index.html
  else
    echo "⚠️ No s'ha trobat cap navegador. Obre index.html manualment."
  fi
else
  echo "⚠️ Sistema no reconegut. Obre index.html manualment."
fi
