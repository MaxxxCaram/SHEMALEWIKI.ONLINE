// Vercel Serverless Function: /api/admin
// GET: list all profiles (newest first) with approval status
// POST: approve/reject a profile (sets cam_chat as status marker)

const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const headers = {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  // GET: list profiles
  if (req.method === 'GET') {
    try {
      const filter = req.query?.status || '';
      let url = `${SUPABASE_URL}/rest/v1/profiles?select=*&order=created_at.desc&limit=50`;
      
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

  // POST: approve/reject
  if (req.method === 'POST') {
    try {
      const { profileId, action } = req.body || {}; // action: 'approve' | 'reject' | 'delete'
      
      if (!profileId || !action) {
        return res.status(400).json({ error: 'profileId and action required' });
      }

      if (action === 'delete') {
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

      // Approve or reject: set cam_chat as status marker
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
