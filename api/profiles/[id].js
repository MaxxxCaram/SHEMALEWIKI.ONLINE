const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dXpwc3d4emVuZ3FvcXF3dHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NzYxMDksImV4cCI6MjA5NDM1MjEwOX0.IFXPHYPWk2fEznegGjDXUVnZ0jhJXRzI4MkWVM-uPpU';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'Missing profile id' });

        // Fetch profile with photos and services
        const query = `${SUPABASE_URL}/rest/v1/profiles?select=*,photos(*),services(*)`;
        const r = await fetch(`${query}&id=eq.${id}`, {
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
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        return res.status(200).json(data[0]);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}