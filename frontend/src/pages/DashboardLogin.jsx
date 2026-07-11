import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Lock, ArrowRight, ArrowLeft, Mail, Phone, 
  MapPin, Globe, Camera, Video, Plus, Send, 
  CheckCircle2, Sparkles, UserCheck, PlusCircle
} from 'lucide-react';
import { supabase } from '../supabase';

// Compress professional photos to stay under Vercel's 4.5MB serverless limit
function compressImage(file, maxDim = 2048, quality = 0.85) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) return resolve(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = (height * maxDim) / width; width = maxDim; }
          else { width = (width * maxDim) / height; height = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
        }, 'image/jpeg', quality);
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export default function DashboardLogin() {
  const [view, setView] = useState('options'); // 'options', 'claim', 'create', 'login'
  const navigate = useNavigate();

  // Login States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Claim States
  const [claimNameOnSite, setClaimNameOnSite] = useState('');
  const [claimEmail, setClaimEmail] = useState('');
  const [claimPhone, setClaimPhone] = useState('');
  const [claimCountry, setClaimCountry] = useState('');
  const [claimCity, setClaimCity] = useState('');
  const [claimContact, setClaimContact] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Create Profile States
  const [createStep, setCreateStep] = useState(1);
  const [createLoading, setCreateLoading] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createError, setCreateError] = useState('');

  // Step 1: Contact & Location
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createWhatsapp, setCreateWhatsapp] = useState('');
  const [createContinent, setCreateContinent] = useState('Europe');
  const [createCountry, setCreateCountry] = useState('');
  const [createCity, setCreateCity] = useState('');

  // Step 2: Physical & Ad Details
  const [createBio, setCreateBio] = useState('');
  const [createAge, setCreateAge] = useState('');
  const [createHeight, setCreateHeight] = useState('');
  const [createWeight, setCreateWeight] = useState('');
  const [createNationality, setCreateNationality] = useState('');
  const [createLanguages, setCreateLanguages] = useState('');
  const [createOnlyFans, setCreateOnlyFans] = useState('');
  const [createCamChat, setCreateCamChat] = useState('');

  // Step 3: Media
  const [createPhotoFiles, setCreatePhotoFiles] = useState([]);  // File objects
  const [createVideoLinks, setCreateVideoLinks] = useState(['']);

  const API_BASE = typeof window !== 'undefined' ? window.location.origin : '';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginIdentifier,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || 'Credenciales inválidas');
        return;
      }

      localStorage.setItem('dashboard_user_id', data.profile.id);
      navigate('/dashboard');
    } catch (err) {
      setLoginError('Ocurrió un error. Verificá tu conexión.');
      console.error(err);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    setLoginError('');
    setClaimLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name_on_site: claimNameOnSite,
          email: claimEmail,
          phone: claimPhone,
          country: claimCountry,
          city: claimCity,
          contact_details: claimContact
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit claim');
      }

      setClaimSuccess(true);
    } catch (err) {
      console.error(err);
      setLoginError('No se pudo enviar la solicitud. Por favor, inténtelo de nuevo.');
    } finally {
      setClaimLoading(false);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);

    try {
      const profileId = crypto.randomUUID();

      const response = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          name: createName,
          email: createEmail,
          phone: createPhone,
          whatsapp: createWhatsapp || createPhone,
          country: createCountry,
          city: createCity,
          bio: createBio,
          age: createAge,
          height: createHeight,
          weight: createWeight,
          nationality: createNationality,
          languages: createLanguages,
          onlyfans: createVideoLinks.filter(Boolean).join(', '),
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create profile');
      }

      // Upload photos after profile created (FK satisfied)
      if (createPhotoFiles.length > 0) {
        // Upload one at a time with compression (Vercel 4.5MB limit)
        (async () => {
          for (const file of createPhotoFiles) {
            try {
              const compressed = await compressImage(file);
              const formData = new FormData();
              formData.append('profile_id', profileId);
              formData.append('files', compressed);
              const r = await fetch('/api/upload-photos', { method: 'POST', body: formData });
              if (r.ok) {
                const d = await r.json();
                console.log('Photo uploaded:', d.count);
              }
            } catch (e) {
              console.error('Photo upload failed:', e);
            }
          }
        })();
      }

      setCreateSuccess(true);
    } catch (err) {
      console.error(err);
      setCreateError('No se pudo crear el perfil. Por favor, inténtelo de nuevo.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    setCreatePhotoFiles(prev => [...prev, ...files].slice(0, 10));
  };
  const removePhoto = (idx) => {
    setCreatePhotoFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddVideoField = () => {
    setCreateVideoLinks(prev => [...prev, '']);
  };

  const handleVideoLinkChange = (index, value) => {
    setCreateVideoLinks(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  return (
    <div className="container" style={{ padding: '3rem 0', display: 'flex', justifyContent: 'center', minHeight: '80vh', alignItems: 'center' }}>
      {/* 1. SELECTION PORTAL */}
      {view === 'options' && (
        <div style={{ maxWidth: '900px', width: '100%', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <button 
              onClick={() => navigate('/')}
              className="back-btn"
              style={{ display: 'inline-flex', marginBottom: '1.5rem', fontSize: '0.9rem' }}
            >
              <ArrowLeft className="back-icon" style={{ width: '1rem', height: '1rem' }} />
              Volver al inicio
            </button>
            <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.75rem', fontWeight: 'bold' }}>Trans Dashboard Portal</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Selecciona una opción para acceder o administrar tu perfil</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            
            {/* CARD 1: RECLAMAR PERFIL */}
            <div 
              onClick={() => setView('claim')}
              className="glass-card hover-glow" 
              style={{ padding: '2.5rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                <UserCheck size={28} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Reclama tu perfil</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', flexGrow: 1, marginBottom: '1.5rem' }}>
                Si ya figuras en nuestro sitio web pero no tienes tus accesos, solicita tu usuario y contraseña aquí.
              </p>
              <button className="btn" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)', width: '100%', border: '1px solid var(--glass-border)' }}>
                Reclamar Perfil <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
              </button>
            </div>

            {/* CARD 2: CREAR PERFIL */}
            <div 
              onClick={() => setView('create')}
              className="glass-card hover-glow" 
              style={{ padding: '2.5rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <PlusCircle size={28} style={{ color: '#8b5cf6' }} />
              </div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Crear perfil</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', flexGrow: 1, marginBottom: '1.5rem' }}>
                Crea un nuevo anuncio profesional desde cero. Podrás registrar tus fotos, vídeos y todos tus datos.
              </p>
              <button className="btn btn-primary" style={{ width: '100%' }}>
                Crear Perfil <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
              </button>
            </div>

            {/* CARD 3: LOG IN */}
            <div 
              onClick={() => setView('login')}
              className="glass-card hover-glow" 
              style={{ padding: '2.5rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <Lock size={28} style={{ color: '#22c55e' }} />
              </div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Iniciar Sesión</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', flexGrow: 1, marginBottom: '1.5rem' }}>
                Para las acompañantes que ya tienen su perfil actualizado y activo por nuestro equipo de administración.
              </p>
              <button className="btn" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)', width: '100%', border: '1px solid var(--glass-border)' }}>
                Acceder <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. RECLAMA TU PERFIL FORM */}
      {view === 'claim' && (
        <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem' }}>
          <button 
            onClick={() => { setView('options'); setClaimSuccess(false); }}
            className="back-btn"
            style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}
          >
            <ArrowLeft className="back-icon" style={{ width: '1rem', height: '1rem' }} />
            Volver a Opciones
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Reclama tu perfil</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Te enviaremos tus datos de inicio de sesión</p>
          </div>

          {loginError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {loginError}
            </div>
          )}

          {claimSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', marginBottom: '1.5rem', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <CheckCircle2 size={32} style={{ color: '#22c55e' }} />
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>¡Solicitud enviada!</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
                Tu solicitud de reclamación de perfil ha sido registrada correctamente. Nuestro equipo validará los datos y te enviará las credenciales a la brevedad.
              </p>
              <button 
                onClick={() => { setView('options'); setClaimSuccess(false); }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Entendido
              </button>
            </div>
          ) : (
            <form onSubmit={handleClaim} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="form-group">
                <label htmlFor="claimNameOnSite" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nombre con el que figuras en el sitio</label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                  <input 
                    type="text" 
                    id="claimNameOnSite"
                    name="claimNameOnSite"
                    autoComplete="name"
                    className="search-input" 
                    style={{ width: '100%', paddingLeft: '3rem' }} 
                    placeholder="Ej. Maria Martinez" 
                    value={claimNameOnSite}
                    onChange={(e) => setClaimNameOnSite(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="claimEmail" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Correo Electrónico (Mail)</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                  <input 
                    type="email" 
                    id="claimEmail"
                    name="claimEmail"
                    autoComplete="email"
                    className="search-input" 
                    style={{ width: '100%', paddingLeft: '3rem' }} 
                    placeholder="tuemail@ejemplo.com" 
                    value={claimEmail}
                    onChange={(e) => setClaimEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="claimPhone" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Teléfono de Contacto</label>
                <div style={{ position: 'relative' }}>
                  <Phone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                  <input 
                    type="text" 
                    id="claimPhone"
                    name="claimPhone"
                    autoComplete="tel"
                    className="search-input" 
                    style={{ width: '100%', paddingLeft: '3rem' }} 
                    placeholder="+34 600 000 000" 
                    value={claimPhone}
                    onChange={(e) => setClaimPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="claimCountry" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>País</label>
                  <div style={{ position: 'relative' }}>
                    <Globe style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                    <input 
                      type="text" 
                      id="claimCountry"
                      name="claimCountry"
                      autoComplete="country-name"
                      className="search-input" 
                      style={{ width: '100%', paddingLeft: '3rem' }} 
                      placeholder="Ej. España" 
                      value={claimCountry}
                      onChange={(e) => setClaimCountry(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="claimCity" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ciudad</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                    <input 
                      type="text" 
                      id="claimCity"
                      name="claimCity"
                      autoComplete="address-level2"
                      className="search-input" 
                      style={{ width: '100%', paddingLeft: '3rem' }} 
                      placeholder="Ej. Madrid" 
                      value={claimCity}
                      onChange={(e) => setClaimCity(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="claimContact" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Datos de contacto adicionales / Mensaje</label>
                <textarea 
                  id="claimContact"
                  name="claimContact"
                  className="search-input" 
                  style={{ width: '100%', minHeight: '100px', resize: 'vertical', padding: '0.75rem 1rem' }} 
                  placeholder="Escribe aquí cualquier dato adicional que nos ayude a verificar tu identidad..."
                  value={claimContact}
                  onChange={(e) => setClaimContact(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}
                disabled={claimLoading}
              >
                {claimLoading ? (
                  <span className="spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></span>
                ) : (
                  <>Enviar Solicitud <Send size={18} style={{ marginLeft: '0.5rem' }} /></>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* 3. CREAR PERFIL WIZARD FORM */}
      {view === 'create' && (
        <div className="glass-card" style={{ maxWidth: '650px', width: '100%', padding: '2.5rem' }}>
          <button 
            onClick={() => { setView('options'); setCreateSuccess(false); setCreateStep(1); }}
            className="back-btn"
            style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}
          >
            <ArrowLeft className="back-icon" style={{ width: '1rem', height: '1rem' }} />
            Volver a Opciones
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Crear perfil</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Paso {createStep} de 3 — Anuncio Profesional</p>
            
          </div>

          {createStep === 1 && (
            <form onSubmit={handleCreateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="createName" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nombre / Apodo *</label>
                  <div style={{ position: 'relative' }}>
                    <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                    <input 
                      type="text" 
                      id="createName"
                      name="createName"
                      className="search-input" 
                      style={{ width: '100%', paddingLeft: '3rem' }} 
                      placeholder="Ej. Maria Martinez" 
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="createEmail" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email de Contacto *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                    <input 
                      type="email" 
                      id="createEmail"
                      name="createEmail"
                      autoComplete="email"
                      className="search-input" 
                      style={{ width: '100%', paddingLeft: '3rem' }} 
                      placeholder="tuemail@ejemplo.com" 
                      value={createEmail}
                      onChange={(e) => setCreateEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="createPhone" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Teléfono de Contacto *</label>
                  <div style={{ position: 'relative' }}>
                    <Phone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                    <input 
                      type="text" 
                      id="createPhone"
                      name="createPhone"
                      autoComplete="tel"
                      className="search-input" 
                      style={{ width: '100%', paddingLeft: '3rem' }} 
                      placeholder="+34 600 000 000" 
                      value={createPhone}
                      onChange={(e) => setCreatePhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="createWhatsapp" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>WhatsApp (opcional, si es distinto)</label>
                  <div style={{ position: 'relative' }}>
                    <Phone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                    <input 
                      type="text" 
                      id="createWhatsapp"
                      name="createWhatsapp"
                      autoComplete="tel"
                      className="search-input" 
                      style={{ width: '100%', paddingLeft: '3rem' }} 
                      placeholder="Si es distinto al teléfono" 
                      value={createWhatsapp}
                      onChange={(e) => setCreateWhatsapp(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="createCountry" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>País *</label>
                  <div style={{ position: 'relative' }}>
                    <Globe style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                    <input 
                      type="text" 
                      id="createCountry"
                      name="createCountry"
                      autoComplete="country-name"
                      className="search-input" 
                      style={{ width: '100%', paddingLeft: '3rem' }} 
                      placeholder="Ej. España" 
                      value={createCountry}
                      onChange={(e) => setCreateCountry(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="createCity" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ciudad *</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                    <input 
                      type="text" 
                      id="createCity"
                      name="createCity"
                      autoComplete="address-level2"
                      className="search-input" 
                      style={{ width: '100%', paddingLeft: '3rem' }} 
                      placeholder="Ej. Madrid" 
                      value={createCity}
                      onChange={(e) => setCreateCity(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setCreateStep(2)}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
              >
                Siguiente <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
              </button>
            </form>
          )}

          {createStep === 2 && (
            <form onSubmit={handleCreateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="form-group">
                <label htmlFor="createBio" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Biografía (mínimo 50 caracteres) *</label>
                <textarea 
                  id="createBio"
                  name="createBio"
                  style={{ width: '100%', minHeight: '150px', resize: 'vertical', padding: '0.75rem 1rem' }} 
                  placeholder="Cuenta un poco sobre ti, lo que ofreces, tu estilo, disponibilidad..."
                  value={createBio}
                  onChange={(e) => setCreateBio(e.target.value)}
                  required
                  minLength={50}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="createAge" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Edad *</label>
                  <input 
                    type="number" 
                    id="createAge"
                    name="createAge"
                    style={{ width: '100%', padding: '0.75rem 1rem' }} 
                    placeholder="Ej. 25" 
                    value={createAge}
                    onChange={(e) => setCreateAge(e.target.value)}
                    required
                    min={18}
                    max={100}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="createHeight" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Altura (cm)</label>
                  <input 
                    type="number" 
                    id="createHeight"
                    name="createHeight"
                    style={{ width: '100%', padding: '0.75rem 1rem' }} 
                    placeholder="Ej. 165" 
                    value={createHeight}
                    onChange={(e) => setCreateHeight(e.target.value)}
                    min={100}
                    max={250}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="createWeight" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Peso (kg)</label>
                  <input 
                    type="number" 
                    id="createWeight"
                    name="createWeight"
                    style={{ width: '100%', padding: '0.75rem 1rem' }} 
                    placeholder="Ej. 55" 
                    value={createWeight}
                    onChange={(e) => setCreateWeight(e.target.value)}
                    min={20}
                    max={300}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="createNationality" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nacionalidad</label>
                  <input 
                    type="text" 
                    id="createNationality"
                    name="createNationality"
                    autoComplete="country-name"
                    style={{ width: '100%', padding: '0.75rem 1rem' }} 
                    placeholder="Ej. Argentina" 
                    value={createNationality}
                    onChange={(e) => setCreateNationality(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="createLanguages" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Idiomas que hablas</label>
                <input 
                  type="text" 
                  id="createLanguages"
                  name="createLanguages"
                  style={{ width: '100%', padding: '0.75rem 1rem' }} 
                  placeholder="Ej. Español, Inglés, Portugués" 
                  value={createLanguages}
                  onChange={(e) => setCreateLanguages(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => setCreateStep(1)}
                  className="btn"
                  style={{ flex: 1, background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)' }}
                >
                  <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Anterior
                </button>
                <button 
                  type="button"
                  onClick={() => setCreateStep(3)}
                  className="btn btn-primary"
                  style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                >
                  Siguiente <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                </button>
              </div>
            </form>
          )}

          {createStep === 3 && (
            <form onSubmit={handleCreateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="form-group">
                <label htmlFor="createOnlyFans" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Enlaces de redes sociales / OnlyFans</label>
                <textarea 
                  id="createOnlyFans"
                  name="createOnlyFans"
                  style={{ width: '100%', minHeight: '80px', resize: 'vertical', padding: '0.75rem 1rem' }} 
                  placeholder="Uno por línea. Ejemplo:\nhttps://onlyfans.com/...\nhttps://tinder.com/..." 
                  value={createOnlyFans}
                  onChange={(e) => setCreateOnlyFans(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Fotos (opcional, máx. 10)</label>
                <input 
                  type="file" 
                  multiple
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  style={{ width: '100%', background: 'transparent' }}
                />
                {createPhotoFiles.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {createPhotoFiles.map((file, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Foto ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          style={{
                            position: 'absolute', top: '-6px', right: '-6px',
                            width: '22px', height: '22px', borderRadius: '50%',
                            background: '#ef4444', color: '#fff', border: 'none',
                            fontSize: '0.75rem', cursor: 'pointer', lineHeight: '22px', textAlign: 'center'
                          }}
                        >×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Enlaces de videos (opcional)</label>
                {createVideoLinks.map((link, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input 
                      type="url"
                      className="search-input"
                      style={{ flex: 1, padding: '0.75rem 1rem' }} 
                      placeholder="https://onlyfans.com/... o https://tinder.com/..." 
                      value={link}
                      onChange={(e) => handleVideoLinkChange(index, e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const newLinks = [...createVideoLinks];
                        newLinks.splice(index, 1);
                        setCreateVideoLinks(newLinks);
                      }}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', cursor: 'pointer' }}
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={handleAddVideoField}
                  className="btn"
                  style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', width: 'auto', padding: '0.5rem 1rem' }}
                >
                  <Plus size={16} style={{ marginRight: '0.5rem' }} /> Agregar enlace
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => setCreateStep(2)}
                  className="btn"
                  style={{ flex: 1, background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)' }}
                >
                  <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Anterior
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                  disabled={createLoading}
                >
                  {createLoading ? (
                    <span className="spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></span>
                  ) : (
                    <>Crear Perfil <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} /></>
                  )}
                </button>
              </div>
            </form>
          )}

          {createSuccess && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', marginBottom: '1.5rem', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <CheckCircle2 size={32} style={{ color: '#22c55e' }} />
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>¡Perfil creado!</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
                Tu perfil ha sido registrado correctamente. Nuestro equipo lo revisará en las próximas horas y te notificaremos cuando esté activo.
              </p>
              <button 
                onClick={() => { setView('options'); setCreateSuccess(false); setCreateStep(1); }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Entendido
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. SECURE LOG IN FORM */}
      {view === 'login' && (
        <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}>
          <button 
            onClick={() => { setView('options'); setLoginError(''); }}
            className="back-btn"
            style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}
          >
            <ArrowLeft className="back-icon" style={{ width: '1rem', height: '1rem' }} />
            Volver a Opciones
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Iniciar Sesión</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Ingresa tus accesos de administración</p>
          </div>

          {loginError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label htmlFor="loginIdentifier" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Usuario o Correo Electrónico</label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                <input 
                  type="text" 
                  id="loginIdentifier"
                  name="loginIdentifier"
                  autoComplete="username"
                  className="search-input" 
                  style={{ width: '100%', paddingLeft: '3rem' }} 
                  placeholder="Introduce tu usuario o mail" 
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                <input 
                  type="password" 
                  id="loginPassword"
                  name="loginPassword"
                  autoComplete="current-password"
                  className="search-input" 
                  style={{ width: '100%', paddingLeft: '3rem' }} 
                  placeholder="Tu contraseña" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}
              disabled={loginLoading}
            >
              {loginLoading ? (
                <span className="spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></span>
              ) : (
                <>Entrar <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} /></>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
