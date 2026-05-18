const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable_cwSD5GVp927MuLu0N1uROA_z7OsOjIB';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { 
            name, email, phone, whatsapp, continent, country, city,
            bio, age, height, weight, endowment, nationality, languages,
            onlyfans, cam_chat, photoUrls, videoLinks 
        } = req.body;

        if (!name || !email || !phone || !country || !city) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const profileId = `draft_${Date.now()}`;
        const fullLocation = `DRAFT: ${continent || 'Europe'} | ${country} | ${city}`;

        // 1. Insert Profile
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
                id: profileId,
                name,
                email,
                phone,
                whatsapp: whatsapp || '',
                location: fullLocation,
                bio: bio || '',
                age: age || '',
                height: height || '',
                weight: weight || '',
                endowment: endowment || '',
                nationality: nationality || '',
                languages: languages || '',
                onlyfans: onlyfans || '',
                cam_chat: cam_chat || '',
                description: 'DRAFT_PENDING_APPROVAL'
            }]);

        if (profileError) throw profileError;

        // 2. Insert Photos
        if (photoUrls && Array.isArray(photoUrls)) {
            const validPhotos = photoUrls.filter(url => url.trim() !== '');
            if (validPhotos.length > 0) {
                const photoInserts = validPhotos.map(url => ({
                    profile_id: profileId,
                    photo_url: url.trim(),
                    local_path: ''
                }));
                const { error: photoError } = await supabase.from('photos').insert(photoInserts);
                if (photoError) console.error('Error inserting photos:', photoError);
            }
        }

        // 3. Insert Videos
        if (videoLinks && Array.isArray(videoLinks)) {
            const validVideos = videoLinks.filter(url => url.trim() !== '');
            if (validVideos.length > 0) {
                const videoInserts = validVideos.map(url => ({
                    profile_id: profileId,
                    photo_url: url.trim(),
                    local_path: ''
                }));
                const { error: videoError } = await supabase.from('photos').insert(videoInserts);
                if (videoError) console.error('Error inserting video links:', videoError);
            }
        }

        res.status(200).json({ message: 'Perfil borrador creado con éxito', profileId });
    } catch (err) {
        console.error('Draft error:', err);
        res.status(500).json({ error: err.message });
    }
};
