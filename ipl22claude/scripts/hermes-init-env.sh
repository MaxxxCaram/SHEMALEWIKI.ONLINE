#!/bin/bash

###############################################################################
# Hermes Environment Initialization
# Add this to your ~/.bashrc or ~/.zshrc to auto-initialize Hermes
# Owner: Maxima
###############################################################################

# Hermes directories
export HERMES_HOME="${HERMES_HOME:-$HOME/.hermes}"
export HERMES_LOGS="$HERMES_HOME/logs"
export HERMES_RECOVERIES="$HERMES_HOME/recoveries"
export HERMES_CONFIG="$HERMES_HOME"

# Create directories if they don't exist
mkdir -p "$HERMES_LOGS" "$HERMES_RECOVERIES" "$HERMES_CONFIG"

# Load Hermes configuration if it exists
if [ -f "$HERMES_CONFIG/hermes-config.json" ]; then
    export HERMES_INITIALIZED=true
fi

# GitHub integration (if configured)
# export GITHUB_TOKEN="your_token_here"  # Set manually or in .env

# Google Search Console (if configured)
# export GSC_API_KEY="your_api_key_here"
# export GSC_PROPERTY_ID="https://shemalewiki.online"

# Slack webhooks (if configured)
# export SLACK_WEBHOOK_HERMES="https://hooks.slack.com/..."
# export SLACK_WEBHOOK_URGENT="https://hooks.slack.com/..."

# Vercel (should be auto-detected)
# export VERCEL_TOKEN="your_token_here"

# Supabase (should be auto-detected)
# export SUPABASE_URL="..."
# export SUPABASE_ANON_KEY="..."

# Add Hermes scripts to PATH
export PATH="$PATH:$(pwd)/scripts"

# Function to run Hermes checklist
hermes_check() {
    echo "🔍 Running Hermes checklist..."
    bash scripts/hermes-checklist.sh
}

# Function to view recent logs
hermes_logs() {
    echo "📋 Recent Hermes logs:"
    ls -lah "$HERMES_LOGS/" | tail -20
}

# Function to generate daily report
hermes_report() {
    echo "📊 Generating daily report..."
    bash scripts/hermes-daily-report.sh
}

# Function to check status
hermes_status() {
    echo "📊 Hermes Status"
    echo "==============="

    if [ -f "$HERMES_CONFIG/hermes-config.json" ]; then
        cat "$HERMES_CONFIG/hermes-config.json" | jq .
    else
        echo "❌ Hermes not initialized. Run: ./scripts/hermes-setup-all.ps1"
    fi
}

echo "✅ Hermes environment initialized"
echo "Commands available:"
echo "  hermes_check    - Run startup checklist"
echo "  hermes_logs     - View recent logs"
echo "  hermes_report   - Generate daily report"
echo "  hermes_status   - Show configuration status"
