const html = require('fs').readFileSync('ts_dating_dump.html', 'utf8');
const cheerio = require('cheerio');
const $ = cheerio.load(html);

const links = [];
$('a').each((i, el) => {
    const a = $(el);
    const img = a.find('img').first();
    const href = a.attr('href');
    if (href && href.includes('/escort/') && img.length > 0) {
        links.push({ href: href, src: img.attr('src') });
    }
});
console.log('Found escorts:', links.length);
console.log(links.slice(0, 10));
