const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dXpwc3d4emVuZ3FvcXF3dHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NzYxMDksImV4cCI6MjA5NDM1MjEwOX0.IFXPHYPWk2fEznegGjDXUVnZ0jhJXRzI4MkWVM-uPpU';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { search, limit, offset, filter } = req.query || {};

        let query = `${SUPABASE_URL}/rest/v1/profiles?select=*,photos(*)`;

        if (filter === 'approved') {
            query += (query.includes('?') ? '&' : '?') + 'status=eq.approved';
        } else if (filter === 'rejected') {
            query += (query.includes('?') ? '&' : '?') + 'status=eq.rejected';
        }

        if (search) {
            const orClause = `(name.ilike.%${search}%,location.ilike.%${search}%,bio.ilike.%${search}%)`;
            query += (query.includes('?') ? '&' : '?') + `or=${encodeURIComponent(orClause)}`;
        }

        const limitVal = parseInt(limit, 10) || 50;
        const offsetVal = parseInt(offset, 10) || 0;
        query += (query.includes('?') ? '&' : '?') + `limit=${limitVal}&offset=${offsetVal}`;

        const r = await fetch(query, {
            headers: {
                'apikey': KEY,
                'Authorization': `Bearer ${KEY}`
            }
        });

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