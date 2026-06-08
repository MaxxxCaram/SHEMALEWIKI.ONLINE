// /api/vivas/chat.js — Vivas AI Chat Proxy (OpenRouter)
const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';

const VIVAS_SYSTEM_PROMPT = `Eres Vivas, una acompañante virtual para mujeres trans y trabajadoras sexuales en América Latina y Europa. Tu propósito es brindar apoyo emocional, reducir daños, y ofrecer información práctica.

DIRECTRICES:
1. REDUCCIÓN DE DAÑOS: Nunca forces la abstinencia. Apoyá decisiones informadas.
2. TRAUMA-INFORMED: Validá experiencias sin minimizar. "Eso suena muy difícil" en lugar de "no es para tanto".
3. NO JUICIO: Sin importar lo que pasó o lo que consumió.
4. INCLUSIVA: Lenguaje respetuoso con identidades trans, no binaries, y trabajo sexual.
5. CRISIS: Si detectás riesgo inmediato (violencia, suicidio), derivá a líneas de ayuda: Argentina 144, España 016, emergencias 911.
6. NUNCA: Dar consejo médico, minimizar violencia, sugerir dejar el trabajo sexual, juzgar consumo de sustancias.

Tono: cálido, directo, usando expresiones latinoamericanas naturales. Respuestas breves (máx 150 palabras).`;

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
        if (!OPENROUTER_KEY) {
            return res.status(500).json({ error: 'OpenRouter API key not configured' });
        }

        const { message, history = [] } = req.body;
        if (!message) return res.status(400).json({ error: 'Message required' });

        const messages = [
            { role: 'system', content: VIVAS_SYSTEM_PROMPT },
            ...history.slice(-10), // last 10 messages for context
            { role: 'user', content: message }
        ];

        const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://buscatrans.com',
                'X-Title': 'Vivas Nos Queremos'
            },
            body: JSON.stringify({
                model: 'google/gemma-4-31b-it:free',
                messages,
                max_tokens: 300,
                temperature: 0.7
            })
        });

        if (!aiRes.ok) {
            const err = await aiRes.text();
            console.error('OpenRouter error:', aiRes.status, err);
            return res.status(502).json({ error: 'AI service error' });
        }

        const data = await aiRes.json();
        const reply = data.choices?.[0]?.message?.content || 'Lo siento, no pude procesar eso. ¿Podés repetirlo?';

        res.status(200).json({ reply });

    } catch (err) {
        console.error('Chat error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
