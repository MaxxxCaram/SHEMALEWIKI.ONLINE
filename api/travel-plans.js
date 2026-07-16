/**
 * Travel Plans API — Vercel Serverless Function
 */

import crypto from 'crypto';

const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const INTERNAL_SECRET = process.env.TRAVEL_INTERNAL_SECRET;

function getServiceKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');
  return key;
}

function verifyUserToken(headers, userId) {
  const authHeader = headers.authorization || '';
  let tokenStr = '';
  if (authHeader.startsWith('Bearer ')) {
    tokenStr = authHeader.substring(7);
  } else {
    return false;
  }

  if (!tokenStr || typeof tokenStr !== 'string') return false;
  const parts = tokenStr.split('.');
  if (parts.length !== 3) return false;
  const [tokenUserId, ts, sig] = parts;
  if (tokenUserId !== userId) return false;

  const ADMIN_SECRET = process.env.ADMIN_SECRET;
  if (!ADMIN_SECRET) return false;

  const expected = crypto.createHmac('sha256', ADMIN_SECRET)
    .update(`${userId}:${ts}`)
    .digest('hex');

  if (sig !== expected) return false;

  const SESSION_TTL = 30 * 24 * 60 * 60 * 1000;
  const age = Date.now() - parseInt(ts, 10);
  return age < SESSION_TTL;
}

function sbAuth(serviceKey) {
  return { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };
}

async function readFile(serviceKey, filename) {
  const resp = await fetch(
    `${SUPABASE_URL}/storage/v1/object/travel-plans/${filename}`,
    { headers: sbAuth(serviceKey) }
  );
  if (!resp.ok) return null;
  return await resp.json();
}

async function writeFile(serviceKey, filename, data) {
  const resp = await fetch(
    `${SUPABASE_URL}/storage/v1/object/travel-plans/${filename}`,
    {
      method: 'POST',
      headers: { ...sbAuth(serviceKey), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Write failed for ${filename}: ${resp.status} ${err}`);
  }
  return { success: true };
}

async function getIndex(serviceKey) {
  const data = await readFile(serviceKey, '_index.json');
  return data || { profiles: {}, updated_at: new Date().toISOString() };
}

async function updateIndex(serviceKey, profileId, cities) {
  const index = await getIndex(serviceKey);
  index.profiles[profileId] = {
    cities: cities || [],
    updated_at: new Date().toISOString(),
  };
  index.updated_at = new Date().toISOString();
  await writeFile(serviceKey, '_index.json', index);
}

function computePlanStatus(plan) {
  const now = new Date();
  const arrival = new Date(plan.arrival_date);
  const departure = new Date(plan.departure_date);
  const visibleFrom = new Date(arrival.getTime() - 48 * 60 * 60 * 1000);

  if (now > departure) return 'past';
  if (now >= visibleFrom && now <= departure) return 'active';
  if (now < arrival) return 'upcoming';
  return 'past';
}

function hoursUntilVisible(plan) {
  const target = new Date(plan.arrival_date).getTime() - 48 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((target - Date.now()) / (1000 * 60 * 60)));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Internal-Secret, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const serviceKey = getServiceKey();
    const url = new URL(req.url, `https://${req.headers.host || 'shemalewiki.online'}`);
    const path = url.pathname.replace('/api/travel-plans', '');

    if (req.method === 'POST' && (!req.body || !req.body.profile_id)) {
      const xSecret = req.headers['x-internal-secret'];
      if (!INTERNAL_SECRET || !xSecret || xSecret !== INTERNAL_SECRET) {
        return res.status(401).json({ error: 'Unauthorized: Invalid cron trigger secret' });
      }

      const index = await getIndex(serviceKey);
      const now = new Date();
      let activated = 0, expired = 0, checked = 0;

      for (const [profileId, entry] of Object.entries(index.profiles || {})) {
        const data = await readFile(serviceKey, `${profileId}.json`);
        if (!data || !data.plans) continue;
        checked++;
        let changed = false;

        for (const plan of data.plans) {
          const arrival = new Date(plan.arrival_date);
          const departure = new Date(plan.departure_date);
          const visibleFrom = new Date(arrival.getTime() - 48 * 60 * 60 * 1000);

          if (now >= visibleFrom && now <= departure && !plan.is_active) {
            plan.is_active = true;
            plan.activated_at = now.toISOString();
            changed = true;
            activated++;
          }
          if (now > departure && plan.is_active) {
            plan.is_active = false;
            plan.deactivated_at = now.toISOString();
            changed = true;
            expired++;
          }
        }

        if (changed) {
          data.updated_at = now.toISOString();
          await writeFile(serviceKey, `${profileId}.json`, data);
        }
      }

      return res.json({ activated, expired, checked, timestamp: now.toISOString() });
    }

    if (req.method === 'GET' && path === '/active') {
      try {
        const city = url.searchParams.get('city');
        if (!city) return res.status(400).json({ error: 'city param required' });

        const index = await getIndex(serviceKey);
        const active = [];
        const cityLower = city.toLowerCase();

        for (const [profileId, entry] of Object.entries(index.profiles || {})) {
          const hasCity = (entry.cities || []).some(c => c.toLowerCase() === cityLower);
          if (!hasCity) continue;

          const data = await readFile(serviceKey, `${profileId}.json`);
          if (!data || !data.plans) continue;

          for (const plan of data.plans) {
            if (plan.is_active && plan.city.toLowerCase() === cityLower) {
              active.push({
                profile_id: profileId,
                plan_id: plan.id,
                city: plan.city,
                country: plan.country || '',
                arrival_date: plan.arrival_date,
                departure_date: plan.departure_date,
              });
            }
          }
        }

        return res.json({ city, active, count: active.length });
      } catch (innerErr) {
        return res.status(500).json({ 
          error: 'Active query failed', 
          detail: innerErr?.message || 'unknown'
        });
      }
    }

    if (req.method === 'GET') {
      const profileId = url.searchParams.get('profile_id');
      if (!profileId) return res.status(400).json({ error: 'profile_id required' });

      const data = await readFile(serviceKey, `${profileId}.json`);

      if (!data) {
        return res.json({ profile_id: profileId, plans: [] });
      }

      data.plans = (data.plans || []).map(plan => ({
        ...plan,
        status: computePlanStatus(plan),
        hours_until_visible: hoursUntilVisible(plan),
      }));

      return res.json(data);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const { profile_id, plans } = req.body || {};
      if (!profile_id) return res.status(400).json({ error: 'profile_id required' });
      if (!Array.isArray(plans)) return res.status(400).json({ error: 'plans array required' });

      if (!verifyUserToken(req.headers, profile_id)) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing session token' });
      }

      const cities = [];
      for (const plan of plans) {
        if (!plan.id) plan.id = `plan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        if (!plan.city) return res.status(400).json({ error: 'city required for all plans' });
        if (!plan.arrival_date || !plan.departure_date) return res.status(400).json({ error: 'dates required' });
        plan.is_active = plan.is_active || false;
        plan.created_at = plan.created_at || new Date().toISOString();
        plan.updated_at = new Date().toISOString();
        if (!cities.includes(plan.city)) cities.push(plan.city);
      }

      const planData = { profile_id, plans, updated_at: new Date().toISOString() };

      await writeFile(serviceKey, `${profile_id}.json`, planData);
      
      try {
        await updateIndex(serviceKey, profile_id, cities);
      } catch (e) {
        console.error('Index update failed (non-fatal):', e.message);
      }

      return res.json({ success: true, profile_id, plan_count: plans.length });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('Travel Plans API error:', err);
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
}
