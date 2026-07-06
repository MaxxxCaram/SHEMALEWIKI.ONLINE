#!/bin/bash

# Hermes Dashboard Launcher (Bash)
# Inicia el dashboard en http://localhost:3333

echo "🤖 Iniciando Hermes Dashboard..."
echo ""

# Check if Node modules exist
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Show info
echo "📂 Dashboard: http://localhost:3333"
echo "📊 Logs: ~/.hermes/logs/"
echo ""
echo "Presiona Ctrl+C para detener"
echo ""

# Start dashboard
node scripts/hermes-dashboard.js
