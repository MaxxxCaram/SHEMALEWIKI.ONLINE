import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const content = {
  en: {
    title: 'Advertise on ShemaleWiki — Pricing & Plans',
    hero: 'Grow Your Business with ShemaleWiki',
    subtitle: 'Reach thousands of visitors actively searching for trans companions in your city. Join the fastest-growing trans community directory.',
    tiers: [
      {
        name: 'Basic Listing',
        price: 'Free',
        features: ['Profile page with photos', 'Appear in city searches', 'Contact links (phone, WhatsApp)', 'Basic profile statistics'],
        cta: 'Submit Profile',
      },
      {
        name: 'Featured Listing',
        price: '€29/mo',
        popular: true,
        features: ['Priority placement at top of city pages', 'Golden badge & highlighted card', 'Up to 20 photos in gallery', 'Verification badge', 'Priority support'],
        cta: 'Get Featured',
      },
    ],
    howItWorks: [
      { step: '1', title: 'Submit your profile', desc: 'Fill out our simple form with your details, photos, and services. Takes less than 5 minutes.' },
      { step: '2', title: 'Get verified', desc: 'Our team reviews your submission within 24 hours. We verify photos and contact information.' },
      { step: '3', title: 'Go live', desc: 'Your profile goes live on ShemaleWiki and BuscaTrans — visible to thousands of potential clients.' },
    ],
    stats: [
      { number: '3,700+', label: 'Active members' },
      { number: '50+', label: 'Cities covered' },
      { number: '3', label: 'Languages' },
      { number: '10K+', label: 'Monthly visitors' },
    ],
    faq: [
      { q: 'How do I get the verification badge?', a: 'Submit your profile with real photos and accurate information. Our team manually reviews each submission to ensure quality and authenticity.' },
      { q: 'Can I use the same profile on BuscaTrans?', a: 'Yes! All profiles on ShemaleWiki automatically appear on BuscaTrans (our Spanish-language sister site) at no extra cost.' },
      { q: 'How do I cancel my subscription?', a: 'Cancel anytime from your dashboard. No long-term contracts — monthly billing, cancel whenever you want.' },
    ],
    contactTitle: 'Ready to get started?',
    contactSub: 'Email us at ads@shemalewiki.online or fill out the form below.',
  },
  es: {
    title: 'Anuncia en BuscaTrans — Precios y Planes',
    hero: 'Hacé crecer tu negocio con BuscaTrans',
    subtitle: 'Llegá a miles de visitantes que buscan acompañantes trans en tu ciudad. Sumate al directorio trans de mayor crecimiento.',
    tiers: [
      {
        name: 'Perfil Básico',
        price: 'Gratis',
        features: ['Página de perfil con fotos', 'Aparecé en búsquedas por ciudad', 'Links de contacto (teléfono, WhatsApp)', 'Estadísticas básicas'],
        cta: 'Crear Perfil',
      },
      {
        name: 'Perfil Destacado',
        price: '€29/mes',
        popular: true,
        features: ['Prioridad al inicio de páginas de ciudad', 'Insignia dorada y tarjeta resaltada', 'Hasta 20 fotos en galería', 'Insignia de verificación', 'Soporte prioritario'],
        cta: 'Ser Destacada',
      },
    ],
    howItWorks: [
      { step: '1', title: 'Creá tu perfil', desc: 'Completá nuestro formulario con tus datos, fotos y servicios. Toma menos de 5 minutos.' },
      { step: '2', title: 'Verificate', desc: 'Nuestro equipo revisa tu perfil en 24 horas. Verificamos fotos e información de contacto.' },
      { step: '3', title: 'Publicá', desc: 'Tu perfil se publica en BuscaTrans y ShemaleWiki — visible para miles de clientes potenciales.' },
    ],
    stats: [
      { number: '3.700+', label: 'Perfiles activos' },
      { number: '50+', label: 'Ciudades' },
      { number: '3', label: 'Idiomas' },
      { number: '10K+', label: 'Visitas mensuales' },
    ],
    faq: [
      { q: '¿Cómo obtengo la insignia de verificación?', a: 'Enviá tu perfil con fotos reales e información precisa. Nuestro equipo revisa manualmente cada perfil para garantizar calidad y autenticidad.' },
      { q: '¿Puedo usar el mismo perfil en ShemaleWiki?', a: '¡Sí! Todos los perfiles de BuscaTrans aparecen automáticamente en ShemaleWiki (nuestro sitio en inglés) sin costo adicional.' },
      { q: '¿Cómo cancelo mi suscripción?', a: 'Cancelá cuando quieras desde tu dashboard. Sin contratos a largo plazo — facturación mensual.' },
    ],
    contactTitle: '¿Lista para empezar?',
    contactSub: 'Escribinos a ads@shemalewiki.online o completá el formulario.',
  },
};

export default function Advertise() {
  // Detect language from URL
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const lang = path.startsWith('/es') ? 'es' : 'en';
  const t = content[lang] || content.en;
  const isBuscaTrans = typeof window !== 'undefined' && window.location.hostname.includes('buscatrans');
  const brandName = isBuscaTrans ? 'BuscaTrans' : 'ShemaleWiki';

  return (
    <>
      <SEO
        title={`${t.title} | ${brandName}`}
        description={t.subtitle}
        canonicalPath={`/${lang}/advertise`}
        lang={lang}
      />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

        {/* Hero */}
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t.hero}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            {t.subtitle}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {t.stats.map((s, i) => (
            <div key={i} className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-primary)' }}>{s.number}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Pricing Tiers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {t.tiers.map((tier, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                padding: '2rem',
                textAlign: 'center',
                border: tier.popular ? '2px solid var(--accent-primary)' : undefined,
                position: 'relative',
              }}
            >
              {tier.popular && (
                <span style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--accent-primary)', color: 'white', padding: '4px 16px',
                  borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
                }}>
                  POPULAR
                </span>
              )}
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{tier.name}</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: '1rem' }}>
                {tier.price}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', textAlign: 'left' }}>
                {tier.features.map((f, j) => (
                  <li key={j} style={{ padding: '0.4rem 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    ✓ {f}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:ads@shemalewiki.online"
                className="btn btn-primary"
                style={{ display: 'inline-block', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 700 }}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          {lang === 'es' ? 'Cómo funciona' : 'How It Works'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {t.howItWorks.map((step, i) => (
            <div key={i} className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '50%',
                background: 'var(--accent-primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem', fontSize: '1.3rem', fontWeight: 900,
              }}>
                {step.step}
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          {lang === 'es' ? 'Preguntas frecuentes' : 'Frequently Asked Questions'}
        </h2>
        <div className="glass" style={{ padding: '2rem', marginBottom: '3rem' }}>
          {t.faq.map((item, i) => (
            <div key={i} style={{ marginBottom: i < t.faq.length - 1 ? '1.5rem' : 0 }}>
              <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.3rem' }}>{item.q}</h4>
              <p style={{ color: 'var(--text-secondary)' }}>{item.a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t.contactTitle}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t.contactSub}</p>
          <a
            href="mailto:ads@shemalewiki.online"
            className="btn btn-primary"
            style={{
              display: 'inline-block', padding: '1rem 3rem', borderRadius: '8px',
              fontSize: '1.1rem', fontWeight: 700,
            }}
          >
            ads@shemalewiki.online
          </a>
        </div>

      </div>
    </>
  );
}
