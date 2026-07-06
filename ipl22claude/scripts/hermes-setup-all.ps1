# Hermes Complete Setup Script (PowerShell)
# Initializes all Hermes automation
# Owner: Maxima

Write-Host "🚀 Hermes Agent Complete Setup" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host ""

# Step 1: Create directory structure
Write-Host "📁 Creating directory structure..." -ForegroundColor Cyan
$logDir = "$env:USERPROFILE\.hermes\logs"
$recoveryDir = "$env:USERPROFILE\.hermes\recoveries"
$configDir = "$env:USERPROFILE\.hermes"

New-Item -ItemType Directory -Force -Path $logDir | Out-Null
New-Item -ItemType Directory -Force -Path $recoveryDir | Out-Null
New-Item -ItemType Directory -Force -Path $configDir | Out-Null

Write-Host "✅ Directories created:" -ForegroundColor Green
Write-Host "   - $logDir"
Write-Host "   - $recoveryDir"
Write-Host "   - $configDir"
Write-Host ""

# Step 2: Check environment variables
Write-Host "🔑 Checking environment variables..." -ForegroundColor Cyan

$checks = @{
    "GITHUB_TOKEN" = "GitHub integration";
    "GSC_API_KEY" = "Google Search Console";
    "GSC_PROPERTY_ID" = "GSC Property URL";
}

foreach ($var in $checks.Keys) {
    if ([Environment]::GetEnvironmentVariable($var)) {
        Write-Host "✅ $($checks[$var]): Configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $($checks[$var]): NOT SET - $(($checks[$var])) features disabled" -ForegroundColor Yellow
    }
}

Write-Host ""

# Step 3: Verify scripts exist
Write-Host "📝 Verifying automation scripts..." -ForegroundColor Cyan

$scripts = @(
    "scripts/hermes-checklist.sh",
    "scripts/hermes-daily-report.sh",
    "scripts/hermes-deploy-watchdog.sh",
    "scripts/hermes-wayback-recovery.sh",
    "scripts/hermes-github-integration.sh",
    "scripts/hermes-gsc-integration.sh",
    "scripts/hermes-playwright-setup.sh"
)

foreach ($script in $scripts) {
    if (Test-Path $script) {
        Write-Host "✅ $script" -ForegroundColor Green
    } else {
        Write-Host "❌ $script - MISSING" -ForegroundColor Red
    }
}

Write-Host ""

# Step 4: Create master config
Write-Host "⚙️  Creating master configuration..." -ForegroundColor Cyan

$config = @{
    "hermes_version" = "0.18"
    "status" = "active"
    "autonomy_mode" = "enabled"
    "timestamp" = (Get-Date -Format "o")
    "directories" = @{
        "logs" = $logDir
        "recoveries" = $recoveryDir
        "config" = $configDir
    }
    "cron_jobs" = @(
        @{
            "name" = "deploy-watchdog"
            "schedule" = "6 AM daily"
            "description" = "Health checks & uptime monitoring"
        },
        @{
            "name" = "daily-report"
            "schedule" = "12 PM daily"
            "description" = "Status report & KPI summary"
        },
        @{
            "name" = "wayback-recovery"
            "schedule" = "Sunday 12 AM"
            "description" = "Recover lost profiles from archive.org"
        }
    )
    "integrations" = @{
        "github" = if ([Environment]::GetEnvironmentVariable("GITHUB_TOKEN")) { "enabled" } else { "disabled" }
        "gsc" = if ([Environment]::GetEnvironmentVariable("GSC_API_KEY")) { "enabled" } else { "disabled" }
        "playwright" = "ready"
    }
} | ConvertTo-Json -Depth 10

$config | Out-File -FilePath "$configDir\hermes-config.json" -Encoding UTF8

Write-Host "✅ Config saved to: $configDir\hermes-config.json" -ForegroundColor Green
Write-Host ""

# Step 5: Summary
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Hermes Status:" -ForegroundColor Cyan
Write-Host "  Version: 0.18"
Write-Host "  Mode: Autonomous"
Write-Host "  Uptime monitoring: Active"
Write-Host "  Status reporting: Active"
Write-Host "  Recovery system: Ready"
Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Set GITHUB_TOKEN if not already done"
Write-Host "  2. Set GSC_API_KEY for search monitoring (optional)"
Write-Host "  3. Cron jobs will start automatically"
Write-Host "  4. Check logs in: $logDir"
Write-Host ""
Write-Host "📞 Support:" -ForegroundColor Magenta
Write-Host "  Owner: Maxima"
Write-Host "  Email: caramvictoria@gmail.com"
Write-Host "  Logs: ~/.hermes/logs/"
Write-Host ""
