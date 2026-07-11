import { useState } from 'react';
import logoSw from '../assets/logosw.png';
import logoBT from '../assets/buscatrans-logo.svg';

const STORAGE_KEY = 'sw_age_verified';

export function useAgeVerified() {
  const [verified, setVerified] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  });

  const verify = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setVerified(true);
  };

  return { verified, verify };
}

const isBT = () => typeof window !== 'undefined' && window.location.hostname.includes('buscatrans');

const t = {
  en: {
    title: 'Age Verification',
    question: 'Are you 18 years of age or older?',
    accept: 'Yes, I am 18+',
    decline: 'No, I am under 18',
  },
  es: {
    title: 'Verificación de Edad',
    question: '¿Sos mayor de 18 años?',
    accept: 'Sí, soy mayor de 18',
    decline: 'No, soy menor de 18',
  },
  pt: {
    title: 'Verificação de Idade',
    question: 'Você tem 18 anos ou mais?',
    accept: 'Sim, tenho 18+',
    decline: 'Não, sou menor de 18',
  },
};

export default function AgeVerification({ onVerify }) {
  const [declined, setDeclined] = useState(false);

  const bt = isBT();
  const brandName = bt ? 'BuscaTrans' : 'ShemaleWiki';

  let lang = 'en';
  if (typeof window !== 'undefined') {
    if (bt || window.location.pathname.startsWith('/es') || window.location.pathname.startsWith('/registro')) {
      lang = 'es';
    } else if (window.location.pathname.startsWith('/pt')) {
      lang = 'pt';
    }
  }
  const txt = t[lang] || t.en;

  const handleAccept = () => {
    onVerify();
  };

  const handleDecline = () => {
    setDeclined(true);
  };

  const cardBg = bt ? 'rgba(30, 15, 53, 0.9)' : 'rgba(17, 17, 17, 0.9)';
  const cardBorder = bt ? 'rgba(192, 38, 211, 0.2)' : 'rgba(255,255,255,0.08)';
  const btnBg = bt ? 'linear-gradient(135deg, #c026d3, #e040a0)' : 'linear-gradient(135deg, #c9a227, #e8c84a)';
  const declineBg = 'rgba(255,255,255,0.06)';

  if (declined) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bt ? 'linear-gradient(135deg, #1a0a2e 0%, #2d1052 50%, #1a0a2e 100%)' : 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
        padding: '1rem',
      }}>
        <div style={{
          maxWidth: '420px',
          width: '100%',
          background: cardBg,
          backdropFilter: 'blur(20px)',
          borderRadius: '1.25rem',
          border: `1px solid ${cardBorder}`,
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            {bt ? (
              <img src={logoBT} alt="BuscaTrans" style={{ height: '80px' }} />
            ) : (
              <img src={logoSw} alt="ShemaleWiki" style={{ height: '45px' }} />
            )}
          </div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f87171', marginBottom: '1rem' }}>
            {lang === 'es' ? 'Acceso Denegado' : lang === 'pt' ? 'Acesso Negado' : 'Access Denied'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {lang === 'es' ? 'Debes ser mayor de 18 años para acceder a este sitio.' : lang === 'pt' ? 'Você precisa ter 18 anos ou mais para acessar este site.' : 'You must be 18 or older to access this site.'}
          </p>
          <a href="https://www.google.com" style={{
            display: 'inline-block',
            padding: '0.8rem 2rem',
            borderRadius: '0.5rem',
            background: declineBg,
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            textDecoration: 'none',
            fontWeight: 600,
          }}>
            {lang === 'es' ? 'Volver a Google' : lang === 'pt' ? 'Voltar ao Google' : 'Back to Google'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: bt ? 'linear-gradient(135deg, #1a0a2e 0%, #2d1052 50%, #1a0a2e 100%)' : 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
      padding: '1rem',
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        background: cardBg,
        backdropFilter: 'blur(20px)',
        borderRadius: '1.25rem',
        border: `1px solid ${cardBorder}`,
        padding: '2.5rem 2rem',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {bt ? (
            <img src={logoBT} alt="BuscaTrans" style={{ height: '80px' }} />
          ) : (
            <img src={logoSw} alt="ShemaleWiki" style={{ height: '45px' }} />
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          fontFamily: bt ? "'Playfair Display', serif" : "'Bebas Neue', sans-serif",
        }}>
          {txt.title}
        </h1>

        {/* Question */}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.05rem',
          lineHeight: 1.6,
          marginBottom: '2rem',
        }}>
          {txt.question}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleDecline}
            style={{
              flex: 1,
              padding: '0.85rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(255,255,255,0.1)',
              background: declineBg,
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {txt.decline}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            style={{
              flex: 1,
              padding: '0.85rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: btnBg,
              color: bt ? 'white' : '#0a0a0a',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {txt.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
