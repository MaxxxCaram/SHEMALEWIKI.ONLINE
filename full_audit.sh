#!/bin/bash

echo "════════════════════════════════════════════════════════"
echo "🔍 AUDITORÍA COMPLETA - HERMES PLATFORM"
echo "════════════════════════════════════════════════════════"
echo ""

echo "📊 1. HEALTH CHECK COMPLETO"
echo "───────────────────────────"
curl -s http://localhost:3000/health | jq .
echo ""

echo "🌐 2. ENDPOINTS VERIFICACIÓN"
echo "───────────────────────────"
echo "GET /api/governance:"
curl -s http://localhost:3000/api/governance | jq .
echo ""

echo "3. DOCKER STATS"
echo "───────────────"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
echo ""

echo "4. DISCO Y ALMACENAMIENTO"
echo "───────────────────────"
df -h | grep -E "Filesystem|/var"
echo ""
du -sh /var/www/shemalewiki/*
echo ""

echo "5. LOGS RECIENTES"
echo "───────────────"
docker compose logs --tail=10 hermes
echo ""

echo "════════════════════════════════════════════════════════"
echo "✅ AUDITORÍA COMPLETADA"
echo "════════════════════════════════════════════════════════"
