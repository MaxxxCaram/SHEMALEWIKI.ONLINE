import { Helmet } from 'react-helmet-async';

/**
 * SEO component for per-page meta tags.
 * All pages get proper title, description, canonical, hreflang, and optional structured data.
 */
export default function SEO({ 
  title, 
  description, 
  keywords,
  canonicalPath = '',
  lang = 'en',
  alternates = [], // [{ lang: 'es', path: '/es/...' }, ...]
  jsonLd = null,
  ogImage = null,
}) {
  const isBuscaTrans = () => typeof window !== 'undefined' && window.location.hostname.includes('buscatrans');
  const baseUrl = isBuscaTrans() ? 'https://buscatrans.com' : 'https://shemalewiki.online';
  const brandName = isBuscaTrans() ? 'BuscaTrans' : 'ShemaleWiki Online';
  const fullTitle = title 
    ? `${title} | ${brandName}` 
    : (isBuscaTrans() 
      ? 'BuscaTrans — Comunidad de Mujeres Trans Verificadas'
      : 'ShemaleWiki Online — Trans Community Directory');
  const fullCanonical = canonicalPath ? `${baseUrl}${canonicalPath}` : baseUrl;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ShemaleWiki Online" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Hreflang */}
      {alternates.map((alt) => (
        <link 
          key={alt.lang}
          rel="alternate" 
          hreflang={alt.lang} 
          href={`${baseUrl}${alt.path}`} 
        />
      ))}
      {/* Self-referencing hreflang */}
      <link rel="alternate" hreflang={lang} href={fullCanonical} />
      {/* x-default hreflang */}
      <link rel="alternate" hreflang="x-default" href={`${baseUrl}${canonicalPath || '/'}`} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
