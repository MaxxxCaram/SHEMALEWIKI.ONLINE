import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, Mail, MessageCircle, MapPin, RefreshCw } from 'lucide-react';
import { supabase } from '../supabase';
import { getProxiedImageUrl } from '../utils';

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);


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

  return (
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {profile.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone size={18} className="text-gradient" /> {profile.phone}
                </div>
              )}
              {profile.whatsapp && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MessageCircle size={18} style={{ color: '#25D366' }} /> {profile.whatsapp}
                </div>
              )}
              {profile.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={18} className="text-gradient" /> {profile.email}
                </div>
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
  );
}
