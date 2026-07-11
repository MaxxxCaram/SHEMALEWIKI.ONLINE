// Login endpoint - generates session token from email+password
const crypto = require('crypto');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Server config error' });
  }

  // Fetch profile from Supabase
  const headers = {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?select=id,name,email,password&or=email.eq.${encodeURIComponent(email)},name.eq.${encodeURIComponent(email)}`,
      { method: 'GET', headers }
    );

    if (!resp.ok) {
      return res.status(500).json({ error: 'Database error' });
    }

    const profiles = await resp.json();
    if (!profiles || profiles.length === 0 || !profiles[0].password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const profile = profiles[0];
    if (profile.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate session token
    const secret = process.env.ADMIN_SECRET || 'CHANGE_ME_SETUP_ADMIN_SECRET';
    const ts = Date.now();
    const sig = crypto.createHmac('sha256', secret)
      .update(`${profile.id}:${ts}`)
      .digest('hex');
    const token = `${profile.id}.${ts}.${sig}`;

    return res.json({
      success: true,
      token,
      profile: { id: profile.id, name: profile.name, email: profile.email },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Login failed' });
  }
}
