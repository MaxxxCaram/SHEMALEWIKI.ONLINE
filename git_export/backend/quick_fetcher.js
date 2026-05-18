const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://qtuzpswxzengqoqqwtpt.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);

async function run() {
    console.log("Starting quick photo fetcher...");
    const browser = await puppeteer.launch({ headless: true, channel: 'chrome' });
    const page = await browser.newPage();
    await page.goto('https://www.distintas.net/espana-andalucia', { waitUntil: 'networkidle2' });
    
    // Check for Cloudflare
    const title = await page.title();
    if (title.includes('Just a moment')) {
        console.log('Waiting for Cloudflare...');
        await page.waitForTimeout(8000);
    }

    const profiles = await page.evaluate(() => {
        const results = [];
        // Distintas specific logic
        document.querySelectorAll('.elementor-widget-theme-post-title a').forEach(a => {
            const container = a.closest('.elementor-post');
            const img = container ? container.querySelector('img') : null;
            if (a.href && a.innerText.trim().length > 3 && img && img.src) {
                results.push({
                    name: a.innerText.trim(),
                    url: a.href,
                    photo: img.src
                });
            }
        });
        return results;
    });

    console.log(`Found ${profiles.length} real profiles with photos.`);

    for (let i = 0; i < profiles.length && i < 20; i++) {
        const p = profiles[i];
        
        // 1. Check if profile exists
        const { data: existing } = await supabase.from('profiles').select('id').eq('name', p.name).limit(1);
        
        let profileId;
        if (!existing || existing.length === 0) {
            console.log(`[NEW PROFILE] ${p.name}`);
            profileId = `spider_quick_${Date.now()}_${i}`;
            await supabase.from('profiles').insert({
                id: profileId,
                name: p.name,
                location: `Europe | Spain | Andalucia`,
                url: p.url,
                bio: 'Quickly discovered.'
            });
        } else {
            profileId = existing[0].id;
        }

        // 2. Insert the photo
        console.log(`[PHOTO ADDED] for ${p.name}`);
        await supabase.from('photos').insert({
            profile_id: profileId,
            photo_url: p.photo
        });
    }

    console.log("Quick fetcher finished!");
    await browser.close();
}

run().catch(console.error);
