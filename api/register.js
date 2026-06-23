// Vercel Serverless Function: POST /api/register
// Uses service key to bypass RLS for new profile registration

const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, whatsapp, country, city, bio, age, languages, 
            nationality, height, weight, onlyfans } = req.body || {};

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and contact are required' });
    }

    const continent = (country && ['Argentina','Colombia','Mexico','Chile','Peru','Venezuela','Brazil'].some(c => country.includes(c)))
      ? 'Latin America' : 'Europe';
    const location = `${continent} | ${country || ''} | ${city || ''}`;

    // Insert profile with service key
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name, email, phone: phone || '', whatsapp: whatsapp || phone || '',
        location, bio: bio || '',
        age: age ? parseInt(age) : null,
        languages: languages || '',
        nationality: nationality || '',
        height: height ? parseInt(height) : null,
        weight: weight ? parseInt(weight) : null,
        onlyfans: onlyfans || ''
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    return res.status(201).json({ profile: data[0] });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: err.message });
  }
}
