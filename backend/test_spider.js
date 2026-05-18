const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
  try {
    const res = await axios.get('https://www.distintas.net/escorts-trans/espana');
    const $ = cheerio.load(res.data);
    const profiles = [];
    $('.elementor-widget-theme-post-title a').each((i, el) => {
        const name = $(el).text().trim();
        const url = $(el).attr('href');
        if (name && url) {
            profiles.push({ name, url });
        }
    });
    console.log(profiles.slice(0, 5));
  } catch(e) {
    console.error(e.message);
  }
}
test();
