import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

/* ── Brand detection ── */
const isBT = () => typeof window !== 'undefined' && window.location.hostname.includes('buscatrans');

/* ── Content ── */
const content = {
  en: {
    steps: ['Account', 'Profile', 'Photos', 'Plan'],
    titles: ['List your profile', 'Your profile details', 'Upload your photos', 'Choose your plan'],
    subtitles: [
      'Reach clients worldwide · Free to start',
      'Be specific · Get more clients',
      'Profiles with photos get 8× more views',
      'Start free · Upgrade anytime',
    ],
    fields: {
      step1: [
        { id: 'display_name', label: 'Display name', type: 'text', placeholder: 'e.g. Jessica, Alicia...' },
        { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
        { id: 'contact', label: 'WhatsApp / Telegram', type: 'tel', placeholder: '+44 7...' },
        { id: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 characters' },
        { id: 'country', label: 'Country', type: 'text', placeholder: 'United Kingdom' },
        { id: 'city', label: 'City', type: 'text', placeholder: 'London' },
      ],
      step2: [
        { id: 'bio', label: 'About you (public bio)', type: 'textarea', placeholder: 'Describe yourself professionally...' },
        { id: 'age', label: 'Age', type: 'number' },
        { id: 'languages', label: 'Languages', type: 'text', placeholder: 'English, Spanish' },
        { id: 'rate_hourly', label: 'Rate / hour (£/$)', type: 'number' },
        { id: 'rate_overnight', label: 'Overnight rate', type: 'number' },
      ],
      services: ['Companion', 'Dinner dates', 'Travel', 'GFE', 'Overnight'],
      availability: [
        { value: 'now', label: 'Available now' },
        { value: 'appointment', label: 'By appointment only' },
        { value: 'touring', label: 'Travelling — show tour dates' },
      ],
      step3: {
        privacy: 'Photos are reviewed by our moderation team before going live. We never share your data with third parties.',
        photoOptions: [
          { value: 'public', label: 'Face visible to all', sublabel: 'Maximum exposure' },
          { value: 'verified', label: 'Face visible to verified users only', sublabel: 'Recommended for privacy' },
          { value: 'private', label: 'Private gallery — share manually' },
        ],
      },
      plans: [
        { id: 'free', name: 'Free', price: 0, features: [] },
        { id: 'standard', name: 'Standard', price: 19, recommended: true, features: ['Top of search results', 'Verified badge', 'View analytics', 'Priority support'] },
        { id: 'vip', name: 'VIP Gold', price: 49, features: ['Everything in Standard', 'Homepage feature slot', 'Tour date promotion', 'Priority verification'] },
      ],
    },
    ctas: ['Next → Profile details', 'Next → Upload photos', 'Next → Choose plan', 'Publish my profile →'],
    note: 'Cancel or change plan at any time · No lock-in',
    legal: 'By registering you agree to our terms and privacy policy',
    crossListLabel: 'Also list on BuscaTrans.com?',
    crossListYes: 'Yes — appear on both directories',
    crossListYesSub: 'Double exposure at no extra cost',
    crossListNo: 'No — ShemaleWiki.online only',
  },
  es: {
    steps: ['Cuenta', 'Perfil', 'Fotos', 'Plan'],
    titles: ['Creá tu cuenta', 'Tu perfil', 'Tus fotos', 'Elegí tu plan'],
    subtitles: [
      'Tu espacio, tus reglas, tu mundo.',
      'Tu historia, en tus palabras.',
      'Mostrá lo mejor de vos.',
      'Empezá gratis. Crecé cuando quieras.',
    ],
    fields: {
      step1: [
        { id: 'display_name', label: 'Tu nombre artístico', type: 'text', placeholder: 'Ej: Valentina, Daniela...' },
        { id: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com' },
        { id: 'contact', label: 'WhatsApp', type: 'tel', placeholder: '+54 9...' },
        { id: 'password', label: 'Contraseña', type: 'password', placeholder: 'Mínimo 8 caracteres' },
        { id: 'country', label: 'País', type: 'text', placeholder: 'Argentina' },
        { id: 'city', label: 'Ciudad principal', type: 'text', placeholder: 'Buenos Aires' },
      ],
      step2: [
        { id: 'bio', label: 'Descripción de tu perfil', type: 'textarea', placeholder: 'Presentate con tus propias palabras...' },
        { id: 'age', label: 'Edad', type: 'number' },
        { id: 'languages', label: 'Idiomas', type: 'text', placeholder: 'Español, Inglés' },
        { id: 'rate_hourly', label: 'Tarifa por hora ($)', type: 'number' },
        { id: 'rate_overnight', label: 'Noche completa ($)', type: 'number' },
      ],
      services: ['Acompañante', 'Cenas', 'Viajes', 'GFE', 'Masajes'],
      availability: [
        { value: 'now', label: 'Disponible ahora' },
        { value: 'appointment', label: 'Solo con cita previa' },
      ],
      step3: {
        privacy: 'Tus fotos son revisadas por nuestro equipo antes de publicarse. Nunca compartimos tu información sin tu permiso.',
        photoOptions: [
          { value: 'public', label: 'Fotos con cara visible para todos' },
          { value: 'verified', label: 'Solo clientes verificados las verán', sublabel: 'Recomendado para privacidad' },
          { value: 'private', label: 'Galería privada — compartís el acceso manualmente' },
        ],
      },
      plans: [
        { id: 'free', name: 'Gratuito', price: 0, features: [] },
        { id: 'premium', name: 'Premium', price: 29, recommended: true, features: ['Destacada en resultados', 'Badge verificada', 'Stats de visitas', 'Soporte prioritario'] },
        { id: 'vip', name: 'VIP Gold', price: 69, features: ['Todo lo de Premium', 'Aparición en portada', 'Destacada en newsletter'] },
      ],
    },
    ctas: ['Siguiente → Perfil', 'Siguiente → Fotos', 'Siguiente → Elegir plan', 'Publicar mi perfil →'],
    note: 'Cancelá o cambiá de plan cuando quieras · Sin permanencia',
    legal: 'Al registrarte aceptás nuestros términos y privacidad',
    crossListLabel: '¿También aparecer en ShemaleWiki.online?',
    crossListYes: 'Sí — aparecer en ambos directorios',
    crossListYesSub: 'Doble exposición sin costo extra',
    crossListNo: 'No — solo BuscaTrans.com',
  },
};

export default function Register() {
  const bt = isBT();
  const lang = bt ? 'es' : 'en';
  const t = content[lang];
  const brand = bt ? 'BuscaTrans' : 'ShemaleWiki';

  /* Detect language from URL path for /registro -> es */
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const actualLang = path.startsWith('/registro') ? 'es' : lang;
  const actualT = content[actualLang];

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [selectedPhotoPrivacy, setSelectedPhotoPrivacy] = useState('verified');
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [crossList, setCrossList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdProfile, setCreatedProfile] = useState(null);

  const maxSteps = 4;

  const update = (id, val) => setForm(prev => ({ ...prev, [id]: val }));

  const toggleService = (s) => {
    setSelectedServices(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const canAdvance = () => {
    if (step === 0) return true; // basic, let them proceed
    if (step === 1) return true;
    if (step === 2) return true;
    return true;
  };

  const nextStep = () => {
    if (step < maxSteps - 1) setStep(s => s + 1);
  };
  const prevStep = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');

    const payload = {
      name: form.display_name || '',
      email: form.email || '',
      phone: form.contact || '',
      whatsapp: form.contact || '',
      country: form.country || '',
      city: form.city || '',
      bio: form.bio || '',
      age: form.age || '',
      languages: form.languages || '',
      nationality: '',
      height: '',
      weight: '',
      onlyfans: '',
      cam_chat: ''
    };

    try {
      const apiBase = window.location.origin;
      const response = await fetch(`${apiBase}/api/drafts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Registration failed');
      }

      setCreatedProfile(data.profile);
      setSubmitSuccess(true);
    } catch (err) {
      console.error('Registration error:', err);
      setSubmitError(err.message || 'Could not create profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title={`${actualT.titles[0]} | ${brand}`}
        description={actualT.subtitles[0]}
        canonicalPath={actualLang === 'es' ? '/es/registro' : '/en/register'}
        lang={actualLang}
      />

      <div className="register-container fade-in">
        {/* Step indicator */}
        <div className="register-step-indicator">
          {actualT.steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
              <span style={{
                fontSize: '0.75rem',
                color: i === step ? 'var(--accent-primary)' : i < step ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                fontWeight: i === step ? 700 : 400,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>{s}</span>
              {i < maxSteps - 1 && <span style={{ color: 'var(--card-border)', margin: '0 0.25rem' }}>—</span>}
            </div>
          ))}
        </div>

        <div className="glass register-card">
          <h1 className="register-title">{actualT.titles[step]}</h1>
          <p className="register-subtitle">{actualT.subtitles[step]}</p>

          {/* ── STEP 1: Account ── */}
          {step === 0 && (
            <div>
              {actualT.fields.step1.map(f => (
                <div className="form-group" key={f.id}>
                  <label className="form-label" htmlFor={f.id}>{f.label}</label>
                  <input
                    id={f.id}
                    className="form-input"
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.id] || ''}
                    onChange={e => update(f.id, e.target.value)}
                  />
                </div>
              ))}

              {/* Cross-list toggle */}
              <div className="form-group">
                <label className="form-label">{actualT.crossListLabel}</label>
                <div className="form-radio-group">
                  <label className={`form-radio ${crossList ? 'selected' : ''}`} onClick={() => setCrossList(true)}>
                    <input type="radio" name="crosslist" checked={crossList} onChange={() => setCrossList(true)} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{actualT.crossListYes}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{actualT.crossListYesSub}</div>
                    </div>
                  </label>
                  <label className={`form-radio ${!crossList ? 'selected' : ''}`} onClick={() => setCrossList(false)}>
                    <input type="radio" name="crosslist" checked={!crossList} onChange={() => setCrossList(false)} />
                    <div style={{ fontWeight: 600 }}>{actualT.crossListNo}</div>
                  </label>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '1rem' }}>
                {actualT.legal}
              </p>
            </div>
          )}

          {/* ── STEP 2: Profile ── */}
          {step === 1 && (
            <div>
              {actualT.fields.step2.map(f => (
                <div className="form-group" key={f.id}>
                  <label className="form-label">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      className="form-textarea"
                      placeholder={f.placeholder}
                      value={form[f.id] || ''}
                      onChange={e => update(f.id, e.target.value)}
                    />
                  ) : (
                    <input
                      className="form-input"
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.id] || ''}
                      onChange={e => update(f.id, e.target.value)}
                    />
                  )}
                </div>
              ))}

              {/* Services multi-select */}
              <div className="form-group">
                <label className="form-label">{bt ? 'Servicios que ofrecés' : 'Services offered'}</label>
                <div className="form-multi-select">
                  {actualT.fields.services.map(s => (
                    <button
                      key={s}
                      type="button"
                      className={`ms-option ${selectedServices.includes(s) ? 'selected' : ''}`}
                      onClick={() => toggleService(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="form-group">
                <label className="form-label">{bt ? 'Disponibilidad' : 'Availability'}</label>
                <div className="form-radio-group">
                  {actualT.fields.availability.map(opt => (
                    <label
                      key={opt.value}
                      className={`form-radio ${selectedAvailability === opt.value ? 'selected' : ''}`}
                      onClick={() => setSelectedAvailability(opt.value)}
                    >
                      <input type="radio" name="avail" checked={selectedAvailability === opt.value} onChange={() => setSelectedAvailability(opt.value)} />
                      <span style={{ fontWeight: 600 }}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Photos ── */}
          {step === 2 && (
            <div>
              <div className="photo-upload-zone" style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</p>
                <p style={{ fontWeight: 600 }}>{bt ? 'Foto de perfil principal' : 'Main profile photo'}</p>
                <p style={{ fontSize: '0.8rem' }}>{bt ? 'JPG o PNG · Máx. 10MB · Mínimo 400×400px' : 'JPG or PNG · Max 10MB · Min 400×400px'}</p>
              </div>

              <div className="photo-upload-zone" style={{ marginBottom: '1.5rem', opacity: 0.6 }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖼️</p>
                <p style={{ fontWeight: 600 }}>{bt ? 'Galería de fotos' : 'Photo gallery'}</p>
                <p style={{ fontSize: '0.8rem' }}>{bt ? 'Hasta 10 fotos' : 'Up to 12 photos'}</p>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontStyle: 'italic' }}>
                🔒 {actualT.fields.step3.privacy}
              </p>

              <div className="form-group">
                <label className="form-label">{bt ? 'Privacidad de fotos' : 'Privacy options'}</label>
                <div className="form-radio-group">
                  {actualT.fields.step3.photoOptions.map(opt => (
                    <label
                      key={opt.value}
                      className={`form-radio ${selectedPhotoPrivacy === opt.value ? 'selected' : ''}`}
                      onClick={() => setSelectedPhotoPrivacy(opt.value)}
                    >
                      <input type="radio" name="photoPriv" checked={selectedPhotoPrivacy === opt.value} onChange={() => setSelectedPhotoPrivacy(opt.value)} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{opt.label}</div>
                        {opt.sublabel && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{opt.sublabel}</div>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Plan ── */}
          {step === 3 && (
            <div>
              {submitError && (
                <div className="form-error" style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  fontSize: '0.9rem'
                }}>
                  {submitError}
                </div>
              )}

              {submitSuccess ? (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    marginBottom: '1rem', fontSize: '2rem'
                  }}>
                    ✓
                  </div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#22c55e' }}>
                    {actualLang === 'es' ? '¡Perfil creado con éxito!' : 'Profile created!'}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    {actualLang === 'es'
                      ? `Tu perfil "${createdProfile?.name}" está pendiente de revisión. Te notificaremos cuando esté activo.`
                      : `Your profile "${createdProfile?.name}" is pending review. We'll notify you when it goes live.`}
                  </p>
                  <a href="/" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    {actualLang === 'es' ? 'Volver al inicio' : 'Back to home'}
                  </a>
                </div>
              ) : (
                <div>
                  <div className="plans-grid">
                    {actualT.fields.plans.map(plan => (
                      <div
                        key={plan.id}
                        className={`plan-card ${plan.recommended ? 'recommended' : ''} ${selectedPlan === plan.id ? '' : ''}`}
                        onClick={() => setSelectedPlan(plan.id)}
                        style={{ borderColor: selectedPlan === plan.id ? 'var(--accent-primary)' : undefined }}
                      >
                        {plan.recommended && (
                          <div className="plan-recommended-badge">
                            {bt ? 'Recomendado' : 'Recommended'}
                          </div>
                        )}
                        <h3 className="plan-name">{plan.name}</h3>
                        <div className="plan-price">
                          {plan.price === 0 ? (bt ? 'Gratis' : 'Free') : `€${plan.price}`}
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/mo</span>
                        </div>
                        {plan.features.length > 0 && (
                          <ul className="plan-features">
                            {plan.features.map((f, fi) => <li key={fi}>{f}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    {actualT.note}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem' }}>
            {step > 0 ? (
              <button type="button" className="btn btn-outline" onClick={prevStep} onMouseDown={prevStep}>
                ← {bt ? 'Anterior' : 'Back'}
              </button>
            ) : <div />}
            {step === maxSteps - 1 ? (
              submitSuccess ? null : (
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={handleSubmit}
                  onMouseDown={handleSubmit}
                  disabled={submitting || !form.display_name || !form.email || !form.contact}
                  style={{ flex: 1 }}
                >
                  {submitting
                    ? (actualLang === 'es' ? 'Creando perfil...' : 'Creating profile...')
                    : actualT.ctas[step]}
                </button>
              )
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={nextStep}
                onMouseDown={nextStep}
                onTouchEnd={nextStep}
                disabled={!canAdvance()}
                style={{ flex: step === 0 ? 1 : undefined }}
              >
                {actualT.ctas[step]}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}