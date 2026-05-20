import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase } from '../supabase';
import { getProxiedImageUrl } from '../utils';

export default function ProfilesList() {
  const { continent, country } = useParams();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, [country]); // Re-fetch if country changes

  // Format country from URL (e.g. united-kingdom -> United Kingdom)
  const displayCountry = country.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const fetchProfiles = async (searchQuery = '') => {
    setLoading(true);
    try {
      let queryBuilder = supabase
        .from('profiles')
        .select('*, photos(photo_url)')
        .ilike('location', `% | ${displayCountry} |%`);
        
      if (searchQuery) {
        queryBuilder = queryBuilder.ilike('name', `%${searchQuery}%`);
      }
      const { data, error } = await queryBuilder.order('created_at', { ascending: false }).limit(50);
      
      if (error) throw error;
      if (data) {
        setProfiles(data);
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

  const seoTitle = `Trans Escorts in ${displayCountry}`;
  const seoDesc = `Find verified trans, shemale and ladyboy escorts in ${displayCountry}. Browse ${profiles.length} active profiles with photos, services and contact info.`;

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDesc}
        canonicalPath={`/${continent}/${country}`}
      />
      <div className="container" style={{ padding: '2rem 0' }}>
        <button 
          onClick={() => navigate(`/${continent}`)}
          className="back-btn"
        >
          <ArrowLeft className="back-icon" />
          Back to {continent.charAt(0).toUpperCase() + continent.slice(1)}
        </button>

        <div className="page-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h1 className="page-title">Escorts in {displayCountry}</h1>
          <p className="page-subtitle">Find the perfect companion</p>
        </div>

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
              <Link to={`/profile/${profile.id}`} key={profile.id} className="glass-card">
                <img
                  src={getProxiedImageUrl(profile.photos?.find(p => !p.photo_url.includes('archive.org'))?.photo_url || profile.photos?.[0]?.photo_url)} 
                  alt={profile.name} 
                  className="profile-card-img"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x400?text=No+Photo'; }}
                />
                <div className="profile-card-content">
                  <h3 className="profile-card-title">{profile.name}</h3>
                  <div className="profile-card-meta">
                    <span>📍 {profile.location || 'Unknown'}</span>
                    {profile.age && <span>🎂 Age: {profile.age}</span>}
                    {profile.endowment && <span>🍆 {profile.endowment} cm</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
