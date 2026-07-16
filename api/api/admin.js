import crypto from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

const SESSION_TTL = 3600 * 1000 * 24; // 24 hours

function generateToken() {
  const ts = Date.now();
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET)
    .update(`admin:${ts}`)
    .digest('hex');
  return `admin.${ts}.${hmac}`;
}

function verifyToken(tokenStr) {
  if (!tokenStr || typeof tokenStr !== 'string') return false;
  const parts = tokenStr.split('.');
  if (parts.length !== 3) return false;
  
  const [role, ts, sig] = parts;
  if (role !== 'admin') return false;

  const expected = crypto.createHmac('sha256', ADMIN_SECRET)
    .update(`admin:${ts}`)
    .digest('hex');

  if (sig !== expected) return false;

  const age = Date.now() - parseInt(ts, 10);
  return age < SESSION_TTL;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-secret');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!SERVICE_KEY || !ADMIN_SECRET) return res.status(500).json({ error: 'Server configuration missing' });

  const headers = {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  const originalPath = req.headers['x-matched-path'] || req.url || '';
  const isLoginPath = originalPath.includes('/login') || (req.method === 'POST' && req.body && req.body.secret && !req.body.profileId && !req.body.action);

  if (req.method === 'POST' && isLoginPath) {
    try {
      const { secret } = req.body || {};
      if (!secret) {
        return res.status(400).json({ error: 'Secret required' });
      }
      if (secret !== ADMIN_SECRET) {
        return res.status(401).json({ error: 'Invalid secret' });
      }
      const token = generateToken();
      return res.status(200).json({ success: true, token, expires: new Date(Date.now() + SESSION_TTL).toISOString() });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'GET') {
    if (isLoginPath) {
      return res.status(405).json({ error: 'Method not allowed on login endpoint' });
    }

    const authHeader = req.headers.authorization || '';
    const secretHeader = req.headers['x-admin-secret'] || '';

    let isAuthed = false;
    if (authHeader.startsWith('Bearer ')) {
      isAuthed = verifyToken(authHeader.substring(7));
    } else if (secretHeader) {
      isAuthed = (secretHeader === ADMIN_SECRET);
    }

    if (!isAuthed) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*,photos(*)&order=created_at.desc`, { headers });
      if (!r.ok) {
        const errText = await r.text();
        return res.status(500).json({ error: `Supabase error: ${errText}` });
      }
      const data = await r.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    const authHeader = req.headers.authorization || '';
    const secretHeader = req.headers['x-admin-secret'] || '';

    let isAuthed = false;
    if (authHeader.startsWith('Bearer ')) {
      isAuthed = verifyToken(authHeader.substring(7));
    } else if (secretHeader) {
      isAuthed = (secretHeader === ADMIN_SECRET);
    }

    if (!isAuthed) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { profileId, action, secret: actionSecret } = req.body || {};

      if (!profileId || !action) {
        return res.status(400).json({ error: 'profileId and action required' });
      }

      if (action === 'approve') {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(profileId)}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ status: 'approved' })
        });
        if (!r.ok) return res.status(500).json({ error: await r.text() });
        return res.status(200).json({ success: true });
      }

      if (action === 'reject') {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(profileId)}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ status: 'rejected' })
        });
        if (!r.ok) return res.status(500).json({ error: await r.text() });
        return res.status(200).json({ success: true });
      }

      if (action === 'delete') {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(profileId)}`, {
          method: 'DELETE',
          headers
        });
        if (!r.ok) return res.status(500).json({ error: await r.text() });
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: 'Invalid action' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
