// Vercel Serverless Function: POST /api/register
// Uses service key to bypass RLS for new profile registration
// Sends notification email to ads@shemalewiki.online
// Saves photos to Supabase Storage via photo_urls

import { randomUUID } from 'crypto';
import nodemailer from 'nodemailer';

const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Email config
const SMTP_HOST = 'smtp.hostinger.com';
const SMTP_PORT = 465;
const SMTP_USER = 'ads@shemalewiki.online';
const SMTP_PASS = process.env.ADS_EMAIL_PASSWORD || 'Maxima2026!';
const NOTIFY_EMAIL = 'ads@shemalewiki.online';

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
    const { profileId: clientProfileId, name, email, phone, whatsapp, country, city, bio, age, languages, 
            nationality, height, weight, onlyfans, photo_urls, services,
            availability, photo_privacy, plan } = req.body || {};

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and contact are required' });
    }

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

    // Save photo URLs to photos table
    if (photo_urls && photo_urls.length > 0) {
      try {
        const photoInserts = photo_urls.map(url => ({
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
        ['Fotos', photo_urls && photo_urls.length > 0 ? `${photo_urls.length} foto(s)` : 'Sin fotos'],
        ['Servicios', services || ''],
        ['Plan', plan || 'free'],
      ].filter(([,v]) => v);

      const fieldsHtml = fields.map(([k, v]) => 
        `<tr><td style="padding:6px 12px;font-weight:bold;color:#555;">${k}</td><td style="padding:6px 12px;">${escapeHtml(String(v))}</td></tr>`
      ).join('');

      // Photo thumbnails in email
      const photosHtml = photo_urls && photo_urls.length > 0 
        ? photo_urls.map((url, i) => 
            `<img src="${url}" alt="Foto ${i+1}" style="width:120px;height:120px;object-fit:cover;border-radius:8px;margin:4px;">`
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
