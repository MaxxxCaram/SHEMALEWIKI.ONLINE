import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ───────── Interactive World Map ─────────
   Self-contained SVG world map (equirectangular 1000×500).
   Clickable continents → navigate to the browse-by-region page.
   Velvet Noir styling, hover glow + tooltip, no external deps. */

// Continent hit-areas (approximate, recognizable shapes on a 1000×500 canvas).
// Each maps to the CityGuide route /:continent (which filters profiles by region).
const CONTINENTS = [
  {
    id: 'north-america', slug: 'north-america',
    label: 'North America', labelEs: 'Norteamérica',
    d: 'M120,95 L210,80 L300,95 L330,130 L300,170 L270,200 L250,235 L215,225 L200,180 L160,170 L140,140 L120,115 Z',
    cx: 225, cy: 150,
  },
  {
    id: 'south-america', slug: 'south-america',
    label: 'South America', labelEs: 'Sudamérica',
    d: 'M250,255 L300,250 L325,285 L315,335 L290,400 L265,410 L255,360 L245,310 L240,275 Z',
    cx: 282, cy: 330,
  },
  {
    id: 'europe', slug: 'europe',
    label: 'Europe', labelEs: 'Europa',
    d: 'M465,90 L545,85 L560,115 L540,150 L500,165 L475,150 L465,120 Z',
    cx: 510, cy: 125,
  },
  {
    id: 'africa', slug: 'africa',
    label: 'Africa', labelEs: 'África',
    d: 'M470,180 L560,185 L600,230 L585,300 L540,375 L500,380 L480,320 L470,250 Z',
    cx: 530, cy: 280,
  },
  {
    id: 'asia', slug: 'asia',
    label: 'Asia', labelEs: 'Asia',
    d: 'M565,90 L720,75 L860,95 L885,150 L820,200 L760,215 L690,200 L620,180 L575,150 L560,115 Z',
    cx: 720, cy: 145,
  },
  {
    id: 'oceania', slug: 'oceania',
    label: 'Oceania', labelEs: 'Oceanía',
    d: 'M780,320 L860,315 L895,345 L880,390 L825,400 L795,375 L780,345 Z',
    cx: 835, cy: 360,
  },
];

export default function WorldMap({ brand = 'shemalewiki' }) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(null);
  const isES = brand === 'buscatrans';
  const base = isES ? '/es' : '';

  const go = (slug) => navigate(`${base}/${slug}`);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 920, margin: '0 auto' }}>
      <svg
        viewBox="0 0 1000 500"
        width="100%"
        style={{
          display: 'block',
          borderRadius: 18,
          background: 'radial-gradient(circle at 50% 40%, #0f172a 0%, #020617 100%)',
          border: '1px solid rgba(148,163,184,0.15)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
        }}
        role="img"
        aria-label="Interactive world map — browse profiles by region"
      >
        <defs>
          <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* faint lat/long grid */}
          {[100,200,300,400].map((y) => (
            <line key={'h'+y} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(148,163,184,0.07)" strokeWidth="1" />
          ))}
          {[200,400,600,800].map((x) => (
            <line key={'v'+x} x1={x} y1="0" x2={x} y2="500" stroke="rgba(148,163,184,0.07)" strokeWidth="1" />
          ))}
        </defs>

        {CONTINENTS.map((c) => {
          const active = hover === c.id;
          return (
            <g
              key={c.id}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHover(c.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => go(c.slug)}
            >
              <path
                d={c.d}
                fill={active ? 'url(#land)' : 'rgba(124,58,237,0.55)'}
                stroke={active ? '#a78bfa' : 'rgba(167,139,250,0.4)'}
                strokeWidth={active ? 2.5 : 1.2}
                filter={active ? 'url(#glow)' : 'none'}
                style={{ transition: 'all .2s ease' }}
              />
              <circle cx={c.cx} cy={c.cy} r={active ? 5 : 3.5} fill="#f0abfc" opacity={active ? 1 : 0.7} />
              {/* label on hover */}
              <text
                x={c.cx}
                y={c.cy - 14}
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fill="#f8fafc"
                opacity={active ? 1 : 0}
                style={{ transition: 'opacity .15s', pointerEvents: 'none', textShadow: '0 1px 4px #000' }}
              >
                {isES ? c.labelEs : c.label}
              </text>
            </g>
          );
        })}

        {/* hover tooltip box */}
        {hover && (() => {
          const c = CONTINENTS.find((x) => x.id === hover);
          return (
            <g pointerEvents="none">
              <rect x={Math.min(Math.max(c.cx - 70, 8), 832)} y={c.cy + 12} width="140" height="30" rx="8"
                fill="rgba(15,23,42,0.92)" stroke="rgba(167,139,250,0.5)" />
              <text x={Math.min(Math.max(c.cx, 78), 902)} y={c.cy + 31} textAnchor="middle" fontSize="13" fill="#e2e8f0">
                {isES ? 'Ver perfiles →' : 'Browse →'}
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Legend / hint */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center',
        marginTop: '1rem',
      }}>
        {CONTINENTS.map((c) => (
          <button
            key={c.id}
            onClick={() => go(c.id)}
            onMouseEnter={() => setHover(c.id)}
            onMouseLeave={() => setHover(null)}
            style={{
              background: hover === c.id ? 'rgba(124,58,237,0.35)' : 'rgba(148,163,184,0.08)',
              border: '1px solid rgba(167,139,250,0.3)',
              color: '#e2e8f0', borderRadius: 999, padding: '0.35rem 0.9rem',
              fontSize: '0.8rem', cursor: 'pointer', transition: 'all .15s',
            }}
          >
            {isES ? c.labelEs : c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
