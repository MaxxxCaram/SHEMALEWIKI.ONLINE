# Hermes Dashboard Launcher (PowerShell)
# Inicia el dashboard en http://localhost:3333

Write-Host "🤖 Iniciando Hermes Dashboard..." -ForegroundColor Green
Write-Host ""

# Check if Node modules exist
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Show info
Write-Host "📂 Dashboard Location: http://localhost:3333" -ForegroundColor Cyan
Write-Host "📊 Logs Directory: ~/.hermes/logs/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Start dashboard
node scripts/hermes-dashboard.js
