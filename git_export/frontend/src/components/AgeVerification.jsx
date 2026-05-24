import { useState, useEffect } from 'react';
import logo from '../assets/logosw.png';

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

export default function AgeVerification({ onVerify }) {
  const [confirmed, setConfirmed] = useState(false);
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;

  const handleCheckbox = (e) => {
    setConfirmed(e.target.checked);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate birth year
    const birthYear = parseInt(year, 10);
    if (!birthYear || birthYear < minYear || birthYear > currentYear) {
      setError('Please enter a valid birth year.');
      return;
    }

    const age = currentYear - birthYear;
    if (age < 18) {
      setError('You must be 18 or older to enter this site.');
      return;
    }

    if (!confirmed) {
      setError('Please confirm you are 18 or older.');
      return;
    }

    onVerify();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '3rem 2rem',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
      }}>
        <img 
          src={logo} 
          alt="ShemaleWiki" 
          style={{ height: '60px', marginBottom: '2rem' }} 
        />
        
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 700, 
          color: '#f8fafc',
          marginBottom: '1.5rem'
        }}>
          Age Verification Required
        </h1>
        
        <p style={{ 
          color: '#94a3b8', 
          fontSize: '0.95rem',
          lineHeight: 1.7,
          marginBottom: '2rem'
        }}>
          This website contains adult content intended for viewers 18 years of age or older.
          By entering, you affirm that you are at least 18 years old and that you are not
          offended by adult-oriented material.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#94a3b8',
              fontSize: '0.85rem',
              marginBottom: '0.5rem',
              textAlign: 'left'
            }}>
              Enter your birth year
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
                padding: '0.875rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(15, 23, 42, 0.6)',
                color: '#f8fafc',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            cursor: 'pointer',
            textAlign: 'left'
          }}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={handleCheckbox}
              style={{ width: '18px', height: '18px', accentColor: '#ec4899' }}
            />
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              I am 18 years of age or older and agree to view adult content
            </span>
          </label>

          {error && (
            <p style={{ 
              color: '#f87171', 
              fontSize: '0.85rem', 
              marginBottom: '1rem' 
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Enter Site
          </button>
        </form>

        <p style={{ 
          color: '#64748b', 
          fontSize: '0.75rem', 
          marginTop: '1.5rem',
          lineHeight: 1.5
        }}>
          By entering, you agree to our Terms of Service and Privacy Policy.
          We use cookies to improve your browsing experience.
        </p>
      </div>
    </div>
  );
}
