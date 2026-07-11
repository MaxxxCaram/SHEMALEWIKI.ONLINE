const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!SERVICE_KEY) {
            console.error('SUPABASE_SERVICE_ROLE_KEY not set');
            return res.status(500).json({ error: 'Server configuration error: missing API key' });
        }

        const { 
            name, email, phone, whatsapp, country, city,
            bio, age, height, weight, nationality, languages,
            onlyfans, cam_chat 
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !country || !city) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['name', 'email', 'phone', 'country', 'city']
            });
        }

        // Build profile ID
        const profileId = `new_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        
        // Detect continent from country
        let continent = 'Other';
        const countryLower = (country || '').toLowerCase().trim();
        const eu = /spain|españa|netherlands|países bajos|holland|germany|alemania|france|francia|italy|italia|portugal|belgium|bélgica|uk|united kingdom|reino unido|switzerland|suiza|austria|poland|polonia|sweden|suecia|norway|noruega|denmark|dinamarca|finland|finlandia|ireland|irlanda|czech|chequia|greece|grecia|hungary|hungría|romania|rumania|bulgaria|serbia|croatia|croacia|slovenia|slovakia|lithuania|lituania|latvia|letonia|estonia|luxembourg|luxemburgo|malta|cyprus|chipre/;
        const americas = /argentina|brazil|brasil|mexico|méxico|colombia|chile|peru|perú|uruguay|venezuela|ecuador|bolivia|paraguay|united states|estados unidos|canada|canadá|panama|panamá|costa rica|guatemala|honduras|el salvador|nicaragua|dominican|república dominicana|cuba|jamaica|bahamas|trinidad|haiti/;
        
        if (eu.test(countryLower)) continent = 'Europe';
        else if (americas.test(countryLower)) continent = 'Americas';
        
        const location = `${continent} | ${country.trim()} | ${city.trim()}`;

        // Insert profile via Supabase REST API (no client library needed)
        const row = {
            id: profileId,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            whatsapp: (whatsapp || phone).trim(),
            location,
            bio: (bio || '').trim().slice(0, 2000),
            age: String(age || '').trim(),
            height: String(height || '').trim(),
            weight: String(weight || '').trim(),
            nationality: (nationality || '').trim(),
            languages: (languages || '').trim(),
            onlyfans: (onlyfans || '').trim(),
            cam_chat: (cam_chat || '').trim(),
            description: 'REGISTERED_VIA_SITE'
        };

        const supabaseRes = await fetch(
            `${SUPABASE_URL}/rest/v1/profiles`,
            {
                method: 'POST',
                headers: {
                    'apikey': SERVICE_KEY,
                    'Authorization': `Bearer ${SERVICE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(row)
            }
        );

        if (!supabaseRes.ok) {
            const errText = await supabaseRes.text();
            console.error('Supabase insert failed:', supabaseRes.status, errText);
            return res.status(500).json({ 
                error: 'Database insert failed',
                status: supabaseRes.status,
                details: errText.slice(0, 300)
            });
        }

        const data = await supabaseRes.json();
        console.log(`Profile created: ${profileId} — ${name.trim()}`);

        res.status(201).json({ 
            success: true, 
            message: 'Profile created successfully',
            profile: Array.isArray(data) ? data[0] : data
        });

    } catch (err) {
        console.error('Draft error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};
