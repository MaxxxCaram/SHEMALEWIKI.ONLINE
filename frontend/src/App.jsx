import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Component } from 'react';
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
import Reclama from './pages/Reclama';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import AgeVerification, { useAgeVerified } from './components/AgeVerification';
import './index.css';
import logoSw from './assets/logosw.png';
import logoBT from './assets/buscatrans-logo.svg';

// Error Boundary: catches render errors (including .forEach on non-arrays)
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-primary)', color: 'var(--text-primary)',
          textAlign: 'center', padding: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</h1>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Algo salió mal</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Recargá la página y debería funcionar. Si el error persiste, avisanos.
          </p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Recargar página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
        <div className="nav-links nav-left">
          <Link to={bt ? "/es/" : "/"}>{bt ? 'Inicio' : 'Browse'}</Link>
          <Link to={bt ? "/anunciar" : "/advertise"} style={{ color: 'var(--accent-secondary)' }}>{bt ? 'Anunciar' : 'Advertise'}</Link>
        </div>
        <Link to={bt ? "/es/" : "/"} className="nav-brand">
          {bt ? (
            <img src={logoBT} alt="BuscaTrans" style={{ height: '90px' }} />
          ) : (
            <>
              <img src={logoSw} alt="ShemaleWiki Online" style={{ height: '36px', marginRight: '8px' }} />
              <span className="text-gradient" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>SHEMALEWIKI</span>
            </>
          )}
        </Link>
        <div className="nav-links nav-right">
          {bt ? (
            <>
              <a
                href="https://shemalewiki.online/downloads/vivas.apk"
                className="btn btn-download"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem', marginRight: '0.5rem' }}
              >
                📱 Descargar App
              </a>
              <Link to="/registro" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>
                Registrarse
              </Link>
            </>
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
  return <Home />;
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
          <Route path="/anunciar" element={<Advertise />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/reclama" element={<Reclama />} />
          <Route path="/es/reclama" element={<Reclama />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />

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

          <Route path="/he" element={<Continents />} />
          <Route path="/he/:continent" element={<Countries />} />
          <Route path="/he/:continent/:country" element={<ProfilesList />} />
          <Route path="/he/:continent/:country/:city" element={<CityGuide />} />
          <Route path="/he/profile/:id" element={<Profile />} />
        </Routes>
      </main>
    </Router>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;