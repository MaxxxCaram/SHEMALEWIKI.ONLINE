import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save, User, Camera, Settings, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../supabase';
import { getProxiedImageUrl } from '../utils';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const navigate = useNavigate();

  // Media upload state
  const [mediaFile, setMediaFile] = useState(null);
  const [videoLink, setVideoLink] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [userMedia, setUserMedia] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('dashboard_user_id');
    if (!userId) {
      navigate('/dashboard/login');
      return;
    }
    fetchProfile(userId);
  }, [navigate]);

  const fetchProfile = async (id) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (error) throw error;
      setProfile(data || {});

      // Fetch user media (photos/videos)
      const { data: mediaData } = await supabase.from('photos').select('*').eq('profile_id', id);
      if (mediaData) setUserMedia(mediaData);
    } catch (error) {
      console.error("Error fetching profile", error);
      localStorage.removeItem('dashboard_user_id');
      navigate('/dashboard/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dashboard_user_id');
    navigate('/dashboard/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (index, value) => {
    // Location format: Continent | Country | City
    const parts = (profile.location || 'Other | Unknown | Unknown').split(' | ');
    parts[index] = value || 'Unknown';
    setProfile(prev => ({ ...prev, location: parts.join(' | ') }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id);
        
      if (error) throw error;
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error updating profile", error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleMediaUpload = async (e) => {
    e.preventDefault();
    if (!mediaFile) return;

    setUploadingMedia(true);
    setUploadMessage('');

    const formData = new FormData();
    formData.append('media', mediaFile);
    formData.append('profile_id', profile.id);

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setUploadMessage('Media uploaded successfully!');
      setMediaFile(null);
      // Refresh media list
      const { data: mediaData } = await supabase.from('photos').select('*').eq('profile_id', profile.id);
      if (mediaData) setUserMedia(mediaData);

      setTimeout(() => setUploadMessage(''), 3000);
    } catch (error) {
      console.error("Error uploading media", error);
      setUploadMessage('Failed to upload media.');
    } finally {
      setUploadingMedia(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!profile) return null;

  const locationParts = (profile.location || 'Other | Unknown | Unknown').split(' | ');
  const country = locationParts[1] || '';
  const city = locationParts[2] || '';

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Trans Dashboard</h1>
          <p className="page-subtitle">Welcome back, {profile.name}</p>
        </div>
        <button onClick={handleLogout} className="btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Sidebar */}
        <div className="glass-card" style={{ padding: '1.5rem', width: '250px', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('personal')}
              className="btn" 
              style={{ background: activeTab === 'personal' ? 'rgba(236, 72, 153, 0.1)' : 'transparent', color: activeTab === 'personal' ? 'var(--accent-primary)' : 'var(--text-primary)', justifyContent: 'flex-start', border: activeTab === 'personal' ? '1px solid rgba(236, 72, 153, 0.2)' : '1px solid transparent' }}
            >
              <User size={18} /> Update Data
            </button>
            <button 
              onClick={() => setActiveTab('ad')}
              className="btn" 
              style={{ background: activeTab === 'ad' ? 'rgba(236, 72, 153, 0.1)' : 'transparent', color: activeTab === 'ad' ? 'var(--accent-primary)' : 'var(--text-primary)', justifyContent: 'flex-start', border: activeTab === 'ad' ? '1px solid rgba(236, 72, 153, 0.2)' : '1px solid transparent' }}
            >
              <Settings size={18} /> Edit Ad
            </button>
            <button 
              onClick={() => setActiveTab('media')}
              className="btn" 
              style={{ background: activeTab === 'media' ? 'rgba(236, 72, 153, 0.1)' : 'transparent', color: activeTab === 'media' ? 'var(--accent-primary)' : 'var(--text-primary)', justifyContent: 'flex-start', border: activeTab === 'media' ? '1px solid rgba(236, 72, 153, 0.2)' : '1px solid transparent' }}
            >
              <ImageIcon size={18} /> Upload Photos/Videos
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="glass-card" style={{ padding: '2rem', flex: 1, minWidth: '300px' }}>
          {message && activeTab !== 'media' && (
            <div style={{ background: message.includes('success') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.includes('success') ? '#22c55e' : '#ef4444', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', border: `1px solid ${message.includes('success') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
              {message}
            </div>
          )}

          {activeTab === 'personal' && (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Personal Data</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Name</label>
                    <input type="text" name="name" className="search-input" style={{ width: '100%', padding: '0.75rem 1rem' }} value={profile.name || ''} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
                    <input type="email" name="email" className="search-input" style={{ width: '100%', padding: '0.75rem 1rem' }} value={profile.email || ''} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone</label>
                    <input type="text" name="phone" className="search-input" style={{ width: '100%', padding: '0.75rem 1rem' }} value={profile.phone || ''} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>WhatsApp</label>
                    <input type="text" name="whatsapp" className="search-input" style={{ width: '100%', padding: '0.75rem 1rem' }} value={profile.whatsapp || ''} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Country</label>
                    <input type="text" className="search-input" style={{ width: '100%', padding: '0.75rem 1rem' }} value={country} onChange={(e) => handleLocationChange(1, e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>City</label>
                    <input type="text" className="search-input" style={{ width: '100%', padding: '0.75rem 1rem' }} value={city} onChange={(e) => handleLocationChange(2, e.target.value)} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <RefreshCw className="spin" size={18} /> : <Save size={18} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'ad' && (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Edit Ad</h2>
                
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Biography</label>
                  <textarea name="bio" className="search-input" style={{ width: '100%', padding: '0.75rem 1rem', minHeight: '150px', resize: 'vertical' }} value={profile.bio || profile.description || ''} onChange={handleChange} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Age</label>
                    <input type="text" name="age" className="search-input" style={{ width: '100%', padding: '0.75rem 1rem' }} value={profile.age || ''} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Height (cm)</label>
                    <input type="text" name="height" className="search-input" style={{ width: '100%', padding: '0.75rem 1rem' }} value={profile.height || ''} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Weight (kg)</label>
                    <input type="text" name="weight" className="search-input" style={{ width: '100%', padding: '0.75rem 1rem' }} value={profile.weight || ''} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Endowment (cm)</label>
                    <input type="text" name="endowment" className="search-input" style={{ width: '100%', padding: '0.75rem 1rem' }} value={profile.endowment || ''} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Nationality</label>
                    <input type="text" name="nationality" className="search-input" style={{ width: '100%', padding: '0.75rem 1rem' }} value={profile.nationality || ''} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Languages</label>
                    <input type="text" name="languages" className="search-input" style={{ width: '100%', padding: '0.75rem 1rem' }} value={profile.languages || ''} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <RefreshCw className="spin" size={18} /> : <Save size={18} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Upload Photos & Add Video Links</h2>
              
              {uploadMessage && (
                <div style={{ background: uploadMessage.includes('success') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: uploadMessage.includes('success') ? '#22c55e' : '#ef4444', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: `1px solid ${uploadMessage.includes('success') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
                  {uploadMessage}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Photo Upload Form */}
                <form onSubmit={handleMediaUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', background: 'var(--bg-primary)', border: '1px dashed var(--accent-primary)', borderRadius: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Upload Photo</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="search-input" 
                      style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid var(--glass-border)' }} 
                      onChange={(e) => setMediaFile(e.target.files[0])} 
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={uploadingMedia || !mediaFile} style={{ marginTop: 'auto' }}>
                    {uploadingMedia ? <RefreshCw className="spin" size={18} /> : <Upload size={18} />}
                    {uploadingMedia ? 'Uploading...' : 'Upload Photo'}
                  </button>
                </form>

                {/* Video Link Form */}
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!videoLink) return;
                  setUploadingMedia(true);
                  setUploadMessage('');
                  try {
                    const { error } = await supabase.from('photos').insert([{ profile_id: profile.id, photo_url: videoLink }]);
                    if (error) throw error;
                    setUploadMessage('Video link added successfully!');
                    setVideoLink('');
                    const { data: mediaData } = await supabase.from('photos').select('*').eq('profile_id', profile.id);
                    if (mediaData) setUserMedia(mediaData);
                    setTimeout(() => setUploadMessage(''), 3000);
                  } catch (err) {
                    console.error(err);
                    setUploadMessage('Failed to add video link.');
                  } finally {
                    setUploadingMedia(false);
                  }
                }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', background: 'var(--bg-primary)', border: '1px dashed var(--glass-border)', borderRadius: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Add Video Link (OnlyFans, Pornhub, xHamster, etc.)</label>
                    <input 
                      type="url" 
                      placeholder="https://..." 
                      className="search-input" 
                      style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid var(--glass-border)' }} 
                      value={videoLink || ''}
                      onChange={(e) => setVideoLink(e.target.value)} 
                      required 
                    />
                  </div>
                  <button type="submit" className="btn" disabled={uploadingMedia || !videoLink} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', marginTop: 'auto' }}>
                    <Save size={18} style={{ marginRight: '0.5rem' }} /> Add Link
                  </button>
                </form>
              </div>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Your Media Gallery</h3>
              {userMedia.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', background: 'var(--bg-primary)', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
                  <Camera size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p>You haven't added any media yet.</p>
                </div>
              ) : (
                <div className="gallery-grid">
                  {userMedia.map((media, i) => {
                    const isVideoLink = media.photo_url.match(/^(http|https):\/\/[^ "]+$/i) && !media.photo_url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                    return isVideoLink ? (
                      <a key={i} href={media.photo_url} target="_blank" rel="noopener noreferrer" className="gallery-img" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', textDecoration: 'none', padding: '1rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎥</span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', wordBreak: 'break-all' }}>Watch Video</span>
                      </a>
                    ) : (
                      <img key={i} src={getProxiedImageUrl(media.photo_url)} alt="Uploaded media" className="gallery-img" />
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
