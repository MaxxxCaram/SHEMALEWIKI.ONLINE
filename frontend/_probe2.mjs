import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env','utf8');
const get = (k) => (env.match(new RegExp(k+'=(\\S+)'))||[])[1];
const url = get('VITE_SUPABASE_URL');
const anon = get('VITE_SUPABASE_ANON_KEY');
const sb = createClient(url, anon);

const testUrl = 'https://static2.eros.bz/fichas/23487/thumbnails/69cea5c4aedfe.jpeg';

(async () => {
  const res = await fetch(testUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }});
  console.log('FETCH_EROS:', res.status, res.headers.get('content-type'), res.headers.get('content-length'));
  if (!res.ok) { console.log('cannot fetch eros'); return; }
  const buf = Buffer.from(await res.arrayBuffer());
  console.log('BUF_BYTES:', buf.length);
  const { data, error } = await sb.storage
    .from('profile-photos')
    .upload('migrate_test/23487_69cea5c4aedfe.jpeg', buf, { contentType: 'image/jpeg', upsert: true });
  console.log('ANON_UPLOAD:', data ? JSON.stringify(data) : 'NULL', 'ERR:', error ? error.message : 'none');
  if (data) {
    const pub = sb.storage.from('profile-photos').getPublicUrl(data.path);
    console.log('PUBLIC_URL:', pub.data.publicUrl);
  }
})();
