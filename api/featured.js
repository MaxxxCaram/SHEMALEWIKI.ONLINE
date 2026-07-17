const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dXpwc3d4emVuZ3FvcXF3dHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NzYxMDksImV4cCI6MjA5NDM1MjEwOX0.IFXPHYPWk2fEznegGjDXUVnZ0jhJXRzI4MkWVM-uPpU';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // Get profile_ids that have Storage photos (quality)
        const photosQ = await fetch(`${SUPABASE_URL}/rest/v1/photos?select=profile_id&photo_url=ilike.*storage/v1/object/public/profile-photos*&limit=1000`, {
            headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
        });
        const photoRows = await photosQ.json();
        
        // Prioritise Storage-first
        const storageIds = [...new Set(photoRows.map(p => p.profile_id).filter(Boolean))];
        const otherIds = [...new Set(photoRows.map(p => p.profile_id).filter(Boolean))];
        
        const ids = [...storageIds, ...otherIds].slice(0, 150);

        let profiles = [];
        if (ids.length > 0) {
            const profilesQ = await fetch(
                `${SUPABASE_URL}/rest/v1/profiles?select=*,photos(photo_url,local_path)&id=in.(${ids.map(encodeURIComponent).join(',')})&limit=60`,
                { headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` } }
            );
            const data = await profilesQ.json();
            
            // Sort: Storage-first
            const hasStorage = p => p.photos?.some(ph => ph.photo_url?.includes('storage/v1/object/public'));
            profiles = (Array.isArray(data) ? data : [])
                .sort((a, b) => Number(hasStorage(b)) - Number(hasStorage(a)))
                .slice(0, 12);
        }

        return res.status(200).json(profiles);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}