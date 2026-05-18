const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePiccole(name) {
    try {
        console.log(`Searching piccoletrasgressioni.it for ${name}...`);
        const slug = name.toLowerCase().replace(/\\s+/g, '-');
        const url = `https://www.piccoletrasgressioni.it/trans/${slug}`;
        
        try {
            const response = await axios.get(url, { timeout: 5000 });
            const $ = cheerio.load(response.data);
            
            const photos = [];
            $('.gallery img, .fotogallery img').each((i, el) => {
                const src = $(el).attr('src');
                if (src) {
                    photos.push(src.startsWith('http') ? src : `https://www.piccoletrasgressioni.it${src}`);
                }
            });

            const bio = $('.description, .testo, p').first().text().trim();
            
            return {
                source: 'piccoletrasgressioni.it',
                found: true,
                url,
                photos: photos.slice(0, 5),
                bio: bio ? bio.substring(0, 500) : null
            };
        } catch (err) {
            return { source: 'piccoletrasgressioni.it', found: false };
        }
    } catch (e) {
        return { source: 'piccoletrasgressioni.it', error: e.message };
    }
}

module.exports = scrapePiccole;
