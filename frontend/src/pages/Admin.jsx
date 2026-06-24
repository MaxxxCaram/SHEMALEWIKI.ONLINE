import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, Trash2, ExternalLink, RefreshCw } from 'lucide-react';

const API_BASE = typeof window !== 'undefined' ? window.location.origin : 'https://shemalewiki.online';

export default function Admin() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [auth, setAuth] = useState(false);
  const [passInput, setPassInput] = useState('');

  const ADMIN_PASS = 'Maxima2026!';

  const fetchProfiles = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/admin`);
      const data = await r.json();
      if (data.profiles) setProfiles(Array.isArray(data.profiles) ? data.profiles : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('admin_auth');
    if (saved === ADMIN_PASS) {
      setAuth(true);
      fetchProfiles();
    } else {
      setLoading(false);
    }
  }, [fetchProfiles]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passInput === ADMIN_PASS) {
      localStorage.setItem('admin_auth', ADMIN_PASS);
      setAuth(true);
      setLoading(true);
      fetchProfiles();
    } else {
      setMsg('❌ Contraseña incorrecta');
    }
  };

  const handleAction = async (profileId, action) => {
    setMsg('');
    try {
      const r = await fetch(`${API_BASE}/api/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, action }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Failed');

      const labels = { approve: '✅ Aprobado', reject: '❌ Rechazado', delete: '🗑️ Eliminado' };
      setMsg(labels[action] || 'OK');

      // Refresh list
      fetchProfiles();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('❌ ' + err.message);
    }
  };

  const getStatus = (p) => {
    if (p.cam_chat === 'approved') return { label: '✅ Aprobado', color: '#22c55e' };
    if (p.cam_chat === 'rejected') return { label: '❌ Rechazado', color: '#ef4444' };
    return { label: '⏳ Pendiente', color: '#f59e0b' };
  };

  if (!auth) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '1.5rem' }}>🔐 Admin Panel</h1>
          {msg && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{msg}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="search-input"
              placeholder="Contraseña"
              value={passInput}
              onChange={e => setPassInput(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem' }}
              autoFocus
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  const pending = profiles.filter(p => p.cam_chat !== 'approved' && p.cam_chat !== 'rejected');
  const approved = profiles.filter(p => p.cam_chat === 'approved');
  const rejected = profiles.filter(p => p.cam_chat === 'rejected');

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ textAlign: 'left' }}>🔧 Admin Panel</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {profiles.length} perfiles · {pending.length} pendientes · {approved.length} aprobados
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={fetchProfiles} className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
            <RefreshCw size={16} style={{ marginRight: '0.5rem' }} /> Refrescar
          </button>
          <button onClick={() => { localStorage.removeItem('admin_auth'); setAuth(false); }} className="btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
            Salir
          </button>
        </div>
      </div>

      {msg && (
        <div style={{ background: msg.startsWith('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: msg.startsWith('✅') ? '#22c55e' : '#ef4444', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          {msg}
        </div>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#f59e0b' }}>⏳ Pendientes ({pending.length})</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {pending.map(p => (
              <ProfileCard key={p.id} profile={p} onAction={handleAction} />
            ))}
          </div>
        </div>
      )}

      {/* Approved */}
      {approved.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#22c55e' }}>✅ Aprobados ({approved.length})</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {approved.map(p => (
              <ProfileCard key={p.id} profile={p} onAction={handleAction} />
            ))}
          </div>
        </div>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#ef4444' }}>❌ Rechazados ({rejected.length})</h2>
          <div style={{ display: 'grid', gap: '0.75rem', opacity: 0.7 }}>
            {rejected.map(p => (
              <ProfileCard key={p.id} profile={p} onAction={handleAction} />
            ))}
          </div>
        </div>
      )}

      {profiles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No hay perfiles todavía.
        </div>
      )}
    </div>
  );
}

function ProfileCard({ profile, onAction }) {
  const s = () => {
    if (profile.cam_chat === 'approved') return { label: '✅', color: '#22c55e' };
    if (profile.cam_chat === 'rejected') return { label: '❌', color: '#ef4444' };
    return { label: '⏳', color: '#f59e0b' };
  };
  const status = s();

  return (
    <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '1.5rem' }}>{status.label}</span>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <strong style={{ fontSize: '1.1rem' }}>{profile.name}</strong>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {profile.location || 'Sin ubicación'} · {profile.phone || 'Sin teléfono'} · {profile.email}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          {profile.bio ? profile.bio.slice(0, 120) + (profile.bio.length > 120 ? '...' : '') : 'Sin bio'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <a href={`/profile/${profile.id}`} target="_blank" rel="noopener noreferrer"
          className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '0.4rem 0.8rem', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <ExternalLink size={14} /> Ver
        </a>
        {profile.cam_chat !== 'approved' && (
          <button onClick={() => onAction(profile.id, 'approve')} className="btn"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            <CheckCircle2 size={14} style={{ marginRight: '0.25rem' }} /> Aprobar
          </button>
        )}
        {profile.cam_chat !== 'rejected' && (
          <button onClick={() => onAction(profile.id, 'reject')} className="btn"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            <XCircle size={14} style={{ marginRight: '0.25rem' }} /> Rechazar
          </button>
        )}
        <button onClick={() => { if (confirm('¿Eliminar definitivamente?')) onAction(profile.id, 'delete'); }} className="btn"
          style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
