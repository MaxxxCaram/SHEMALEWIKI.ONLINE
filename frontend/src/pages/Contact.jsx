import { useState } from 'react';
import SEO from '../components/SEO';

const isBT = () => typeof window !== 'undefined' && window.location.hostname.includes('buscatrans');

const content = {
  en: {
    title: 'Contact Us',
    subtitle: 'Questions? Want to advertise? We\'re here.',
    name: 'Your name',
    email: 'Your email',
    subject: 'Subject',
    message: 'Your message',
    send: 'Send message',
    sending: 'Sending...',
    success: 'Message sent! We\'ll get back to you soon.',
    error: 'Could not send. Please try again.',
    required: 'Please fill in name, email, and message.',
  },
  es: {
    title: 'Contactanos',
    subtitle: '¿Consultas? ¿Querés anunciar? Escribinos.',
    name: 'Tu nombre',
    email: 'Tu email',
    subject: 'Asunto',
    message: 'Tu mensaje',
    send: 'Enviar mensaje',
    sending: 'Enviando...',
    success: '¡Mensaje enviado! Te respondemos pronto.',
    error: 'No se pudo enviar. Intentá de nuevo.',
    required: 'Completá nombre, email y mensaje.',
  },
};

export default function Contact() {
  const bt = isBT();
  const t = bt ? content.es : content.en;
  const brand = bt ? 'BuscaTrans' : 'ShemaleWiki';

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'
  const [errMsg, setErrMsg] = useState('');

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Honeypot: if hidden field filled, bot submitting — reject silently
    if (honeypot) return;
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error');
      setErrMsg(t.required);
      return;
    }

    setStatus('sending');
    setErrMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrMsg(err.message || t.error);
    }
  };

  return (
    <>
      <SEO
        title={`${t.title} | ${brand}`}
        description={t.subtitle}
        canonicalPath={bt ? '/es/contacto' : '/en/contact'}
        lang={bt ? 'es' : 'en'}
      />

      <div className="register-container fade-in">
        <div className="glass register-card" style={{ maxWidth: '560px' }}>
          <h1 className="register-title">{t.title}</h1>
          <p className="register-subtitle">{t.subtitle}</p>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                marginBottom: '1rem', fontSize: '2rem'
              }}>✓</div>
              <p style={{ color: '#22c55e', fontSize: '1.1rem' }}>{t.success}</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
                onClick={() => setStatus(null)}
              >
                {bt ? 'Enviar otro mensaje' : 'Send another message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Honeypot — hidden from real users, bots fill it */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }}>
                <label htmlFor="hp-field">{bt ? 'No completá este campo' : 'Do not fill this field'}</label>
                <input
                  id="hp-field"
                  type="text"
                  name="hp"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t.name}</label>
                <input
                  className="form-input"
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t.email}</label>
                <input
                  className="form-input"
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t.subject}</label>
                <input
                  className="form-input"
                  type="text"
                  value={form.subject}
                  onChange={e => update('subject', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t.message}</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  value={form.message}
                  onChange={e => update('message', e.target.value)}
                  required
                />
              </div>

              {status === 'error' && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444', padding: '0.75rem 1rem',
                  borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem'
                }}>
                  {errMsg}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === 'sending'}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {status === 'sending' ? t.sending : t.send}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            📧 ads@shemalewiki.online
          </p>
        </div>
      </div>
    </>
  );
}
