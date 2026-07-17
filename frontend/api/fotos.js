const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Perfiles con fotos Storage (hardcodeados para render ISR inmediato)
const FEATURED_STORAGE = [
  { id: 'faa5bfe7-2b1d-4bf4-9bc1-f9d50c38d3ac', name: 'Kimora', location: 'Europe | Netherlands | Den Haag', photo: 'https://qtuzpswxzengqoqqwtpt.supabase.co/storage/v1/object/public/profile-photos/kinky/faa5bfe7-2b1d-4bf4-9bc1-f9d50c38d3ac/80602.jpg' },
  { id: '9df726ef-d2c0-499e-a8f5-00b8ca394f1c', name: 'Rebeka TS', location: 'Europe | Netherlands | Nijmegen', photo: 'https://qtuzpswxzengqoqqwtpt.supabase.co/storage/v1/object/public/profile-photos/kinky/9df726ef-d2c0-499e-a8f5-00b8ca394f1c/80256.jpg' },
  { id: 'c5ae21e6-ab8f-4773-bfe5-331c1b7a56a9', name: 'Dana', location: 'Europe | Netherlands | Utrecht', photo: 'https://qtuzpswxzengqoqqwtpt.supabase.co/storage/v1/object/public/profile-photos/kinky/c5ae21e6-ab8f-4773-bfe5-331c1b7a56a9/79690.jpg' },
  { id: 'd89b6fcf-c8aa-4657-b2f5-a067582f290a', name: 'Raika', location: 'Europe | Netherlands | Amersfoort', photo: 'https://qtuzpswxzengqoqqwtpt.supabase.co/storage/v1/object/public/profile-photos/kinky/d89b6fcf-c8aa-4657-b2f5-a067582f290a/79686.jpg' },
  { id: '2761', name: 'Nicolita', location: 'Europe | Belgium | Antwerpen', photo: 'https://web.archive.org/web/20230925222958/https/cdn.shemalewiki.com/images_profile/2761/53545759575F5F5755505E5954574847887886_s.jpg' }
];

export default async function handler(req, res) {
  const domain = req.headers.host?.includes('buscatrans') ? 'buscatrans' : 'shemalewiki';
  
  const html = `<!DOCTYPE html>
<html lang="${domain === 'buscatrans' ? 'es' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${domain === 'buscatrans' ? 'BuscaTrans — Comunidad de Mujeres Trans' : 'ShemaleWiki — International Directory'}</title>
  <link rel="stylesheet" href="/assets/index.css">
</head>
<body style="font-family:sans-serif;background:#0a0a0a;color:#fff;margin:0">
  <div style="padding:2rem;text-align:center">
    <h1 style="color:#fbbf24">${domain === 'buscatrans' ? 'Perfiles con fotos' : 'Featured profiles with real photos'}</h1>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem;max-width:1200px;margin:2rem auto">
      ${FEATURED_STORAGE.map(p => `
        <a href="/profile/${p.id}" style="text-decoration:none;color:inherit;display:block;background:#1a1a1a;border-radius:12px;overflow:hidden">
          <img src="${p.photo}" alt="${p.name}" style="width:100%;height:280px;object-fit:cover" loading="lazy">
          <div style="padding:1rem">
            <h3 style="margin:0;color:#fbbf24">${p.name}</h3>
            <p style="margin:0.5rem 0 0;color:#888;font-size:0.9rem">${p.location}</p>
          </div>
        </a>`).join('')}
    </div>
  </div>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
  return res.status(200).send(html);
}