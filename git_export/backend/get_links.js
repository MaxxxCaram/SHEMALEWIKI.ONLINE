const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function run() {
    const browser = await puppeteer.launch({ headless: true, channel: 'chrome' });
    const page = await browser.newPage();
    await page.goto('https://www.distintas.net/escorts-trans/espana', { waitUntil: 'networkidle2' });
    const html = await page.content();
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    const links = [];
    $('a').each((i, el) => {
        const text = $(el).text().trim();
        const href = $(el).attr('href');
        if (text && href && href.length > 10 && !href.includes('tag')) {
            links.push({text: text.substring(0, 20), href: href});
        }
    });
    console.log("Links:", links.slice(0, 30));
    await browser.close();
}
run();
