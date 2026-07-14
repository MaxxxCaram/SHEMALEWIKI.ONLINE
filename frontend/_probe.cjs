const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env','utf8');
const get = (k) => (env.match(new RegExp(k+'=(\\S+)'))||[])[1];
const url = get('VITE_SUPABASE_URL');
const anon = get('VITE_SUPABASE_ANON_KEY');
const sb = createClient(url, anon);
(async () => {
  const { data: buckets, error } = await sb.storage.listBuckets();
  if (error) { console.log('BUCKET_ERR', error.message); return; }
  console.log('BUCKETS:', buckets.map(b=>b.name+'('+(b.public?'pub':'priv')+')').join(', '));
  // try anon upload to profile-photos
  const test = Buffer.from('probe');
  const { data: up, error: eUp } = await sb.storage
    .from('profile-photos')
    .upload('migrate_probe.txt', test, { upsert: true, contentType: 'text/plain' });
  console.log('ANON_UPLOAD:', up ? JSON.stringify(up) : 'NULL', 'ERR:', eUp ? eUp.message : 'none');
})();
