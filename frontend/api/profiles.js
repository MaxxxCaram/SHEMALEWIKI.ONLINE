// Vercel Serverless Function: GET /api/profiles
// Also routes: /api/drafts, /api/vivas/chat (consolidated to save serverless function limit)

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qtuzpswxzengqoqqwtpt.supabase.co';

function getServiceKey() {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) {
        console.error('SUPABASE_SERVICE_KEY not set');
        return null;
    }
    return key;
}

function supabaseHeaders(extra = {}) {
    const key = getServiceKey();
    if (!key) return {};
    const h = { "apikey": key, "Authorization": `Bearer ${key}` };
    Object.assign(h, extra);
    return h;
}

function buildQueryString(params) {
    const parts = [];
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
    }
    return parts.length ? '?' + parts.join('&') : '';
}

async function fetchTable(table, params, headers) {
    let query = buildQueryString({
        select: '*',
        order: 'created_at.desc',
        ...params,
    });
    const apiPath = `/rest/v1/${table}${query}`;
    const response = await fetch(`${SUPABASE_URL}${apiPath}`, { method: 'GET', headers });
    if (!response.ok) throw new Error(`${table} error: ${response.status}`);
    return response.json();
}

const ALLOWED_ORIGINS = ['https://shemalewiki.online', 'https://buscatrans.com'];

module.exports = async (req, res) => {
    // CORS — restrict to official domains only
    const origin = req.headers.origin || '';
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Internal routing
    const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
    const path = url.pathname;
    const headers = supabaseHeaders({ "Prefer": "count=exact" });

    // Route: /api/drafts
    if (path === '/api/drafts' || path.startsWith('/api/drafts/')) {
        try {
            const queryParams = {
                page: parseInt(url.searchParams.get('page') || '1', 10),
                limit: parseInt(url.searchParams.get('limit') || '50', 10),
            };
            const data = await fetchTable('drafts', queryParams, headers);
            return res.json(data);
        } catch (err) {
            console.error('Drafts handler error:', err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    // Route: /api/vivas/chat
    if (path === '/api/vivas/chat' || path.startsWith('/api/vivas/chat/')) {
        try {
            const queryParams = {
                page: parseInt(url.searchParams.get('page') || '1', 10),
                limit: parseInt(url.searchParams.get('limit') || '50', 10),
            };
            const data = await fetchTable('vivas_chat', queryParams, headers);
            return res.json(data);
        } catch (err) {
            console.error('Vivas chat handler error:', err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    // Default: /api/profiles
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    try {
        let select = '*';
        let query = buildQueryString({
            select,
            limit: String(limit),
            offset: String(offset),
            order: 'created_at.desc',
        });

        if (search) {
            const orClause = `name.ilike.%${search}%,location.ilike.%${search}%,bio.ilike.%${search}%`;
            query += (query.includes('?') ? '&' : '?') + `or=${encodeURIComponent(orClause)}`;
        }

        const apiPath = `/rest/v1/profiles${query}`;

        const response = await fetch(`${SUPABASE_URL}${apiPath}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Supabase error:', response.status, errorText);
            return res.status(500).json({ error: 'Database query failed', details: errorText.substring(0, 500) });
        }

        const data = await response.json();
        const countHeader = response.headers.get('content-range');
        let total = 0;
        if (countHeader) {
            const match = countHeader.match(/\d+\/(\d+)/);
            if (match) total = parseInt(match[1], 10);
        }

        return res.json({
            data,
            page,
            limit,
            total: total || data.length,
        });

    } catch (err) {
        console.error('Profiles handler error:', err.message);
        return res.status(500).json({ error: err.message });
    }
};
