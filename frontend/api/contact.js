// Vercel Serverless Function: POST /api/contact
// Sends contact form submissions to ads@shemalewiki.online via Hostinger SMTP

import nodemailer from 'nodemailer';

const SMTP_HOST = 'smtp.hostinger.com';
const SMTP_PORT = 465;
const SMTP_USER = 'ads@shemalewiki.online';
const SMTP_PASS = process.env.ADS_EMAIL_PASSWORD;
const NOTIFY_EMAIL = 'ads@shemalewiki.online';

// CORS: only allow official domains
const ALLOWED_ORIGINS = ['https://shemalewiki.online', 'https://buscatrans.com'];

// Rate limiting
const rateLimit = {};
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 per hour

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
  // CORS: validate origin
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check SMTP config
  if (!SMTP_PASS) {
    return res.status(503).json({ error: 'Email service not configured' });
  }

  // Rate limiting
  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait an hour.' });
  }

  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Build email content
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #c43a8a;">📩 Nuevo mensaje de ShemaleWiki</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Nombre:</td><td style="padding: 8px;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Asunto:</td><td style="padding: 8px;">${escapeHtml(subject || '(sin asunto)')}</td></tr>
        </table>
        <hr style="border: 1px solid #eee; margin: 16px 0;">
        <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; white-space: pre-wrap;">
          ${escapeHtml(message)}
        </div>
        <p style="color: #999; font-size: 0.8rem; margin-top: 24px;">
          Enviado desde el formulario de contacto · ${new Date().toISOString()}
        </p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"ShemaleWiki Contacto" <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: `[Contacto] ${subject || 'Nuevo mensaje'} — ${name}`,
      html: htmlBody,
    });

    return res.status(200).json({ success: true, message: 'Message sent successfully' });

  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
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
