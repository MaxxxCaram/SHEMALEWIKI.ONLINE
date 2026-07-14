import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import useScrollReveal from '../useScrollReveal';
import { supabase } from '../supabase';

/* ── Brand detection ── */
const isBT = () => typeof window !== 'undefined' && window.location.hostname.includes('buscatrans');

/* ── Content per brand ── */
const t = {
  shemalewiki: {
    eyebrow: 'International Trans Community Directory',
    heading: 'Discover verified trans profiles',
    highlight: 'worldwide.',
    subtitle: '10,000+ profiles · 80 countries · Updated daily · v2-photos',
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

export default function Home() {
  const brand = isBT() ? 'buscatrans' : 'shemalewiki';
  const content = t[brand];
  const [activePill, setActivePill] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Vanguard scroll-reveal for ShemaleWiki feature cards + city block
  useScrollReveal([profiles]);

  const canonPath = brand === 'buscatrans' ? '/es/' : '/';
  const lang = brand === 'buscatrans' ? 'es' : 'en';
  const siteName = brand === 'buscatrans' ? 'BuscaTrans' : 'ShemaleWiki';

  // Fetch real approved profiles that HAVE photos. The DB stores 42k+ photos
  // in Supabase Storage, linked from the `photos` table by profile_id. Most
  // recent profiles lack photos, so we query the photo table first to get the
  // profile_ids that actually have images, then fetch those profiles.
  useEffect(() => {
    (async () => {
      try {
        // 1. Get profile_ids that have at least one REAL photo in Supabase Storage
        //    (web.archive.org URLs are blocked by the browser, so we exclude them)
        const { data: photoRows, error: e0 } = await supabase
          .from('photos')
          .select('profile_id, photo_url')
          .not('photo_url', 'is', null)
          .limit(2000);

        if (e0) throw e0;

        // Aceptar fotos que CARGAN en el browser: Supabase Storage + static2.eros.bz
        // (Spain tiene 138 perfiles con foto cargable entre ambos; NL solo kinky.nl bloqueado)
        const LOADABLE = ['qtuzpswxzengqoqqwtpt.supabase.co/storage', 'static2.eros.bz'];
        const validIds = Array.from(
          new Set(
            (photoRows || [])
              .filter(p => p.profile_id && p.photo_url && LOADABLE.some(h => p.photo_url.includes(h)))
              .map(p => p.profile_id)
          )
        );

        let arr = [];
        if (validIds.length > 0) {
          // 2. Fetch those profiles (with their photos embedded)
          const { data: withPhotos, error: e1 } = await supabase
            .from('profiles')
            .select('*, photos(photo_url, local_path)')
            .in('id', validIds.slice(0, 100))
            .not('cam_chat', 'eq', 'rejected')
            .order('created_at', { ascending: false })
            .limit(12);

          if (e1) throw e1;
          arr = Array.isArray(withPhotos) ? withPhotos : [];
        }

        // 3. If we still need more to fill the grid, grab recent approved profiles
        if (arr.length < 12) {
          const { data: recent, error: e2 } = await supabase
            .from('profiles')
            .select('*, photos(photo_url, local_path)')
            .not('cam_chat', 'eq', 'rejected')
            .order('created_at', { ascending: false })
            .limit(12);
          if (!e2 && Array.isArray(recent)) {
            const have = new Set(arr.map(p => p.id));
            for (const p of recent) {
              if (!have.has(p.id)) arr.push(p);
              if (arr.length >= 12) break;
            }
          }
        }

        setProfiles(arr.slice(0, 12));
      } catch (err) {
        console.error('Home fetch failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getCitySlug = (location) => {
    const parts = (location || '').split(' | ');
    const city = parts[parts.length - 1];
    return city.toLowerCase().replace(/\s+/g, '-');
  };

  const getContinentSlug = (location) => {
    const parts = (location || '').split(' | ');
    return parts[0]?.toLowerCase() || 'europe';
  };

  const getCountrySlug = (location) => {
    const parts = (location || '').split(' | ');
    return parts[1]?.toLowerCase() || '';
  };

  const getProfilePhoto = (p) => {
    if (p.photos && p.photos.length > 0) {
      // Preferir fotos de Supabase Storage (cargan en el navegador).
      // web.archive.org no permite hotlinking y el browser las bloquea.
      const storagePhotos = p.photos.filter(ph =>
        ph.photo_url && ph.photo_url.includes('qtuzpswxzengqoqqwtpt.supabase.co/storage')
      );
      const pool = storagePhotos.length > 0 ? storagePhotos : p.photos;
      const cover = pool.find(ph => ph.local_path === 'cover');
      return cover ? cover.photo_url : pool[0].photo_url;
    }
    return null;
  };

  const getProfileLink = (p) => {
    const continent = getContinentSlug(p.location);
    const country = getCountrySlug(p.location);
    const city = getCitySlug(p.location);
    if (continent && country && city) return `/${continent}/${country}/${city}`;
    return `/profile/${p.id}`;
  };

  return (
    <>
      <SEO
        title={siteName === 'BuscaTrans' ? 'BuscaTrans — Comunidad Global de Mujeres Trans Verificadas' : 'Trans Community Directory'}
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
            aria-label={brand === 'buscatrans' ? 'Buscar perfiles por ciudad o país' : 'Search profiles by city or country'}
            placeholder={content.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { window.location.href = brand === 'buscatrans' ? `/es/europe${searchQuery ? '?search=' + encodeURIComponent(searchQuery) : ''}` : `/europe${searchQuery ? '?search=' + encodeURIComponent(searchQuery) : ''}`; } }}
          />
          <Link to={brand === 'buscatrans' ? '/es/europe' : '/europe'} className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
            <Search size={18} />
            {brand === 'buscatrans' ? 'Buscar' : 'Search'}
          </Link>
        </div>

        {/* Filter pills — functional: navigate to city search */}
        <div className="filter-pills" role="group" aria-label={brand === 'buscatrans' ? 'Filtrar por ciudad' : 'Filter by city'}>
          {content.pills.map((pill, i) => {
            const isAll = pill === 'All' || pill === 'Todas';
            const searchTarget = isAll
              ? (brand === 'buscatrans' ? '/es/europe' : '/europe')
              : (brand === 'buscatrans' ? `/es/europe?search=${encodeURIComponent(pill)}` : `/europe?search=${encodeURIComponent(pill)}`);
            return (
              <Link
                key={pill}
                to={searchTarget}
                className={`filter-pill ${i === activePill ? 'active' : ''}`}
                onClick={() => setActivePill(i)}
              >
                {pill}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── FEATURED PROFILES ── */}
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{content.featuredTitle}</h2>
          <Link to={brand === 'buscatrans' ? '/es/europe' : '/europe'} className="section-link">{content.featuredLink}</Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : profiles.length > 0 ? (
          <div className="profiles-grid">
            {profiles.map((p, i) => {
              const photo = getProfilePhoto(p);
              const link = getProfileLink(p);
              return (
                <Link to={link} key={p.id} className="glass-card sw-reveal" style={{ textDecoration: 'none', color: 'inherit', '--sw-delay': `${i * 0.06}s` }}>
                  <div style={{ 
                    height: '280px', 
                    background: photo ? `url(${photo}) center/cover` : 'var(--card-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-secondary)', fontSize: '3rem', position: 'relative'
                  }}>
                    {!photo && '👤'}
                  </div>
                  <div className="profile-card-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 className="profile-card-title">{p.name}</h3>
                      {p.cam_chat === 'approved' && (
                        <span className="profile-card-badge badge-premium" style={{ fontSize: '0.65rem', background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>Verified</span>
                      )}
                    </div>
                    <div className="profile-card-meta">
                      <span><MapPin size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{getCitySlug(p.location).replace(/-/g, ' ') || p.location}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            <p>{brand === 'buscatrans' ? 'No hay perfiles todavía. ¡Sé la primera en registrarte!' : 'No approved profiles yet. Be the first!'}</p>
            <Link to={brand === 'buscatrans' ? '/registro' : '/register'} className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}>
              {brand === 'buscatrans' ? 'Crear perfil' : 'List your profile'}
            </Link>
          </div>
        )}

        {/* ── CITY MAP SECTION ── */}
        <div className="section-header sw-reveal">
          <h2 className="section-title">{content.citiesTitle}</h2>
          <Link to={brand === 'buscatrans' ? '/es/europe' : '/europe'} className="section-link">{content.citiesLink}</Link>
        </div>
        <div className="map-placeholder sw-reveal">
          <MapPin size={48} style={{ opacity: 0.3 }} />
          <p style={{ marginTop: '0.5rem' }}>
            {brand === 'buscatrans' ? 'Mapa interactivo de ciudades' : 'Interactive world map'}
          </p>
        </div>
      </div>

      <div style={{ height: '80px' }} />

      {/* ── BOTTOM NAV (mobile) ── */}
      <nav className="bottom-nav" aria-label={brand === 'buscatrans' ? 'Navegación' : 'Navigation'}>
        <div className="bottom-nav-items">
          {content.bottomNav.map((item, i) => {
            const linkMap = {
              home: brand === 'buscatrans' ? '/es/' : '/',
              search: brand === 'buscatrans' ? '/es/europe' : '/europe',
              star: brand === 'buscatrans' ? '/es/europe' : '/europe',
              heart: brand === 'buscatrans' ? '/es/europe' : '/europe',
              user: '/dashboard/login',
            };
            return (
              <Link
                key={i}
                to={linkMap[item.icon] || '/'}
                className={`bottom-nav-item ${item.active ? 'active' : ''}`}
                aria-label={item.label}
              >
                {item.icon === 'home' && '🏠'}
                {item.icon === 'search' && '🔍'}
                {item.icon === 'star' && '⭐'}
                {item.icon === 'heart' && '❤️'}
                {item.icon === 'user' && '👤'}
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
