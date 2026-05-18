import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabase';

export default function DashboardLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Since there is no password field in the current database schema,
      // we authenticate by checking if the email or name exists.
      // In a production environment with proper auth, this would use supabase.auth.signInWithPassword
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, name, email')
        .or(`email.eq.${identifier},name.eq.${identifier}`)
        .limit(1);

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const profile = data[0];
        // Simulate successful login
        localStorage.setItem('dashboard_user_id', profile.id);
        navigate('/dashboard');
      } else {
        setError('Invalid username/email or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}>
        <button 
          onClick={() => navigate('/')}
          className="back-btn"
          style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}
        >
          <ArrowLeft className="back-icon" style={{ width: '1rem', height: '1rem' }} />
          Back to Home
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Trans Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Login to manage your profile</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email or Username</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
              <input 
                type="text" 
                className="search-input" 
                style={{ width: '100%', paddingLeft: '3rem' }} 
                placeholder="Enter your email or name" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
              <input 
                type="password" 
                className="search-input" 
                style={{ width: '100%', paddingLeft: '3rem' }} 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? (
              <span className="spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></span>
            ) : (
              <>Login <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
