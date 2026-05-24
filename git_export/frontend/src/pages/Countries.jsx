import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase } from '../supabase';

export default function Countries() {
  const { continent } = useParams();
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Capitalize continent name for display and DB query
  const displayContinent = continent.charAt(0).toUpperCase() + continent.slice(1);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        // Query profiles that start with this continent
        const { data, error } = await supabase
          .from('profiles')
          .select('location')
          .ilike('location', `${displayContinent} |%`);

        if (error) throw error;

        // Extract unique countries
        const countrySet = new Set();
        data.forEach(p => {
          if (p.location) {
            const parts = p.location.split(' | ');
            if (parts.length >= 2 && parts[1] !== 'Unknown') {
              countrySet.add(parts[1]);
            }
          }
        });

        setCountries(Array.from(countrySet).sort());
      } catch (error) {
        console.error("Error fetching countries", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [displayContinent]);

  const seoTitle = `Trans Escorts in ${displayContinent}`;
  const seoDesc = `Find trans, shemale and ladyboy escorts in ${displayContinent}. Browse verified profiles by country — ${countries.slice(0, 10).join(', ')}${countries.length > 10 ? ' and more' : ''}.`;

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDesc}
        canonicalPath={`/${continent}`}
      />
      <div className="container" style={{ padding: '3rem 0' }}>
        <button 
          onClick={() => navigate('/')}
          className="back-btn"
        >
          <ArrowLeft className="back-icon" />
          Back to Continents
        </button>

        <div className="page-header">
          <h1 className="page-title">
            Escorts in {displayContinent}
          </h1>
          <p className="page-subtitle">
            Select a country to view profiles
          </p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : countries.length === 0 ? (
          <div className="empty-state">
            No profiles found for {displayContinent} yet.
          </div>
        ) : (
          <div className="countries-grid">
            {countries.map((country) => (
              <Link
                key={country}
                to={`/${continent}/${country.toLowerCase()}`}
                className="country-card"
              >
                <div className="country-icon-wrapper">
                  <MapPin className="country-icon" />
                </div>
                <span className="country-name">
                  {country}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
