import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import Continents from './pages/Continents';
import Countries from './pages/Countries';
import ProfilesList from './pages/ProfilesList';
import Profile from './pages/Profile';
import CityGuide from './pages/CityGuide';
import DashboardLogin from './pages/DashboardLogin';
import Dashboard from './pages/Dashboard';
import Advertise from './pages/Advertise';
import Register from './pages/Register';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import AgeVerification, { useAgeVerified } from './components/AgeVerification';
import './index.css';
import logoSw from './assets/logosw.png';

/* ── Domain detection ── */
const isBuscaTrans = () => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.includes('buscatrans');
};

const getBrand = () => isBuscaTrans() ? 'buscatrans' : 'shemalewiki';

// Apply data-brand to <html> early
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-brand', getBrand());
}

/* ── Navbar ── */
function Navbar() {
  const bt = isBuscaTrans();
  const brand = bt ? 'buscatrans' : 'shemalewiki';

  return (
    <nav className="navbar">
      <div className="container">
        <Link to={bt ? "/es/" : "/"} className="nav-brand">
          {bt ? (
            <>
              <span style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#e040a0',
                marginRight: '6px',
                fontFamily: 'var(--font-display)',
              }}>⚲</span>
              <span style={{
                background: 'linear-gradient(135deg, #c026d3, #e040a0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.3rem',
                letterSpacing: '-0.01em',
              }}>BUSCATRANS</span>
            </>
          ) : (
            <>
              <img src={logoSw} alt="ShemaleWiki Online" style={{ height: '36px', marginRight: '8px' }} />
              <span className="text-gradient" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>SHEMALEWIKI</span>
            </>
          )}
        </Link>
        <div className="nav-links">
          <Link to={bt ? "/es/" : "/"}>{bt ? 'Inicio' : 'Browse'}</Link>
          <Link to="/advertise" style={{ color: 'var(--accent-secondary)' }}>{bt ? 'Anunciar' : 'Advertise'}</Link>
          {bt ? (
            <Link to="/registro" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>
              Registrarse
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>
              List your profile
            </Link>
          )}
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
          {/* Root: redirects / → /es/ on BuscaTrans, shows Home on ShemaleWiki */}
          <Route path="/" element={<RootRedirect />} />

          {/* Static pages */}
          <Route path="/dashboard/login" element={<DashboardLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Legacy continent routes */}
          <Route path="/:continent" element={<Countries />} />
          <Route path="/:continent/:country" element={<ProfilesList />} />
          <Route path="/:continent/:country/:city" element={<CityGuide />} />
          <Route path="/profile/:id" element={<Profile />} />

          {/* Language-prefixed routes */}
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