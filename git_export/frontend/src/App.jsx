import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Continents from './pages/Continents';
import Countries from './pages/Countries';
import ProfilesList from './pages/ProfilesList';
import Profile from './pages/Profile';
import DashboardLogin from './pages/DashboardLogin';
import Dashboard from './pages/Dashboard';
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

function App() {
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
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
