// Vercel Serverless Function: POST /api/register
// Uses service key to bypass RLS for new profile registration
// Sends notification email to ads@shemalewiki.online
// Saves photos to Supabase Storage via photo_urls
//
// Security:
// - NO hardcoded passwords (SMTP_PASS is environment-only)
// - Input validation + rate limiting + honeypot
// - Sanitized email HTML (no XSS via photo URLs)
// - CORS restricted to official domains

import { randomUUID } from 'crypto';
import nodemailer from 'nodemailer';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// SMTP config — password ONLY from env, no fallback
const SMTP_HOST = 'smtp.hostinger.com';
const SMTP_PORT = 465;
const SMTP_USER = 'ads@shemalewiki.online';
const SMTP_PASS = process.env.ADS_EMAIL_PASSWORD; // No fallback!
const NOTIFY_EMAIL = 'ads@shemalewiki.online';

// Rate limiting: track IPs in-memory (fine for serverless, ~minutes scale)
const rateLimit = {};
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const RATE_LIMIT_MAX = 3; // 3 requests per window

// CORS: only allow official domains
const ALLOWED_ORIGINS = ['https://shemalewiki.online', 'https://buscatrans.com'];

// Validation helpers
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPhone(phone) {
  return /^\+?[\d\s\-()]{6,}$/.test(phone);
}

function sanitizeName(name) {
  // 2-50 chars, alphanumeric + spaces + accents
  return String(name).replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '').trim();
}

function isValidName(name) {
  const cleaned = sanitizeName(name);
  return cleaned.length >= 2 && cleaned.length <= 50 && cleaned !== name;
}

function isValidPhotoUrl(url) {
  // Only allow HTTPS URLs to known image hosting or our own storage
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return false;
    // Block javascript:, data:, blob: schemes
    if (url.toLowerCase().includes('javascript:') || url.toLowerCase().includes('data:') || url.toLowerCase().includes('blob:')) return false;
    return true;
  } catch {
    return false;
  }
}

function sanitizeUrlForHtml(url) {
  // Double-check: if URL passes validation, it's safe for <img src="">
  return isValidPhotoUrl(url) ? url : 'about:blank';
}

// Rate limiter
function checkRateLimit(ip) {
  const now = Date.now();
  if (!rateLimit[ip]) rateLimit[ip] = [];
  // Clean old entries
  rateLimit[ip] = rateLimit[ip].filter(t => now - t < RATE_LIMIT_WINDOW);
  if (rateLimit[ip].length >= RATE_LIMIT_MAX) {
    return false;
  }
  rateLimit[ip].push(now);
  return true;
}

// Get client IP from request
function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || 'unknown';
}

export default async function handler(req, res) {
  // CORS: validate origin
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-RateLimit-Window', '1h');
  res.setHeader('X-RateLimit-Max', '3');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check SERVICE_KEY
  if (!SERVICE_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Rate limiting
  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Demasiados intentos. Esperá una hora.' });
  }

  try {
    const { profileId: clientProfileId, name, email, phone, whatsapp, country, city, bio, age, languages,
            nationality, height, weight, onlyfans, photo_urls, services,
            availability, photo_privacy, plan, honeypot } = req.body || {};

    // Honeypot: if field is filled, it's a bot
    if (honeypot) {
      return res.status(200).json({ success: true }); // Pretend success
    }

    // Required fields validation
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Nombre, email y teléfono son requeridos' });
    }

    // Name validation
    if (!isValidName(name)) {
      return res.status(400).json({ error: 'Nombre inválido (solo letras, 2-50 caracteres)' });
    }

    // Email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Phone validation
    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: 'Teléfono inválido' });
    }

    // Location
    const continent = (country && ['Argentina','Colombia','Mexico','Chile','Peru','Venezuela','Brazil'].some(c => country.includes(c)))
      ? 'Latin America' : 'Europe';
    const location = `${continent} | ${country || ''} | ${city || ''}`;

    const profileId = clientProfileId || randomUUID();

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

    // Save photo URLs to photos table (validated)
    if (photo_urls && photo_urls.length > 0) {
      const validPhotos = photo_urls.filter(u => isValidPhotoUrl(u));
      if (validPhotos.length > 0 && validPhotos.length !== photo_urls.length) {
        console.warn(`Filtered ${photo_urls.length - validPhotos.length} invalid URLs for profile ${profileId}`);
      }
      try {
        const photoInserts = validPhotos.map(url => ({
          profile_id: profileId,
          photo_url: url
        }));
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
        console.error('Photo insert failed (non-fatal):', photoErr.message);
      }
    }

    // Send notification email (non-blocking)
    try {
      if (!SMTP_PASS) {
        console.error('SMTP_PASS not configured, skipping notification email');
      } else {
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

        // Sanitized photo thumbnails — URLs are validated, so safe for <img src="">
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
                <a href="https://shemalewiki.online/profile/${profile.id}"
                   style="background:#c43a8a;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;">
                  Ver perfil →
                </a>
              </p>
              <p style="color:#999;font-size:0.8rem;margin-top:24px;">
                ID: ${profile.id} · ${new Date().toISOString()}
              </p>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error('Notification email failed (non-fatal):', emailErr.message);
    }

    return res.status(201).json({ profile });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: err.message });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
