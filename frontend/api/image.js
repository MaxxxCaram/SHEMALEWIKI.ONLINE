import axios from 'axios';
import https from 'https';

const FALLBACK_URL = 'https://placehold.co/300x400.png?text=No+Photo';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url || url.trim() === '') {
    return serveFallback(res);
  }

  try {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });

    // Set request headers to look like a real browser and bypass hotlink protection
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    };

    // If it's a specific domain, add a matching Referer header
    try {
      const parsedUrl = new URL(url);
      headers['Referer'] = parsedUrl.origin;
    } catch (_) {}

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      httpsAgent,
      headers,
      timeout: 8000
    });

    const imgBuf = Buffer.from(response.data);

    // Detect & block the "No Photo" placeholder (grey 3891-byte image).
    // Supabase stores thousands of these instead of real photos. We swap
    // them for our clean local fallback so the UI never shows the grey blob.
    const crypto = require('crypto');
    const NOPHOTO_MD5 = '31771ae7ecb111a486dae2fbda2f792b';
    const md5 = crypto.createHash('md5').update(imgBuf).digest('hex');
    if (md5 === NOPHOTO_MD5) {
      return serveFallback(res);
    }

    const contentType = response.headers['content-type'] || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    // Cache the image for 1 day
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).send(imgBuf);
  } catch (err) {
    console.error(`Image proxy failed for URL: ${url}. Error: ${err.message}`);
    return serveFallback(res);
  }
};

async function serveFallback(res) {
  // Serve our clean local placeholder (no external dependency).
  try {
    const fs = require('fs');
    const path = require('path');
    const svgPath = path.join(process.cwd(), 'public', 'placeholder-profile.svg');
    if (fs.existsSync(svgPath)) {
      const svg = fs.readFileSync(svgPath);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
      return res.status(200).send(svg);
    }
  } catch (e) {
    console.error('Local placeholder read failed:', e.message);
  }
  // Last resort: 1x1 transparent PNG
  const transparentPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
  );
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  return res.status(200).send(transparentPng);
}
