const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const scrapeDistintas = require('./distintas');
const scrapeTsDating = require('./tsdating');
const scrapeKinky = require('./kinky');
const scrapePiccole = require('./piccole');

const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function enrichProfile(profileId, name, phone) {
    const cleanName = name.split(/ - | \| /)[0].trim();
    console.log(`Enriching profile ${profileId} - Name: ${cleanName} (Original: ${name}), Phone: ${phone}`);
    
    const results = await Promise.all([
        scrapeDistintas(cleanName),
        scrapeTsDating(cleanName),
        scrapeKinky(cleanName),
        scrapePiccole(cleanName)
    ]);

    console.log('Scrape Results:', JSON.stringify(results, null, 2));

    let updatedPhotos = [];
    let updatedBio = null;

    for (const res of results) {
        if (res.found) {
            if (res.photos && res.photos.length > 0) {
                updatedPhotos = updatedPhotos.concat(res.photos);
            }
            if (res.bio && !updatedBio) {
                updatedBio = res.bio;
            }
        }
    }

    if (updatedPhotos.length > 0) {
        const photoInserts = updatedPhotos.map(photo => ({
            profile_id: profileId,
            photo_url: photo,
            local_path: ''
        }));
        const { error } = await supabase.from('photos').insert(photoInserts);
        if (!error) {
            console.log(`Inserted ${updatedPhotos.length} new photos for ${name}`);
        } else {
            console.error('Error inserting photos:', error.message);
        }
    }

    if (updatedBio) {
        const { error } = await supabase.from('profiles').update({ bio: updatedBio, updated_at: new Date() }).eq('id', profileId);
        if (!error) {
            console.log(`Updated bio for ${name}`);
        } else {
            console.error('Error updating bio:', error.message);
        }
    }
}

// Support being run directly from command line
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length >= 3) {
        enrichProfile(args[0], args[1], args[2]);
    } else {
        console.error('Usage: node enrich.js <profile_id> <name> <phone>');
    }
}

module.exports = enrichProfile;
