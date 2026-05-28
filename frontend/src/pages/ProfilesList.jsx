import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabase';
import LazyImage from '../components/LazyImage';

export default function ProfilesList() {
  const { continent, country } = useParams();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, [country]);

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
            <Link to={`/profile/${profile.id}`} key={profile.id} className="glass-card profile-card">
              <LazyImage
                src={profile.photos?.[0]?.photo_url}
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
                  {profile.endowment && <span>🍆 {profile.endowment}cm</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
