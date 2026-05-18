const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeDistintas(name) {
    try {
        console.log(`Searching distintas.net for ${name}...`);
        // We do a simple Google search or directly search their site.
        // Assuming they have a search endpoint or we format the name to a URL slug.
        const slug = name.toLowerCase().replace(/\\s+/g, '-');
        const url = `https://www.distintas.net/escorts-trans/${slug}`;
        
        try {
            const response = await axios.get(url, { timeout: 5000 });
            const $ = cheerio.load(response.data);
            
            const photos = [];
            $('img').each((i, el) => {
                const src = $(el).attr('src');
                if (src && (src.includes('galeria') || src.includes('fotos'))) {
                    photos.push(src.startsWith('http') ? src : `https://www.distintas.net${src}`);
                }
            });

            const bio = $('.description, .bio, p').first().text().trim();
            
            return {
                source: 'distintas.net',
                found: true,
                url,
                photos: photos.slice(0, 5), // get top 5 photos
                bio: bio ? bio.substring(0, 500) : null
            };
        } catch (err) {
            // If 404 or other error, means not found by slug
            return { source: 'distintas.net', found: false };
        }
    } catch (e) {
        return { source: 'distintas.net', error: e.message };
    }
}

module.exports = scrapeDistintas;
