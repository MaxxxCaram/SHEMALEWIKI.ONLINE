#!/bin/bash

###############################################################################
# Hermes Google Search Console Integration
# Configures GSC API access for search monitoring
# Owner: Maxima
###############################################################################

echo "🔧 Hermes Google Search Console Integration"
echo "==========================================="
echo ""

# Check if API key is set
if [ -z "$GSC_API_KEY" ]; then
    echo "❌ GSC_API_KEY not found"
    echo ""
    echo "To enable Google Search Console integration, add to your .env or .bashrc:"
    echo "export GSC_API_KEY='your_api_key_here'"
    echo "export GSC_PROPERTY_ID='https://shemalewiki.online'"
    echo ""
    echo "Get API key from:"
    echo "  https://console.cloud.google.com/apis/credentials"
    echo ""
    echo "Setup instructions:"
    echo "  1. Create a Google Cloud project"
    echo "  2. Enable 'Google Search Console API'"
    echo "  3. Create an API key (or Service Account)"
    echo "  4. Authorize at: https://search.google.com/search-console"
    exit 1
fi

echo "✅ GSC_API_KEY configured"
echo ""

# Verify property
if [ -z "$GSC_PROPERTY_ID" ]; then
    echo "❌ GSC_PROPERTY_ID not set"
    echo "Set it: export GSC_PROPERTY_ID='https://shemalewiki.online'"
    exit 1
fi

echo "✅ Property: $GSC_PROPERTY_ID"
echo ""

echo "🚀 Enabling Hermes GSC features:"
echo ""
echo "Features:"
echo "  ✅ Monitor indexation status"
echo "  ✅ Track ranking keywords"
echo "  ✅ Monitor crawl errors"
echo "  ✅ Generate weekly reports"
echo "  ✅ Alert on significant changes"
echo ""

cat > ~/.hermes/.gsc-config.json << EOF
{
  "enabled": true,
  "property_id": "$GSC_PROPERTY_ID",
  "features": {
    "monitor_indexation": true,
    "track_rankings": true,
    "crawl_error_monitoring": true,
    "weekly_reports": true,
    "alerts": true
  },
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "✅ GSC integration configured"
echo "Config saved to: ~/.hermes/.gsc-config.json"
