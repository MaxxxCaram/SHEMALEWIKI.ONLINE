// Vercel Serverless Function: GET /api/profiles
// Fetches profiles from Supabase using HTTP REST (no external deps needed)
// Format: /api/profiles?page=1&limit=50&search=term

const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';

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

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Parse query params
    const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    const headers = supabaseHeaders({ "Prefer": "count=exact" });

    try {
        // Build the query URL
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
