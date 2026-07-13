const { createClient } = require('@supabase/supabase-js');
const enrichProfile = require('./enrich');
const fs = require('fs');

const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function runBatch() {
    console.log('Starting batch enrichment process...');

    // Fetch all profiles
    let allProfiles = [];
    let page = 0;
    const limit = 1000;
    
    while (true) {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, name, phone')
            .range(page * limit, (page + 1) * limit - 1)
            .order('id', { ascending: true });
            
        if (error) {
            console.error('Error fetching profiles:', error);
            process.exit(1);
        }
        
        if (data.length === 0) break;
        allProfiles = allProfiles.concat(data);
        page++;
    }

    console.log(`Fetched ${allProfiles.length} profiles from Supabase.`);

    // Check which ones already have photos to avoid re-scraping
    const { data: existingPhotos, error: photoError } = await supabase
        .from('photos')
        .select('profile_id');
        
    if (photoError) {
         console.error('Error fetching photos to check state:', photoError);
    }
    
    const enrichedProfileIds = new Set((existingPhotos || []).map(p => p.profile_id));
    
    const profilesToEnrich = allProfiles.filter(p => !enrichedProfileIds.has(p.id));

    console.log(`Found ${enrichedProfileIds.size} profiles already enriched. Proceeding with ${profilesToEnrich.length} profiles...`);

    const BATCH_SIZE = 5;
    for (let i = 0; i < profilesToEnrich.length; i += BATCH_SIZE) {
        const batch = profilesToEnrich.slice(i, i + BATCH_SIZE);
        console.log(`\n--- Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(profilesToEnrich.length / BATCH_SIZE)} ---`);
        
        // Process batch concurrently
        const promises = batch.map(async (profile) => {
            try {
                await enrichProfile(profile.id, profile.name, profile.phone);
            } catch (err) {
                console.error(`Failed to enrich profile ${profile.name} (${profile.id}):`, err.message);
            }
        });

        await Promise.all(promises);

        // Anti-ban delay between batches
        if (i + BATCH_SIZE < profilesToEnrich.length) {
            const waitTime = Math.floor(Math.random() * 2000) + 3000; // 3 to 5 seconds
            console.log(`Waiting ${waitTime}ms before next batch to prevent IP bans...`);
            await delay(waitTime);
        }
    }

    console.log('\n✅ Batch enrichment process completed successfully!');
    process.exit(0);
}

runBatch();
