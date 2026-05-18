const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeKinky(name) {
    try {
        console.log(\`Searching kinky.nl/shemales for \${name}...\`);
        const slug = name.toLowerCase().replace(/\\s+/g, '-');
        const url = \`https://www.kinky.nl/shemales/\${slug}\`;
        
        try {
            const response = await axios.get(url, { timeout: 5000 });
            const $ = cheerio.load(response.data);
            
            const photos = [];
            $('img.gallery-image, .photos img').each((i, el) => {
                const src = $(el).attr('src');
                if (src) {
                    photos.push(src.startsWith('http') ? src : \`https://www.kinky.nl\${src}\`);
                }
            });

            const bio = $('.profile-text, .description, p').first().text().trim();
            
            return {
                source: 'kinky.nl',
                found: true,
                url,
                photos: photos.slice(0, 5),
                bio: bio ? bio.substring(0, 500) : null
            };
        } catch (err) {
            return { source: 'kinky.nl', found: false };
        }
    } catch (e) {
        return { source: 'kinky.nl', error: e.message };
    }
}

module.exports = scrapeKinky;
