import crypto from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!SERVICE_KEY) return res.status(500).json({ error: 'Server config error' });

  try {
    if (req.method === 'DELETE') {
      const { photoId } = req.query || {};
      if (!photoId) return res.status(400).json({ error: 'photoId required' });

      const getRes = await fetch(
        `${SUPABASE_URL}/rest/v1/photos?id=eq.${photoId}&select=*`,
        { headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` } }
      );
      if (!getRes.ok) {
        const errText = await getRes.text();
        return res.status(500).json({ error: errText });
      }
      const photos = await getRes.json();
      if (photos.length === 0) {
        return res.status(404).json({ error: 'Photo not found' });
      }

      const photoProfileId = photos[0].profile_id;
      if (!verifyUserToken(req.headers, photoProfileId)) {
        return res.status(403).json({ error: 'Forbidden: You do not own this photo or have an invalid session' });
      }

      for (const photo of photos) {
        if (photo.local_path) {
          await fetch(
            `${SUPABASE_URL}/storage/v1/object/profile-photos/${photo.local_path}`,
            { method: 'DELETE', headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` } }
          );
        }
      }

      const delRes = await fetch(
        `${SUPABASE_URL}/rest/v1/photos?id=eq.${photoId}`,
        {
          method: 'DELETE',
          headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` },
        }
      );
      if (!delRes.ok) {
        const errText = await delRes.text();
        return res.status(500).json({ error: errText });
      }
      return res.status(200).json({ deleted: photoId });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { profile_id, photo_url, photo_id, action } = body;

      if (action === 'set-cover') {
        if (!profile_id || !photo_id) {
          return res.status(400).json({ error: 'profile_id and photo_id required' });
        }

        if (!verifyUserToken(req.headers, profile_id)) {
          return res.status(403).json({ error: 'Forbidden: Invalid or missing session token' });
        }

        await fetch(
          `${SUPABASE_URL}/rest/v1/photos?profile_id=eq.${encodeURIComponent(profile_id)}&local_path=eq.cover`,
          {
            method: 'PATCH',
            headers: {
              'apikey': SERVICE_KEY,
              'Authorization': `Bearer ${SERVICE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({ local_path: '' }),
          }
        );

        const setRes = await fetch(
          `${SUPABASE_URL}/rest/v1/photos?id=eq.${photo_id}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': SERVICE_KEY,
              'Authorization': `Bearer ${SERVICE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation',
            },
            body: JSON.stringify({ local_path: 'cover' }),
          }
        );

        if (!setRes.ok) {
          const errText = await setRes.text();
          return res.status(500).json({ error: errText });
        }

        const updated = await setRes.json();
        return res.status(200).json({ cover: updated[0] });
      }

      if (!profile_id || !photo_url) {
        return res.status(400).json({ error: 'profile_id and photo_url required' });
      }

      if (!verifyUserToken(req.headers, profile_id)) {
        return res.status(403).json({ error: 'Forbidden: Invalid or missing session token' });
      }

      const maxIdRes = await fetch(
        `${SUPABASE_URL}/rest/v1/photos?select=id&order=id.desc&limit=1`,
        { headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` } }
      );
      let nextId = 1;
      if (maxIdRes.ok) {
        const rows = await maxIdRes.json();
        if (rows.length > 0) nextId = (rows[0].id || 0) + 1;
      }

      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/photos`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          id: nextId,
          profile_id,
          photo_url,
        }),
      });

      if (!insertRes.ok) {
        const errText = await insertRes.text();
        return res.status(500).json({ error: errText });
      }

      const inserted = await insertRes.json();
      return res.status(200).json({ photo: inserted[0] });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('manage-photos error:', err);
    return res.status(500).json({ error: err.message });
  }
}
