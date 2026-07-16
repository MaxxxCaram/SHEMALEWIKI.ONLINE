// Vercel Serverless Function: POST /api/register
import crypto, { randomUUID } from 'crypto';
import nodemailer from 'nodemailer';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const SMTP_HOST = 'smtp.hostinger.com';
const SMTP_PORT = 465;
const SMTP_USER = 'ads@shemalewiki.online';
const SMTP_PASS = process.env.ADS_EMAIL_PASSWORD;
const NOTIFY_EMAIL = 'ads@shemalewiki.online';

const rateLimit = {};
const RATE_LIMIT_WINDOW = 3600000;
const RATE_LIMIT_MAX = 3;

const ALLOWED_ORIGINS = ['https://shemalewiki.online', 'https://buscatrans.com'];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPhone(phone) {
  return /^\+?[\d\s\-()]{6,}$/.test(phone);
}

function sanitizeName(name) {
  return String(name).replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '').trim();
}

function isValidName(name) {
  const cleaned = sanitizeName(name);
  return cleaned.length >= 2 && cleaned.length <= 50 && cleaned !== name;
}

function isValidPhotoUrl(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return false;
    if (url.toLowerCase().includes('javascript:') || url.toLowerCase().includes('data:') || url.toLowerCase().includes('blob:')) return false;
    return true;
  } catch {
    return false;
  }
}

function sanitizeUrlForHtml(url) {
  return isValidPhotoUrl(url) ? url : 'about:blank';
}

function generateUserToken(userId) {
  const ADMIN_SECRET = process.env.ADMIN_SECRET;
  if (!ADMIN_SECRET) return '';
  const ts = Date.now();
  const sig = crypto.createHmac('sha256', ADMIN_SECRET)
    .update(`${userId}:${ts}`)
    .digest('hex');
  return `${userId}.${ts}.${sig}`;
}

function checkRateLimit(ip) {
  const now = Date.now();
  if (!rateLimit[ip]) rateLimit[ip] = [];
  rateLimit[ip] = rateLimit[ip].filter(t => now - t < RATE_LIMIT_WINDOW);
  if (rateLimit[ip].length >= RATE_LIMIT_MAX) return false;
  rateLimit[ip].push(now);
  return true;
}

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || 'unknown';
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-RateLimit-Window', '1h');
  res.setHeader('X-RateLimit-Max', '3');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!SERVICE_KEY) return res.status(500).json({ error: 'Server configuration error' });

  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Demasiados intentos. Esperá una hora.' });
  }

  try {
    const { profileId: clientProfileId, name, email, phone, whatsapp, country, city, bio, age, languages,
            nationality, height, weight, onlyfans, photo_urls, services,
            availability, photo_privacy, plan, honeypot } = req.body || {};

    if (honeypot) return res.status(200).json({ success: true });

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Nombre, email y teléfono son requeridos' });
    }

    if (!isValidName(name)) {
      return res.status(400).json({ error: 'Nombre inválido (solo letras, 2-50 caracteres)' });
    }

    if (!isValidEmail(email)) return res.status(400).json({ error: 'Email inválido' });
    if (!isValidPhone(phone)) return res.status(400).json({ error: 'Teléfono inválido' });

    const continent = (country && ['Argentina','Colombia','Mexico','Chile','Peru','Venezuela','Brazil'].some(c => country.includes(c)))
      ? 'Latin America' : 'Europe';
    const location = `${continent} | ${country || ''} | ${city || ''}`;

    const profileId = clientProfileId || randomUUID();

    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        id: profileId,
        name, email, phone: phone || '', whatsapp: whatsapp || phone || '',
        location, bio: bio || '',
        age: age ? parseInt(age) : null,
        languages: languages || '',
        nationality: nationality || '',
        height: height ? parseInt(height) : null,
        weight: weight ? parseInt(weight) : null,
        onlyfans: onlyfans || '',
        description: [services, availability, photo_privacy, plan].filter(Boolean).join(' | ') || ''
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    const profile = data[0];

    const validPhotos = [];
    if (photo_urls && photo_urls.length > 0) {
      const filtered = photo_urls.filter(u => isValidPhotoUrl(u));
      validPhotos.push(...filtered);
      try {
        const photoInserts = filtered.map(url => ({ profile_id: profileId, photo_url: url }));
        await fetch(`${SUPABASE_URL}/rest/v1/photos`, {
          method: 'POST',
          headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(photoInserts)
        });
      } catch (photoErr) {
        console.error('Photo insert error:', photoErr.message);
      }
    }

    try {
      if (SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: true,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        });

        const fields = [
          ['Nombre', profile.name],
          ['Email', profile.email],
          ['WhatsApp', profile.whatsapp],
          ['Ubicación', profile.location],
          ['Bio', profile.bio],
          ['Edad', profile.age],
          ['Idiomas', profile.languages],
          ['Nacionalidad', profile.nationality],
          ['Altura', profile.height ? `${profile.height} cm` : ''],
          ['Peso', profile.weight ? `${profile.weight} kg` : ''],
          ['OnlyFans', profile.onlyfans],
          ['Fotos', validPhotos.length > 0 ? `${validPhotos.length} foto(s)` : 'Sin fotos'],
          ['Servicios', services || ''],
          ['Plan', plan || 'free'],
        ].filter(([,v]) => v);

        const fieldsHtml = fields.map(([k, v]) =>
          `<tr><td style="padding:6px 12px;font-weight:bold;color:#555;">${k}</td><td style="padding:6px 12px;">${escapeHtml(String(v))}</td></tr>`
        ).join('');

        const photosHtml = validPhotos.length > 0
          ? validPhotos.map((url, i) =>
              `<img src="${sanitizeUrlForHtml(url)}" alt="Foto ${i+1}" style="width:120px;height:120px;object-fit:cover;border-radius:8px;margin:4px;" onerror="this.style.display='none';">`
            ).join('')
          : '';

        await transporter.sendMail({
          from: `"ShemaleWiki Registros" <${SMTP_USER}>`,
          to: NOTIFY_EMAIL,
          subject: `🆕 Nuevo perfil: ${profile.name} — ${location}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
              <h2 style="color:#c43a8a;">🆕 Nuevo perfil registrado</h2>
              <table style="width:100%;border-collapse:collapse;background:#f9f9f9;border-radius:8px;">
                ${fieldsHtml}
              </table>
              ${photosHtml ? `<div style="margin-top:16px;">${photosHtml}</div>` : ''}
              <p style="margin-top:16px;">
                <a href="https://shemalewiki.online/profile/${profile.id}" style="background:#c43a8a;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;">Ver perfil →</a>
              </p>
            </div>
          `,
        });
      }
    } catch (e) {
      console.error('Email error:', e.message);
    }

    const token = generateUserToken(profileId);
    return res.status(201).json({ profile, token });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
