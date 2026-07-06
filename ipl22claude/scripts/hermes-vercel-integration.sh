#!/bin/bash

###############################################################################
# Hermes Vercel Integration
# Manage deployments, builds, and edge functions
# Owner: Maxima
###############################################################################

echo "🔧 Hermes Vercel Integration Setup"
echo "===================================="
echo ""

# Check if Vercel token is set
if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ VERCEL_TOKEN not found"
    echo ""
    echo "To enable Vercel integration, add to your .env:"
    echo "export VERCEL_TOKEN='your_token_here'"
    echo ""
    echo "Generate token at: https://vercel.com/account/tokens"
    echo "Required scope: Full access"
    exit 1
fi

echo "✅ VERCEL_TOKEN configured"
echo ""

# Test connection
echo "Testing Vercel API connection..."
RESPONSE=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v9/projects)

if echo "$RESPONSE" | grep -q "projects"; then
    echo "✅ Connected to Vercel API"
    echo ""
    echo "🚀 Available Hermes Vercel features:"
    echo "  ✅ Monitor deployment status"
    echo "  ✅ Trigger builds automatically"
    echo "  ✅ Query build logs"
    echo "  ✅ Manage edge functions"
    echo "  ✅ Check performance metrics"
    echo "  ✅ Purge cache"
    echo ""
else
    echo "❌ Failed to authenticate with Vercel"
    echo "Response: $RESPONSE"
    exit 1
fi

cat > ~/.hermes/.vercel-config.json << EOF
{
  "enabled": true,
  "api_endpoint": "https://api.vercel.com",
  "projects": {
    "shemalewiki_online": {
      "project_id": "shemalewiki-online",
      "environments": ["production", "preview"],
      "domains": ["shemalewiki.online"]
    },
    "buscatrans": {
      "project_id": "shemalewiki-online",
      "environments": ["production"],
      "domains": ["buscatrans.com"]
    }
  },
  "features": {
    "auto_deploy_on_push": true,
    "monitor_builds": true,
    "query_logs": true,
    "cache_purge": true,
    "performance_monitoring": true
  },
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "✅ Vercel integration configured"
echo "Config saved to: ~/.hermes/.vercel-config.json"
