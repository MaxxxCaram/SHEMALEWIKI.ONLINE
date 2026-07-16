import crypto from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const ALLOWED_ORIGINS = ['https://shemalewiki.online', 'https://buscatrans.com'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const MAGIC_BYTES = {
  'FFD8FF': 'image/jpeg',
  '89504E47': 'image/png',
  '52494646': 'image/webp',
  '47494638': 'image/gif',
};

function getMagicByteClass(buffer) {
  if (buffer.length < 4) return null;
  const hex = buffer.slice(0, 4).toString('hex').toUpperCase();
  for (const [magic, type] of Object.entries(MAGIC_BYTES)) {
    if (hex.startsWith(magic)) return type;
  }
  return null;
}

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

  const SESSION_TTL = 30 * 24 * 60 * 60 * 1000;
  const age = Date.now() - parseInt(ts, 10);
  return age < SESSION_TTL;
}

function parseMultipart(buffer, boundary) {
  const parts = [];
  const str = buffer.toString('binary');
  const boundaryMarker = '--' + boundary;
  const sections = str.split(boundaryMarker);
  
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    if (section.startsWith('--')) break;
    
    const headerEnd = section.indexOf('\r\n\r\n');
    if (headerEnd === -1) continue;
    
    const headers = section.substring(0, headerEnd);
    const bodyStart = headerEnd + 4;
    let body = section.substring(bodyStart);
    
    if (body.endsWith('\r\n')) body = body.substring(0, body.length - 2);
    
    const nameMatch = headers.match(/name="([^"]+)"/);
    const filenameMatch = headers.match(/filename="([^"]+)"/);
    const contentTypeMatch = headers.match(/Content-Type:\s*(.+)/i);
    
    if (!nameMatch) continue;
    
    const fieldName = nameMatch[1];
    const filename = filenameMatch ? filenameMatch[1] : null;
    const contentType = contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream';
    
    const bodyBuffer = Buffer.from(body, 'binary');
    parts.push({ fieldName, filename, contentType, data: bodyBuffer });
  }
  
  return parts;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!SERVICE_KEY) return res.status(500).json({ error: 'Server config error: SERVICE_KEY missing' });

  try {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
    }

    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) return res.status(400).json({ error: 'No boundary found' });
    const boundary = boundaryMatch[1].replace(/^["']|["']$/g, '');

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyBuffer = Buffer.concat(chunks);

    if (bodyBuffer.length === 0) return res.status(400).json({ error: 'Empty body' });

    const parts = parseMultipart(bodyBuffer, boundary);
    let profileId = null;
    const files = [];
    
    for (const part of parts) {
      if (part.fieldName === 'profile_id' && !part.filename) {
        profileId = part.data.toString('utf-8').trim();
      } else if ((part.fieldName === 'files' || part.fieldName === 'files[]') && part.filename) {
        files.push(part);
      }
    }

    if (!profileId) return res.status(400).json({ error: 'profile_id is required' });

    if (!verifyUserToken(req.headers, profileId)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or missing session token' });
    }

    if (files.length === 0) return res.status(400).json({ error: 'No files provided' });

    const maxIdRes = await fetch(
      `${SUPABASE_URL}/rest/v1/photos?select=id&order=id.desc&limit=1`,
      { headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` } }
    );
    let nextId = 1;
    if (maxIdRes.ok) {
      const rows = await maxIdRes.json();
      if (rows.length > 0) nextId = (rows[0].id || 0) + 1;
    }

    const results = [];

    for (const file of files) {
      if (file.data.length > MAX_FILE_SIZE) {
        results.push({ error: `File too large`, filename: file.filename });
        continue;
      }

      const mimeType = getMagicByteClass(file.data);
      if (!mimeType) {
        results.push({ error: 'Invalid image file (magic bytes check failed)', filename: file.filename });
        continue;
      }

      const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
      const safeExt = ext[mimeType] || 'jpg';
      const uuid = Math.random().toString(36).substring(2, 15);
      const safeFilename = `${uuid}.${safeExt}`;
      const storagePath = `${profileId}/${nextId}_${safeFilename}`;

      const uploadRes = await fetch(
        `${SUPABASE_URL}/storage/v1/object/profile-photos/${storagePath}`,
        {
          method: 'POST',
          headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Content-Type': mimeType,
            'x-upsert': 'true',
          },
          body: file.data,
        }
      );

      if (!uploadRes.ok) {
        results.push({ error: 'Upload failed', filename: file.filename });
        continue;
      }

      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/profile-photos/${storagePath}`;

      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/photos`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          id: nextId,
          profile_id: profileId,
          photo_url: publicUrl,
          local_path: storagePath,
        }),
      });

      if (!insertRes.ok) {
        await fetch(
          `${SUPABASE_URL}/storage/v1/object/profile-photos/${storagePath}`,
          { method: 'DELETE', headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` } }
        );
        results.push({ error: `DB insert failed`, filename: file.filename });
        continue;
      }

      results.push({ id: nextId, url: publicUrl, path: storagePath });
      nextId++;
    }

    return res.status(200).json({ photos: results, count: results.filter(r => r.url).length, total: files.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
