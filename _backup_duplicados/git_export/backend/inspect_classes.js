const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function run() {
    const browser = await puppeteer.launch({ headless: true, channel: 'chrome' });
    const page = await browser.newPage();
    await page.goto('https://www.ts-dating.com/shemale-escorts/Spain/', { waitUntil: 'networkidle2' });
    const html = await page.content();
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    
    const classes = new Set();
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('/escort/')) {
            const parentClass = $(el).parent().attr('class');
            if (parentClass) classes.add(parentClass);
        }
    });
    console.log("Classes of parent elements of escort links:", [...classes]);
    await browser.close();
}
run();
