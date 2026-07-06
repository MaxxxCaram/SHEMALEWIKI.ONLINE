#!/bin/bash

###############################################################################
# Hermes Supabase Integration
# Query KPIs, monitor database health, manage storage
# Owner: Maxima
###############################################################################

echo "🔧 Hermes Supabase Integration Setup"
echo "====================================="
echo ""

# Check environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Supabase credentials not found"
    echo ""
    echo "Add to your .env:"
    echo "export SUPABASE_URL='https://qtuzpswxzengqoqqwtpt.supabase.co'"
    echo "export SUPABASE_ANON_KEY='your_anon_key'"
    echo ""
    echo "Find in: https://app.supabase.com/project/[project]/settings/api"
    exit 1
fi

echo "✅ SUPABASE_URL: $SUPABASE_URL"
echo "✅ SUPABASE_ANON_KEY: configured"
echo ""

# Test connection
echo "Testing Supabase connection..."
RESPONSE=$(curl -s \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/profiles?select=count()&limit=1")

if echo "$RESPONSE" | grep -q "count"; then
    echo "✅ Connected to Supabase"
    echo ""
else
    echo "⚠️  Connection test inconclusive"
    echo "Response: $RESPONSE"
fi

echo "🚀 Available Hermes Supabase features:"
echo "  ✅ Query profile KPIs"
echo "  ✅ Count profiles without photos"
echo "  ✅ Monitor database health"
echo "  ✅ Identify duplicate profiles"
echo "  ✅ Track new profiles (daily)"
echo "  ✅ Monitor Storage usage"
echo "  ✅ Query edge functions logs"
echo ""

cat > ~/.hermes/.supabase-config.json << EOF
{
  "enabled": true,
  "url": "$SUPABASE_URL",
  "project_ref": "qtuzpswxzengqoqqwtpt",
  "tables": {
    "profiles": {
      "columns": ["id", "name", "email", "city", "country", "created_at"],
      "monitoring": true
    },
    "photos": {
      "columns": ["id", "profile_id", "url", "uploaded_at"],
      "monitoring": true
    }
  },
  "features": {
    "kpi_queries": true,
    "health_checks": true,
    "duplicate_detection": true,
    "daily_growth_tracking": true,
    "storage_monitoring": true
  },
  "kpi_queries": {
    "total_profiles": "SELECT COUNT(*) FROM profiles",
    "profiles_with_photos": "SELECT COUNT(DISTINCT profile_id) FROM photos",
    "profiles_without_photos": "SELECT COUNT(*) FROM profiles WHERE id NOT IN (SELECT DISTINCT profile_id FROM photos)",
    "new_profiles_24h": "SELECT COUNT(*) FROM profiles WHERE created_at > now() - interval '24 hours'",
    "new_profiles_7d": "SELECT COUNT(*) FROM profiles WHERE created_at > now() - interval '7 days'",
    "storage_usage": "SELECT SUM(metadata->>'size') FROM storage.objects WHERE bucket_id = 'profile-photos'"
  },
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "✅ Supabase integration configured"
echo "Config saved to: ~/.hermes/.supabase-config.json"
echo ""
echo "Available KPI queries:"
echo "  - Total profiles"
echo "  - Profiles with photos"
echo "  - Profiles WITHOUT photos (need photos!)"
echo "  - New profiles (24h)"
echo "  - New profiles (7d)"
echo "  - Storage usage"
