import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save, User, Camera, Settings, RefreshCw, Upload, Image as ImageIcon, BarChart3, ExternalLink, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabase';
import { getProxiedImageUrl } from '../utils';

const API_BASE = typeof window !== 'undefined' ? window.location.origin : 'https://shemalewiki.online';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const navigate = useNavigate();

  // Brand detection
  const isBT = typeof window !== 'undefined' && window.location.hostname.includes('buscatrans');

  // Media
  const [userMedia, setUserMedia] = useState([]);
  const [newPhotoFiles, setNewPhotoFiles] = useState(null);
  const fileInputRef = useRef(null);
  const [newVideoLink, setNewVideoLink] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('dashboard_user_id');
    if (!userId) { navigate('/dashboard/login'); return; }
    fetchProfile(userId);
  }, [navigate]);

  const fetchProfile = async (id) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (error) throw error;
      setProfile(data || {});

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
    const parts = (profile.location || 'Other | Unknown | Unknown').split(' | ');
    while (parts.length < 3) parts.push('Unknown');
    parts[index] = value || 'Unknown';
    setProfile(prev => ({ ...prev, location: parts.join(' | ') }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const userId = localStorage.getItem('dashboard_user_id');
      const r = await fetch(`${API_BASE}/api/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, profile })
      });

      if (!r.ok) {
        const err = await r.json();
        throw new Error(err.error || 'Update failed');
      }

      const result = await r.json();
      setProfile(result.profile || profile);
      setMessage('✅ Profile updated successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (error) {
      console.error("Error updating profile", error);
      setMessage('❌ ' + (error.message || 'Failed to update. Try again.'));
    } finally {
      setSaving(false);
    }
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!newPhotoFiles || newPhotoFiles.length === 0) return;
    setUploadingMedia(true);
    setUploadMessage('');

    try {
      let uploaded = 0;
      for (const file of newPhotoFiles) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = `${profile.id}/${Date.now()}_${safeName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(filePath);

        // Insert into photos table
        const { error: insertError } = await supabase.from('photos').insert([{
          profile_id: profile.id,
          photo_url: publicUrl
        }]);
        if (insertError) throw insertError;
        uploaded++;
      }

      setNewPhotoFiles(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploadMessage(isBT
        ? `✅ ${uploaded} foto(s) agregada(s)`
        : `✅ ${uploaded} photo(s) added!`);
      const { data: mediaData } = await supabase.from('photos').select('*').eq('profile_id', profile.id);
      if (mediaData) setUserMedia(mediaData);
      setTimeout(() => setUploadMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setUploadMessage(isBT ? '❌ Error al subir foto.' : '❌ Failed to upload photo.');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!newVideoLink.trim()) return;
    setUploadingMedia(true);
    setUploadMessage('');

    try {
      const { error } = await supabase.from('photos').insert([{ 
        profile_id: profile.id, 
        photo_url: newVideoLink.trim() 
      }]);
      if (error) throw error;

      setNewVideoLink('');
      setUploadMessage('✅ Video link added!');
      const { data: mediaData } = await supabase.from('photos').select('*').eq('profile_id', profile.id);
      if (mediaData) setUserMedia(mediaData);
      setTimeout(() => setUploadMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setUploadMessage('❌ Failed to add video.');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (photoId) => {
    try {
      const { error } = await supabase.from('photos').delete().eq('id', photoId);
      if (error) throw error;
      setUserMedia(prev => prev.filter(m => m.id !== photoId));
      setUploadMessage('🗑️ Media removed.');
      setTimeout(() => setUploadMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setUploadMessage('❌ Failed to remove.');
    }
  };

  // Profile completeness calculator
  const calcCompleteness = () => {
    if (!profile) return 0;
    const fields = ['name', 'bio', 'location', 'phone', 'age', 'height', 'weight', 'nationality', 'languages'];
    const filled = fields.filter(f => profile[f] && String(profile[f]).trim().length > 0).length;
    const hasPhotos = userMedia.length > 0;
    return Math.round(((filled / fields.length) * 80) + (hasPhotos ? 20 : 0));
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!profile) return null;

  const locationParts = (profile.location || 'Other | Unknown | Unknown').split(' | ');
  const country = locationParts[1] || '';
  const city = locationParts[2] || '';
  const completeness = calcCompleteness();

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Dashboard</h1>
          <p className="page-subtitle">Welcome back, {profile.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a href={`/profile/${profile.id}`} target="_blank" rel="noopener noreferrer" className="btn"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <ExternalLink size={16} /> View Profile
          </a>
          <button onClick={handleLogout} className="btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Sidebar */}
        <div className="glass-card" style={{ padding: '1.5rem', width: '250px', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <TabBtn icon={<User size={18} />} label="Personal Info" active={activeTab === 'personal'} onClick={() => setActiveTab('personal')} />
            <TabBtn icon={<Settings size={18} />} label="Edit Ad" active={activeTab === 'ad'} onClick={() => setActiveTab('ad')} />
            <TabBtn icon={<ImageIcon size={18} />} label="Photos & Videos" active={activeTab === 'media'} onClick={() => setActiveTab('media')} />
            <TabBtn icon={<BarChart3 size={18} />} label="Stats" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
          </div>
        </div>

        {/* Content */}
        <div className="glass-card" style={{ padding: '2rem', flex: 1, minWidth: '300px' }}>
          {message && (
            <div style={{ 
              background: message.startsWith('✅') ? 'rgba(34, 197, 94, 0.1)' : message.startsWith('🗑️') ? 'rgba(250, 204, 21, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
              color: message.startsWith('✅') ? '#22c55e' : message.startsWith('🗑️') ? '#facc15' : '#ef4444', 
              padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', 
              border: `1px solid ${message.startsWith('✅') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
            }}>
              {message}
            </div>
          )}

          {/* PERSONAL INFO TAB */}
          {activeTab === 'personal' && (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Personal Info</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                <FormField label="Stage Name" name="name" value={profile.name || ''} onChange={handleChange} required />
                <FormField label="Email" name="email" type="email" value={profile.email || ''} onChange={handleChange} />
                <FormField label="Phone" name="phone" value={profile.phone || ''} onChange={handleChange} />
                <FormField label="WhatsApp" name="whatsapp" value={profile.whatsapp || ''} onChange={handleChange} />
                <FormField label="Country" value={country} onChange={(e) => handleLocationChange(1, e.target.value)} />
                <FormField label="City" value={city} onChange={(e) => handleLocationChange(2, e.target.value)} />
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <RefreshCw className="spin" size={18} /> : <Save size={18} />}
                  {saving ? ' Saving...' : ' Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* EDIT AD TAB */}
          {activeTab === 'ad' && (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Edit Ad</h2>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Biography</label>
                <textarea name="bio" className="search-input" style={{ width: '100%', padding: '0.75rem 1rem', minHeight: '140px', resize: 'vertical', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }} value={profile.bio || profile.description || ''} onChange={handleChange} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <FormField label="Age" name="age" value={profile.age || ''} onChange={handleChange} />
                <FormField label="Height (cm)" name="height" value={profile.height || ''} onChange={handleChange} />
                <FormField label="Weight (kg)" name="weight" value={profile.weight || ''} onChange={handleChange} />
                <FormField label="Nationality" name="nationality" value={profile.nationality || ''} onChange={handleChange} />
                <FormField label="Languages" name="languages" value={profile.languages || ''} onChange={handleChange} />
                <FormField label="Endowment" name="endowment" value={profile.endowment || ''} onChange={handleChange} />
              </div>

              <h3 style={{ fontSize: '1.1rem', marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Links & Social</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                <FormField label="OnlyFans URL" name="onlyfans" type="url" value={profile.onlyfans || ''} onChange={handleChange} placeholder="https://onlyfans.com/..." />
                <FormField label="Cam Chat URL" name="cam_chat" type="url" value={profile.cam_chat || ''} onChange={handleChange} placeholder="https://..." />
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <RefreshCw className="spin" size={18} /> : <Save size={18} />}
                  {saving ? ' Saving...' : ' Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* MEDIA TAB */}
          {activeTab === 'media' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Photos & Videos</h2>

              {uploadMessage && (
                <div style={{ 
                  background: uploadMessage.startsWith('✅') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: uploadMessage.startsWith('✅') ? '#22c55e' : '#ef4444',
                  padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.25rem',
                  border: `1px solid ${uploadMessage.startsWith('✅') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                }}>
                  {uploadMessage}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {/* Add Photos — Direct Upload */}
                <form onSubmit={handleAddPhoto} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem', background: 'var(--bg-primary)', border: '1px dashed var(--accent-primary)', borderRadius: '1rem' }}>
                  <label style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }}>
                    <Camera size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                    {isBT ? 'Agregar fotos' : 'Add Photos'}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => setNewPhotoFiles(e.target.files)}
                    style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', padding: '0.7rem', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)' }}
                  />
                  <button type="submit" className="btn btn-primary" disabled={uploadingMedia || !newPhotoFiles || newPhotoFiles.length === 0}>
                    {uploadingMedia ? <RefreshCw className="spin" size={16} /> : <Plus size={16} />}
                    {isBT ? ' Subir fotos' : ' Upload Photos'}
                  </button>
                </form>

                {/* Add Video Link */}
                <form onSubmit={handleAddVideo} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem', background: 'var(--bg-primary)', border: '1px dashed var(--glass-border)', borderRadius: '1rem' }}>
                  <label style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }}>
                    🎥 {isBT ? 'Agregar enlace de video' : 'Add Video Link'}
                  </label>
                  <input type="url" placeholder="https://onlyfans.com/... or https://pornhub.com/..." className="search-input"
                    style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', padding: '0.7rem' }}
                    value={newVideoLink} onChange={e => setNewVideoLink(e.target.value)} />
                  <button type="submit" className="btn" disabled={uploadingMedia || !newVideoLink.trim()}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>
                    <Plus size={16} style={{ marginRight: '0.4rem' }} /> {isBT ? 'Agregar enlace' : 'Add Link'}
                  </button>
                </form>
              </div>

              {/* Gallery */}
              <h3 style={{ marginBottom: '1rem' }}>Your Media ({userMedia.length} items)</h3>
              {userMedia.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', background: 'var(--bg-primary)', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
                  <Camera size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p>No media yet. Add photos and video links above.</p>
                </div>
              ) : (
                <div className="gallery-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                  {userMedia.map((media, i) => {
                    const isVideo = media.photo_url && !media.photo_url.match(/\.(jpg|jpeg|png|gif|webp|avif)(\?.*)?$/i);
                    return (
                      <div key={i} style={{ position: 'relative' }}>
                        {isVideo ? (
                          <a href={media.photo_url} target="_blank" rel="noopener noreferrer" 
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textDecoration: 'none', aspectRatio: '3/4', minHeight: '180px' }}>
                            <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎥</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', wordBreak: 'break-all', textAlign: 'center' }}>Watch Video</span>
                          </a>
                        ) : (
                          <img src={getProxiedImageUrl(media.photo_url)} alt="Media" 
                            style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                        )}
                        <button onClick={() => handleDeleteMedia(media.id)}
                          style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
                          title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Profile Stats</h2>

              {/* Completeness gauge */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', display: 'inline-block', width: 140, height: 140 }}>
                  <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--glass-border)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke={completeness >= 80 ? '#22c55e' : completeness >= 50 ? '#f59e0b' : '#ef4444'} strokeWidth="3"
                      strokeDasharray={`${completeness} ${100 - completeness}`} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 700 }}>{completeness}%</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>complete</span>
                  </div>
                </div>
                <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {completeness >= 80 ? '🎉 Your profile looks great!' : completeness >= 50 ? '📝 Getting there — add more details to stand out.' : '⚠️ Fill out your profile to attract more contacts.'}
                </p>
              </div>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <StatCard icon="📸" label="Photos" value={userMedia.filter(m => m.photo_url && m.photo_url.match(/\.(jpg|jpeg|png|gif|webp)/i)).length} />
                <StatCard icon="🎥" label="Videos" value={userMedia.filter(m => m.photo_url && !m.photo_url.match(/\.(jpg|jpeg|png|gif|webp)/i)).length} />
                <StatCard icon="📍" label="Location" value={profile.location ? 'Set' : 'Missing'} />
                <StatCard icon="📞" label="Contact" value={profile.phone || profile.whatsapp ? 'Added' : 'Missing'} />
                <StatCard icon="📝" label="Bio" value={profile.bio ? `${Math.min(profile.bio.length, 999)} chars` : 'Empty'} />
                <StatCard icon="🕐" label="Last Updated" value={profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'} />
              </div>

              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>💡 Tips to Improve</h3>
                <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
                  {!profile.bio && <li>Add a compelling biography — profiles with bios get 3x more contacts.</li>}
                  {userMedia.filter(m => m.photo_url && m.photo_url.match(/\.(jpg|jpeg|png|gif|webp)/i)).length < 3 && <li>Upload at least 3 photos — profiles with 5+ photos get 5x more views.</li>}
                  {!profile.phone && !profile.whatsapp && <li>Add a phone or WhatsApp number so potential contacts can reach you.</li>}
                  {!profile.age && <li>Include your age — it's one of the most filtered fields.</li>}
                  {!profile.languages && <li>List the languages you speak — especially important for international clients.</li>}
                  {completeness >= 80 && <li>Your profile is well-optimized! Consider adding social links (OnlyFans, Cam Chat) for more exposure.</li>}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Small Components ── */

function TabBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="btn" style={{
      background: active ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
      color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
      justifyContent: 'flex-start', gap: '0.75rem',
      border: active ? '1px solid rgba(236, 72, 153, 0.2)' : '1px solid transparent',
      padding: '0.7rem 1rem', width: '100%', textAlign: 'left'
    }}>
      {icon} {label}
    </button>
  );
}

function FormField({ label, name, type = 'text', value, onChange, required, placeholder }) {
  return (
    <div className="form-group">
      <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
        {label}
      </label>
      <input type={type} name={name} className="search-input" placeholder={placeholder}
        style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}
        value={value} onChange={onChange} required={required} />
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{label}</div>
    </div>
  );
}
