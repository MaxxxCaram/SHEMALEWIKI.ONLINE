const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const countryToContinent = {
  // Europe
  "United Kingdom": "Europe", "Denmark": "Europe", "Finland": "Europe", "Sweden": "Europe", "Norway": "Europe",
  "Czech Republic": "Europe", "Belgium": "Europe", "Spain": "Europe", "France": "Europe", "Germany": "Europe",
  "Italy": "Europe", "Netherlands": "Europe", "Switzerland": "Europe", "Austria": "Europe", "Poland": "Europe",
  "Portugal": "Europe", "Ireland": "Europe", "Greece": "Europe", "Hungary": "Europe", "Romania": "Europe",
  "Bulgaria": "Europe", "Croatia": "Europe", "Serbia": "Europe", "Slovakia": "Europe", "Slovenia": "Europe",
  "Estonia": "Europe", "Latvia": "Europe", "Lithuania": "Europe", "Cyprus": "Europe", "Malta": "Europe",
  "Iceland": "Europe", "Luxembourg": "Europe", "Montenegro": "Europe", "North Macedonia": "Europe", "Albania": "Europe",
  "Bosnia and Herzegovina": "Europe", "Moldova": "Europe", "Ukraine": "Europe", "Belarus": "Europe", "Russia": "Europe",
  // Americas
  "United States": "Americas", "Canada": "Americas", "Mexico": "Americas", "Brazil": "Americas", "Argentina": "Americas",
  "Colombia": "Americas", "Chile": "Americas", "Peru": "Americas", "Venezuela": "Americas", "Ecuador": "Americas",
  "Uruguay": "Americas", "Paraguay": "Americas", "Bolivia": "Americas", "Costa Rica": "Americas", "Panama": "Americas",
  "Dominican Republic": "Americas", "Puerto Rico": "Americas", "Cuba": "Americas", "Jamaica": "Americas",
  // Asia
  "Thailand": "Asia", "Philippines": "Asia", "Japan": "Asia", "South Korea": "Asia", "China": "Asia", "Taiwan": "Asia",
  "Hong Kong": "Asia", "Singapore": "Asia", "Malaysia": "Asia", "Indonesia": "Asia", "Vietnam": "Asia", "India": "Asia",
  "United Arab Emirates": "Asia", "Turkey": "Asia", "Israel": "Asia", "Saudi Arabia": "Asia", "Qatar": "Asia",
  // Oceania
  "Australia": "Oceania", "New Zealand": "Oceania",
  // Africa
  "South Africa": "Africa", "Egypt": "Africa", "Morocco": "Africa", "Nigeria": "Africa", "Kenya": "Africa"
};

async function cleanData() {
    console.log('Fetching all profiles...');
    let allProfiles = [];
    let page = 0;
    const limit = 1000;
    
    while (true) {
        const { data, error } = await supabase.from('profiles').select('id, name').range(page * limit, (page + 1) * limit - 1);
        if (error) { console.error(error); return; }
        if (data.length === 0) break;
        allProfiles = allProfiles.concat(data);
        page++;
    }

    console.log(`Fetched ${allProfiles.length} profiles. Cleaning data...`);

    let updates = [];
    let noLocationCount = 0;

    for (const p of allProfiles) {
        const rawName = p.name;
        // Example: 'Jejee - Archive - | Lyngby | Denmark | shemale...'
        const parts = rawName.split('|').map(s => s.trim());
        
        let country = 'Unknown';
        let city = 'Unknown';
        
        const shemaleIndex = parts.findIndex(p => p.toLowerCase().includes('shemale'));
        
        if (shemaleIndex >= 2) {
           country = parts[shemaleIndex - 1];
           if (shemaleIndex >= 3) {
               city = parts[shemaleIndex - 2];
           }
        }
        
        const cleanName = parts[0].split(' - ')[0].trim();
        
        // Match continent
        let continent = 'Other';
        for (const [key, val] of Object.entries(countryToContinent)) {
            if (country.toLowerCase().includes(key.toLowerCase())) {
                continent = val;
                country = key; // normalize country name
                break;
            }
        }
        
        if (country === 'Unknown' || country === '') {
            noLocationCount++;
        }

        const locationStr = `${continent} | ${country} | ${city}`;
        
        updates.push({
            id: p.id,
            name: cleanName,
            location: locationStr
        });
    }

    console.log(`Prepared ${updates.length} updates. Profiles with Unknown location: ${noLocationCount}`);
    
    // Batch update
    const BATCH_SIZE = 100;
    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
        const batch = updates.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('profiles').upsert(batch);
        if (error) {
            console.error('Error updating batch:', error);
        } else {
            console.log(`Updated batch ${i / BATCH_SIZE + 1} / ${Math.ceil(updates.length / BATCH_SIZE)}`);
        }
    }
    
    console.log('Data cleanup completed!');
}

cleanData();
