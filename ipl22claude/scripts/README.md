# 🤖 Hermes Agent v0.18 - Complete Automation System

> **A light for programming platforms. Control everything. Make it perfect.**

Hermes is your autonomous agent for **shemalewiki.online** and **buscatrans.com**. It automates deployments, monitoring, and data recovery with zero human intervention.

---

## 📊 Architecture

```
┌─────────────┐
│   Vercel    │  Deploy, build, edge functions
├─────────────┤
│  Supabase   │  PostgreSQL, Storage, Auth
├─────────────┤
│   GitHub    │  Code, commits, PRs
├─────────────┤
│   Hermes    │  ← You are here (orchestration)
└─────────────┘
```

---

## 🚀 What Hermes Does

### Daily (Automated)

| Time | Task | Duration | Impact |
|------|------|----------|--------|
| **6:03 AM** | Deploy Watchdog | 5 min | ✅ Both sites online? |
| **12:07 PM** | Status Report | 3 min | 📊 KPI summary |
| **Sunday 12:11 AM** | Wayback Recovery | 20 min | 📚 Restore 38,666 lost profiles |
| **Monday 6:13 AM** | DB Cleanup | 10 min | 🧹 Identify duplicates |

### On-Demand (Manual)

- Deploy to production (auto-merge if tests pass)
- Create feature branches
- Generate reports
- Run health checks
- Monitor performance

---

## 🔧 Installation & Setup

### 1. **Install Required Tools**

```bash
# Node.js & npm
npm install

# Playwright (for testing)
npm install -D @playwright/test
npx playwright install
```

### 2. **Set Environment Variables**

Create `.env` file in project root:

```bash
# Vercel (required)
export VERCEL_TOKEN="vercel_xxxxxxxxxxxx"

# Supabase (required)
export SUPABASE_URL="https://qtuzpswxzengqoqqwtpt.supabase.co"
export SUPABASE_ANON_KEY="your_anon_key_here"

# GitHub (optional but recommended)
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"

# Google Search Console (optional)
export GSC_API_KEY="your_api_key_here"
export GSC_PROPERTY_ID="https://shemalewiki.online"

# Slack (optional)
export SLACK_WEBHOOK_HERMES="https://hooks.slack.com/services/T.../B.../xxx"
export SLACK_WEBHOOK_URGENT="https://hooks.slack.com/services/T.../B.../xxx"
```

### 3. **Run Setup**

```bash
# PowerShell (Windows)
powershell -ExecutionPolicy Bypass -File scripts/hermes-setup-all.ps1

# Bash (Mac/Linux)
source scripts/hermes-init-env.sh
hermes_status
```

### 4. **Test Connection**

```bash
# Run startup checklist
bash scripts/hermes-checklist.sh

# View status
hermes_status
```

---

## 📁 Directory Structure

```
scripts/
├── README.md                          ← You are here
├── hermes-setup-all.ps1              ← Master setup (Windows)
├── hermes-init-env.sh                ← Environment init (bash)
├── hermes-checklist.sh               ← Session startup
├── hermes-daily-report.sh            ← 12 PM report
├── hermes-deploy-watchdog.sh         ← 6 AM health check
├── hermes-wayback-recovery.sh        ← Sunday 12 AM recovery
├── hermes-vercel-integration.sh      ← Vercel API setup
├── hermes-supabase-integration.sh    ← Supabase API setup
├── hermes-github-integration.sh      ← GitHub API setup
├── hermes-gsc-integration.sh         ← Google Search Console setup
└── hermes-playwright-setup.sh        ← Browser testing setup

.claude/
├── hermes-automation.json            ← Master config
└── settings.json

SOUL.md                               ← Autonomy rules & permissions
```

---

## 📈 Automated Reports

Hermes saves all activity to `~/.hermes/logs/`:

```
~/.hermes/logs/
├── daily-20260707.md              ← Daily KPI report
├── watchdog-20260707-060300.md    ← Health check
├── session-start-20260707-200100.md
└── wayback-recovery-20260707.md
```

### Daily Report Contents

- ✅ Site uptime (both domains)
- ✅ Build success rate (7 days)
- ✅ Deploy success rate (7 days)
- ✅ Profile count + growth
- ✅ Profiles without photos (priority!)
- ✅ Any errors or failures

---

## 🔐 Permissions (SOUL.md)

Hermes operates under strict rules defined in `SOUL.md`:

### ✅ Can Do Without Asking
- Run tests & builds
- Deploy if tests pass
- Install npm dependencies
- Health checks & monitoring
- Read database
- Generate reports

### ⚠️ Requires Confirmation
- Production deploy (first time)
- Database modifications
- External notifications
- Architecture changes

### 🚫 Never Does
- Delete data
- Modify payments
- Contact external users
- Bypass security

Read the full rules in `SOUL.md`.

---

## 🎯 KPIs Tracked

| Metric | Target | How Often |
|--------|--------|-----------|
| Uptime | 99.9% | Every 6 AM |
| Build Success | 95%+ | Every deploy |
| Deploy Success | 95%+ | Every deploy |
| Response Time | <500ms | Every 6 AM |
| Profile Growth | Tracked | Daily 12 PM |
| Photo Coverage | ↑ | Daily 12 PM |

---

## 🔄 Cron Jobs (Scheduled Tasks)

Hermes uses **Claude's CronCreate** system to schedule recurring tasks. These are persistent and survive session restarts.

### Currently Scheduled

```json
{
  "deploy_watchdog": "6:03 AM daily",
  "daily_report": "12:07 PM daily",
  "wayback_recovery": "Sunday 12:11 AM",
  "database_cleanup": "Monday 6:13 AM"
}
```

To view active jobs:
```bash
# Claude command
/cron-list
```

---

## 🛠️ Troubleshooting

### "Sites offline" alert

```bash
# Check manually
curl -I https://shemalewiki.online
curl -I https://buscatrans.com

# Check Vercel
npx vercel status
```

### "Supabase connection error"

```bash
# Verify credentials
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# Test API
curl -H "apikey: $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/profiles?limit=1"
```

### "No profiles without photos found"

Check if the query is correct in `.supabase-config.json`.

---

## 📞 Support & Contact

- **Owner:** Maxima (caramvictoria@gmail.com)
- **Logs:** `~/.hermes/logs/`
- **Config:** `.claude/hermes-automation.json`
- **Rules:** `SOUL.md`

---

## 📚 Documentation

- `SOUL.md` — Autonomy rules & permissions
- `.claude/hermes-automation.json` — Configuration
- `CLAUDE.md` — Project instructions
- This file — Setup & usage guide

---

## 🚀 Next Steps

1. ✅ Set up environment variables
2. ✅ Run `hermes-setup-all.ps1`
3. ✅ Verify cron jobs active
4. ✅ Check first daily report (12 PM)
5. ✅ Monitor logs in `~/.hermes/logs/`

**You're all set!** Hermes will now work 24/7 to keep your platforms running perfectly. 🌟

---

*Last updated: 2026-07-06*  
*Hermes Agent v0.18*
