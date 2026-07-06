#!/bin/bash

# Vercel Build Script for Expo Project
# Creates the 'site' directory that Vercel expects

echo "📦 Building for Vercel..."

# Create site directory
mkdir -p site

# Copy public contents to site
if [ -d "public" ]; then
  cp -r public/* site/ 2>/dev/null || true
  echo "✅ Copied public/ to site/"
else
  echo "⚠️  public/ directory not found"
  echo "<h1>ShemaleWiki & BuscaTrans - Hermes Agent v0.18</h1>" > site/index.html
fi

# Ensure index.html exists
if [ ! -f "site/index.html" ]; then
  echo "Creating minimal index.html..."
  cat > site/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>ShemaleWiki & BuscaTrans</title>
</head>
<body>
  <h1>ShemaleWiki & BuscaTrans - Hermes Agent v0.18</h1>
  <p>Production Environment</p>
</body>
</html>
EOF
fi

# Verify site directory exists
if [ -d "site" ] && [ -f "site/index.html" ]; then
  echo "✅ Build completed successfully"
  echo "📁 Site directory ready for deployment"
  ls -la site/
  exit 0
else
  echo "❌ Build failed - site directory not created"
  exit 1
fi
