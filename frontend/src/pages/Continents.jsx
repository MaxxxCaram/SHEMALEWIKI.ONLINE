import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import SEO from '../components/SEO';
import logo from '../assets/logosw.png';

const continents = [
  { name: 'Europe', icon: '🌍' },
  { name: 'Americas', icon: '🌎' },
  { name: 'Asia', icon: '🌏' },
  { name: 'Oceania', icon: '🏄' },
  { name: 'Africa', icon: '🦁' },
  { name: 'Other', icon: '🗺️' }
];

export default function Continents() {
  return (
    <>
      <SEO 
        title="Trans Escort Directory"
        description="Browse the world's largest multilingual directory of trans, shemale and ladyboy escorts. Search by continent and country to find verified profiles near you."
        canonicalPath="/"
        alternates={[
          { lang: 'es', path: '/es/' },
          { lang: 'pt', path: '/pt/' }
        ]}
      />
      <div className="container" style={{ padding: '3rem 0' }}>
        <div className="hero-section">
          <h1 className="hero-title">
            Welcome to SHEMALEWIKI ONLINE
          </h1>
          <img 
            src={logo} 
            alt="ShemaleWiki Logo" 
            className="hero-logo" 
          />
          <p className="hero-subtitle">
            Choose your continent to find the most beautiful trans escorts in your area.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/dashboard/login" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Trans Dashboard
            </Link>
          </div>
        </div>

        <div className="continents-grid">
          {continents.map((continent) => (
            <Link
              key={continent.name}
              to={`/${continent.name.toLowerCase()}`}
              className="continent-card"
            >
              <div className="continent-content">
                <div className="continent-icon">{continent.icon}</div>
                <h2 className="continent-title">{continent.name}</h2>
                <div className="continent-explore">
                  <span>Explore Countries</span>
                  <Globe className="explore-icon" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
