#!/bin/bash

###############################################################################
# Hermes Playwright Setup
# Installs and configures Playwright for render testing & monitoring
# Owner: Maxima
###############################################################################

echo "🔧 Hermes Playwright Setup"
echo "=========================="
echo ""

# Check if Playwright is installed
if npm list @playwright/test > /dev/null 2>&1; then
    echo "✅ Playwright already installed"
    PLAYWRIGHT_VERSION=$(npm list @playwright/test | grep @playwright/test | head -1)
    echo "Version: $PLAYWRIGHT_VERSION"
else
    echo "📦 Installing Playwright..."
    npm install -D @playwright/test
    echo "✅ Playwright installed"
fi

echo ""
echo "📥 Installing browsers..."
npx playwright install

echo ""
echo "🚀 Playwright is ready for:"
echo "  ✅ Render testing (Googlebot simulation)"
echo "  ✅ Screenshot validation"
echo "  ✅ Performance monitoring"
echo "  ✅ Broken link detection"
echo "  ✅ SEO audit"
echo ""

# Create test directory if needed
mkdir -p tests/e2e

cat > ~/.hermes/.playwright-config.json << EOF
{
  "enabled": true,
  "version": "latest",
  "browsers": ["chromium", "firefox", "webkit"],
  "features": {
    "render_testing": true,
    "performance_monitoring": true,
    "link_validation": true,
    "seo_audit": true,
    "screenshots": true
  },
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "✅ Playwright configured"
echo "Config saved to: ~/.hermes/.playwright-config.json"
echo ""
echo "Next steps:"
echo "  1. Run: npx playwright codegen https://shemalewiki.online"
echo "  2. Create tests in: tests/e2e/"
echo "  3. Execute: npx playwright test"
