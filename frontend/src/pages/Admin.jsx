// Admin Panel — password NEVER on frontend, only server-side verification
// Login POST /api/admin/login {secret} → returns {token}
// Subsequent requests use: Authorization: Bearer <token>

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, Trash2, ExternalLink, RefreshCw, LogOut } from 'lucide-react';

const API_BASE = typeof window !== 'undefined' ? window.location.origin : 'https://shemalewiki.online';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
}

export default function Admin() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [token, setToken] = useState(getToken());

  const apiHeaders = { 'Content-Type': 'application/json' };
  if (token) {
    apiHeaders['Authorization'] = `Bearer ${token}`;
  }

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/admin`, { headers: apiHeaders });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        if (r.status === 401 || r.status === 403) {
          // Token expired or invalid
          localStorage.removeItem('admin_token');
          setToken(null);
          setIsAuthenticated(false);
          setMsg('Sesión expirada. Ingresá tu secret de nuevo.');
        } else {
          setMsg('❌ Error: ' + (data.error || 'no disponible'));
        }
        return;
      }
      const data = await r.json();
      if (data.profiles) {
        setProfiles(Array.isArray(data.profiles) ? data.profiles : []);
      }
    } catch (err) {
      console.error(err);
      setMsg('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [apiHeaders]);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      fetchProfiles();
    }
  }, [token, fetchProfiles]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: passInput }),
      });
      const data = await r.json();
      if (r.ok && data.token) {
        localStorage.setItem('admin_token', data.token);
        setToken(data.token);
        setMsg('✅ Acceso concedido');
      } else {
        setMsg('❌ Secret incorrecto');
      }
    } catch (err) {
      setMsg('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (profileId, action) => {
    setMsg('');
    try {
      const body = { profileId, action };
      // Delete requires secret for safety
      if (action === 'delete') {
        body.secret = document.getElementById('admin-delete-secret')?.value || '';
      }
      const r = await fetch(`${API_BASE}/api/admin`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Failed');

      const labels = { approve: '✅ Aprobado', reject: '❌ Rechazado', delete: '🗑️ Eliminado' };
      setMsg(labels[action] || 'OK');
      fetchProfiles();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('❌ ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setIsAuthenticated(false);
    setProfiles([]);
    setPassInput('');
    setMsg('Sesión cerrada');
  };

  const getStatus = (p) => {
    if (p.cam_chat === 'approved') return { label: '✅ Aprobado', color: '#22c55e' };
    if (p.cam_chat === 'rejected') return { label: '❌ Rechazado', color: '#ef4444' };
    return { label: '⏳ Pendiente', color: '#f59e0b' };
  };

  // Login form — no password on frontend
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '1.5rem' }}>🔐 Admin Panel</h1>
          {msg && <p style={{ color: msg.startsWith('✅') ? '#22c55e' : '#ef4444', marginBottom: '1rem' }}>{msg}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="search-input"
              placeholder="Secret de admin"
              value={passInput}
              onChange={e => setPassInput(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem' }}
              autoFocus
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? '...' : 'Entrar'}
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
          <button onClick={handleLogout} className="btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
            <LogOut size={16} style={{ marginRight: '0.25rem' }} /> Salir
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
        {profile.cam_chat !== 'approved'
          ? <button onClick={() => onAction(profile.id, 'approve')} className="btn"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <CheckCircle2 size={14} style={{ marginRight: '0.25rem' }} /> Aprobar
            </button>
          : null}
        {profile.cam_chat !== 'rejected'
          ? <button onClick={() => onAction(profile.id, 'reject')} className="btn"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              title="Reject profile">
              <XCircle size={14} style={{ marginRight: '0.25rem' }} /> Rechazar
            </button>
          : null}
        <button onClick={() => {
          if (confirm(`¿Eliminar el perfil "${profile.name}"? Esta acción no se puede deshacer.`)) {
            onAction(profile.id, 'delete');
          }
        }} className="btn"
          style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          title="Delete profile">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
