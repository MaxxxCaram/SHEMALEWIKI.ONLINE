// Magic Link Auth — generates stateless tokens
const crypto = require('crypto');
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email required' });
  }

  // Generate magic token
  const ts = Date.now();
  const secret = process.env.ADMIN_SECRET || 'CHANGE_ME_SETUP_ADMIN_SECRET';
  const sig = crypto.createHmac('sha256', secret).update(`${email}:${ts}`).digest('hex');
  const token = `${email}.${ts}.${sig}`;

  // Get user name from DB
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  let displayName = 'Usuario';
  if (SUPABASE_URL && SERVICE_KEY) {
    try {
      const resp = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?select=name&email=eq.${encodeURIComponent(email)}`,
        { headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` } }
      );
      if (resp.ok) {
        const data = await resp.json();
        if (data?.[0]) displayName = data[0].name;
      }
    } catch (_) {}
  }

  const frontendUrl = process.env.SITE_URL || 'https://shemalewiki.online';
  const link = `${frontendUrl}/login?token=${token}`;

  // Send email
  const SMTP_PASS = process.env.ADS_EMAIL_PASSWORD;
  let emailSent = false;
  if (SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: { user: 'ads@shemalewiki.online', pass: SMTP_PASS },
      });
      await transporter.sendMail({
        from: '"ShemaleWiki" <ads@shemalewiki.online>',
        to: email,
        subject: '🔗 Tu enlace de acceso',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;">
            <h2 style="color:#c43a8a;">Tu enlace de acceso</h2>
            <p>Hola ${displayName}, hacé click para entrar a tu panel:</p>
            <a href="${link}" style="display:inline-block;background:#c43a8a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">
              Acceder a mi panel
            </a>
            <p style="color:#999;font-size:0.8rem;margin-top:24px;">
              Este enlace expira en 15 minutos. Si no lo pediste, ignorá este email.
            </p>
            <p style="color:#999;font-size:0.8rem;">
              O copiá este link: <code style="word-break:break-all;">${link}</code>
            </p>
          </div>
        `,
      });
      emailSent = true;
    } catch (err) {
      console.error('Email failed:', err.message);
    }
  }

  return res.json({ token, link, emailSent, fallback: link });
}
