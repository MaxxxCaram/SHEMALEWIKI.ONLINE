const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', hermes: 'running', supabase: 'connected' }));
  } else if (pathname === '/api/governance') {
    res.writeHead(200);
    res.end(JSON.stringify({ level: 'LEVEL_1', trustScore: 100, operational: true }));
  } else if (pathname === '/api/moderation/profile' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({ profileId: '123', approved: true }));
  } else if (pathname === '/api/verification/content' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({ contentId: '456', verified: true, safe: true }));
  } else if (pathname === '/api/risk/score' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({ userId: '789', riskScore: Math.round(Math.random() * 50) }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3000, '0.0.0.0', () => {
  console.log('✓ Hermes Ready on port 3000');
});
