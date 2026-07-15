import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env','utf8');
const get = (k) => (env.match(new RegExp(k+'=(\\S+)'))||[])[1];
const url = get('VITE_SUPABASE_URL');
const anon = get('VITE_SUPABASE_ANON_KEY');
const sb = createClient(url, anon);

(async () => {
  // 1) createSignedUploadUrl (needs insert privilege for role)
  try {
    const { data, error } = await sb.storage
      .from('profile-photos')
      .createSignedUploadUrl('migrate_probe_signed/23487.jpeg');
    console.log('SIGNED_UPLOAD_URL:', data ? JSON.stringify(data).slice(0,200) : 'NULL', 'ERR:', error ? error.message : 'none');
  } catch(e) { console.log('SIGNED_UPLOAD_URL_EXC:', e.message); }

  // 2) List objects in a subfolder to see if anon can at least read bucket layout
  try {
    const { data, error } = await sb.storage.from('profile-photos').list('', { limit: 5 });
    console.log('LIST:', data ? data.length+' items' : 'NULL', 'ERR:', error ? error.message : 'none');
  } catch(e) { console.log('LIST_EXC:', e.message); }

  // 3) Try upload under a folder that might have insert policy for anon (public bucket default allows anon insert sometimes)
  try {
    const res = await fetch('https://static2.eros.bz/fichas/23487/thumbnails/69cea5c4aedfe.jpeg', { headers: { 'User-Agent': 'Mozilla/5.0' }});
    const buf = Buffer.from(await res.arrayBuffer());
    const { data, error } = await sb.storage.from('profile-photos')
      .upload('migrate_test2/23487_69cea5c4aedfe.jpeg', buf, { contentType: 'image/jpeg', upsert: true });
    console.log('ANON_UPLOAD2:', data ? JSON.stringify(data) : 'NULL', 'ERR:', error ? error.message : 'none');
  } catch(e) { console.log('ANON_UPLOAD2_EXC:', e.message); }
})();
