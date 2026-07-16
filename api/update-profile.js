import crypto from 'crypto';

function verifyUserToken(headers, userId) {
  const authHeader = headers.authorization || '';
  let tokenStr = '';
  if (authHeader.startsWith('Bearer ')) {
    tokenStr = authHeader.substring(7);
  } else {
    return false;
  }

  if (!tokenStr || typeof tokenStr !== 'string') return false;
  const parts = tokenStr.split('.');
  if (parts.length !== 3) return false;
  const [tokenUserId, ts, sig] = parts;
  if (tokenUserId !== userId) return false;

  const ADMIN_SECRET = process.env.ADMIN_SECRET;
  if (!ADMIN_SECRET) return false;

  const expected = crypto.createHmac('sha256', ADMIN_SECRET)
    .update(`${userId}:${ts}`)
    .digest('hex');

  if (sig !== expected) return false;

  const SESSION_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
  const age = Date.now() - parseInt(ts, 10);
  return age < SESSION_TTL;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, profile } = req.body || {};
    if (!userId || !profile) return res.status(400).json({ error: 'Missing userId or profile' });

    if (!verifyUserToken(req.headers, userId)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or missing session token' });
    }

    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    if (!key) return res.status(500).json({ error: 'Server misconfiguration — SERVICE_ROLE_KEY missing' });

    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';

    const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(profile)
    });

    if (!r.ok) {
      const err = await r.text();
      return res.status(r.status).json({ error: `Supabase error: ${err}` });
    }

    const data = await r.json();
    return res.status(200).json({ success: true, profile: data[0] });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
