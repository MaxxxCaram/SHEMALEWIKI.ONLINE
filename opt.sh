#!/bin/bash
set -e
echo "⚡ OPTIMIZANDO HERMES..."
docker compose ps
sleep 3
docker image prune -a -f 2>/dev/null || true
docker container prune -f 2>/dev/null || true
docker volume prune -f 2>/dev/null || true
docker compose exec -T redis redis-cli -a hermes456 BGSAVE 2>/dev/null || true
docker compose restart hermes
sleep 8
echo ""
echo "✅ VERIFICANDO..."
curl -s http://localhost:3000/health | jq . 2>/dev/null || curl -s http://localhost:3000/health
echo ""
docker compose ps
