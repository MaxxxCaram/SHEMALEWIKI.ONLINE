#!/usr/bin/env node

/**
 * Hermes Dashboard Server
 * Real-time status, KPIs, and logs visualization
 *
 * Run: node scripts/hermes-dashboard.js
 * Open: http://localhost:3333
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3333;
const HERMES_HOME = path.join(os.homedir(), '.hermes');
const LOGS_DIR = path.join(HERMES_HOME, 'logs');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// ============================================
// API ENDPOINTS
// ============================================

// Get all logs
app.get('/api/logs', (req, res) => {
  try {
    const files = fs.readdirSync(LOGS_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        name: f,
        path: path.join(LOGS_DIR, f),
        time: fs.statSync(path.join(LOGS_DIR, f)).mtime
      }))
      .sort((a, b) => b.time - a.time);

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get log content
app.get('/api/logs/:filename', (req, res) => {
  try {
    const filepath = path.join(LOGS_DIR, req.params.filename);

    // Security: prevent path traversal
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

// Get latest report
app.get('/api/latest-report', (req, res) => {
  try {
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

// Get dashboard stats
app.get('/api/stats', (req, res) => {
  try {
    const files = fs.readdirSync(LOGS_DIR);
    const dailyReports = files.filter(f => f.startsWith('daily-')).length;
    const watchdogReports = files.filter(f => f.startsWith('watchdog-')).length;
    const waybackReports = files.filter(f => f.startsWith('wayback-')).length;

    res.json({
      total_logs: files.length,
      daily_reports: dailyReports,
      watchdog_runs: watchdogReports,
      wayback_recoveries: waybackReports,
      logs_directory: LOGS_DIR
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get configuration status
app.get('/api/config', (req, res) => {
  try {
    const configPath = path.join(HERMES_HOME, 'hermes-config.json');

    let config = {
      status: 'not_initialized',
      integrations: {}
    };

    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      config = JSON.parse(content);
    }

    // Check env variables (don't expose values, just presence)
    config.environment = {
      VERCEL_TOKEN: !!process.env.VERCEL_TOKEN,
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
      GITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
      GSC_API_KEY: !!process.env.GSC_API_KEY
    };

    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// STATIC DASHBOARD HTML
// ============================================

const dashboardHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🤖 Hermes Dashboard</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --bg: #0f172a;
      --bg2: #1e293b;
      --bg3: #334155;
      --text: #f1f5f9;
      --text2: #cbd5e1;
      --brand: #3b82f6;
      --success: #10b981;
      --warning: #f59e0b;
      --error: #ef4444;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }

    header {
      background: linear-gradient(135deg, var(--brand) 0%, #1e3a8a 100%);
      padding: 2rem;
      text-align: center;
      border-bottom: 2px solid var(--brand);
    }

    header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    header p {
      color: rgba(255,255,255,0.8);
      font-size: 0.9rem;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .card {
      background: var(--bg2);
      border: 1px solid var(--bg3);
      border-radius: 8px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .card:hover {
      border-color: var(--brand);
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
    }

    .card h3 {
      font-size: 0.9rem;
      color: var(--text2);
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--brand);
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.85rem;
      color: var(--text2);
    }

    .status-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 600;
      margin: 0.25rem 0.25rem 0.25rem 0;
    }

    .status-badge.active {
      background: rgba(16, 185, 129, 0.2);
      color: var(--success);
      border: 1px solid var(--success);
    }

    .status-badge.inactive {
      background: rgba(239, 68, 68, 0.2);
      color: var(--error);
      border: 1px solid var(--error);
    }

    .section {
      margin-bottom: 2rem;
    }

    .section h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--bg3);
    }

    .logs-container {
      max-height: 500px;
      overflow-y: auto;
      background: var(--bg2);
      border: 1px solid var(--bg3);
      border-radius: 8px;
      padding: 1rem;
    }

    .log-item {
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      background: var(--bg);
      border-left: 3px solid var(--brand);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .log-item:hover {
      background: var(--bg3);
      transform: translateX(4px);
    }

    .log-time {
      font-size: 0.8rem;
      color: var(--text2);
      display: block;
      margin-bottom: 0.25rem;
    }

    .log-name {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text);
    }

    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }

    .modal.active {
      display: flex;
    }

    .modal-content {
      background: var(--bg2);
      border: 1px solid var(--bg3);
      border-radius: 8px;
      max-width: 80vw;
      max-height: 80vh;
      overflow: auto;
      padding: 2rem;
      position: relative;
    }

    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--error);
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-weight: 600;
    }

    .modal-close:hover {
      opacity: 0.8;
    }

    .log-content {
      background: var(--bg);
      border: 1px solid var(--bg3);
      border-radius: 4px;
      padding: 1rem;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 60vh;
      overflow-y: auto;
    }

    .loading {
      text-align: center;
      color: var(--text2);
      padding: 2rem;
    }

    .spinner {
      display: inline-block;
      width: 30px;
      height: 30px;
      border: 3px solid var(--bg3);
      border-top-color: var(--brand);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .env-status {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .env-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: var(--bg);
      border-radius: 4px;
      border-left: 3px solid var(--bg3);
    }

    .env-item.active {
      border-left-color: var(--success);
    }

    .env-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--text2);
    }

    .env-item.active .env-dot {
      background: var(--success);
    }

    .refresh-btn {
      background: var(--brand);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .refresh-btn:hover {
      opacity: 0.8;
      transform: translateY(-2px);
    }

    .refresh-btn.loading {
      opacity: 0.6;
      cursor: not-allowed;
    }

    footer {
      text-align: center;
      padding: 2rem;
      color: var(--text2);
      border-top: 1px solid var(--bg3);
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <header>
    <h1>🤖 Hermes Dashboard</h1>
    <p>Real-time status & KPI monitoring | shemalewiki.online & buscatrans.com</p>
  </header>

  <div class="container">
    <!-- Stats Grid -->
    <div class="grid">
      <div class="card">
        <h3>📋 Total Logs</h3>
        <div class="stat-value" id="total-logs">-</div>
        <div class="stat-label">files in ~/.hermes/logs/</div>
      </div>

      <div class="card">
        <h3>📊 Daily Reports</h3>
        <div class="stat-value" id="daily-reports">-</div>
        <div class="stat-label">12 PM KPI reports</div>
      </div>

      <div class="card">
        <h3>✅ Watchdog Runs</h3>
        <div class="stat-value" id="watchdog-runs">-</div>
        <div class="stat-label">6 AM health checks</div>
      </div>

      <div class="card">
        <h3>📚 Wayback Recoveries</h3>
        <div class="stat-value" id="wayback-recoveries">-</div>
        <div class="stat-label">Sunday profile restores</div>
      </div>
    </div>

    <!-- Configuration -->
    <div class="section">
      <h2>⚙️ Configuration Status</h2>
      <div class="grid">
        <div class="card">
          <h3>🔗 Integrations</h3>
          <div id="integrations" class="loading">
            <div class="spinner"></div>
          </div>
        </div>

        <div class="card">
          <h3>🔑 Environment Variables</h3>
          <div id="environment" class="env-status">
            <div class="env-item">
              <div class="env-dot"></div>
              <span>Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Latest Report -->
    <div class="section">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h2>📈 Latest Daily Report</h2>
        <button class="refresh-btn" onclick="loadLatestReport()">🔄 Refresh</button>
      </div>
      <div id="latest-report" class="loading">
        <div style="text-align: center;">
          <div class="spinner"></div>
          <p style="margin-top: 1rem;">Loading latest report...</p>
        </div>
      </div>
    </div>

    <!-- Recent Logs -->
    <div class="section">
      <h2>📋 Recent Logs</h2>
      <div class="logs-container" id="logs-list">
        <div class="loading">
          <div class="spinner"></div>
          <p style="margin-top: 1rem;">Loading logs...</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Log Viewer Modal -->
  <div class="modal" id="logModal">
    <div class="modal-content">
      <button class="modal-close" onclick="closeLogModal()">Close ✕</button>
      <h3 id="logModalTitle" style="margin-bottom: 1rem;"></h3>
      <div id="logContent" class="log-content"></div>
    </div>
  </div>

  <footer>
    <p>Hermes Agent v0.18 • Last updated: <span id="footer-time">--:--:--</span></p>
  </footer>

  <script>
    // Load all data
    async function loadDashboard() {
      await loadStats();
      await loadConfig();
      await loadLatestReport();
      await loadLogs();
      updateTime();
    }

    async function loadStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();

        document.getElementById('total-logs').textContent = data.total_logs;
        document.getElementById('daily-reports').textContent = data.daily_reports;
        document.getElementById('watchdog-runs').textContent = data.watchdog_runs;
        document.getElementById('wayback-recoveries').textContent = data.wayback_recoveries;
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }

    async function loadConfig() {
      try {
        const res = await fetch('/api/config');
        const config = await res.json();

        // Integrations
        const integrationsHTML = Object.entries(config.integrations || {})
          .map(([key, val]) => {
            const status = val ? 'active' : 'inactive';
            return \`<span class="status-badge \${status}">\${key}: \${val ? '✓' : '✗'}</span>\`;
          })
          .join('');
        document.getElementById('integrations').innerHTML = integrationsHTML || '<p>No integrations configured</p>';

        // Environment
        const envHTML = Object.entries(config.environment || {})
          .map(([key, val]) => {
            const status = val ? 'active' : '';
            return \`
              <div class="env-item \${status}">
                <div class="env-dot"></div>
                <span>\${key}</span>
              </div>
            \`;
          })
          .join('');
        document.getElementById('environment').innerHTML = envHTML;
      } catch (error) {
        console.error('Error loading config:', error);
      }
    }

    async function loadLatestReport() {
      try {
        const res = await fetch('/api/latest-report');
        const data = await res.json();

        const content = data.content
          .split('\\n')
          .map(line => {
            if (line.startsWith('#')) {
              return \`<strong>\${line}</strong>\`;
            }
            return line;
          })
          .join('\\n');

        document.getElementById('latest-report').innerHTML =
          \`<pre style="background: var(--bg); padding: 1rem; border-radius: 4px; overflow-x: auto;">\${content}</pre>\`;
      } catch (error) {
        document.getElementById('latest-report').innerHTML =
          \`<p style="color: var(--error);">No reports available yet</p>\`;
      }
    }

    async function loadLogs() {
      try {
        const res = await fetch('/api/logs');
        const logs = await res.json();

        if (logs.length === 0) {
          document.getElementById('logs-list').innerHTML =
            '<p style="color: var(--text2);">No logs yet. Run hermes-checklist.sh first.</p>';
          return;
        }

        const html = logs.slice(0, 20).map(log => {
          const date = new Date(log.time);
          const timeStr = date.toLocaleString();
          return \`
            <div class="log-item" onclick="loadLogContent('\${log.name}')">
              <span class="log-time">\${timeStr}</span>
              <span class="log-name">\${log.name}</span>
            </div>
          \`;
        }).join('');

        document.getElementById('logs-list').innerHTML = html;
      } catch (error) {
        console.error('Error loading logs:', error);
        document.getElementById('logs-list').innerHTML =
          \`<p style="color: var(--error);">Error loading logs: \${error.message}</p>\`;
      }
    }

    async function loadLogContent(filename) {
      try {
        const res = await fetch(\`/api/logs/\${filename}\`);
        const data = await res.json();

        document.getElementById('logModalTitle').textContent = filename;
        document.getElementById('logContent').textContent = data.content;
        document.getElementById('logModal').classList.add('active');
      } catch (error) {
        alert('Error loading log: ' + error.message);
      }
    }

    function closeLogModal() {
      document.getElementById('logModal').classList.remove('active');
    }

    function updateTime() {
      const now = new Date().toLocaleTimeString();
      document.getElementById('footer-time').textContent = now;
    }

    // Auto-refresh every 30 seconds
    setInterval(() => {
      loadStats();
      loadLatestReport();
      updateTime();
    }, 30000);

    // Initial load
    loadDashboard();
  </script>
</body>
</html>
`;

// Serve dashboard
app.get('/', (req, res) => {
  res.type('text/html').send(dashboardHTML);
});

// Start server
app.listen(PORT, () => {
  console.log('\n');
  console.log('╔════════════════════════════════════════╗');
  console.log('║  🤖 Hermes Dashboard Started          ║');
  console.log('║                                        ║');
  console.log(`║  📂 Open: http://localhost:${PORT}        ║`);
  console.log('║                                        ║');
  console.log('║  Press Ctrl+C to stop                  ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('\n');
});

module.exports = app;
