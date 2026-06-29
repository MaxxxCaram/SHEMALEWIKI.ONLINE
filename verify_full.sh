#!/bin/bash

echo "════════════════════════════════════════════════════════"
echo "✅ VERIFICACIÓN FINAL COMPLETA"
echo "════════════════════════════════════════════════════════"
echo ""

echo "1️⃣  GIT STATUS"
git -C /var/www/shemalewiki status
echo ""

echo "2️⃣  ÚLTIMO COMMIT"
git -C /var/www/shemalewiki log --oneline -1
echo ""

echo "3️⃣  REMOTE CONFIGURADO"
git -C /var/www/shemalewiki remote -v
echo ""

echo "4️⃣  VERIFICAR CERTIFICADOS SSL"
ls -la /var/www/shemalewiki/ssl/ 2>/dev/null || echo "SSL: No configurado aún"
echo ""

echo "5️⃣  UPTIME HERMES"
docker compose ps hermes | tail -1
echo ""

echo "════════════════════════════════════════════════════════"
echo "🌐 ACCESO A SERVICIOS:"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Hermes API:   http://187.77.68.200:3000/health"
echo "Grafana:      http://187.77.68.200:3005 (admin/hermes789)"
echo "Vercel:       https://shemalewiki-online.vercel.app"
echo "GitHub:       https://github.com/MaxxxCaram/SHEMALEWIKI.ONLINE"
echo "Supabase:     https://qtuzpswxzengqoqqwtpt.supabase.co"
echo ""
echo "════════════════════════════════════════════════════════"
