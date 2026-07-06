#!/bin/bash

###############################################################################
# Hermes Deploy Watchdog
# Runs at 6 AM daily - verifies deployment health & monitors uptime
# Owner: Maxima
###############################################################################

set -e

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
LOG_DIR="$HOME/.hermes/logs"
REPORT_FILE="$LOG_DIR/watchdog-$(date '+%Y%m%d-%H%M%S').md"

mkdir -p "$LOG_DIR"

echo "🔍 Hermes Deploy Watchdog Started"
echo "Timestamp: $TIMESTAMP"
echo ""

cat > "$REPORT_FILE" << EOF
# Hermes Deploy Watchdog Report
**Time:** $TIMESTAMP

## 🌐 Site Health Checks

### Site 1: shemalewiki.online
EOF

# Check site 1
RESPONSE1=$(curl -s -o /dev/null -w "%{http_code}" https://shemalewiki.online 2>&1)
if [ "$RESPONSE1" = "200" ]; then
    echo "✅ shemalewiki.online: ONLINE (HTTP $RESPONSE1)"
    echo "✅ Status: ONLINE (HTTP $RESPONSE1)" >> "$REPORT_FILE"
    echo "Response time: [checking...]" >> "$REPORT_FILE"
else
    echo "❌ shemalewiki.online: OFFLINE (HTTP $RESPONSE1)"
    echo "❌ Status: OFFLINE (HTTP $RESPONSE1)" >> "$REPORT_FILE"
    echo "⚠️ ALERT: shemalewiki.online not responding!" >> "$REPORT_FILE"
fi

echo ""
cat >> "$REPORT_FILE" << EOF

### Site 2: buscatrans.com
EOF

# Check site 2
RESPONSE2=$(curl -s -o /dev/null -w "%{http_code}" https://buscatrans.com 2>&1)
if [ "$RESPONSE2" = "200" ]; then
    echo "✅ buscatrans.com: ONLINE (HTTP $RESPONSE2)"
    echo "✅ Status: ONLINE (HTTP $RESPONSE2)" >> "$REPORT_FILE"
else
    echo "❌ buscatrans.com: OFFLINE (HTTP $RESPONSE2)"
    echo "❌ Status: OFFLINE (HTTP $RESPONSE2)" >> "$REPORT_FILE"
    echo "⚠️ ALERT: buscatrans.com not responding!" >> "$REPORT_FILE"
fi

echo ""
cat >> "$REPORT_FILE" << EOF

## 🚀 Vercel Deployment Status
EOF

echo "Checking latest deployment..."
echo "Last deployment: [Vercel API check needed]" >> "$REPORT_FILE"
echo "Deployment status: [Vercel API check needed]" >> "$REPORT_FILE"

echo ""
cat >> "$REPORT_FILE" << EOF

## 🗄️ Supabase Connection
EOF

echo "Database connection: [Supabase healthcheck needed]" >> "$REPORT_FILE"

echo ""
cat >> "$REPORT_FILE" << EOF

## 📈 Profile Stats
EOF

echo "Total profiles: [Supabase query needed]" >> "$REPORT_FILE"
echo "New profiles (24h): [Supabase query needed]" >> "$REPORT_FILE"
echo "Profiles without photos: [Supabase query needed]" >> "$REPORT_FILE"

echo ""
cat >> "$REPORT_FILE" << EOF

## ✅ Summary
EOF

if [ "$RESPONSE1" = "200" ] && [ "$RESPONSE2" = "200" ]; then
    echo "✅ All systems operational"
    echo "✅ All systems operational" >> "$REPORT_FILE"
else
    echo "⚠️ FAILURES DETECTED - Manual intervention may be needed"
    echo "⚠️ FAILURES DETECTED - Check above for details" >> "$REPORT_FILE"
fi

echo ""
echo "📄 Report saved: $REPORT_FILE"
echo ""

# Save status for next session
echo "Last watchdog: $TIMESTAMP" > "$LOG_DIR/last-watchdog.txt"

# Display report
cat "$REPORT_FILE"
