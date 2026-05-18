const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeTsDating(name) {
    try {
        console.log(\`Searching ts-dating.com for \${name}...\`);
        const slug = name.toLowerCase().replace(/\\s+/g, '-');
        const url = \`https://ts-dating.com/escort/\${slug}\`;
        
        try {
            const response = await axios.get(url, { timeout: 5000 });
            const $ = cheerio.load(response.data);
            
            const photos = [];
            $('.profile-gallery img, .photos img').each((i, el) => {
                const src = $(el).attr('src');
                if (src) {
                    photos.push(src.startsWith('http') ? src : \`https://ts-dating.com\${src}\`);
                }
            });

            const bio = $('.about-me, .description, p').first().text().trim();
            
            return {
                source: 'ts-dating.com',
                found: true,
                url,
                photos: photos.slice(0, 5),
                bio: bio ? bio.substring(0, 500) : null
            };
        } catch (err) {
            return { source: 'ts-dating.com', found: false };
        }
    } catch (e) {
        return { source: 'ts-dating.com', error: e.message };
    }
}

module.exports = scrapeTsDating;
