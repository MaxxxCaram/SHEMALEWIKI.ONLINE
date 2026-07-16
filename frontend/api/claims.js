const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';

const ALLOWED_ORIGINS = ['https://shemalewiki.online', 'https://buscatrans.com'];

export default async function handler(req, res) {
    const origin = req.headers.origin || '';
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
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
            return res.status(500).json({ error: 'Server configuration error: missing API key' });
        }

        const { name_on_site, email, phone, country, city, contact_details } = req.body;
        
        if (!name_on_site || !email || !phone) {
            return res.status(400).json({ error: 'Missing required fields: name_on_site, email, phone' });
        }

        const claimId = `claim_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

        const row = {
            id: claimId,
            name: `CLAIM: ${name_on_site.trim()}`,
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            location: 'Claims | Pending',
            bio: [
                `Name on site: ${name_on_site}`,
                `Email: ${email}`,
                `Phone: ${phone}`,
                `Country: ${country || 'N/A'}`,
                `City: ${city || 'N/A'}`,
                `Message: ${contact_details || 'N/A'}`
            ].join('\n').slice(0, 2000),
            description: 'CLAIM_REQUEST_PENDING'
        };

        const supabaseRes = await fetch(
            `${SUPABASE_URL}/rest/v1/profiles`,
            {
                method: 'POST',
                headers: {
                    'apikey': SERVICE_KEY,
                    'Authorization': `Bearer ${SERVICE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(row)
            }
        );

        if (!supabaseRes.ok) {
            const errText = await supabaseRes.text();
            console.error('Claim insert failed:', supabaseRes.status, errText);
            return res.status(500).json({ error: 'Failed to submit claim', details: errText.slice(0, 300) });
        }

        console.log(`Claim submitted: ${claimId}`);
        res.status(200).json({ success: true, message: 'Claim submitted successfully', id: claimId });

    } catch (err) {
        console.error('Claim error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};
