#!/bin/bash

###############################################################################
# Hermes Dashboard VPS Installation
# Instala el dashboard remoto en el VPS
# Run: bash vps-setup/install-dashboard-vps.sh
###############################################################################

set -e

echo "🚀 Instalando Hermes Dashboard en VPS..."
echo ""

# Load config
if [ ! -f "vps-setup/.hermes-vps-config.sh" ]; then
    echo "❌ Primero ejecuta: bash vps-setup/detect-hermes.sh"
    exit 1
fi

source vps-setup/.hermes-vps-config.sh

echo "📂 Usando logs de: $HERMES_LOGS_DIR"
echo ""

# Install dependencies
echo "📦 Instalando dependencias en VPS..."
npm install express dotenv cors 2>&1 | grep -E "added|up to date"

echo ""
echo "🔧 Creando dashboard para VPS..."

# Copy dashboard with VPS configuration
cat > vps-dashboard.js << 'DASHBOARD_EOF'
#!/usr/bin/env node

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3334;
const LOGS_DIR = process.env.HERMES_LOGS_DIR || path.join(process.env.HOME || '/root', '.hermes/logs');
const API_KEY = process.env.HERMES_API_KEY || 'change-me-in-env';

console.log('Logs directory:', LOGS_DIR);
console.log('API Key set:', !!process.env.HERMES_API_KEY);

// Authentication middleware
app.use((req, res, next) => {
  const token = req.query.token || req.headers['x-api-key'];

  // Public endpoints
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }

  if (!token || token !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
});

// Health check (no auth)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API endpoints
app.get('/api/stats', (req, res) => {
  try {
    if (!fs.existsSync(LOGS_DIR)) {
      return res.json({
        total_logs: 0,
        daily_reports: 0,
        watchdog_runs: 0,
        wayback_recoveries: 0,
        logs_directory: LOGS_DIR,
        error: 'Logs directory does not exist'
      });
    }

    const files = fs.readdirSync(LOGS_DIR);
    res.json({
      total_logs: files.length,
      daily_reports: files.filter(f => f.startsWith('daily-')).length,
      watchdog_runs: files.filter(f => f.startsWith('watchdog-')).length,
      wayback_recoveries: files.filter(f => f.startsWith('wayback-')).length,
      logs_directory: LOGS_DIR
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/logs', (req, res) => {
  try {
    if (!fs.existsSync(LOGS_DIR)) {
      return res.json([]);
    }

    const files = fs.readdirSync(LOGS_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        name: f,
        time: fs.statSync(path.join(LOGS_DIR, f)).mtime
      }))
      .sort((a, b) => b.time - a.time);

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/logs/:filename', (req, res) => {
  try {
    const filepath = path.join(LOGS_DIR, req.params.filename);

    if (!filepath.startsWith(LOGS_DIR)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const content = fs.readFileSync(filepath, 'utf8');
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/latest-report', (req, res) => {
  try {
    if (!fs.existsSync(LOGS_DIR)) {
      return res.json({ content: 'No logs directory' });
    }

    const files = fs.readdirSync(LOGS_DIR)
      .filter(f => f.startsWith('daily-') && f.endsWith('.md'))
      .sort()
      .reverse();

    if (files.length === 0) {
      return res.json({ content: 'No reports yet' });
    }

    const filepath = path.join(LOGS_DIR, files[0]);
    const content = fs.readFileSync(filepath, 'utf8');
    res.json({ content, filename: files[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve dashboard HTML
const dashboardHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🤖 Hermes VPS Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root { --bg: #0f172a; --bg2: #1e293b; --text: #f1f5f9; --brand: #3b82f6; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); }
    header { background: linear-gradient(135deg, var(--brand), #1e3a8a); padding: 2rem; text-align: center; }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .card { background: var(--bg2); padding: 1.5rem; border-radius: 8px; border: 1px solid #334155; }
    .stat-value { font-size: 2.5rem; font-weight: bold; color: var(--brand); }
    .stat-label { font-size: 0.85rem; color: #94a3b8; margin-top: 0.5rem; }
    .logs { max-height: 400px; overflow-y: auto; }
    .log-item { padding: 0.75rem; margin: 0.5rem 0; background: var(--bg); border-left: 3px solid var(--brand); border-radius: 4px; cursor: pointer; }
    .log-item:hover { background: #334155; }
    .log-content { background: var(--bg); padding: 1rem; border-radius: 4px; max-height: 500px; overflow-y: auto; font-family: monospace; font-size: 0.85rem; margin-top: 1rem; white-space: pre-wrap; }
    footer { text-align: center; padding: 2rem; color: #64748b; border-top: 1px solid #334155; margin-top: 2rem; }
  </style>
</head>
<body>
  <header>
    <h1>🤖 Hermes VPS Dashboard</h1>
    <p>Remote monitoring for shemalewiki.online & buscatrans.com</p>
  </header>

  <div class="container">
    <div class="grid">
      <div class="card">
        <h3>📋 Total Logs</h3>
        <div class="stat-value" id="total">-</div>
        <div class="stat-label">files in ~/.hermes/logs/</div>
      </div>
      <div class="card">
        <h3>📊 Daily Reports</h3>
        <div class="stat-value" id="daily">-</div>
        <div class="stat-label">KPI summaries</div>
      </div>
      <div class="card">
        <h3>✅ Watchdog Runs</h3>
        <div class="stat-value" id="watchdog">-</div>
        <div class="stat-label">health checks</div>
      </div>
    </div>

    <div class="card">
      <h2 style="margin-bottom: 1rem;">📈 Latest Report</h2>
      <div id="report" class="log-content">Loading...</div>
    </div>

    <div class="card">
      <h2 style="margin-bottom: 1rem;">📋 Recent Logs</h2>
      <div class="logs" id="logs">Loading...</div>
    </div>
  </div>

  <footer>
    <p>Hermes Agent v0.18 | Last updated: <span id="time">--:--:--</span></p>
  </footer>

  <script>
    const TOKEN = new URLSearchParams(window.location.search).get('token') || localStorage.getItem('hermes_token');

    async function fetch_api(endpoint) {
      const url = new URL(endpoint, window.location.origin);
      url.searchParams.set('token', TOKEN);
      const res = await fetch(url);
      return res.json();
    }

    async function load() {
      const stats = await fetch_api('/api/stats');
      document.getElementById('total').textContent = stats.total_logs;
      document.getElementById('daily').textContent = stats.daily_reports;
      document.getElementById('watchdog').textContent = stats.watchdog_runs;

      const report = await fetch_api('/api/latest-report');
      document.getElementById('report').textContent = report.content;

      const logs = await fetch_api('/api/logs');
      const html = logs.slice(0, 20).map(log => {
        const date = new Date(log.time).toLocaleString();
        return \`<div class="log-item" onclick="loadLog('\${log.name}')">\${date}<br/>\${log.name}</div>\`;
      }).join('');
      document.getElementById('logs').innerHTML = html;

      document.getElementById('time').textContent = new Date().toLocaleTimeString();
    }

    async function loadLog(name) {
      const data = await fetch_api(\`/api/logs/\${name}\`);
      document.getElementById('report').textContent = data.content;
    }

    if (TOKEN) localStorage.setItem('hermes_token', TOKEN);
    load();
    setInterval(load, 30000);
  </script>
</body>
</html>
`;

app.get('/', (req, res) => {
  res.type('text/html').send(dashboardHTML);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Dashboard running on http://YOUR_VPS_IP:${PORT}?token=${API_KEY}\n`);
  console.log(`   Or: https://shemalewiki.online:${PORT}?token=${API_KEY}`);
  console.log(`\n⚠️  CHANGE YOUR API KEY in .env!`);
});

DASHBOARD_EOF

echo ""
echo "✅ Dashboard creado: vps-dashboard.js"
echo ""
echo "📝 Configuración requerida (.env):"
echo ""

cat > .env.example << 'ENV_EOF'
# Hermes VPS Dashboard Config
PORT=3334

# CAMBIAR ESTO A UN TOKEN SEGURO
HERMES_API_KEY=cambiar_a_token_seguro_$(openssl rand -hex 16)

# Auto-detectado:
HERMES_LOGS_DIR=LOGS_DIR_AQUI
EOF

echo "Copia estos valores a tu .env:"
echo "  HERMES_API_KEY=$(openssl rand -hex 16)"
echo "  HERMES_LOGS_DIR=$HERMES_LOGS_DIR"
echo ""
echo "✅ Listo para instalar en el VPS"
