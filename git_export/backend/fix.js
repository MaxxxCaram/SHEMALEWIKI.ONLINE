const fs = require('fs');
const path = require('path');
const dir = './scrapers';
fs.readdirSync(dir).forEach(f => {
    if (!f.endsWith('.js')) return;
    const p = path.join(dir, f);
    let c = fs.readFileSync(p, 'utf8');
    if (c.includes('\\`')) {
        c = c.replace(/\\`/g, '`').replace(/\\\$/g, '$');
        fs.writeFileSync(p, c);
        console.log('Fixed ' + f);
    }
});
