import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Search } from 'lucide-react';
import Continents from './pages/Continents';
import Countries from './pages/Countries';
import ProfilesList from './pages/ProfilesList';
import Profile from './pages/Profile';
import CityGuide from './pages/CityGuide';
import DashboardLogin from './pages/DashboardLogin';
import Dashboard from './pages/Dashboard';
import Advertise from './pages/Advertise';
import AgeVerification, { useAgeVerified } from './components/AgeVerification';
import './index.css';
import logoSw from './assets/logosw.png';

/* ── Domain detection ── */
const isBuscaTrans = () => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host.includes('buscatrans');
};

const getBrand = () => isBuscaTrans() ? 'buscatrans' : 'shemalewiki';

// Apply data-brand to <html> early
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-brand', getBrand());
}

/* ── Navbar ── */
function Navbar() {
  const bt = isBuscaTrans();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to={bt ? "/es/" : "/"} className="nav-brand" style={{ display: 'flex', alignItems: 'center' }}>
          {bt ? (
            <>
              <span style={{
                fontSize: '1.8rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#c9a84c',
                marginRight: '8px'
              }}>⚲</span>
              <span style={{
                background: 'linear-gradient(135deg, #c2185b, #c9a84c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900,
                fontSize: '1.3rem',
                letterSpacing: '-0.01em'
              }}>BUSCATRANS</span>
            </>
          ) : (
            <>
              <img src={logoSw} alt="ShemaleWiki Online" style={{ height: '40px', marginRight: '10px' }} />
              <span className="text-gradient">SHEMALEWIKI</span> ONLINE
            </>
          )}
        </Link>
        <div className="nav-links">
          <Link to={bt ? "/es/" : "/"}>Continents</Link>
          <Link to="/advertise" style={{ color: 'var(--accent-secondary)' }}>Advertise</Link>
        </div>
      </div>
    </nav>
  );
}

/* ── RootRedirect: buscatrans.com / → /es/ ── */
function RootRedirect() {
  if (isBuscaTrans()) {
    return <Navigate to="/es/" replace />;
  }
  return <Continents />;
}

function AppContent() {
  const { verified, verify } = useAgeVerified();

  if (!verified) {
    return <AgeVerification onVerify={verify} />;
  }

  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          {/* Root: redirects to /es/ on BuscaTrans, shows Continents on ShemaleWiki */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/dashboard/login" element={<DashboardLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/:continent" element={<Countries />} />
          <Route path="/:continent/:country" element={<ProfilesList />} />
          <Route path="/:continent/:country/:city" element={<CityGuide />} />
          <Route path="/profile/:id" element={<Profile />} />
          {/* Language-prefixed routes (SEO-friendly: /en/, /es/, /pt/) */}
          <Route path="/en" element={<Continents />} />
          <Route path="/en/:continent" element={<Countries />} />
          <Route path="/en/:continent/:country" element={<ProfilesList />} />
          <Route path="/en/:continent/:country/:city" element={<CityGuide />} />
          <Route path="/en/profile/:id" element={<Profile />} />
          <Route path="/es" element={<Continents />} />
          <Route path="/es/:continent" element={<Countries />} />
          <Route path="/es/:continent/:country" element={<ProfilesList />} />
          <Route path="/es/:continent/:country/:city" element={<CityGuide />} />
          <Route path="/es/profile/:id" element={<Profile />} />
          <Route path="/pt" element={<Continents />} />
          <Route path="/pt/:continent" element={<Countries />} />
          <Route path="/pt/:continent/:country" element={<ProfilesList />} />
          <Route path="/pt/:continent/:country/:city" element={<CityGuide />} />
          <Route path="/pt/profile/:id" element={<Profile />} />
        </Routes>
      </main>
    </Router>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AppContent />
    </HelmetProvider>
  );
}

export default App;
