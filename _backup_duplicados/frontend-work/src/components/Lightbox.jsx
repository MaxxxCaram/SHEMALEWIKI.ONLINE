import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Fullscreen lightbox for gallery images.
 * Keyboard: ← → to navigate, ESC to close.
 * Click outside image to close.
 */
export default function Lightbox({ images, currentIndex, onClose, onNavigate }) {
  const [loaded, setLoaded] = useState(false);

  const goNext = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const goPrev = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case 'Escape': onClose(); break;
        case 'ArrowRight': goNext(); break;
        case 'ArrowLeft': goPrev(); break;
      }
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, goNext, goPrev]);

  useEffect(() => {
    setLoaded(false);
  }, [currentIndex]);

  if (!images || images.length === 0) return null;

  const current = images[currentIndex];
  const src = current?.photo_url || current;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        <X size={28} />
      </button>

      {images.length > 1 && (
        <>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Previous">
            <ChevronLeft size={36} />
          </button>
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Next">
            <ChevronRight size={36} />
          </button>
        </>
      )}

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {!loaded && <div className="lightbox-loading"><div className="lightbox-spinner" /></div>}
        <img
          src={src}
          alt={`Photo ${currentIndex + 1}`}
          className={`lightbox-img ${loaded ? 'loaded' : ''}`}
          onLoad={() => setLoaded(true)}
        />
        
        <div className="lightbox-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
