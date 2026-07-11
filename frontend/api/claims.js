const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';

const ALLOWED_ORIGINS = ['https://shemalewiki.online', 'https://buscatrans.com'];

module.exports = async (req, res) => {
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

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate phone (at least 7 digits)
        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 7) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }

        // Sanitize inputs
        const sanitize = (str) => String(str).trim().slice(0, 500);

        const claimId = `claim_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

        const row = {
            id: claimId,
            name: `CLAIM: ${sanitize(name_on_site)}`,
            email: sanitize(email).toLowerCase(),
            phone: sanitize(phone),
            location: 'Claims | Pending',
            bio: [
                `Name on site: ${sanitize(name_on_site)}`,
                `Email: ${sanitize(email)}`,
                `Phone: ${sanitize(phone)}`,
                `Country: ${sanitize(country || 'N/A')}`,
                `City: ${sanitize(city || 'N/A')}`,
                `Message: ${sanitize(contact_details || 'N/A')}`
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
