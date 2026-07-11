import { useState, useRef, useEffect } from 'react';
import { getProxiedImageUrl } from '../utils';

/**
 * Lazy-loaded image with blur-up placeholder and graceful fallback.
 * Uses IntersectionObserver to only load when visible.
 */
export default function LazyImage({ src, alt, className, style, fallback }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // preload 200px before visible
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const displaySrc = error
    ? (fallback || getProxiedImageUrl(null))
    : (inView ? getProxiedImageUrl(src) : null);

  return (
    <div ref={imgRef} className={`lazy-img-wrapper ${className || ''}`} style={style}>
      {!loaded && !error && (
        <div className="lazy-img-skeleton">
          <div className="lazy-img-shimmer" />
        </div>
      )}
      {displaySrc && (
        <img
          src={displaySrc}
          alt={alt || ''}
          className={`lazy-img ${loaded ? 'lazy-img-loaded' : ''}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}
