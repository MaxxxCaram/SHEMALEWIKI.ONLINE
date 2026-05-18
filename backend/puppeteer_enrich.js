const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://qtuzpswxzengqoqqwtpt.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);

async function run() {
    console.log("Starting Global Puppeteer Enrichment...");
    const browser = await puppeteer.launch({ headless: true, channel: 'chrome' });
    
    while(true) {
        const page = await browser.newPage();
        
        // Fetch 50 random profiles to process
        const { data: profiles } = await supabase.from('profiles').select('id, name, location').limit(50);
        
        for (const profile of profiles) {
        try {
            console.log(`Searching for: ${profile.name}...`);
            const query = encodeURIComponent(`${profile.name} escort trans`);
            await page.goto(`https://duckduckgo.com/?q=${query}&iax=images&ia=images`, { waitUntil: 'networkidle2' });
            
            // Wait for images to load
            await new Promise(r => setTimeout(r, 2000));
            
            const photoUrl = await page.evaluate(() => {
                const imgs = Array.from(document.querySelectorAll('img'));
                // DuckDuckGo serves image results via external-content proxy
                const validImg = imgs.find(img => img.src && img.src.includes('external-content.duckduckgo.com/iu/'));
                return validImg ? validImg.src : null;
            });
            
            if (photoUrl) {
                console.log(`[FOUND PHOTO] ${photoUrl}`);
                await supabase.from('photos').insert({
                    profile_id: profile.id,
                    photo_url: photoUrl
                });
            } else {
                console.log(`[NO PHOTO FOUND] for ${profile.name}`);
            }
        } catch (e) {
            console.error(`Error on ${profile.name}: ${e.message}`);
        }
        }
        await page.close();
    }
    console.log("Done.");
    await browser.close();
}
run();
