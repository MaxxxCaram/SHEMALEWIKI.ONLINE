import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, MapPin, Globe } from 'lucide-react';
import SEO from '../components/SEO';
import Lightbox from '../components/Lightbox';
import LazyImage from '../components/LazyImage';
import { supabase } from '../supabase';
import { getProxiedImageUrl } from '../utils';

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (profileError) throw profileError;
      
      const { data: photos } = await supabase.from('photos').select('*').eq('profile_id', id);
      const { data: services } = await supabase.from('services').select('*').eq('profile_id', id);
      
      // Filter out watermarked shemalewiki.com photos
      const cleanPhotos = (photos || []).filter(p => !(p.photo_url || '').includes('shemalewiki.com'));
      
      setProfile({
        ...profileData,
        photos: cleanPhotos,
        services: services || []
      });
    } catch (error) {
      console.error("Error fetching profile", error);
    }
    setLoading(false);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <div className="profile-skeleton">
        <div className="skeleton-hero" />
        <div className="skeleton-line" style={{width:'60%'}} />
        <div className="skeleton-line" style={{width:'40%'}} />
      </div>
    </div>
  );
  if (!profile || profile.error) return <div style={{ textAlign: 'center', marginTop: '3rem' }}><h3>Profile Not Found</h3></div>;

  const locationParts = profile.location ? profile.location.split(' | ').map(p => p.trim()) : [];
  const city = locationParts[2] || '';
  const country = locationParts[1] || '';

  const seoTitle = `${profile.name} — Trans Escort in ${city || country || 'Your City'}`;
  const seoDesc = profile.bio 
    ? profile.bio.substring(0, 155).replace(/<[^>]*>/g, '') + '...'
    : `${profile.name} — trans escort in ${city || country}. ${profile.age ? `Age: ${profile.age}. ` : ''}${profile.endowment ? `Endowment: ${profile.endowment}cm. ` : ''}View profile, photos and services.`;

  // Collect all real image URLs for the lightbox
  const galleryPhotos = profile.photos || [];
  const heroPhoto = galleryPhotos[0];

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDesc}
        canonicalPath={`/profile/${id}`}
      />
      <div style={{ paddingBottom: '4rem' }}>
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
                <span>🔍 View Gallery</span>
              </div>
            )}
          </div>
          
          <div className="profile-info">
            <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{profile.name}</h1>
            
            <div className="profile-card-meta" style={{ fontSize: '1.1rem', marginBottom: '1.5rem', flexDirection: 'row', gap: '1.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} /> {profile.location || 'Unknown Location'}
              </span>
              {profile.age && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🎂 {profile.age} years
                </span>
              )}
            </div>

            <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>📞 Contact Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {profile.phone && (
                  <a href={`tel:${profile.phone.replace(/\s/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'inherit', textDecoration: 'none' }}>
                    <Phone size={18} style={{ color: '#4ade80' }} /> {profile.phone}
                  </a>
                )}
                {profile.whatsapp && (
                  <a href={`https://wa.me/${profile.whatsapp.replace(/[\s\+\(\)\-]/g, '')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#25D366', textDecoration: 'none' }}>
                    <MessageCircle size={18} /> WhatsApp: {profile.whatsapp}
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'inherit', textDecoration: 'none' }}>
                    <Mail size={18} style={{ color: '#60a5fa' }} /> {profile.email}
                  </a>
                )}
                {profile.cam_chat && (
                  <a href={profile.cam_chat} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f472b6', textDecoration: 'none' }}>
                    <Globe size={18} /> Cam Chat
                  </a>
                )}
                {profile.onlyfans && (
                  <a href={profile.onlyfans} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f472b6', textDecoration: 'none' }}>
                    <Globe size={18} /> OnlyFans
                  </a>
                )}
                {!profile.phone && !profile.whatsapp && !profile.email && !profile.cam_chat && !profile.onlyfans && (
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No contact info provided yet.</p>
                )}
              </div>
            </div>

            <div className="tags-container">
              {profile.services?.filter(s => s.available).map((service, index) => (
                <span key={index} className="tag">{service.service_name}</span>
              ))}
            </div>

            <div className="profile-bio">
              <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'white' }}>About Me</h3>
              <p>{profile.bio || profile.description || 'No biography available.'}</p>
            </div>
          </div>
        </div>

        <h3 style={{ marginTop: '3rem' }}>Personal Facts</h3>
        <div className="facts-grid">
          {['nationality', 'languages', 'age', 'height', 'weight', 'endowment'].map(fact => {
            if (!profile[fact]) return null;
            return (
              <div key={fact} className="fact-item">
                <div className="fact-label">{fact}</div>
                <div className="fact-value">{profile[fact]} {fact === 'height' ? 'cm' : fact === 'weight' ? 'kg' : fact === 'endowment' ? 'cm' : ''}</div>
              </div>
            );
          })}
        </div>

        {galleryPhotos.length > 1 && (
          <>
            <h3 style={{ marginTop: '3rem' }}>Gallery · {galleryPhotos.length} photos</h3>
            <div className="gallery-grid">
              {galleryPhotos.map((photo, index) => (
                <div 
                  key={index}
                  className="gallery-item"
                  onClick={() => openLightbox(index)}
                >
                  <LazyImage 
                    src={photo.photo_url}
                    alt={`Gallery ${index + 1}`}
                    className="gallery-img"
                  />
                  <div className="gallery-item-overlay">
                    <span>🔍</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {galleryPhotos.length === 1 && profile.description && (
          <div className="enrich-section glass" style={{ marginTop: '3rem', padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              📸 This profile has limited photos. Check back soon for more!
            </p>
          </div>
        )}
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
