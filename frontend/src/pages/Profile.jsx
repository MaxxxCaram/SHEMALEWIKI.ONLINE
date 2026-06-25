import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, MapPin, Globe, Share2, Flag, ChevronLeft, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import Lightbox from '../components/Lightbox';
import LazyImage from '../components/LazyImage';
import { supabase } from '../supabase';
import { getProxiedImageUrl } from '../utils';

const serviceIcons = {
  'incall': '🏠', 'outcall': '🚗', 'gfe': '💕', 'pse': '⭐',
  'anal': '🍑', 'oral': '👄', 'bdsm': '⛓️', 'fetish': '🎭',
  'massage': '💆', 'kissing': '💋', 'overnight': '🌙',
};

function cityToSlug(city) {
  return city.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [similarProfiles, setSimilarProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactVisible, setContactVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchProfile();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', id).not('cam_chat', 'eq', 'rejected').single();
      if (profileError) throw profileError;
      
      const { data: photos } = await supabase.from('photos').select('*').eq('profile_id', id);
      const { data: services } = await supabase.from('services').select('*').eq('profile_id', id);
      
      const cleanPhotos = (photos || []).filter(p => !(p.photo_url || '').includes('shemalewiki.com'));
      
      setProfile({
        ...profileData,
        photos: cleanPhotos,
        services: services || []
      });

      // Fetch similar profiles from same city
      const locParts = (profileData.location || '').split(' | ').map(p => p.trim());
      const city = locParts[locParts.length - 1];
      if (city) {
        const { data: similar } = await supabase
          .from('profiles')
          .select('*, photos(photo_url, local_path)')
          .ilike('location', `% | ${city}`)
          .neq('id', id)
          .limit(4);
        if (similar) {
          setSimilarProfiles(Array.isArray(similar) ? similar.map(p => ({
            ...p,
            photos: (p.photos || []).filter(ph => !(ph.photo_url || '').includes('shemalewiki.com'))
          })).filter(p => p.photos.length > 0) : []);
        }
      }
    } catch (error) {
      console.error("Error fetching profile", error);
      setProfile({ error: true });
    }
    setLoading(false);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: profile.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  if (loading) return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div className="profile-skeleton">
        <div className="skeleton-hero" />
        <div className="skeleton-line" style={{width:'60%', marginTop:'1rem'}} />
        <div className="skeleton-line" style={{width:'40%'}} />
      </div>
    </div>
  );
  if (!profile || profile.error) return (
    <div className="container" style={{ textAlign: 'center', marginTop: '4rem', paddingBottom: '4rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>😕</h2>
      <h3>Profile Not Found</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        This profile may have been removed or the link is incorrect.
      </p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );

  const locationParts = (profile.location || '').split(' | ').map(p => p.trim());
  const city = locationParts[locationParts.length - 1] || '';
  const country = locationParts[locationParts.length - 2] || '';
  const continent = locationParts.length >= 3 ? locationParts[0].toLowerCase() : '';
  const contMap = { 'europe': 'europe', 'americas': 'americas', 'asia': 'asia', 'oceania': 'oceania', 'africa': 'africa' };
  const contSlug = contMap[continent] || 'europe';
  const countrySlug = country.toLowerCase().replace(/\s+/g, '-');
  const citySlug = cityToSlug(city);

  const seoTitle = `${profile.name} — Trans Companion in ${city || country}`;
  const seoDesc = profile.bio 
    ? profile.bio.substring(0, 150).replace(/<[^>]*>/g, '').replace(/"/g, "'").trim() + '...'
    : `${profile.name} — independent trans companion in ${city}, ${country}. ${profile.age ? `Age ${profile.age}. ` : ''}View photos, services, and verified contact info.`;

  const seoKeywords = [
    profile.name, `trans companion ${city}`, `ts ${city}`, `shemale ${city}`,
    country ? `trans ${country}` : '', profile.age ? `${profile.age} years` : ''
  ].filter(Boolean).join(', ');

  const galleryPhotos = profile.photos || [];
  const heroPhoto = galleryPhotos.find(p => p.local_path === 'cover') || galleryPhotos[0];

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': profile.name,
    'description': profile.bio || profile.description,
    'address': { '@type': 'PostalAddress', 'addressLocality': city, 'addressCountry': country },
    'image': heroPhoto?.photo_url,
    ...(profile.age ? { 'birthDate': String(new Date().getFullYear() - Number(profile.age)) } : {})
  };

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        canonicalPath={`/profile/${id}`}
        jsonLd={jsonLd}
      />
      <div className="container" style={{ padding: '1.5rem 0 4rem' }}>
        
        {/* Breadcrumb */}
        <nav className="city-breadcrumb" style={{ marginBottom: '1.5rem' }}>
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-sep">›</span>
          {continent && country && (
            <>
              <Link to={`/${contSlug}`} className="breadcrumb-link">
                {continent.charAt(0).toUpperCase() + continent.slice(1)}
              </Link>
              <span className="breadcrumb-sep">›</span>
              <Link to={`/${contSlug}/${countrySlug}`} className="breadcrumb-link">
                {country}
              </Link>
            </>
          )}
          {!continent && (
            <Link to="/" className="breadcrumb-link">Directory</Link>
          )}
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{profile.name}</span>
        </nav>

        {/* Profile Header */}
        <div className="profile-header">
          <div 
            className="profile-hero-wrapper"
            onClick={() => heroPhoto && openLightbox(0)}
            style={{ cursor: heroPhoto ? 'pointer' : 'default' }}
          >
            <LazyImage 
              src={heroPhoto?.photo_url}
              alt={profile.name}
              className="profile-hero-img"
            />
            {heroPhoto && (
              <div className="hero-img-overlay">
                <span>🔍 View Gallery · {galleryPhotos.length} photos</span>
              </div>
            )}
            {!heroPhoto && (
              <div className="hero-img-overlay" style={{ opacity: 1 }}>
                <span>📷 No photos yet</span>
              </div>
            )}
          </div>
          
          <div className="profile-info">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: 1.1 }}>
                {profile.name}
              </h1>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={handleShare} className="icon-btn" title="Share" aria-label="Share profile"
                  style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'var(--transition)' }}>
                  <Share2 size={18} />
                </button>
                <button title="Report" aria-label="Report profile"
                  style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'var(--transition)' }}
                  onClick={() => alert('To report this profile, please email report@shemalewiki.online')}>
                  <Flag size={18} />
                </button>
              </div>
            </div>
            
            <div className="profile-card-meta" style={{ fontSize: '1.05rem', marginBottom: '1.25rem', flexDirection: 'row', gap: '1.5rem', flexWrap: 'wrap' }}>
              {profile.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} /> {profile.location}
                </span>
              )}
              {profile.age && (
                <span>🎂 {profile.age} years</span>
              )}
              {profile.nationality && (
                <span>🌍 {profile.nationality}</span>
              )}
              {profile.languages && (
                <span>🗣️ {profile.languages}</span>
              )}
            </div>

            {/* Contact Card */}
            <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }}>
              {!contactVisible ? (
                <button 
                  onClick={() => setContactVisible(true)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '1.1rem' }}
                >
                  <Phone size={20} style={{ marginRight: '0.5rem' }} />
                  Show Contact Info
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    📞 Contact {profile.name}
                  </h3>
                  {profile.phone && (
                    <ContactRow icon={<Phone size={18} />} color="#4ade80" label="Phone" value={profile.phone} href={`tel:${profile.phone.replace(/\s/g, '')}`} />
                  )}
                  {profile.whatsapp && (
                    <ContactRow icon={<MessageCircle size={18} />} color="#25D366" label="WhatsApp" value={profile.whatsapp} 
                      href={`https://wa.me/${profile.whatsapp.replace(/[\s\+\-\(\)]/g, '')}`} external />
                  )}
                  {profile.email && (
                    <ContactRow icon={<Mail size={18} />} color="#60a5fa" label="Email" value={profile.email} href={`mailto:${profile.email}`} />
                  )}
                  {profile.onlyfans && (() => {
                    const links = profile.onlyfans.split(/,\s*/).filter(Boolean);
                    if (links.length === 1) {
                      const label = links[0].includes('onlyfans.com') ? 'OnlyFans' : 'Video Link';
                      return <ContactRow icon={<Globe size={18} />} color="#f472b6" label={label} value="View" href={links[0]} external />;
                    }
                    return (
                      <div style={{ padding: '0.5rem 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <Globe size={18} color="#f472b6" />
                          <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>🎥 Video Links</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {links.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                              style={{ background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.3)', color: '#f472b6', padding: '0.3rem 0.7rem', borderRadius: '0.4rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                              Video {i + 1} ↗
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  {!profile.phone && !profile.whatsapp && !profile.email && !profile.onlyfans && (
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center' }}>
                      Contact information coming soon. Check back later!
                    </p>
                  )}
                  <button 
                    onClick={() => setContactVisible(false)}
                    style={{ 
                      background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)',
                      padding: '0.4rem', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem',
                      marginTop: '0.3rem', transition: 'var(--transition)'
                    }}
                    onMouseOver={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.color = 'var(--text-primary)'; }}
                    onMouseOut={e => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.color = 'var(--text-secondary)'; }}
                  >
                    Hide contact info
                  </button>
                </div>
              )}
            </div>

            {/* Services */}
            {profile.services?.filter(s => s.available).length > 0 && (
              <div className="tags-container" style={{ marginBottom: '1.5rem' }}>
                {profile.services.filter(s => s.available).map((service, index) => (
                  <span key={index} className="tag" title={service.service_name}>
                    {serviceIcons[service.service_name?.toLowerCase()] || '✔️'} {service.service_name}
                  </span>
                ))}
              </div>
            )}

            {/* Bio */}
            {(profile.bio || profile.description) && (
              <div className="profile-bio glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1.2rem' }}>About Me</h3>
                <p style={{ lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                  {profile.bio || profile.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Personal Facts */}
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>Personal Facts</h2>
          <div className="facts-grid">
            {[
              { key: 'age', label: 'Age', icon: '🎂' },
              { key: 'nationality', label: 'Nationality', icon: '🌍' },
              { key: 'languages', label: 'Languages', icon: '🗣️' },
              { key: 'height', label: 'Height', suffix: 'cm', icon: '📏' },
              { key: 'weight', label: 'Weight', suffix: 'kg', icon: '⚖️' },
              { key: 'endowment', label: 'Endowment', icon: '✨' },
            ].filter(f => profile[f.key]).map(({ key, label, suffix, icon }) => (
              <div key={key} className="fact-item">
                <div className="fact-label">{icon} {label}</div>
                <div className="fact-value">{profile[key]}{suffix ? ` ${suffix}` : ''}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        {galleryPhotos.length > 1 && (
          <section style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              Gallery · {galleryPhotos.length} photos
            </h2>
            <div className="gallery-grid">
              {galleryPhotos.map((photo, index) => (
                <div 
                  key={index}
                  className="gallery-item"
                  onClick={() => openLightbox(index)}
                >
                  <LazyImage 
                    src={photo.photo_url}
                    alt={`${profile.name} photo ${index + 1}`}
                    className="gallery-img"
                  />
                  <div className="gallery-item-overlay">
                    <span>🔍</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Profiles */}
        {similarProfiles.length > 0 && (
          <section style={{ marginTop: '3rem', borderTop: '1px solid var(--glass-border)', paddingTop: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              More Companions in {city}
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
              gap: '1rem' 
            }}>
              {similarProfiles.map(sp => (
                <Link to={`/profile/${sp.id}`} key={sp.id} className="glass-card profile-card" style={{ textDecoration: 'none' }}>
                  <LazyImage
                    src={(sp.photos || []).find(p => p.local_path === 'cover')?.photo_url || sp.photos?.[0]?.photo_url}
                    alt={sp.name}
                    className="profile-card-img"
                  />
                  <div className="profile-card-gradient" />
                  <div className="profile-card-content">
                    <h3 className="profile-card-title">{sp.name}</h3>
                    <div className="profile-card-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={12} /> {sp.location || city}
                      </span>
                      {sp.age && <span>{sp.age} yrs</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to browse */}
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {city && country && (
            <Link to={`/${contSlug}/${countrySlug}/${citySlug}`} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={16} /> All companions in {city}
            </Link>
          )}
          <Link to="/" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ChevronLeft size={16} /> Home
          </Link>
        </div>

      </div>

      {lightboxOpen && (
        <Lightbox
          images={galleryPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}

// Contact row component
function ContactRow({ icon, color, label, value, href, external }) {
  const target = external ? { target: '_blank', rel: 'noreferrer' } : {};
  return (
    <a href={href} {...target}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '0.75rem', 
        color: 'var(--text-primary)', textDecoration: 'none',
        padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)',
        background: 'rgba(255,255,255,0.03)', transition: 'var(--transition)',
        border: '1px solid transparent'
      }}
      onMouseOver={e => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.borderColor = 'var(--glass-border)'; }}
      onMouseOut={e => { e.target.style.background = 'rgba(255,255,255,0.03)'; e.target.style.borderColor = 'transparent'; }}
    >
      <span style={{ color, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{value}</span>
    </a>
  );
}
