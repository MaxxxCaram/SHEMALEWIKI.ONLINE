const html = require('fs').readFileSync('ts_dating_dump.html', 'utf8');
const cheerio = require('cheerio');
const $ = cheerio.load(html);

const links = [];
$('a').each((i, el) => {
    const href = $(el).attr('href');
    if (href && href.includes('escort')) {
        links.push(href);
    }
});
console.log(links.slice(0, 20));
