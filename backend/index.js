const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { spawn } = require('child_process');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
// Better to rely on environment variables in production.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable_cwSD5GVp927MuLu0N1uROA_z7OsOjIB';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Handle media uploads
app.post('/api/upload', upload.single('media'), async (req, res) => {
    try {
        const { profile_id } = req.body;
        if (!req.file || !profile_id) {
            return res.status(400).json({ error: 'No file or profile_id provided' });
        }

        // Construct the public URL for the uploaded file
        const photo_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Save to Supabase photos table
        const { data, error } = await supabase
            .from('photos')
            .insert([{ profile_id, photo_url, local_path: req.file.path }])
            .select();

        if (error) throw error;

        res.json({ message: 'Upload successful', photo_url });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Secure endpoint to handle Profile Claim requests (bypasses anon RLS)
app.post('/api/claims', async (req, res) => {
    try {
        const { name_on_site, email, phone, country, city, contact_details } = req.body;
        if (!name_on_site || !email || !phone) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const claimId = `claim_${Date.now()}`;
        
        const { data, error } = await supabase
            .from('profiles')
            .insert([{
                id: claimId,
                name: `Reclamación: ${name_on_site}`,
                email,
                phone,
                location: 'CLAIM_REQUEST',
                bio: `SOLICITUD DE RECLAMACIÓN DE PERFIL\n\nNombre en site: ${name_on_site}\nEmail: ${email}\nTeléfono: ${phone}\nPaís: ${country || ''}\nCiudad: ${city || ''}\nContacto adicional / Mensaje: ${contact_details || ''}`,
                description: 'CLAIM_REQUEST_PENDING'
            }])
            .select();

        if (error) throw error;
        res.json({ message: 'Reclamación enviada con éxito', data });
    } catch (err) {
        console.error('Claim error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Secure endpoint to handle multi-step Draft Profile creation (bypasses anon RLS)
app.post('/api/drafts', async (req, res) => {
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

        res.json({ message: 'Perfil borrador creado con éxito', profileId });
    } catch (err) {
        console.error('Draft error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Fetch all profiles
app.get('/api/profiles', async (req, res) => {
    const { page = 1, limit = 50, search = '' } = req.query;
    const offset = (page - 1) * limit;

    try {
        let query = supabase
            .from('profiles')
            .select('*', { count: 'exact' });

        if (search) {
            // Simple text search on name or location
            query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%,bio.ilike.%${search}%`);
        }

        const { data, count, error } = await query
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ data, page: parseInt(page), limit: parseInt(limit), total: count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch single profile with photos and services
app.get('/api/profiles/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (profileError || !profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const { data: photos } = await supabase.from('photos').select('*').eq('profile_id', id);
        const { data: services } = await supabase.from('services').select('*').eq('profile_id', id);

        res.json({
            ...profile,
            photos: photos || [],
            services: services || []
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Trigger scraper for a specific profile
app.post('/api/profiles/:id/enrich', async (req, res) => {
    const { id } = req.params;

    try {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        // In Vercel serverless, spawning child processes with Node isn't ideal.
        // We should instead require the enrich function and await it, but since it takes long,
        // it might timeout if > 10s on hobby tier. We will do it asynchronously (fire and forget)
        // or await it.
        const enrichModule = require('./scrapers/enrich');
        // Call it asynchronously without awaiting so the request doesn't timeout
        enrichModule(id, profile.name, profile.phone).catch(err => console.error('Enrichment failed:', err));

        res.json({ message: 'Enrichment job started' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// For local testing
if (require.main === module) {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`Backend API listening at http://localhost:${port}`);
    });
}

// Export the app for Vercel Serverless
module.exports = app;
