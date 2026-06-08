/**
 * Travel Plans API — Vercel Serverless Function
 * 
 * GET  /api/travel-plans?profile_id=X     → list user's plans
 * GET  /api/travel-plans/active?city=X    → active travelers for a city (public)
 * POST /api/travel-plans                  → create/update plans for a profile
 * 
 * Backend: Supabase Storage bucket `travel-plans`
 * File format: {profile_id}.json → { plans: [...], profile_id }
 * 
 * Cron activation: POST /api/travel-plans with X-Internal-Secret header
 * activates plans whose arrival is within 48h, deactivates expired ones.
 */

const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const INTERNAL_SECRET = process.env.TRAVEL_INTERNAL_SECRET || 'vivas-travel-2026-internal';

// Load service key from Vercel env
function getServiceKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');
  return key;
}

function supabaseHeaders(serviceKey) {
  return {
    'apikey': serviceKey,
    'Authorization': `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  };
}

// Read all travel plans from storage
async function getAllPlans(serviceKey) {
  // Supabase Storage listing requires prefix= param (bare listing returns 400)
  const resp = await fetch(
    `${SUPABASE_URL}/storage/v1/object/list/travel-plans?prefix=`,
    { 
      headers: { 
        apikey: serviceKey, 
        Authorization: `Bearer ${serviceKey}` 
      } 
    }
  );
  
  if (!resp.ok) {
    const err = await resp.text();
    console.error('Failed to list travel plans:', resp.status, err);
    return [];
  }
  
  const data = await resp.json();
  const files = (data || []).filter(f => f.name && f.name.endsWith('.json') && f.name !== '_index.json');
  
  const allPlans = [];
  for (const file of files) {
    try {
      const objResp = await fetch(
        `${SUPABASE_URL}/storage/v1/object/travel-plans/${file.name}`,
        { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
      );
      if (objResp.ok) {
        const planData = await objResp.json();
        if (planData && planData.plans) {
          allPlans.push(planData);
        }
      }
    } catch (e) {
      console.error(`Error reading ${file.name}:`, e.message);
    }
  }
  
  return allPlans;
}

// Save plans for a single profile
async function savePlans(serviceKey, profileId, planData) {
  const headers = supabaseHeaders(serviceKey);
  
  // Upload JSON file
  const resp = await fetch(
    `${SUPABASE_URL}/storage/v1/object/travel-plans/${profileId}.json`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(planData),
    }
  );
  
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Failed to save plans: ${resp.status} ${err}`);
  }
  
  return { success: true };
}

// Compute travel plan status
function computePlanStatus(plan) {
  const now = new Date();
  const arrival = new Date(plan.arrival_date);
  const departure = new Date(plan.departure_date);
  const visibleFrom = new Date(arrival.getTime() - 48 * 60 * 60 * 1000); // 48h before
  
  if (now > departure) return 'past';
  if (now >= visibleFrom && now <= departure) return 'active'; // visible + active
  if (now >= arrival && now <= departure) return 'active';
  if (now < arrival) return 'upcoming';
  return 'past';
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Internal-Secret');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    const serviceKey = getServiceKey();
    const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
    const path = url.pathname.replace('/api/travel-plans', '');
    
    // ─── INTERNAL CRON: Activate/deactivate plans ───
    if (req.method === 'POST' && req.headers['x-internal-secret'] === INTERNAL_SECRET && !req.body?.profile_id) {
      const allPlans = await getAllPlans(serviceKey);
      const now = new Date();
      let activated = 0;
      let expired = 0;
      
      for (const profileData of allPlans) {
        let changed = false;
        const plans = profileData.plans || [];
        
        for (const plan of plans) {
          const arrival = new Date(plan.arrival_date);
          const departure = new Date(plan.departure_date);
          const visibleFrom = new Date(arrival.getTime() - 48 * 60 * 60 * 1000);
          const wasActive = plan.is_active;
          
          // Activate: within 48h window AND not yet departed
          if (now >= visibleFrom && now <= departure && !plan.is_active) {
            plan.is_active = true;
            plan.activated_at = now.toISOString();
            changed = true;
            activated++;
          }
          
          // Deactivate: past departure
          if (now > departure && plan.is_active) {
            plan.is_active = false;
            plan.deactivated_at = now.toISOString();
            changed = true;
            expired++;
          }
        }
        
        if (changed) {
          await savePlans(serviceKey, profileData.profile_id, profileData);
        }
      }
      
      return res.json({ activated, expired, checked: allPlans.length, timestamp: now.toISOString() });
    }
    
    // ─── PUBLIC: Get active travelers for a city ───
    if (req.method === 'GET' && path === '/active') {
      const city = url.searchParams.get('city');
      if (!city) return res.status(400).json({ error: 'city param required' });
      
      const allPlans = await getAllPlans(serviceKey);
      const active = [];
      
      for (const profileData of allPlans) {
        const plans = profileData.plans || [];
        for (const plan of plans) {
          if (plan.is_active && plan.city.toLowerCase() === city.toLowerCase()) {
            active.push({
              profile_id: profileData.profile_id,
              plan_id: plan.id,
              city: plan.city,
              country: plan.country,
              arrival_date: plan.arrival_date,
              departure_date: plan.departure_date,
            });
          }
        }
      }
      
      return res.json({ city, active, count: active.length });
    }
    
    // ─── GET: User's travel plans ───
    if (req.method === 'GET') {
      const profileId = url.searchParams.get('profile_id');
      if (!profileId) return res.status(400).json({ error: 'profile_id required' });
      
      const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };
      const resp = await fetch(
        `${SUPABASE_URL}/storage/v1/object/travel-plans/${profileId}.json`,
        { headers }
      );
      
      if (resp.status === 404 || resp.status === 400) {
        return res.json({ profile_id: profileId, plans: [] });
      }
      
      if (!resp.ok) {
        const err = await resp.text();
        return res.status(resp.status).json({ error: err });
      }
      
      const data = await resp.json();
      
      // Compute live status for each plan
      data.plans = (data.plans || []).map(plan => ({
        ...plan,
        status: computePlanStatus(plan),
        hours_until_visible: Math.max(0, Math.ceil(
          (new Date(plan.arrival_date).getTime() - 48 * 60 * 60 * 1000 - Date.now()) / (1000 * 60 * 60)
        )),
      }));
      
      return res.json(data);
    }
    
    // ─── POST/PUT: Save user's travel plans ───
    if (req.method === 'POST' || req.method === 'PUT') {
      const { profile_id, plans } = req.body || {};
      if (!profile_id) return res.status(400).json({ error: 'profile_id required' });
      if (!Array.isArray(plans)) return res.status(400).json({ error: 'plans array required' });
      
      // Validate plans
      for (const plan of plans) {
        if (!plan.id) plan.id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `plan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        if (!plan.city) return res.status(400).json({ error: 'city required for all plans' });
        if (!plan.arrival_date || !plan.departure_date) return res.status(400).json({ error: 'arrival_date and departure_date required' });
        plan.is_active = plan.is_active || false;
        plan.created_at = plan.created_at || new Date().toISOString();
        plan.updated_at = new Date().toISOString();
      }
      
      const planData = { profile_id, plans, updated_at: new Date().toISOString() };
      await savePlans(serviceKey, profile_id, planData);
      
      return res.json({ success: true, profile_id, plan_count: plans.length });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (err) {
    console.error('Travel Plans API error:', err);
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
}
