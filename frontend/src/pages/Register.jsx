import { useState, useRef } from 'react';
import SEO from '../components/SEO';
import { supabase } from '../supabase';

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
        { id: 'display_name', label: 'Display name', type: 'text', placeholder: 'e.g. Jessica, Alicia...', auto: 'nickname' },
        { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', auto: 'email' },
        { id: 'contact', label: 'WhatsApp / Telegram', type: 'tel', placeholder: '+44 7...', auto: 'tel' },
        { id: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 characters', auto: 'new-password' },
        { id: 'country', label: 'Country', type: 'text', placeholder: 'United Kingdom', auto: 'country-name' },
        { id: 'city', label: 'City', type: 'text', placeholder: 'London', auto: 'address-level2' },
      ],
      step2: [
        { id: 'bio', label: 'About you (public bio)', type: 'textarea', placeholder: 'Describe yourself professionally...', auto: 'off' },
        { id: 'age', label: 'Age', type: 'number', auto: 'off' },
        { id: 'languages', label: 'Languages', type: 'text', placeholder: 'English, Spanish', auto: 'off' },
        { id: 'height', label: 'Height (cm)', type: 'number', auto: 'off' },
        { id: 'weight', label: 'Weight (kg)', type: 'number', auto: 'off' },
        { id: 'nationality', label: 'Nationality', type: 'text', placeholder: 'e.g. Brazilian', auto: 'country-name' },
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
  },
  es: {
    steps: ['Cuenta', 'Perfil', 'Fotos', 'Plan'],
    titles: ['Creá tu perfil', 'Tu perfil', 'Tus fotos', 'Elegí tu plan'],
    subtitles: [
      'Tu espacio, tus reglas, tu mundo.',
      'Tu historia, en tus palabras.',
      'Mostrá lo mejor de vos.',
      'Empezá gratis. Crecé cuando quieras.',
    ],
    fields: {
      step1: [
        { id: 'display_name', label: 'Tu nombre artístico', type: 'text', placeholder: 'Ej: Valentina, Daniela...', auto: 'nickname' },
        { id: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com', auto: 'email' },
        { id: 'contact', label: 'WhatsApp', type: 'tel', placeholder: '+54 9...', auto: 'tel' },
        { id: 'password', label: 'Contraseña', type: 'password', placeholder: 'Mínimo 8 caracteres', auto: 'new-password' },
        { id: 'country', label: 'País', type: 'text', placeholder: 'Argentina', auto: 'country-name' },
        { id: 'city', label: 'Ciudad principal', type: 'text', placeholder: 'Buenos Aires', auto: 'address-level2' },
      ],
      step2: [
        { id: 'bio', label: 'Descripción de tu perfil', type: 'textarea', placeholder: 'Presentate con tus propias palabras...', auto: 'off' },
        { id: 'age', label: 'Edad', type: 'number', auto: 'off' },
        { id: 'languages', label: 'Idiomas', type: 'text', placeholder: 'Español, Inglés', auto: 'off' },
        { id: 'height', label: 'Altura (cm)', type: 'number', auto: 'off' },
        { id: 'weight', label: 'Peso (kg)', type: 'number', auto: 'off' },
        { id: 'nationality', label: 'Nacionalidad', type: 'text', placeholder: 'Ej: Argentina', auto: 'country-name' },
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
  },
};

export default function Register() {
  const bt = isBT();
  const lang = bt ? 'es' : 'en';
  const brand = bt ? 'BuscaTrans' : 'ShemaleWiki';

  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const actualLang = path.startsWith('/registro') ? 'es' : lang;
  const actualT = content[actualLang];

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [selectedPhotoPrivacy, setSelectedPhotoPrivacy] = useState('verified');
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdProfile, setCreatedProfile] = useState(null);

  // Photo + video state
  const [photoFiles, setPhotoFiles] = useState([]);  // File objects
  const [videoLinks, setVideoLinks] = useState(['']);  // URL strings

  const maxSteps = 4;
  const update = (id, val) => setForm(prev => ({ ...prev, [id]: val }));

  const toggleService = (s) => {
    setSelectedServices(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const canAdvance = () => true;

  const nextStep = () => {
    if (step < maxSteps - 1) setStep(s => s + 1);
  };
  const prevStep = () => {
    if (step > 0) setStep(s => s - 1);
  };

  // Photo handlers
  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    setPhotoFiles(prev => [...prev, ...files].slice(0, 10));
  };
  const removePhoto = (idx) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Video link handlers
  const addVideoLink = () => setVideoLinks(prev => [...prev, '']);
  const updateVideoLink = (idx, val) => {
    setVideoLinks(prev => prev.map((v, i) => i === idx ? val : v));
  };
  const removeVideoLink = (idx) => {
    setVideoLinks(prev => prev.filter((_, i) => i !== idx));
  };

  const submitInFlight = useRef(false);

  const handleSubmit = async () => {
    if (submitInFlight.current) return;
    submitInFlight.current = true;
    setSubmitting(true);
    setSubmitError('');

    try {
      const profileId = crypto.randomUUID();

      // 1. Register profile FIRST (creates the row needed for photo FK)
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          name: form.display_name || '',
          email: form.email || '',
          phone: form.contact || '',
          whatsapp: form.contact || '',
          country: form.country || '',
          city: form.city || '',
          bio: form.bio || '',
          age: form.age || '',
          languages: form.languages || '',
          nationality: form.nationality || '',
          height: form.height || '',
          weight: form.weight || '',
          onlyfans: videoLinks.filter(Boolean).join(', '),
          services: selectedServices.join(', '),
          availability: selectedAvailability || '',
          photo_privacy: selectedPhotoPrivacy,
          plan: selectedPlan,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setCreatedProfile(data.profile);

      // 2. Upload photos AFTER profile created (FK satisfied)
      if (photoFiles.length > 0) {
        const formData = new FormData();
        formData.append('profile_id', profileId);
        photoFiles.forEach(file => formData.append('files', file));

        fetch('/api/upload-photos', { method: 'POST', body: formData })
          .then(r => r.ok ? r.json() : Promise.reject(r))
          .then(d => console.log('Photos uploaded:', d.count))
          .catch(e => console.error('Photo upload failed:', e));
      }

      setSubmitSuccess(true);
    } catch (err) {
      console.error('Registration error:', err);
      setSubmitError(err.message || (actualLang === 'es' ? 'Error al crear perfil.' : 'Could not create profile.'));
    } finally {
      setSubmitting(false);
      submitInFlight.current = false;
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
                    name={f.id}
                    className="form-input"
                    type={f.type}
                    placeholder={f.placeholder}
                    autoComplete={f.auto}
                    value={form[f.id] || ''}
                    onChange={e => update(f.id, e.target.value)}
                  />
                </div>
              ))}

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
                  <label className="form-label" htmlFor={f.id}>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      id={f.id}
                      name={f.id}
                      className="form-textarea"
                      placeholder={f.placeholder}
                      autoComplete={f.auto}
                      value={form[f.id] || ''}
                      onChange={e => update(f.id, e.target.value)}
                    />
                  ) : (
                    <input
                      id={f.id}
                      name={f.id}
                      className="form-input"
                      type={f.type}
                      placeholder={f.placeholder}
                      autoComplete={f.auto}
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
              {/* Photo upload */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '1.1rem' }}>
                  📷 {bt ? 'Tus fotos' : 'Your photos'}
                </label>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  {bt ? 'JPG/PNG · Máx 10MB c/u · Hasta 10 fotos' : 'JPG/PNG · Max 10MB each · Up to 10 photos'}
                </p>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handlePhotoSelect}
                  style={{
                    width: '100%', padding: '0.75rem',
                    border: '2px dashed var(--card-border)',
                    borderRadius: '0.5rem', background: 'var(--card-bg)',
                    color: 'var(--text-primary)', cursor: 'pointer'
                  }}
                />

                {/* Preview selected photos */}
                {photoFiles.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                    {photoFiles.map((file, i) => (
                      <div key={i} style={{ position: 'relative', width: '80px', height: '80px' }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Foto ${i + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
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

              {/* Video links */}
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label" style={{ fontSize: '1.1rem' }}>
                  🎥 {bt ? 'Enlaces de video (opcional)' : 'Video links (optional)'}
                </label>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  OnlyFans, Pornhub, xHamster, etc.
                </p>
                {videoLinks.map((link, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      className="form-input"
                      type="url"
                      placeholder="https://..."
                      value={link}
                      onChange={e => updateVideoLink(i, e.target.value)}
                      style={{ flex: 1 }}
                    />
                    {videoLinks.length > 1 && (
                      <button type="button" onClick={() => removeVideoLink(i)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}
                      >×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addVideoLink}
                  style={{
                    background: 'none', border: '1px dashed var(--card-border)',
                    color: 'var(--text-secondary)', padding: '0.5rem 1rem',
                    borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem'
                  }}
                >
                  + {bt ? 'Agregar enlace' : 'Add link'}
                </button>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1.5rem', fontStyle: 'italic' }}>
                🔒 {actualT.fields.step3.privacy}
              </p>

              <div className="form-group">
                <label className="form-label">{bt ? 'Privacidad de fotos' : 'Photo privacy'}</label>
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
              <button type="button" className="btn btn-outline" onClick={prevStep}>
                ← {bt ? 'Anterior' : 'Back'}
              </button>
            ) : <div />}
            {step === maxSteps - 1 ? (
              submitSuccess ? null : (
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={handleSubmit}
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
