import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Heart } from 'lucide-react';
import { useState } from 'react';
import SEO from '../components/SEO';

/* ── Brand detection ── */
const isBT = () => typeof window !== 'undefined' && window.location.hostname.includes('buscatrans');

/* ── Content per brand ── */
const t = {
  shemalewiki: {
    eyebrow: 'International TS Escort Directory',
    heading: 'Find verified TS escorts',
    highlight: 'worldwide.',
    subtitle: '10,000+ profiles · 80 countries · Updated daily',
    searchPlaceholder: 'City, country or region...',
    pills: ['All', 'Bangkok', 'London', 'Miami', 'Amsterdam', 'São Paulo', 'Tokyo'],
    featuredTitle: 'Featured profiles',
    featuredLink: 'View all →',
    citiesTitle: 'Browse by region',
    citiesLink: 'Full map →',
    bottomNav: [
      { label: 'Home', icon: 'home', active: true },
      { label: 'Search', icon: 'search' },
      { label: 'Saved', icon: 'star' },
      { label: 'Account', icon: 'user' },
    ],
    heroLogo: true,
  },
  buscatrans: {
    eyebrow: 'El directorio que te ve como sos',
    heading: 'Encontrá tu',
    highlight: 'conexión perfecta.',
    subtitle: 'Perfiles verificados · Discreto · Seguro',
    searchPlaceholder: 'Ciudad o país...',
    pills: ['Todas', 'Buenos Aires', 'Ciudad de México', 'Madrid', 'Lima', 'Bogotá'],
    featuredTitle: 'Perfiles destacados',
    featuredLink: 'Ver todos →',
    citiesTitle: 'Por ciudad',
    citiesLink: 'Ver mapa →',
    bottomNav: [
      { label: 'Inicio', icon: 'home', active: true },
      { label: 'Buscar', icon: 'search' },
      { label: 'Guardados', icon: 'heart' },
      { label: 'Mi perfil', icon: 'user' },
    ],
    heroLogo: false,
  },
};

/* ── Featured profiles (demo data) ── */
const featuredProfiles = {
  shemalewiki: [
    { name: 'Alicia', location: 'Bangkok, TH', badge: { label: 'Verified', type: 'verified' }, tag: 'VIP' },
    { name: 'Jessica', location: 'London, UK', badge: { label: 'Premium', type: 'premium' }, tag: 'Verified' },
    { name: 'Camila', location: 'Miami, US', badge: { label: 'Online', type: 'live' }, tag: 'New' },
  ],
  buscatrans: [
    { name: 'Valentina', location: 'Buenos Aires', badge: { label: 'Verificada', type: 'verified' }, price: 'desde $80/h' },
    { name: 'Daniela', location: 'Ciudad de México', badge: { label: 'Premium', type: 'premium' }, price: 'desde $120/h' },
    { name: 'Sofía', location: 'Madrid', badge: { label: 'Nueva', type: 'new' }, price: 'desde $95/h' },
  ],
};

export default function Home() {
  const brand = isBT() ? 'buscatrans' : 'shemalewiki';
  const content = t[brand];
  const profiles = featuredProfiles[brand];
  const [activePill, setActivePill] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const canonPath = brand === 'buscatrans' ? '/es/' : '/';
  const lang = brand === 'buscatrans' ? 'es' : 'en';
  const siteName = brand === 'buscatrans' ? 'BuscaTrans' : 'ShemaleWiki';

  return (
    <>
      <SEO
        title={siteName === 'BuscaTrans' ? 'BuscaTrans — Directorio de Escorts Trans' : 'Trans Escort Directory'}
        description={content.subtitle}
        canonicalPath={canonPath}
        lang={lang}
      />

      {/* ── HERO ── */}
      <section className="hero-section">
        <p className="hero-eyebrow">{content.eyebrow}</p>
        <h1 className="hero-title">
          {content.heading}{' '}
          <span className="highlight">{content.highlight}</span>
        </h1>
        <p className="hero-subtitle">{content.subtitle}</p>

        {/* Search */}
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder={content.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary btn-lg">
            <Search size={18} />
            {brand === 'buscatrans' ? 'Buscar' : 'Search'}
          </button>
        </div>

        {/* Filter pills */}
        <div className="filter-pills">
          {content.pills.map((pill, i) => (
            <button
              key={pill}
              className={`filter-pill ${i === activePill ? 'active' : ''}`}
              onClick={() => setActivePill(i)}
            >
              {pill}
            </button>
          ))}
        </div>
      </section>

      {/* ── FEATURED PROFILES ── */}
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{content.featuredTitle}</h2>
          <a href="#" className="section-link">{content.featuredLink}</a>
        </div>

        <div className="profiles-grid">
          {profiles.map((p, i) => (
            <Link to="/europe/united-kingdom" key={i} className="glass-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ height: '280px', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '3rem' }}>
                👤
              </div>
              <div className="profile-card-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="profile-card-title">{p.name}</h3>
                  {p.tag && (
                    <span className="profile-card-badge badge-premium" style={{ fontSize: '0.65rem' }}>{p.tag}</span>
                  )}
                </div>
                <div className="profile-card-meta">
                  <span><MapPin size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{p.location}</span>
                  {p.price && <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{p.price}</span>}
                </div>
                <span className={`profile-card-badge badge-${p.badge.type}`}>{p.badge.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* ── CITY MAP SECTION ── */}
        <div className="section-header">
          <h2 className="section-title">{content.citiesTitle}</h2>
          <a href="#" className="section-link">{content.citiesLink}</a>
        </div>
        <div className="map-placeholder">
          <MapPin size={48} style={{ opacity: 0.3 }} />
          <p style={{ marginTop: '0.5rem' }}>
            {brand === 'buscatrans' ? 'Mapa interactivo de ciudades' : 'Interactive world map'}
          </p>
        </div>
      </div>

      <div style={{ height: '80px' }} />

      {/* ── BOTTOM NAV (mobile) ── */}
      <nav className="bottom-nav">
        <div className="bottom-nav-items">
          {content.bottomNav.map((item, i) => (
            <a key={i} className={`bottom-nav-item ${item.active ? 'active' : ''}`} href="#">
              {item.icon === 'home' && '🏠'}
              {item.icon === 'search' && '🔍'}
              {item.icon === 'star' && '⭐'}
              {item.icon === 'heart' && '❤️'}
              {item.icon === 'user' && '👤'}
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}