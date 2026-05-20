import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, MapPin, Lock } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase } from '../supabase';
import { getProxiedImageUrl } from '../utils';

/**
 * Obfuscate phone numbers: show last 4 digits, mask the rest.
 * Example: "(+31) 633455867" → "(+31) ****5867"
 */
function obfuscatePhone(phone) {
  if (!phone) return null;
  // Keep country code visible, mask middle digits, show last 4
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.length <= 4) return phone;
  const last4 = cleaned.slice(-4);
  const prefix = cleaned.slice(0, cleaned.length - 4);
  const masked = prefix.replace(/\d/g, '*');
  // Reconstruct with original formatting hints
  return masked + last4;
}

/**
 * Obfuscate email: show first char + domain, mask middle.
 * Example: "shemale.aaliyah@gmail.com" → "s*******.a*******@gmail.com"
 */
function obfuscateEmail(email) {
  if (!email) return null;
  const [localPart, domain] = email.split('@');
  if (!domain) return email;
  const parts = localPart.split('.');
  const masked = parts.map(p => p[0] + '*'.repeat(Math.max(0, p.length - 1))).join('.');
  return `${masked}@${domain}`;
}

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (profileError) throw profileError;
      
      const { data: photos } = await supabase.from('photos').select('*').eq('profile_id', id);
      const { data: services } = await supabase.from('services').select('*').eq('profile_id', id);
      
      setProfile({
        ...profileData,
        photos: photos || [],
        services: services || []
      });
    } catch (error) {
      console.error("Error fetching profile", error);
    }
    setLoading(false);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}><h3>Loading Profile...</h3></div>;
  if (!profile || profile.error) return <div style={{ textAlign: 'center', marginTop: '3rem' }}><h3>Profile Not Found</h3></div>;

  // Extract city from location (e.g. "Europe | Netherlands | Amsterdam")
  const locationParts = profile.location ? profile.location.split(' | ').map(p => p.trim()) : [];
  const city = locationParts[2] || '';
  const country = locationParts[1] || '';

  const seoTitle = `${profile.name} — Trans Escort in ${city || country || 'Your City'}`;
  const seoDesc = profile.bio 
    ? profile.bio.substring(0, 155).replace(/<[^>]*>/g, '') + '...'
    : `${profile.name} — trans escort in ${city || country}. ${profile.age ? `Age: ${profile.age}. ` : ''}${profile.endowment ? `Endowment: ${profile.endowment}cm. ` : ''}View profile, photos and services.`;

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDesc}
        canonicalPath={`/profile/${id}`}
      />
      <div style={{ paddingBottom: '4rem' }}>
        <div className="profile-header">
          <img 
            src={getProxiedImageUrl(profile.photos?.find(p => !p.photo_url.includes('archive.org'))?.photo_url || profile.photos?.[0]?.photo_url)} 
            alt={profile.name} 
            className="profile-hero-img" 
          />
          
          <div className="profile-info">
            <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{profile.name}</h1>
            
            <div className="profile-card-meta" style={{ fontSize: '1.1rem', marginBottom: '1.5rem', flexDirection: 'row', gap: '1.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} /> {profile.location || 'Unknown Location'}
              </span>
            </div>

            <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Contact Info</h3>
              {!showContact ? (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    Contact details are hidden for privacy. Click below to reveal.
                  </p>
                  <button 
                    onClick={() => setShowContact(true)}
                    className="btn btn-primary"
                    style={{ gap: '0.5rem' }}
                  >
                    <Lock size={16} />
                    Show Contact Info
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {profile.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Phone size={18} className="text-gradient" /> {obfuscatePhone(profile.phone)}
                    </div>
                  )}
                  {profile.whatsapp && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <MessageCircle size={18} style={{ color: '#25D366' }} /> {obfuscatePhone(profile.whatsapp)}
                    </div>
                  )}
                  {profile.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Mail size={18} className="text-gradient" /> {obfuscateEmail(profile.email)}
                    </div>
                  )}
                </div>
              )}
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

        {profile.photos && profile.photos.length > 1 && (
          <>
            <h3 style={{ marginTop: '3rem' }}>Gallery</h3>
            <div className="gallery-grid">
              {profile.photos.filter(p => !p.photo_url.includes('archive.org')).map((photo, index) => (
                <img key={index} src={getProxiedImageUrl(photo.photo_url)} alt={`Gallery ${index}`} className="gallery-img" />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
