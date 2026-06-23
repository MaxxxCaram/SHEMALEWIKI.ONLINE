// Vercel Serverless Function: POST /api/upload-photos
// Accepts multipart/form-data with photo files
// Uses service_role key to bypass Storage RLS
// Uploads to profile-photos bucket + inserts into photos table
// Returns [{url, path, id}]

const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Simple multipart parser (no dependencies needed)
function parseMultipart(buffer, boundary) {
  const parts = [];
  const str = buffer.toString('binary');
  const boundaryMarker = '--' + boundary;
  const sections = str.split(boundaryMarker);
  
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    if (section.startsWith('--')) break; // final boundary
    
    const headerEnd = section.indexOf('\r\n\r\n');
    if (headerEnd === -1) continue;
    
    const headers = section.substring(0, headerEnd);
    const bodyStart = headerEnd + 4;
    let body = section.substring(bodyStart);
    
    // Trim trailing \r\n before next boundary
    if (body.endsWith('\r\n')) body = body.substring(0, body.length - 2);
    
    // Extract filename and field name
    const nameMatch = headers.match(/name="([^"]+)"/);
    const filenameMatch = headers.match(/filename="([^"]+)"/);
    const contentTypeMatch = headers.match(/Content-Type:\s*(.+)/i);
    
    if (!nameMatch) continue;
    
    const fieldName = nameMatch[1];
    const filename = filenameMatch ? filenameMatch[1] : null;
    const contentType = contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream';
    
    // Convert binary string back to Buffer
    const bodyBuffer = Buffer.from(body, 'binary');
    
    parts.push({ fieldName, filename, contentType, data: bodyBuffer });
  }
  
  return parts;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!SERVICE_KEY) {
    return res.status(500).json({ error: 'Server config error: SERVICE_KEY missing' });
  }

  try {
    const contentType = req.headers['content-type'] || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
    }

    // Extract boundary
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) {
      return res.status(400).json({ error: 'No boundary found in Content-Type' });
    }
    const boundary = boundaryMatch[1].replace(/^["']|["']$/g, '');

    // Collect raw body chunks
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyBuffer = Buffer.concat(chunks);

    if (bodyBuffer.length === 0) {
      return res.status(400).json({ error: 'Empty body' });
    }

    // Parse multipart
    const parts = parseMultipart(bodyBuffer, boundary);
    
    // Find profile_id field and file parts
    let profileId = null;
    const files = [];
    
    for (const part of parts) {
      if (part.fieldName === 'profile_id' && !part.filename) {
        profileId = part.data.toString('utf-8').trim();
      } else if ((part.fieldName === 'files' || part.fieldName === 'files[]') && part.filename) {
        files.push(part);
      }
    }

    if (!profileId) {
      return res.status(400).json({ error: 'profile_id is required' });
    }

    if (files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    // Get next photo ID from photos table
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
      const safeName = (file.filename || 'photo.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${profileId}/${Date.now()}_${nextId}_${safeName}`;

      // Upload to Supabase Storage with service_role key
      const uploadRes = await fetch(
        `${SUPABASE_URL}/storage/v1/object/profile-photos/${storagePath}`,
        {
          method: 'POST',
          headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Content-Type': file.contentType,
            'x-upsert': 'true',
          },
          body: file.data,
        }
      );

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        results.push({ error: errText, filename: file.filename });
        continue;
      }

      // Generate public URL
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/profile-photos/${storagePath}`;

      // Insert into photos table
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
        const errText = await insertRes.text();
        // Delete storage file if insert failed
        await fetch(
          `${SUPABASE_URL}/storage/v1/object/profile-photos/${storagePath}`,
          { method: 'DELETE', headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` } }
        );
        results.push({ error: `DB insert failed: ${errText}`, filename: file.filename });
        continue;
      }

      results.push({
        id: nextId,
        url: publicUrl,
        path: storagePath,
        filename: file.filename,
      });

      nextId++;
    }

    const succeeded = results.filter(r => r.url);
    
    return res.status(200).json({
      photos: results,
      count: succeeded.length,
      total: files.length,
    });

  } catch (err) {
    console.error('upload-photos error:', err);
    return res.status(500).json({ error: err.message });
  }
}
