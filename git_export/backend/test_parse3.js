const html = require('fs').readFileSync('distintas_dump.html', 'utf8');
const cheerio = require('cheerio');
const $ = cheerio.load(html);

const profiles = [];
// Distintas usually uses elementor, let's see any link containing the title or photo
$('a').each((i, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr('href');
    if (href && text.length > 3) {
        profiles.push({text, href});
    }
});
console.log("DISTINTAS LINKS:");
console.log(profiles.slice(30, 50));

const html2 = require('fs').readFileSync('ts_dating_dump.html', 'utf8');
const $2 = cheerio.load(html2);
const profilesTs = [];
$2('.escort-card, .profile-card, .card, .profile, a').each((i, el) => {
    const href = $2(el).attr('href') || $2(el).find('a').attr('href');
    const text = $2(el).text().trim();
    if (href && href.includes('profile')) {
        profilesTs.push({text, href});
    }
});
console.log("TS-DATING LINKS:");
console.log(profilesTs.slice(0, 10));
