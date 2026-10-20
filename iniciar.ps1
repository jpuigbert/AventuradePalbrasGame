# ============================================================
# INICIAR.PS1 — Servidor local per a Windows (recomanat per a PWA)
# ============================================================

Set-Location -Path $PSScriptRoot

$port = 8080
Write-Host "Aventura de Palabras" -ForegroundColor Cyan
Write-Host "Servidor a http://localhost:$port" -ForegroundColor Yellow
Write-Host "Prem Ctrl+C per aturar" -ForegroundColor Red

# Obrim el navegador amb la URL local (permet instal·lar com a PWA)
Start-Process "http://localhost:$port"

# Comprova Python
if (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server $port
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    py -m http.server $port
} else {
    Write-Host "Python no trobat. Obrint fitxer directament..." -ForegroundColor Yellow
    Start-Process "index.html"
}
