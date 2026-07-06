#!/bin/bash

###############################################################################
# Hermes GitHub Integration Setup
# Configures GitHub API access for Hermes automation
# Owner: Maxima
###############################################################################

echo "🔧 Hermes GitHub Integration Setup"
echo "===================================="
echo ""

# Check if token is set
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN not found"
    echo ""
    echo "To enable GitHub integration, add to your .env or .bashrc:"
    echo "export GITHUB_TOKEN='ghp_your_token_here'"
    echo ""
    echo "Generate token at: https://github.com/settings/tokens/new"
    echo "Required scopes:"
    echo "  - repo (full control of private repositories)"
    echo "  - workflow (manage GitHub Actions)"
    echo "  - read:org (read organization data)"
    exit 1
fi

echo "✅ GITHUB_TOKEN found"
echo ""

# Test connection
echo "Testing GitHub API connection..."
RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user)
USER=$(echo "$RESPONSE" | grep -o '"login":"[^"]*' | cut -d'"' -f4)

if [ -z "$USER" ]; then
    echo "❌ Failed to authenticate with GitHub"
    echo "Response: $RESPONSE"
    exit 1
fi

echo "✅ Authenticated as: $USER"
echo ""

# Enable features
echo "🚀 Enabling Hermes GitHub features:"
echo ""
echo "Features:"
echo "  ✅ Auto-commit on code changes"
echo "  ✅ Create branches for bugs"
echo "  ✅ Create PRs for features"
echo "  ✅ Auto-merge PRs (tests passing + approved)"
echo "  ✅ Push changes to remote"
echo "  ✅ Manage workflows & actions"
echo ""

cat > ~/.hermes/.github-config.json << EOF
{
  "enabled": true,
  "user": "$USER",
  "token_configured": true,
  "features": {
    "auto_commit": true,
    "create_branches": true,
    "create_prs": true,
    "auto_merge": true,
    "manage_workflows": true
  },
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "✅ GitHub integration configured"
echo "Config saved to: ~/.hermes/.github-config.json"
