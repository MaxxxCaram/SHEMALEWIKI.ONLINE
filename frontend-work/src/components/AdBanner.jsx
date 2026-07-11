import { useEffect, useRef } from 'react';

/**
 * AdBanner — TrafficJunky / ExoClick ad placement
 * 
 * Props:
 *   zoneId: TrafficJunky zone ID (required for TJ)
 *   width: banner width (default 728)
 *   height: banner height (default 90)
 *   provider: 'trafficjunky' | 'exoclick' (default trafficjunky)
 *   className: optional CSS class
 *   fallback: shown while ad loads
 */
export default function AdBanner({ zoneId, width = 728, height = 90, provider = 'trafficjunky', className = '', fallback = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!zoneId || !containerRef.current) return;

    if (provider === 'trafficjunky') {
      // TrafficJunky ad tag
      const script = document.createElement('script');
      script.src = `https://ads.trafficjunky.net/ttj_ads?zone_id=${zoneId}&width=${width}&height=${height}`;
      script.async = true;
      containerRef.current.appendChild(script);
    }

    if (provider === 'exoclick') {
      // ExoClick ad tag  
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://syndication.exoclick.com/ads-iframe-display.php?idzone=${zoneId}&type=${width}x${height}&output=js`;
      script.async = true;
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [zoneId, provider, width, height]);

  return (
    <div
      ref={containerRef}
      className={`ad-banner${className ? ' ' + className : ''}`}
      style={{
        width: '100%',
        maxWidth: `${width}px`,
        height: `${height}px`,
        margin: '2rem auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: fallback ? 'rgba(255,255,255,0.02)' : 'transparent',
        border: fallback ? '1px dashed rgba(255,255,255,0.08)' : 'none',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {fallback && (
        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Publicidad
        </span>
      )}
    </div>
  );
}
