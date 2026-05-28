import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Search } from 'lucide-react';
import Continents from './pages/Continents';
import Countries from './pages/Countries';
import ProfilesList from './pages/ProfilesList';
import Profile from './pages/Profile';
import CityGuide from './pages/CityGuide';
import DashboardLogin from './pages/DashboardLogin';
import Dashboard from './pages/Dashboard';
import AgeVerification, { useAgeVerified } from './components/AgeVerification';
import './index.css';
import logo from './assets/logosw.png';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="ShemaleWiki Online" style={{ height: '40px', marginRight: '10px' }} />
          <span className="text-gradient">SHEMALEWIKI</span> ONLINE
        </Link>
        <div className="nav-links">
          <Link to="/">Continents</Link>
        </div>
      </div>
    </nav>
  );
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
          <Route path="/" element={<Continents />} />
          <Route path="/dashboard/login" element={<DashboardLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
