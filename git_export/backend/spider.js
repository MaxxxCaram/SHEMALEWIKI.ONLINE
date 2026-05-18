const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const targets = [
    { continent: 'Europe', country: 'Spain', url: 'https://www.distintas.net/escorts-trans/espana/' },
    { continent: 'Americas', country: 'Colombia', url: 'https://www.distintas.net/escorts-trans/colombia/' },
    { continent: 'Europe', country: 'Italy', url: 'https://www.distintas.net/escorts-trans/italia/' },
];

async function runSpider() {
    console.log('Launching Universal Stealth Browser...');
    const browser = await puppeteer.launch({ headless: true, channel: 'chrome' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    for (const target of targets) {
        console.log(`\nNavigating to ${target.url}...`);
        await page.goto(target.url, { waitUntil: 'networkidle2' });
        
        const title = await page.title();
        if (title.includes('Just a moment')) {
            console.log('Cloudflare challenge detected! Waiting...');
            await page.waitForTimeout(10000);
        }

        const profiles = await page.evaluate(() => {
            const results = [];
            // Specific selector for distintas.net escorts list
            document.querySelectorAll('.elementor-widget-theme-post-title a').forEach(a => {
                const url = a.href;
                const text = a.innerText.trim();
                if (url && text && text.length > 2) {
                    // Find image inside the parent container
                    const container = a.closest('.elementor-post');
                    const imgEl = container ? container.querySelector('img') : null;
                    results.push({ name: text, url: url, photo: imgEl ? imgEl.src : null });
                }
            });
            return results;
        });
        
        console.log(`Found ${profiles.length} potential new models on ${target.url}`);
        
        for (const p of profiles) {
            const { data: existing } = await supabase.from('profiles').select('id').eq('name', p.name).limit(1);
            
            if (!existing || existing.length === 0) {
                console.log(`[NEW] Adding: ${p.name}`);
                const newId = `spider_${Date.now()}_${Math.floor(Math.random()*1000)}`;
                await supabase.from('profiles').insert({
                    id: newId,
                    name: p.name,
                    location: `${target.continent} | ${target.country} | Unknown`,
                    url: p.url,
                    bio: 'Autodiscovered by Universal Spider'
                });
                if (p.photo && !p.photo.includes('archive.org')) {
                    await supabase.from('photos').insert({ profile_id: newId, photo_url: p.photo });
                }
            } else {
                // Profile exists! Let's check if we have this specific fresh photo
                const existingId = existing[0].id;
                if (p.photo && !p.photo.includes('archive.org')) {
                    const { data: existingPhotos } = await supabase.from('photos').select('id').eq('photo_url', p.photo).limit(1);
                    if (!existingPhotos || existingPhotos.length === 0) {
                        console.log(`[ENRICH] Adding fresh photo for existing model: ${p.name}`);
                        await supabase.from('photos').insert({ profile_id: existingId, photo_url: p.photo });
                    }
                }
            }
        }
    }
    console.log('Spider crawl complete.');
    await browser.close();
}

runSpider().catch(console.error);
