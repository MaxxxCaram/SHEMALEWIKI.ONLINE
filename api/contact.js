// Vercel Serverless Function: POST /api/contact
// Sends contact form submissions to ads@shemalewiki.online via Hostinger SMTP

import nodemailer from 'nodemailer';

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
