/**
 * POST /api/update-profile — Update existing profile using service_role key
 * Body: { userId, profile: { name, email, phone, ... } }
 * Requires: SUPABASE_SERVICE_ROLE_KEY env var on Vercel
 */

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, profile } = req.body || {};
    if (!userId || !profile) return res.status(400).json({ error: 'Missing userId or profile' });

    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) return res.status(500).json({ error: 'Server misconfiguration — SERVICE_ROLE_KEY missing' });

    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';

    // Update profile
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
