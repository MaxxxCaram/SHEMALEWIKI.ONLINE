import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Search } from 'lucide-react';
import SEO from '../components/SEO';
import logo from '../assets/logosw.png';

const isBT = () => typeof window !== 'undefined' && window.location.hostname.includes('buscatrans');
const getLang = () => {
  if (typeof window === 'undefined') return 'en';
  if (isBT() || (typeof window !== 'undefined' && window.location.pathname.startsWith('/es'))) return 'es';
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/pt')) return 'pt';
  return 'en';
};

const continents = [
  { name: 'Europe', icon: '🌍', color: '#4f8cff' },
  { name: 'Americas', icon: '🌎', color: '#ff6b6b' },
  { name: 'Asia', icon: '🌏', color: '#ffd93d' },
  { name: 'Oceania', icon: '🏄', color: '#6bcb77' },
  { name: 'Africa', icon: '🦁', color: '#ff922b' },
  { name: 'Other', icon: '🗺️', color: '#845ef7' },
];

/* ── Content per language ── */
const content = {
  en: {
    title: 'Trans Escort Directory — ShemaleWiki',
    desc: "Browse the world's largest multilingual directory of trans companions and profiles. Search by continent and country to find verified members near you.",
    heroEyebrow: 'INTERNATIONAL TS ESCORT DIRECTORY',
    heroHeading: 'Discover verified trans profiles worldwide.',
    heroSub: '10,000+ profiles · 80+ countries · Updated daily',
    searchPlaceholder: 'City, country or continent...',
    featuredTitle: 'Browse by Continent',
    featuredLink: 'Full directory →',
    dashboardLabel: 'Dashboard',
    backLabel: '← Back to home',
  },
  es: {
    title: 'Directorio de Perfiles Trans — BuscaTrans',
    desc: 'Explorá el directorio multilingüe más grande de perfiles trans verificados. Buscá por continente y país para encontrar miembros verificados cerca tuyo.',
    heroEyebrow: 'EL DIRECTORIO QUE TE VE COMO SOS',
    heroHeading: 'Encontrá tu conexión perfecta.',
    heroSub: 'Perfiles verificados · Discreto · Seguro',
    searchPlaceholder: 'Ciudad, país o continente...',
    featuredTitle: 'Explorá por Continente',
    featuredLink: 'Ver todos →',
    dashboardLabel: 'Panel Trans',
    backLabel: '← Volver al inicio',
  },
  pt: {
    title: 'Diretório de Perfis Trans — ShemaleWiki',
    desc: 'Explore o maior diretório multilíngue de perfis trans verificados. Pesquise por continente e país para encontrar membros verificados perto de você.',
    heroEyebrow: 'DIRETÓRIO INTERNACIONAL DE ESCORTS TS',
    heroHeading: 'Encontre perfis trans verificados no mundo todo.',
    heroSub: '10.000+ perfis · 80+ países · Atualizado diariamente',
    searchPlaceholder: 'Cidade, país ou continente...',
    featuredTitle: 'Explorar por Continente',
    featuredLink: 'Ver todos →',
    dashboardLabel: 'Painel',
    backLabel: '← Voltar ao início',
  },
};

export default function Continents() {
  const lang = getLang();
  const t = content[lang] || content.en;
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const bt = isBT();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;

    // Try to match continent
    const matchContinent = continents.find(c => c.name.toLowerCase() === q.toLowerCase());
    if (matchContinent) {
      navigate(`/${lang === 'es' ? 'es/' : lang === 'pt' ? 'pt/' : ''}${matchContinent.name.toLowerCase()}`);
      return;
    }
    // Navigate to the search results (Countries will handle)
    if (lang === 'es') navigate(`/es/${q.toLowerCase()}`);
    else if (lang === 'pt') navigate(`/pt/${q.toLowerCase()}`);
    else navigate(`/${q.toLowerCase()}`);
  };

  const langPrefix = lang === 'es' ? '/es' : lang === 'pt' ? '/pt' : '';

  return (
    <>
      <SEO
        title={t.title}
        description={t.desc}
        canonicalPath={lang === 'es' ? '/es/' : lang === 'pt' ? '/pt/' : '/'}
        alternates={[
          { lang: 'en', path: '/' },
          { lang: 'es', path: '/es/' },
          { lang: 'pt', path: '/pt/' },
        ]}
      />

      {/* ═══ HERO ═══ */}
      <section className="hero-section" style={{
        textAlign: 'center',
        padding: '4rem 1.5rem 3rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <p className="hero-eyebrow" style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: 'var(--accent-primary)',
          marginBottom: '1rem',
        }}>
          {t.heroEyebrow}
        </p>

        {!bt && (
          <img
            src={logo}
            alt="ShemaleWiki"
            style={{ height: '80px', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px rgba(201,162,39,0.3))' }}
          />
        )}

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: bt ? 'clamp(2.2rem, 6vw, 3.8rem)' : 'clamp(2.5rem, 7vw, 4.5rem)',
          fontWeight: 'var(--font-weight-display)',
          letterSpacing: 'var(--letter-spacing-display)',
          color: 'var(--text-primary)',
          marginBottom: '0.75rem',
          lineHeight: 1.1,
        }}>
          {t.heroHeading}
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.05rem',
          marginBottom: '2rem',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {t.heroSub}
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{
          display: 'flex',
          maxWidth: '520px',
          margin: '0 auto 2rem',
          gap: 0,
        }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            style={{
              flex: 1,
              padding: '0.9rem 1.2rem',
              fontSize: '1rem',
              fontFamily: 'var(--font-body)',
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
          <button type="submit" style={{
            padding: '0.9rem 1.5rem',
            background: bt
              ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
              : 'var(--accent-primary)',
            border: 'none',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
            color: bt ? '#fff' : '#0a0a0a',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <Search size={18} />
            {lang === 'es' ? 'Buscar' : lang === 'pt' ? 'Buscar' : 'Search'}
          </button>
        </form>

        {/* Dashboard button */}
        <Link
          to="/dashboard/login"
          className="btn btn-primary"
          style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}
        >
          {t.dashboardLabel}
        </Link>
      </section>

      {/* ═══ CONTINENT GRID ═══ */}
      <section style={{ padding: '0 1.5rem 3rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1100px',
          margin: '0 auto 1.5rem',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.8rem',
            fontWeight: 'var(--font-weight-display)',
            letterSpacing: 'var(--letter-spacing-display)',
            color: 'var(--text-primary)',
          }}>
            {t.featuredTitle}
          </h2>
        </div>

        <div className="continents-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          {continents.map((continent) => (
            <Link
              key={continent.name}
              to={`${langPrefix}/${continent.name.toLowerCase()}`}
              className="continent-card"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem 1.2rem',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'var(--transition)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div className="continent-icon" style={{
                fontSize: '2.8rem',
                lineHeight: 1,
              }}>
                {continent.icon}
              </div>
              <h2 className="continent-title" style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                fontWeight: 'var(--font-weight-display)',
                letterSpacing: 'var(--letter-spacing-display)',
                color: 'var(--text-primary)',
                margin: 0,
              }}>
                {continent.name}
              </h2>
              <div className="continent-explore" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--accent-primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}>
                <span>{lang === 'es' ? 'Explorar' : lang === 'pt' ? 'Explorar' : 'Explore'}</span>
                <Globe size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
