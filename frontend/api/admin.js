// Admin Panel — auth server-side, password never sent to frontend
// Uses a shared secret verified by the server, returns JWT-like token
// The secret is configurable via Vercel env: ADMIN_SECRET

import { createHmac, randomBytes } from 'crypto';

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24h

function generateToken() {
  const rand = randomBytes(32).toString('hex');
  const ts = Date.now().toString();
  const hmac = createHmac('sha256', ADMIN_SECRET).update(`${rand}:${ts}`).digest('hex');
  return `${rand}.${ts}.${hmac}`;
}

function verifyToken(tokenStr) {
  if (!tokenStr || typeof tokenStr !== 'string') return false;
  const parts = tokenStr.split('.');
  if (parts.length !== 3) return false;
  const [rand, ts, hmac] = parts;
  const expected = createHmac('sha256', ADMIN_SECRET).update(`${rand}:${ts}`).digest('hex');
  if (hmac !== expected) return false;
  const age = Date.now() - parseInt(ts);
  return age < SESSION_TTL; // expires after 24h
}

const ALLOWED_ORIGINS = ['https://shemalewiki.online', 'https://buscatrans.com'];

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-secret');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SERVICE_KEY) {
    return res.status(500).json({ error: 'Server config error: SERVICE_KEY missing' });
  }

  const headers = {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  // ====== GET /api/admin — list profiles (authenticated) ======
  if (req.method === 'GET') {
    // Check auth
    const authHeader = req.headers.authorization || '';
    const secretHeader = req.headers['x-admin-secret'] || '';

    if (!authHeader && !secretHeader) {
      return res.status(401).json({ error: 'Authentication required. POST to /api/admin/login first.' });
    }

    let validAuth = false;
    if (authHeader.startsWith('Bearer ') && verifyToken(authHeader.substring(7))) {
      validAuth = true;
    } else if (secretHeader === ADMIN_SECRET) {
      validAuth = true;
    }

    if (!validAuth) {
      return res.status(403).json({ error: 'Invalid authentication' });
    }

    try {
      const filter = req.query?.status || '';
      let url = `${SUPABASE_URL}/rest/v1/profiles?select=*&order=created_at.desc&limit=50`;
      if (filter) url += `&status=eq.${filter}`;

      const resp = await fetch(url, { headers: { ...headers, 'Prefer': 'return=representation' } });
      if (!resp.ok) {
        const err = await resp.text();
        return res.status(resp.status).json({ error: err });
      }
      const profiles = await resp.json();
      return res.status(200).json({ profiles });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ====== POST /api/admin/login — authenticate ======
  // Distinguish login POST from action POST by body shape:
  // login body = {secret: string} (no profileId, no action)
  // action body = {profileId, action}
  if (req.method === 'POST') {
    const body = req.body || {};
    // === LOGIN ===
    if (body.secret && !body.profileId && !body.action) {
      try {
        const { secret } = body;
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

    // === ACTION (approve/reject/delete) — authenticated ===
    const authHeader = req.headers.authorization || '';
    const secretHeader = req.headers['x-admin-secret'] || '';

    let validAuth = false;
    if (authHeader.startsWith('Bearer ') && verifyToken(authHeader.substring(7))) {
      validAuth = true;
    } else if (secretHeader === ADMIN_SECRET) {
      validAuth = true;
    }

    if (!validAuth) {
      return res.status(403).json({ error: 'Authentication required' });
    }

    try {
      const { profileId, action, secret: actionSecret } = body;

      if (!profileId || !action) {
        return res.status(400).json({ error: 'profileId and action required' });
      }

      // Require secret for destructive actions
      if (action === 'delete') {
        if (actionSecret !== ADMIN_SECRET) {
          return res.status(403).json({ error: 'Secret required to delete' });
        }
        const resp = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${profileId}`, {
          method: 'DELETE',
          headers,
        });
        if (!resp.ok) {
          const err = await resp.text();
          return res.status(resp.status).json({ error: err });
        }
        return res.status(200).json({ success: true, action: 'deleted' });
      }

      const status = action === 'approve' ? 'approved' : 'rejected';
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${profileId}`, {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=representation' },
        body: JSON.stringify({ cam_chat: status }),
      });
      if (!resp.ok) {
        const err = await resp.text();
        return res.status(resp.status).json({ error: err });
      }
      const data = await resp.json();
      return res.status(200).json({ success: true, action: status, profile: data[0] });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
