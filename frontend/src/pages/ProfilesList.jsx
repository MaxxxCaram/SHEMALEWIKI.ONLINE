import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowLeft, Building2 } from 'lucide-react';
import { supabase } from '../supabase';
import LazyImage from '../components/LazyImage';

// City → slug matching CityGuide.jsx routing
function cityToSlug(city) {
  return city.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function ProfilesList() {
  const { continent, country } = useParams();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [cityCounts, setCityCounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const displayCountry = country ? country.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '';

  useEffect(() => {
    fetchProfiles();
    fetchCityCounts();
  }, [country]);

  // Extract unique cities + profile counts (only profiles WITH photos)
  const fetchCityCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('location, photos(id)')
        .ilike('location', `% | ${displayCountry} |%`)
        .not('cam_chat', 'eq', 'rejected')
        .limit(1000);

      if (error) throw error;

      const arr = Array.isArray(data) ? data : [];
      // Only count profiles that have at least 1 photo
      const withPhotos = arr.filter(p => p.photos && p.photos.length > 0);
      if (!withPhotos.length) return;

      const counts = {};
      withPhotos.forEach(p => {
        const parts = (p.location || '').split(' | ');
        const city = parts[parts.length - 1];
        if (city && city !== 'Unknown') {
          counts[city] = (counts[city] || 0) + 1;
        }
      });

      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([city, count]) => ({
          city,
          slug: cityToSlug(city),
          count
        }));

      setCityCounts(sorted);
    } catch (err) {
      console.error('Error fetching city counts:', err);
    }
  };

  const fetchProfiles = async (searchQuery = '') => {
    setLoading(true);
    try {
      let queryBuilder = supabase
        .from('profiles')
        .select('*, photos(photo_url, local_path)')
        .ilike('location', `% | ${displayCountry} |%`)
        .not('cam_chat', 'eq', 'rejected');
        
      if (searchQuery) {
        queryBuilder = queryBuilder.ilike('name', `%${searchQuery}%`);
      }
      const { data, error } = await queryBuilder.order('created_at', { ascending: false }).limit(50);
      
      if (error) throw error;
      if (data) {
        const cleaned = data.map(p => ({
          ...p,
          photos: (p.photos || []).filter(ph => !(ph.photo_url || '').includes('shemalewiki.com'))
        })).filter(p => p.photos.length > 0); // Only show profiles WITH photos per Maxi's directive
        setProfiles(cleaned);
      }
    } catch (error) {
      console.error("Error fetching profiles", error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProfiles(searchQuery);
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <button 
        onClick={() => navigate(`/${continent}`)}
        className="back-btn"
      >
        <ArrowLeft className="back-icon" />
        Back to {continent.charAt(0).toUpperCase() + continent.slice(1)}
      </button>

      <div className="page-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
        <h1 className="page-title">Community in {displayCountry}</h1>
        <p className="page-subtitle">Find the perfect companion</p>
      </div>

      {/* City cards grid */}
      {cityCounts.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            marginBottom: '1.25rem',
            color: 'var(--text-primary)'
          }}>
            Cities in {displayCountry}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {cityCounts.map(({ city, slug, count }) => (
              <Link
                key={city}
                to={`/${continent}/${country}/${slug}`}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition)'
                }}
              >
                <span style={{
                  background: 'var(--accent-primary)',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Building2 size={18} color="white" />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {city}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {count} {count === 1 ? 'profile' : 'profiles'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="search-container">
        <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', gap: '1rem' }}>
          <input 
            type="text" 
            id="searchQuery"
            name="searchQuery"
            className="search-input" 
            placeholder="Search by name, location, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            <Search size={20} />
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : profiles.length === 0 ? (
        <div className="empty-state">
          No profiles found. Try a different search.
        </div>
      ) : (
        <div className="profiles-grid">
          {profiles.map(profile => (
            <Link to={`/profile/${profile.id}`} key={profile.id} className="glass-card profile-card">
              <LazyImage
                src={(profile.photos || []).find(p => p.local_path === 'cover')?.photo_url || profile.photos?.[0]?.photo_url}
                alt={profile.name}
                className="profile-card-img"
              />
              <div className="profile-card-gradient" />
              <div className="profile-card-content">
                <h3 className="profile-card-title">{profile.name}</h3>
                <div className="profile-card-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={14} /> {profile.location || 'Unknown'}
                  </span>
                  {profile.age && <span>🎂 {profile.age} years</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
