import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './Reclama.css';

export default function Reclama() {
  return (
    <div className="reclama-page">
      <SEO
        title="Reclamá tu perfil — BuscaTrans"
        description="Tu perfil ya está en BuscaTrans. Reclamalo gratis, 6 meses sin costo. La primera plataforma de experiencias premium creada y autogestionada por mujeres trans."
      />

      <div className="reclama-hero">
        <h1>Tu perfil ya está publicado</h1>
        <p className="reclama-subtitle">
          Lo recuperamos de sitios que cerraron o te cobraban fortunas por anuncios invisibles.
          Ahora es tuyo.
        </p>
      </div>

      <div className="reclama-card">
        <div className="reclama-intro">
          <p>
            Soy <strong>Victoria Caram</strong>, presidenta de PROUD Nederland y fundadora de{' '}
            <strong>BuscaTrans / ShemaleWiki</strong>, la primera plataforma de experiencias y
            compañía premium creada y autogestionada por mujeres trans.
          </p>
        </div>

        <div className="reclama-benefits">
          <div className="benefit">
            <span className="benefit-icon">📌</span>
            <span><strong>6 meses gratis</strong> — sin letra chica, sin compromiso</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">💰</span>
            <span><strong>15-25€ DE POR VIDA</strong> — más del 90% menos que la competencia</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">🌍</span>
            <span>Visible en <strong>40+ ciudades</strong> del mundo</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">🛡️</span>
            <span><strong>Sin intermediarios.</strong> Vos manejás tu perfil, tu precio, tus reglas</span>
          </div>
        </div>

        <div className="reclama-cta">
          <Link to="/register" className="btn btn-primary btn-lg">
            Reclamar mi perfil ahora
          </Link>
          <p className="reclama-note">
            Ya no lucran más con nosotras. Nosotras construimos lo nuestro.
          </p>
        </div>
      </div>

      <div className="reclama-footer-note">
        <p>
          ¿Ya tenés cuenta?{' '}
          <Link to="/dashboard/login">Iniciá sesión</Link>
        </p>
        <p className="reclama-contact">
          ¿Preguntas? Escribime por Telegram:{' '}
          <a href="https://t.me/maximacarambcn" target="_blank" rel="noopener noreferrer">
            @maximacarambcn
          </a>
        </p>
      </div>
    </div>
  );
}
