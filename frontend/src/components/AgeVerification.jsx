import { useState } from 'react';
import logoSw from '../assets/logosw.png';

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

/* ── Brand detection ── */
const isBT = () => typeof window !== 'undefined' && window.location.hostname.includes('buscatrans');

/* ── Content ── */
const t = {
  en: {
    title: 'Legal Notice — Age Verification',
    intro: 'To browse this website you must accept the following terms:',
    terms: [
      'You must be 18 years of age or older to continue browsing.',
      'The publication of any advertisement containing references to sexual services in exchange for money is not permitted.',
      'It is not permitted to attach pornographic images that explicitly show genital organs.',
      'The insertion of pedophile material, including all access data, will be immediately reported to the competent authorities in order to reach those responsible.',
      'By publishing a listing on ShemaleWiki, the User certifies that they can access the content with all rights and also declares that any person represented in the uploaded images is of legal age (over 18 years), and has given their consent to publish them on ShemaleWiki.',
    ],
    confirmText: 'By clicking "Accept", the User declares to be over 18 years of age and releases the service providers, owners and creators of ShemaleWiki from all liability regarding the contents and the use made of the section.',
    privacyText: 'Likewise, by clicking "Accept", the User declares to know and expressly accept the Privacy Policy of the site, regarding the processing of their personal data.',
    moreInfo: 'For more information, please read our Terms and Conditions.',
    enterYear: 'Enter your birth year',
    checkbox: 'I am 18 years of age or older and accept all the above terms',
    accept: 'Accept',
    errorValid: 'Please enter a valid birth year.',
    errorAge: 'You must be 18 or older to enter this site.',
    errorCheckbox: 'Please accept the terms to continue.',
  },
  es: {
    title: 'Aviso Legal — Verificación de Edad',
    intro: 'Para navegar por este sitio web debe aceptar los siguientes términos:',
    terms: [
      'Para seguir navegando has de ser mayor de 18 años.',
      'No se permite la publicación de ningún anuncio que contenga referencias sobre servicios sexuales a cambio de dinero.',
      'No se permite adjuntar imágenes pornográficas que muestren órganos genitales explícitamente.',
      'La inserción de material pedófilo, incluidos todos los datos de acceso, se comunicará inmediatamente a las autoridades competentes a fin de llegar a los responsables implicados.',
      'Al publicar un anuncio en BuscaTrans, el Usuario certifica que puede acceder al contenido con todos los derechos y también declara que cualquier persona representada en las imágenes cargadas es mayor de edad (más de 18 años), y que ha dado su consentimiento para publicarlas en BuscaTrans.',
    ],
    confirmText: 'Al hacer clic en el botón "Aceptar", el Usuario declara ser mayor de 18 años y exime de toda responsabilidad a los proveedores de estos servicios, propietarios y creadores de BuscaTrans sobre los contenidos y sobre el uso que se haga de la sección.',
    privacyText: 'Asimismo, al hacer clic en el botón "Aceptar", el Usuario declara conocer y aceptar expresamente la Política de Privacidad del sitio, relativa al tratamiento de sus datos personales.',
    moreInfo: 'Para obtener más información, lea nuestros Términos y Condiciones.',
    enterYear: 'Ingresá tu año de nacimiento',
    checkbox: 'Soy mayor de 18 años y acepto todos los términos anteriores',
    accept: 'Aceptar',
    errorValid: 'Por favor ingresá un año de nacimiento válido.',
    errorAge: 'Debés ser mayor de 18 años para entrar a este sitio.',
    errorCheckbox: 'Por favor aceptá los términos para continuar.',
  },
  pt: {
    title: 'Aviso Legal — Verificação de Idade',
    intro: 'Para navegar neste site você deve aceitar os seguintes termos:',
    terms: [
      'Você deve ter 18 anos ou mais para continuar navegando.',
      'Não é permitida a publicação de anúncios que contenham referências a serviços sexuais em troca de dinheiro.',
      'Não é permitido anexar imagens pornográficas que mostrem explicitamente órgãos genitais.',
      'A inserção de material pedófilo, incluindo todos os dados de acesso, será comunicada imediatamente às autoridades competentes para localizar os responsáveis.',
      'Ao publicar um anúncio no ShemaleWiki, o Usuário certifica que pode acessar o conteúdo com todos os direitos e também declara que qualquer pessoa representada nas imagens enviadas é maior de idade (mais de 18 anos) e deu seu consentimento para publicá-las no ShemaleWiki.',
    ],
    confirmText: 'Ao clicar em "Aceitar", o Usuário declara ter mais de 18 anos e isenta os provedores de serviços, proprietários e criadores do ShemaleWiki de toda responsabilidade sobre os conteúdos e o uso feito da seção.',
    privacyText: 'Da mesma forma, ao clicar em "Aceitar", o Usuário declara conhecer e aceitar expressamente a Política de Privacidade do site, relativa ao tratamento de seus dados pessoais.',
    moreInfo: 'Para mais informações, leia nossos Termos e Condições.',
    enterYear: 'Digite seu ano de nascimento',
    checkbox: 'Tenho 18 anos ou mais e aceito todos os termos acima',
    accept: 'Aceitar',
    errorValid: 'Por favor, insira um ano de nascimento válido.',
    errorAge: 'Você deve ter 18 anos ou mais para entrar neste site.',
    errorCheckbox: 'Por favor, aceite os termos para continuar.',
  },
};

export default function AgeVerification({ onVerify }) {
  const [confirmed, setConfirmed] = useState(false);
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;

  const bt = isBT();
  const brandName = bt ? 'BuscaTrans' : 'ShemaleWiki';

  /* Detect language: domain-based or path-based */
  let lang = 'en';
  if (typeof window !== 'undefined') {
    if (bt || window.location.pathname.startsWith('/es') || window.location.pathname.startsWith('/registro')) {
      lang = 'es';
    } else if (window.location.pathname.startsWith('/pt')) {
      lang = 'pt';
    }
  }
  const txt = t[lang] || t.en;

  /* Logo */
  const btLogo = () => (
    <span style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: '1.6rem',
      fontWeight: 700,
      background: 'linear-gradient(135deg, #c026d3, #e040a0)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}>
      ⚲ BuscaTrans
    </span>
  );

  const handleCheckbox = (e) => {
    setConfirmed(e.target.checked);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const birthYear = parseInt(year, 10);
    if (!birthYear || birthYear < minYear || birthYear > currentYear) {
      setError(txt.errorValid);
      return;
    }

    const age = currentYear - birthYear;
    if (age < 18) {
      setError(txt.errorAge);
      return;
    }

    if (!confirmed) {
      setError(txt.errorCheckbox);
      return;
    }

    onVerify();
  };

  const bgColor = bt ? 'linear-gradient(135deg, #1a0a2e 0%, #2d1052 50%, #1a0a2e 100%)' : 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)';
  const cardBg = bt ? 'rgba(30, 15, 53, 0.9)' : 'rgba(17, 17, 17, 0.9)';
  const cardBorder = bt ? 'rgba(192, 38, 211, 0.2)' : 'rgba(255,255,255,0.08)';
  const btnBg = bt ? 'linear-gradient(135deg, #c026d3, #e040a0)' : 'linear-gradient(135deg, #c9a227, #e8c84a)';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: bgColor,
      padding: '1rem',
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        background: cardBg,
        backdropFilter: 'blur(20px)',
        borderRadius: '1.25rem',
        border: `1px solid ${cardBorder}`,
        padding: '2.5rem 2rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {bt ? btLogo() : (
            <img src={logoSw} alt="ShemaleWiki" style={{ height: '55px' }} />
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          textAlign: 'center',
          fontFamily: bt ? "'Playfair Display', serif" : "'Bebas Neue', sans-serif",
          letterSpacing: bt ? '-0.01em' : '0.02em',
        }}>
          {txt.title}
        </h1>

        {/* Intro */}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          lineHeight: 1.7,
          marginBottom: '1rem',
        }}>
          {txt.intro}
        </p>

        {/* Terms list */}
        <ol style={{
          color: 'var(--text-secondary)',
          fontSize: '0.82rem',
          lineHeight: 1.7,
          paddingLeft: '1.25rem',
          marginBottom: '1.25rem',
        }}>
          {txt.terms.map((term, i) => (
            <li key={i} style={{ marginBottom: '0.4rem' }}>{term}</li>
          ))}
        </ol>

        {/* Confirm text */}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.82rem',
          lineHeight: 1.6,
          marginBottom: '0.5rem',
        }}>
          {txt.confirmText}
        </p>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.82rem',
          lineHeight: 1.6,
          marginBottom: '1rem',
        }}>
          {txt.privacyText}
        </p>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.8rem',
          marginBottom: '1.5rem',
        }}>
          {txt.moreInfo}{' '}
          <a href="/terms" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
            {lang === 'es' ? 'Términos y Condiciones' : lang === 'pt' ? 'Termos e Condições' : 'Terms and Conditions'}
          </a>.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              marginBottom: '0.4rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textAlign: 'left',
            }}>
              {txt.enterYear}
            </label>
            <input
              type="number"
              placeholder="YYYY"
              value={year}
              onChange={(e) => { setYear(e.target.value); setError(''); }}
              min={minYear}
              max={currentYear}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--card-border)',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6rem',
            marginBottom: '1.25rem',
            cursor: 'pointer',
            textAlign: 'left',
          }}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={handleCheckbox}
              style={{
                width: '16px',
                height: '16px',
                accentColor: bt ? '#c026d3' : '#c9a227',
                marginTop: '3px',
                flexShrink: 0,
              }}
            />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
              {txt.checkbox}
            </span>
          </label>

          {error && (
            <p style={{
              color: '#f87171',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: btnBg,
              color: bt ? 'white' : '#0a0a0a',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: bt ? "'DM Sans', sans-serif" : "'Space Grotesk', sans-serif",
            }}
          >
            {txt.accept}
          </button>
        </form>
      </div>
    </div>
  );
}