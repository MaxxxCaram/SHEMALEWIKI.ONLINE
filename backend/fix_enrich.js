const fs = require('fs');
let c = fs.readFileSync('scrapers/enrich.js', 'utf8');
c = c.replace('name.split(/ - | \\\\| /)', 'name.split(/ - | \\| /)');
fs.writeFileSync('scrapers/enrich.js', c);
console.log('Fixed enrich.js split regex');
