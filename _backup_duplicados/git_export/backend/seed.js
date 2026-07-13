const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');
const JSON_PATH = path.join(__dirname, '../shemalewiki_recovery/json/profiles.json');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDb();
    }
});

function initializeDb() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY,
            name TEXT,
            url TEXT,
            description TEXT,
            bio TEXT,
            location TEXT,
            phone TEXT,
            email TEXT,
            whatsapp TEXT,
            endowment TEXT,
            age TEXT,
            height TEXT,
            weight TEXT,
            nationality TEXT,
            languages TEXT,
            cam_chat TEXT,
            onlyfans TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            profile_id TEXT,
            photo_url TEXT,
            local_path TEXT,
            FOREIGN KEY(profile_id) REFERENCES profiles(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            profile_id TEXT,
            service_name TEXT,
            available BOOLEAN,
            FOREIGN KEY(profile_id) REFERENCES profiles(id)
        )`);

        console.log('Tables created or already exist.');
        seedData();
    });
}

function seedData() {
    let data;
    try {
        data = fs.readFileSync(JSON_PATH, 'utf8');
    } catch (err) {
        console.error('Error reading JSON file:', err);
        return;
    }

    try {
        const profiles = JSON.parse(data);
        const stmtProfile = db.prepare(`INSERT OR REPLACE INTO profiles 
            (id, name, url, description, bio, location, phone, email, whatsapp, endowment, age, height, weight, nationality, languages, cam_chat, onlyfans) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        const stmtPhoto = db.prepare(`INSERT INTO photos (profile_id, photo_url, local_path) VALUES (?, ?, ?)`);
        const stmtService = db.prepare(`INSERT INTO services (profile_id, service_name, available) VALUES (?, ?, ?)`);

        db.run('BEGIN TRANSACTION');

        let count = 0;
        const entries = Object.entries(profiles);
        
        for (const [url, profileData] of entries) {
            const id = url.split('/').filter(Boolean).pop() || `profile_${count}`;
            
            const facts = profileData.facts || {};
            const contact = profileData.contact || {};

            stmtProfile.run(
                id,
                profileData.name || 'Unknown',
                url,
                profileData.description || '',
                profileData.bio || '',
                profileData.location || '',
                contact.phone || '',
                contact.email || '',
                contact.whatsapp || '',
                facts['Endowment'] || '',
                facts['Age'] || '',
                facts['Height'] || '',
                facts['Weight'] || '',
                facts['Nationality'] || '',
                facts['Languages'] || '',
                facts['My cam chat'] || '',
                facts['My OnlyFans'] || ''
            );

            if (profileData.images && Array.isArray(profileData.images)) {
                profileData.images.forEach(img => {
                    stmtPhoto.run(id, img, '');
                });
            }

            if (profileData.services && Array.isArray(profileData.services)) {
                profileData.services.forEach(srv => {
                    stmtService.run(id, srv.service, srv.available ? 1 : 0);
                });
            }
            count++;
        }

        stmtProfile.finalize();
        stmtPhoto.finalize();
        stmtService.finalize();

        db.run('COMMIT', () => {
            console.log(`Successfully seeded ${count} profiles.`);
            db.close();
        });

    } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
    }
}
