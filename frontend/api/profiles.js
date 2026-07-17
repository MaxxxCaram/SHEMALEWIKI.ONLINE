const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dXpwc3d4emVuZ3FvcXF3dHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NzYxMDksImV4cCI6MjA5NDM1MjEwOX0.IFXPHYPWk2fEznegGjDXUVnZ0jhJXRzI4MkWVM-uPpU';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { filter, search, limit, offset } = req.query || {};

    // featured=true: hardcodeados los 8 perfiles con fotos Storage
    if (filter === 'featured') {
        const storageIds = ['2761','1670','1673','1674','1676','1677','1691','1692'];
        const ids = storageIds.map(encodeURIComponent).join(',');
        const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*,photos(photo_url,local_path)&id=in.(${ids})&limit=12`, {
            headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
        });
        const data = await r.json();
        return res.status(200).json(Array.isArray(data) ? data : []);
    }

    // Query normal
    let query = `${SUPABASE_URL}/rest/v1/profiles?select=*,photos(*)`;
    
    if (search) {
        query += `&or=(name.ilike.*${search}*,location.ilike.*${search}*,bio.ilike.*${search}*)`;
    }
    query += `&limit=${parseInt(limit) || 50}`;

    const r = await fetch(query, { headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` } });
    const data = await r.json();
    return res.status(200).json(data);
}