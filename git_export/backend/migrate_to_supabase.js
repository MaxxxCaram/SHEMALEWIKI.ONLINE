const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY; // using the secret key for migration

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const JSON_PATH = path.join(__dirname, '../shemalewiki_recovery/json/profiles.json');

async function migrate() {
    console.log('Starting migration to Supabase...');
    
    let data;
    try {
        data = fs.readFileSync(JSON_PATH, 'utf8');
    } catch (err) {
        console.error('Error reading JSON file:', err);
        return;
    }

    const profiles = JSON.parse(data);
    const entries = Object.entries(profiles);
    let count = 0;

    for (const [url, profileData] of entries) {
        const id = url.split('/').filter(Boolean).pop() || `profile_${count}`;
        const facts = profileData.facts || {};
        const contact = profileData.contact || {};

        // 1. Insert Profile
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id,
                name: profileData.name || 'Unknown',
                url,
                description: profileData.description || '',
                bio: profileData.bio || '',
                location: profileData.location || '',
                phone: contact.phone || '',
                email: contact.email || '',
                whatsapp: contact.whatsapp || '',
                endowment: facts['Endowment'] || '',
                age: facts['Age'] || '',
                height: facts['Height'] || '',
                weight: facts['Weight'] || '',
                nationality: facts['Nationality'] || '',
                languages: facts['Languages'] || '',
                cam_chat: facts['My cam chat'] || '',
                onlyfans: facts['My OnlyFans'] || ''
            });

        if (profileError) {
            console.error(`Error inserting profile ${id}:`, profileError.message);
            continue; // skip photos/services if profile fails
        }

        // 2. Insert Photos
        if (profileData.images && Array.isArray(profileData.images)) {
            const photoInserts = profileData.images.map(img => ({
                profile_id: id,
                photo_url: img,
                local_path: ''
            }));
            if (photoInserts.length > 0) {
                const { error: photoError } = await supabase.from('photos').insert(photoInserts);
                if (photoError) console.error(`Error inserting photos for ${id}:`, photoError.message);
            }
        }

        // 3. Insert Services
        if (profileData.services && Array.isArray(profileData.services)) {
            const serviceInserts = profileData.services.map(srv => ({
                profile_id: id,
                service_name: srv.service,
                available: srv.available
            }));
            if (serviceInserts.length > 0) {
                const { error: serviceError } = await supabase.from('services').insert(serviceInserts);
                if (serviceError) console.error(`Error inserting services for ${id}:`, serviceError.message);
            }
        }

        count++;
        if (count % 50 === 0) console.log(`Migrated ${count} profiles...`);
    }

    console.log(`Migration complete! Successfully migrated ${count} profiles.`);
}

migrate();
