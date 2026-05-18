import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Lock, ArrowRight, ArrowLeft, Mail, Phone, 
  MapPin, Globe, Camera, Video, Plus, Send, 
  CheckCircle2, Sparkles, UserCheck, PlusCircle
} from 'lucide-react';
import { supabase } from '../supabase';

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
  const [createEndowment, setCreateEndowment] = useState('');
  const [createNationality, setCreateNationality] = useState('');
  const [createLanguages, setCreateLanguages] = useState('');
  const [createOnlyFans, setCreateOnlyFans] = useState('');
  const [createCamChat, setCreateCamChat] = useState('');

  // Step 3: Media
  const [createPhotoUrls, setCreatePhotoUrls] = useState(['', '', '']);
  const [createVideoLinks, setCreateVideoLinks] = useState(['']);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email')
        .or(`email.eq.${loginIdentifier},name.eq.${loginIdentifier}`)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const profile = data[0];
        localStorage.setItem('dashboard_user_id', profile.id);
        navigate('/dashboard');
      } else {
        setLoginError('Usuario, correo electrónico o contraseña no válidos');
      }
    } catch (err) {
      setLoginError('Ocurrió un error durante el inicio de sesión. Por favor, inténtelo de nuevo.');
      console.error(err);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    setClaimLoading(false);
    setLoginError('');

    try {
      setClaimLoading(true);
      const claimId = `claim_${Date.now()}`;
      
      const { error } = await supabase
        .from('profiles')
        .insert([{
          id: claimId,
          name: `Reclamación: ${claimNameOnSite}`,
          email: claimEmail,
          phone: claimPhone,
          location: 'CLAIM_REQUEST',
          bio: `SOLICITUD DE RECLAMACIÓN DE PERFIL\n\nNombre en site: ${claimNameOnSite}\nEmail: ${claimEmail}\nTeléfono: ${claimPhone}\nPaís: ${claimCountry}\nCiudad: ${claimCity}\nContacto adicional / Mensaje: ${claimContact}`,
          description: 'CLAIM_REQUEST_PENDING'
        }]);

      if (error) throw error;
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
      const profileId = `draft_${Date.now()}`;
      const fullLocation = `DRAFT: ${createContinent} | ${createCountry} | ${createCity}`;

      // 1. Insert Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: profileId,
          name: createName,
          email: createEmail,
          phone: createPhone,
          whatsapp: createWhatsapp,
          location: fullLocation,
          bio: createBio,
          age: createAge,
          height: createHeight,
          weight: createWeight,
          endowment: createEndowment,
          nationality: createNationality,
          languages: createLanguages,
          onlyfans: createOnlyFans,
          cam_chat: createCamChat,
          description: 'DRAFT_PENDING_APPROVAL'
        }]);

      if (profileError) throw profileError;

      // 2. Insert Photos (only non-empty links)
      const validPhotos = createPhotoUrls.filter(url => url.trim() !== '');
      if (validPhotos.length > 0) {
        const photoInserts = validPhotos.map(url => ({
          profile_id: profileId,
          photo_url: url.trim(),
          local_path: ''
        }));
        const { error: photoError } = await supabase.from('photos').insert(photoInserts);
        if (photoError) console.error('Error inserting photos:', photoError);
      }

      // 3. Insert Videos (only non-empty links)
      const validVideos = createVideoLinks.filter(url => url.trim() !== '');
      if (validVideos.length > 0) {
        const videoInserts = validVideos.map(url => ({
          profile_id: profileId,
          photo_url: url.trim(), // Storing video links inside the photos table
          local_path: ''
        }));
        const { error: videoError } = await supabase.from('photos').insert(videoInserts);
        if (videoError) console.error('Error inserting video links:', videoError);
      }

      setCreateSuccess(true);
    } catch (err) {
      console.error(err);
      setCreateError('No se pudo crear el perfil. Por favor, inténtelo de nuevo.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleAddPhotoField = () => {
    setCreatePhotoUrls(prev => [...prev, '']);
  };

  const handlePhotoUrlChange = (index, value) => {
    setCreatePhotoUrls(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
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
                Para las escorts que ya tienen su perfil actualizado y activo por nuestro equipo de administración.
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nombre con el que figuras en el sitio</label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                  <input 
                    type="text" 
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Correo Electrónico (Mail)</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                  <input 
                    type="email" 
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Teléfono de Contacto</label>
                <div style={{ position: 'relative' }}>
                  <Phone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                  <input 
                    type="text" 
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
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>País</label>
                  <div style={{ position: 'relative' }}>
                    <Globe style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                    <input 
                      type="text" 
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
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ciudad</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                    <input 
                      type="text" 
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Datos de contacto adicionales / Mensaje</label>
                <textarea 
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
            
            {/* Step Progress Indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: createStep >= 1 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)' }}></div>
              <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: createStep >= 2 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)' }}></div>
              <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: createStep >= 3 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)' }}></div>
            </div>
          </div>

          {createError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {createError}
            </div>
          )}

          {createSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', marginBottom: '1.5rem', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <CheckCircle2 size={32} style={{ color: '#22c55e' }} />
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>¡Borrador guardado con éxito!</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
                Tu perfil profesional ha sido guardado correctamente como borrador pendiente. Nuestro equipo lo revisará y, tras la aprobación, tu anuncio estará disponible para miles de usuarios.
              </p>
              <button 
                onClick={() => { setView('options'); setCreateSuccess(false); setCreateStep(1); }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Entendido
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* STEP 1: CONTACT & LOCATION */}
              {createStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Sparkles size={18} /> Datos de Contacto y Ubicación</h3>
                  
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nombre Artístico</label>
                    <input 
                      type="text" 
                      className="search-input" 
                      style={{ width: '100%' }} 
                      placeholder="Ej. Isabella Rossini" 
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Correo Electrónico (Mail)</label>
                    <input 
                      type="email" 
                      className="search-input" 
                      style={{ width: '100%' }} 
                      placeholder="tuemail@ejemplo.com" 
                      value={createEmail}
                      onChange={(e) => setCreateEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Teléfono</label>
                      <input 
                        type="text" 
                        className="search-input" 
                        style={{ width: '100%' }} 
                        placeholder="+34 600 000 000" 
                        value={createPhone}
                        onChange={(e) => setCreatePhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>WhatsApp</label>
                      <input 
                        type="text" 
                        className="search-input" 
                        style={{ width: '100%' }} 
                        placeholder="+34 600 000 000" 
                        value={createWhatsapp}
                        onChange={(e) => setCreateWhatsapp(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Continente</label>
                    <select 
                      className="search-input" 
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', height: '48px', borderRadius: '0.5rem', padding: '0 1rem' }}
                      value={createContinent}
                      onChange={(e) => setCreateContinent(e.target.value)}
                    >
                      <option value="Europe">Europa</option>
                      <option value="North America">Norteamérica</option>
                      <option value="South America">Sudamérica</option>
                      <option value="Asia">Asia</option>
                      <option value="Oceania">Oceanía</option>
                      <option value="Africa">África</option>
                      <option value="Other">Otro</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>País</label>
                      <input 
                        type="text" 
                        className="search-input" 
                        style={{ width: '100%' }} 
                        placeholder="Ej. España" 
                        value={createCountry}
                        onChange={(e) => setCreateCountry(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ciudad</label>
                      <input 
                        type="text" 
                        className="search-input" 
                        style={{ width: '100%' }} 
                        placeholder="Ej. Madrid" 
                        value={createCity}
                        onChange={(e) => setCreateCity(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    style={{ marginTop: '1rem', width: '100%', display: 'flex', justifyContent: 'center' }}
                    onClick={() => {
                      if (createName && createEmail && createPhone && createCountry && createCity) {
                        setCreateStep(2);
                      } else {
                        setCreateError('Por favor, rellene todos los campos obligatorios.');
                      }
                    }}
                  >
                    Siguiente Paso <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                  </button>
                </div>
              )}

              {/* STEP 2: PHYSICAL & AD DETAILS */}
              {createStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Sparkles size={18} /> Datos Físicos y del Anuncio</h3>

                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Biografía / Presentación</label>
                    <textarea 
                      className="search-input" 
                      style={{ width: '100%', minHeight: '120px', resize: 'vertical', padding: '0.75rem 1rem' }} 
                      placeholder="Cuéntanos un poco sobre ti, tus servicios, tarifas, etc..."
                      value={createBio}
                      onChange={(e) => setCreateBio(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Edad</label>
                      <input 
                        type="text" 
                        className="search-input" 
                        style={{ width: '100%' }} 
                        placeholder="Ej. 24" 
                        value={createAge}
                        onChange={(e) => setCreateAge(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Altura (cm)</label>
                      <input 
                        type="text" 
                        className="search-input" 
                        style={{ width: '100%' }} 
                        placeholder="Ej. 175" 
                        value={createHeight}
                        onChange={(e) => setCreateHeight(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Peso (kg)</label>
                      <input 
                        type="text" 
                        className="search-input" 
                        style={{ width: '100%' }} 
                        placeholder="Ej. 62" 
                        value={createWeight}
                        onChange={(e) => setCreateWeight(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Medida (🍆 cm)</label>
                      <input 
                        type="text" 
                        className="search-input" 
                        style={{ width: '100%' }} 
                        placeholder="Ej. 18" 
                        value={createEndowment}
                        onChange={(e) => setCreateEndowment(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nacionalidad</label>
                      <input 
                        type="text" 
                        className="search-input" 
                        style={{ width: '100%' }} 
                        placeholder="Ej. Brasileña" 
                        value={createNationality}
                        onChange={(e) => setCreateNationality(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Idiomas</label>
                      <input 
                        type="text" 
                        className="search-input" 
                        style={{ width: '100%' }} 
                        placeholder="Español, Inglés" 
                        value={createLanguages}
                        onChange={(e) => setCreateLanguages(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>OnlyFans Link</label>
                      <input 
                        type="url" 
                        className="search-input" 
                        style={{ width: '100%' }} 
                        placeholder="https://onlyfans.com/..." 
                        value={createOnlyFans}
                        onChange={(e) => setCreateOnlyFans(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cam Chat Link</label>
                      <input 
                        type="url" 
                        className="search-input" 
                        style={{ width: '100%' }} 
                        placeholder="https://..." 
                        value={createCamChat}
                        onChange={(e) => setCreateCamChat(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                      type="button" 
                      className="btn" 
                      style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
                      onClick={() => setCreateStep(1)}
                    >
                      Atrás
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      style={{ width: '100%' }}
                      onClick={() => {
                        if (createBio) {
                          setCreateStep(3);
                        } else {
                          setCreateError('Por favor, rellene la biografía.');
                        }
                      }}
                    >
                      Siguiente Paso <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: MEDIA & VIDEO LINKS */}
              {createStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Sparkles size={18} /> Fotos y Enlaces de Vídeos</h3>

                  {/* Photo URLs */}
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enlaces de tus Fotos (URLs Directas)</label>
                    {createPhotoUrls.map((url, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <Camera style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                        <input 
                          type="url" 
                          className="search-input" 
                          style={{ width: '100%', paddingLeft: '3rem' }} 
                          placeholder={`Enlace de Foto ${index + 1} (https://...)`} 
                          value={url}
                          onChange={(e) => handlePhotoUrlChange(index, e.target.value)}
                        />
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={handleAddPhotoField}
                      className="btn" 
                      style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    >
                      <Plus size={14} style={{ marginRight: '0.25rem' }} /> Agregar Enlace de Foto
                    </button>
                  </div>

                  {/* Video Links */}
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enlaces de Vídeos (OnlyFans, Pornhub, xHamster, etc.)</label>
                    {createVideoLinks.map((url, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <Video style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                        <input 
                          type="url" 
                          className="search-input" 
                          style={{ width: '100%', paddingLeft: '3rem' }} 
                          placeholder={`Enlace de Vídeo ${index + 1} (https://...)`} 
                          value={url}
                          onChange={(e) => handleVideoLinkChange(index, e.target.value)}
                        />
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={handleAddVideoField}
                      className="btn" 
                      style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    >
                      <Plus size={14} style={{ marginRight: '0.25rem' }} /> Agregar Enlace de Vídeo
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                    <button 
                      type="button" 
                      className="btn" 
                      style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
                      onClick={() => setCreateStep(2)}
                    >
                      Atrás
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                      disabled={createLoading}
                    >
                      {createLoading ? (
                        <span className="spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></span>
                      ) : (
                        <>Guardar Borrador <Send size={18} style={{ marginLeft: '0.5rem' }} /></>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Usuario o Correo Electrónico</label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                <input 
                  type="text" 
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                <input 
                  type="password" 
                  className="search-input" 
                  style={{ width: '100%', paddingLeft: '3rem' }} 
                  placeholder="Introduce tu contraseña" 
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
