import { Helmet } from 'react-helmet-async';

/**
 * SEO component for per-page meta tags.
 * All pages get proper title, description, canonical, and hreflang.
 */
export default function SEO({ 
  title, 
  description, 
  canonicalPath = '',
  lang = 'en',
  alternates = [] // [{ lang: 'es', path: '/es/...' }, ...]
}) {
  const baseUrl = 'https://shemalewiki.online';
  const fullTitle = title 
    ? `${title} | ShemaleWiki Online` 
    : 'ShemaleWiki Online — Trans Escort Directory';
  const fullCanonical = canonicalPath ? `${baseUrl}${canonicalPath}` : baseUrl;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ShemaleWiki Online" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

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
    </Helmet>
  );
}
