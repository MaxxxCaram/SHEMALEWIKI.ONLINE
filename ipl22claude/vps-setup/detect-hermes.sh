#!/bin/bash

###############################################################################
# Hermes VPS Auto-Detection
# Detecta automáticamente dónde está instalado Hermes y sus logs
# Run: bash vps-setup/detect-hermes.sh
###############################################################################

echo "🔍 Detectando instalación de Hermes en el VPS..."
echo ""

# Current user
CURRENT_USER=$(whoami)
echo "👤 Usuario actual: $CURRENT_USER"
echo ""

# Posibles ubicaciones de logs
POSSIBLE_LOCATIONS=(
    "$HOME/.hermes/logs"
    "/home/$CURRENT_USER/.hermes/logs"
    "/root/.hermes/logs"
    "/var/hermes/logs"
    "/opt/hermes/logs"
    "$(pwd)/.hermes/logs"
    "/home/*/shemalewiki*/.hermes/logs"
    "/home/*/buscatrans*/.hermes/logs"
)

echo "🔎 Buscando logs de Hermes..."
echo ""

FOUND_LOGS=""
for loc in "${POSSIBLE_LOCATIONS[@]}"; do
    # Expandir wildcards
    for expanded in $loc; do
        if [ -d "$expanded" ]; then
            echo "✅ Encontrado: $expanded"
            FOUND_LOGS="$expanded"
            break 2
        fi
    done
done

if [ -z "$FOUND_LOGS" ]; then
    echo "❌ No se encontraron logs de Hermes"
    echo ""
    echo "Crea el directorio manualmente:"
    echo "  mkdir -p ~/.hermes/logs"
    exit 1
fi

echo ""
echo "📁 Directorio de logs: $FOUND_LOGS"
echo "📂 Contenido:"
ls -lah "$FOUND_LOGS" | head -10

echo ""
echo "💾 Guardando configuración..."

cat > vps-setup/.hermes-vps-config.sh << EOF
#!/bin/bash
# Auto-detected Hermes VPS configuration

export HERMES_LOGS_DIR="$FOUND_LOGS"
export HERMES_USER="$CURRENT_USER"
export HERMES_HOME="\$(dirname "$FOUND_LOGS")"

echo "✅ Hermes VPS detectado:"
echo "   Logs: \$HERMES_LOGS_DIR"
echo "   Usuario: \$HERMES_USER"
echo "   Home: \$HERMES_HOME"
EOF

chmod +x vps-setup/.hermes-vps-config.sh

echo ""
echo "✅ Configuración guardada en: vps-setup/.hermes-vps-config.sh"
echo ""
echo "Próximo paso: bash vps-setup/install-dashboard-vps.sh"
