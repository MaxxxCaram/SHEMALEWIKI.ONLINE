import nodemailer from 'nodemailer';

const SMTP_HOST = 'smtp.hostinger.com';
const SMTP_PORT = 465;
const SMTP_USER = 'ads@shemalewiki.online';
const SMTP_PASS = process.env.ADS_EMAIL_PASSWORD;
const NOTIFY_EMAIL = 'ads@shemalewiki.online';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!SMTP_PASS) {
    return res.status(503).json({ error: 'Email service not configured' });
  }

  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `ShemaleWiki Ads <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: `New Ad Contact: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Message sent successfully' });

  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ error: err.message });
  }
}
