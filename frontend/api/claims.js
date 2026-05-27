const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable_cwSD5GVp927MuLu0N1uROA_z7OsOjIB';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = async (req, res) => {
    // Enable CORS
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
        const { name_on_site, email, phone, country, city, contact_details } = req.body;
        if (!name_on_site || !email || !phone) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const claimId = `claim_${Date.now()}`;
        
        const { data, error } = await supabase
            .from('profiles')
            .insert([{
                id: claimId,
                name: `Reclamación: ${name_on_site}`,
                email,
                phone,
                location: 'CLAIM_REQUEST',
                bio: `SOLICITUD DE RECLAMACIÓN DE PERFIL\n\nNombre en site: ${name_on_site}\nEmail: ${email}\nTeléfono: ${phone}\nPaís: ${country || ''}\nCiudad: ${city || ''}\nContacto adicional / Mensaje: ${contact_details || ''}`,
                description: 'CLAIM_REQUEST_PENDING'
            }])
            .select();

        if (error) throw error;
        res.status(200).json({ message: 'Reclamación enviada con éxito', data });
    } catch (err) {
        console.error('Claim error:', err);
        res.status(500).json({ error: err.message });
    }
};
