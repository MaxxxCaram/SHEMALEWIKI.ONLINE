import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Building2, Users, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase } from '../supabase';
import { getProxiedImageUrl } from '../utils';

// City guide content data — rich SEO text for each supported city
const cityContent = {
  amsterdam: {
    displayName: 'Amsterdam',
    country: 'Netherlands',
    continent: 'europe',
    intro: `Amsterdam is one of Europe's most vibrant and inclusive destinations for trans escorts and shemale companionship. Known worldwide for its progressive attitudes, liberal culture, and legendary Red Light District, Amsterdam offers a uniquely welcoming environment for the transgender community. The city's famous tolerance and open-mindedness make it a premier destination for those seeking authentic connections with beautiful trans women, shemale escorts, and ladyboy companions.`,
    scene: `The trans escort scene in Amsterdam is remarkably diverse and professional. From the historic canal-lined streets of De Wallen to the trendy neighborhoods of De Pijp and Jordaan, independent trans escorts operate throughout the city. Amsterdam's legal framework for sex work provides greater safety and professionalism than most cities worldwide. Many trans escorts in Amsterdam offer incall services in well-appointed private apartments near the city center, while others provide outcall services to upscale hotels and residences.`,
    districts: `Popular districts for trans escort encounters include the Centrum area near Dam Square, the fashionable Oud-Zuid district, and the rapidly developing Noord area across the IJ river. The Leidseplein and Rembrandtplein entertainment districts are also hotspots where many escorts arrange meetings. For those preferring discretion, the leafy residential neighborhoods of Oud-Zuid and Amstelveen offer privacy while remaining well-connected by Amsterdam's excellent tram network.`,
    tips: `When booking a trans escort in Amsterdam, communication is key. Most escorts speak excellent English alongside Dutch. It's customary to book in advance, especially during major events like Amsterdam Pride and King's Day. Rates typically range from €150-300 per hour for independent escorts. Always verify profiles and read reviews before booking. The city's excellent public transport and abundance of boutique hotels make logistics easy for both incall and outcall arrangements.`,
    keywords: ['trans escorts Amsterdam', 'shemale escorts Amsterdam', 'ladyboy Amsterdam', 'Amsterdam trans escorts', 'ts escorts Netherlands'],
    faq: [
      { q: 'Is escorting legal in Amsterdam?', a: 'Yes, sex work is legal and regulated in the Netherlands. Independent escorts operate legally, and Amsterdam has specific zones and regulations to ensure safety for both escorts and clients.' },
      { q: 'What areas of Amsterdam have the most trans escorts?', a: 'The Centrum (city center), De Pijp, Oud-Zuid, and areas near the Red Light District have the highest concentration of trans escorts, though many operate throughout greater Amsterdam.' },
      { q: 'How do I verify a trans escort profile in Amsterdam?', a: 'Look for profiles with multiple verified photos, detailed service descriptions, and positive reviews. ShemaleWiki profiles include verification indicators and real photos.' },
    ]
  },
  barcelona: {
    displayName: 'Barcelona',
    country: 'Spain',
    continent: 'europe',
    intro: `Barcelona stands as one of the Mediterranean's most exciting cities for trans escort encounters. This sun-drenched Catalan capital combines cosmopolitan sophistication with a famously open-minded culture, making it an ideal destination for those seeking shemale escorts, trans companions, and ladyboy experiences. From the Gothic Quarter's medieval charm to the modernist wonders of Eixample, Barcelona provides a stunning backdrop for unforgettable meetings.`,
    scene: `The trans escort scene in Barcelona is dynamic, diverse, and increasingly visible. The city's large international community means you'll find escorts from across Europe, Latin America, and Asia. Barcelona's liberal social attitudes and strong LGBTQ+ community in the Eixample district (known as "Gaixample") create a naturally welcoming environment. Many trans escorts in Barcelona offer multilingual services in Spanish, English, and Catalan, catering to both local clients and the millions of tourists who visit annually.`,
    districts: `The Eixample district is the heart of Barcelona's LGBTQ+ scene and a hub for trans escorts. The beachfront Barceloneta neighborhood offers scenic meeting spots, while the upscale Sarrià-Sant Gervasi area provides discreet venues for high-end encounters. The Gothic Quarter and El Born offer charming boutique hotels perfect for incall arrangements. For those seeking nightlife-adjacent meetings, the Port Olímpic and Vila Olímpica areas combine beach vibes with excellent dining and entertainment options.`,
    tips: `Barcelona's trans escort market reflects the city's cosmopolitan character. Rates typically range from €120-250 per hour. Summer months (June-September) see increased demand due to tourism, so advance booking is recommended. The city's excellent metro system makes any neighborhood easily accessible. Many escorts offer both incall and outcall services, with popular meeting spots near Plaça Catalunya, Passeig de Gràcia, and the beachfront areas.`,
    keywords: ['trans escorts Barcelona', 'shemale escorts Barcelona', 'ladyboy Barcelona', 'Barcelona trans escorts', 'ts escorts Spain', 'travestis Barcelona'],
    faq: [
      { q: 'Is escorting legal in Barcelona?', a: 'Escorting is legal in Spain, though street solicitation is restricted. Independent escorts operate freely in Barcelona, and the city has a well-established adult services sector.' },
      { q: 'Where is the best area to meet trans escorts in Barcelona?', a: 'The Eixample (Gaixample) district is the LGBTQ+ hub and a prime area. Other popular zones include the Gothic Quarter, Barceloneta, and the areas around Plaça Catalunya.' },
      { q: 'What languages do trans escorts in Barcelona speak?', a: 'Most escorts in Barcelona speak Spanish and many speak English. Catalan, Portuguese, Italian, and French are also common given the city\'s international character.' },
    ]
  },
  madrid: {
    displayName: 'Madrid',
    country: 'Spain',
    continent: 'europe',
    intro: `Madrid pulses with energy as Spain's capital and one of Europe's premier destinations for trans escort companionship. The city that never sleeps offers an electrifying mix of culture, nightlife, and a thriving LGBTQ+ scene centered around the famous Chueca neighborhood. For those seeking shemale escorts and trans companions in Madrid, the city delivers an unparalleled combination of discretion, diversity, and passion.`,
    scene: `Madrid's trans escort scene is sophisticated and well-established. The city's status as a global business hub means escorts here cater to an international clientele with high expectations. You'll find a remarkable diversity of trans women from across Spain, Latin America, and beyond. Madrid's escorts are known for their professionalism, style, and the warmth characteristic of Spanish culture. The scene operates with a level of discretion and organization that reflects Madrid's position as a world capital.`,
    districts: `Chueca is Madrid's iconic LGBTQ+ neighborhood and a natural starting point for the trans escort scene. The upscale Salamanca district offers luxury settings for high-end encounters, while Malasaña provides a more bohemian, artistic atmosphere. The business-focused AZCA and Cuatro Torres areas near Paseo de la Castellana are popular for discreet meetings with professionals. For those staying near tourist attractions, the area around Gran Vía and Puerta del Sol offers convenient access to many escorts.`,
    tips: `Madrid's trans escort rates typically range from €120-250 per hour, with premium escorts commanding higher rates. The city's world-class hotel infrastructure means excellent options for both incall and outcall arrangements. Madrid's metro is one of Europe's best, making any neighborhood accessible. The best times to visit are spring (March-May) and fall (September-November) when the weather is perfect and the city's cultural calendar is at its peak.`,
    keywords: ['trans escorts Madrid', 'shemale escorts Madrid', 'ladyboy Madrid', 'Madrid trans escorts', 'ts escorts Spain', 'travestis Madrid'],
    faq: [
      { q: 'Is escorting legal in Madrid?', a: 'Yes, escorting between consenting adults is legal in Spain. Madrid has a sophisticated adult services scene with independent escorts operating freely throughout the city.' },
      { q: 'Which neighborhoods are best for meeting trans escorts in Madrid?', a: 'Chueca is the LGBTQ+ heart of Madrid and a top area. Salamanca offers upscale discretion, and the Gran Vía/Puerta del Sol area provides central convenience for tourists.' },
      { q: 'How does Madrid compare to Barcelona for trans escorts?', a: 'Both cities have excellent scenes. Madrid offers more of a business-oriented, energetic vibe with a larger local scene, while Barcelona has more of a beach-resort atmosphere with a higher proportion of tourist-oriented escorts.' },
    ]
  },
  'sao-paulo': {
    displayName: 'São Paulo',
    country: 'Brazil',
    continent: 'americas',
    intro: `São Paulo is the undisputed capital of trans escort culture in South America. As Brazil's largest city and one of the world's most populous metropolitan areas, São Paulo offers an unmatched variety of trans escorts, shemale companions, and stunning Brazilian trans women. The city's legendary diversity, vibrant nightlife, and world-famous Brazilian beauty standards combine to create an environment where trans escort encounters reach their highest expression.`,
    scene: `The trans escort scene in São Paulo is among the largest and most diverse globally. Brazil's cultural celebration of beauty and sensuality creates a uniquely rich environment. São Paulo's escorts range from high-end companions serving the city's elite in Jardins and Itaim Bibi to more accessible options throughout the sprawling metropolis. Many of Brazil's most famous trans adult performers and escorts are based in São Paulo, setting trends that influence the entire Latin American market.`,
    districts: `The upscale Jardins neighborhood is São Paulo's prime area for high-end trans escorts, with luxury apartments and five-star hotels setting the stage for premium encounters. The bustling Avenida Paulista corridor offers central convenience, while Itaim Bibi and Vila Olímpia cater to the city's financial elite. For nightlife-oriented meetings, the Vila Madalena and Pinheiros districts buzz with bars and clubs where connections are made. The Moema and Brooklin areas offer a balance of quality and discretion.`,
    tips: `São Paulo's trans escort rates typically range from R$300-800 per hour, with premium escorts commanding significantly more. Portuguese is essential, though many escorts in upscale areas speak some English. The city's notorious traffic means you should plan logistics carefully — booking escorts near your location or hotel saves significant time. São Paulo has excellent luxury hotels in Jardins, Itaim, and along Avenida Paulista that are escort-friendly and discreet.`,
    keywords: ['trans escorts São Paulo', 'shemale escorts São Paulo', 'travestis São Paulo', 'acompanhantes trans SP', 'ladyboy São Paulo', 'ts escorts Brazil'],
    faq: [
      { q: 'Is escorting legal in São Paulo?', a: 'Yes, sex work between consenting adults is legal in Brazil. São Paulo has a well-established adult services industry with escorts operating independently throughout the city.' },
      { q: 'What languages do trans escorts in São Paulo speak?', a: 'Portuguese is the primary language. English is spoken by escorts catering to international clients, particularly in upscale areas like Jardins and Itaim Bibi. Spanish is also common.' },
      { q: 'What are the best areas to find trans escorts in São Paulo?', a: 'Jardins, Avenida Paulista, Itaim Bibi, and Moema are the prime districts. These areas combine luxury accommodations, discretion, and the highest concentration of quality escorts.' },
    ]
  },
  'buenos-aires': {
    displayName: 'Buenos Aires',
    country: 'Argentina',
    continent: 'americas',
    intro: `Buenos Aires captivates visitors with its European elegance, passionate culture, and thriving trans escort scene. Argentina's cosmopolitan capital combines Parisian-style boulevards with Latin American sensuality, creating a uniquely alluring environment for those seeking shemale escorts and trans companions. From the colorful streets of La Boca to the sophisticated Recoleta district, Buenos Aires offers an unforgettable experience for trans escort encounters.`,
    scene: `The trans escort scene in Buenos Aires is one of South America's most developed and professional. Argentina's progressive gender identity laws and strong LGBTQ+ rights framework provide a supportive environment. Buenos Aires's escorts are known for their striking beauty, sophistication, and the distinctive Argentine charm. The scene includes everyone from elite companions serving international clients in Puerto Madero to independent escorts operating throughout the city's diverse neighborhoods.`,
    districts: `Palermo is Buenos Aires's trendiest district and a hub for trans escort activity, subdivided into Palermo Soho, Palermo Hollywood, and Palermo Chico. Recoleta offers classic European elegance with luxury hotels ideal for high-end encounters. The modern Puerto Madero waterfront district is Buenos Aires's most exclusive area, home to five-star hotels popular for escort meetings. Belgrano and Las Cañitas provide a more residential, discreet atmosphere while remaining well-connected to the city center.`,
    tips: `Buenos Aires trans escort rates typically range from ARS $40,000-100,000 per hour (approximately $100-250 USD at informal rates). Many escorts prefer dollars or euros due to Argentina's currency fluctuations. Spanish is essential; English is less common than in European cities. Palermo and Recoleta offer the best combination of quality escorts, excellent hotels, and vibrant dining/nightlife. The city's late-night culture — dinner at 10 PM, clubs at 2 AM — means encounters often extend into the early morning hours.`,
    keywords: ['trans escorts Buenos Aires', 'shemale escorts Buenos Aires', 'travestis Buenos Aires', 'ladyboy Buenos Aires', 'ts escorts Argentina', 'acompañantes trans Buenos Aires'],
    faq: [
      { q: 'Is escorting legal in Buenos Aires?', a: 'Yes, sex work between consenting adults is legal in Argentina. Buenos Aires has a well-established and professional adult services industry.' },
      { q: 'What are the best neighborhoods for meeting trans escorts in Buenos Aires?', a: 'Palermo (Soho, Hollywood, and Chico) is the top district. Recoleta offers elegance and discretion, while Puerto Madero provides the most luxurious settings.' },
      { q: 'Should I pay in pesos or dollars in Buenos Aires?', a: 'Many escorts prefer payment in US dollars or euros due to currency stability. Discuss payment currency when booking to avoid misunderstandings.' },
    ]
  }
};

// Helper to get slug from display name
function cityToSlug(city) {
  return city.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function CityGuide() {
  const { continent, country, city } = useParams();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [profileCount, setProfileCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);

  const displayCountry = country.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const displayCity = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Find matching content by city slug
  useEffect(() => {
    const match = cityContent[city.toLowerCase()];
    setContent(match || null);
  }, [city]);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        // Query profiles that match this city in location
        const locationPattern = `% | ${displayCity}`;
        const { data, error } = await supabase
          .from('profiles')
          .select('*, photos(photo_url)')
          .ilike('location', locationPattern)
          .order('created_at', { ascending: false })
          .limit(12);

        if (error) throw error;
        if (data) {
          setProfiles(data);
          // Get total count separately
          const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .ilike('location', locationPattern);
          setProfileCount(count || data.length);
        }
      } catch (error) {
        console.error('Error fetching city profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [displayCity]);

  const seoTitle = `Trans Escorts in ${displayCity} — Shemale & Ladyboy ${displayCity}`;
  const seoDesc = content
    ? `Find ${profileCount} verified trans escorts, shemale and ladyboy companions in ${displayCity}, ${displayCountry}. Browse profiles with photos, services, and contact info. ${content.keywords.slice(0, 3).join(', ')}.`
    : `Find verified trans escorts, shemale and ladyboy companions in ${displayCity}, ${displayCountry}. Browse ${profileCount} active profiles with photos, services, and contact info.`;

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonicalPath={`/${continent}/${country}/${city}`}
      />
      <div className="container" style={{ padding: '2rem 0 4rem' }}>
        {/* Breadcrumb navigation */}
        <div className="city-breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to={`/${continent}`} className="breadcrumb-link">
            {continent.charAt(0).toUpperCase() + continent.slice(1)}
          </Link>
          <span className="breadcrumb-sep">›</span>
          <Link to={`/${continent}/${country}`} className="breadcrumb-link">
            {displayCountry}
          </Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{displayCity}</span>
        </div>

        <button
          onClick={() => navigate(`/${continent}/${country}`)}
          className="back-btn"
        >
          <ArrowLeft className="back-icon" />
          Back to {displayCountry}
        </button>

        {/* Hero Section */}
        <div className="city-hero glass" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>
            Trans Escorts in {displayCity}
          </h1>
          <p className="page-subtitle" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
            Your guide to shemale escorts, trans companions, and ladyboys in {displayCity}, {displayCountry}
          </p>
          <div className="city-stats" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div className="city-stat">
              <Users size={20} style={{ color: 'var(--accent-primary)' }} />
              <span><strong>{profileCount}</strong> active profiles</span>
            </div>
            <div className="city-stat">
              <MapPin size={20} style={{ color: 'var(--accent-primary)' }} />
              <span>{displayCountry}</span>
            </div>
          </div>
        </div>

        {/* City Guide Content */}
        {content && (
          <div className="city-content glass" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            <h2>About Trans Escorts in {displayCity}</h2>
            <p>{content.intro}</p>

            <h3>The Trans Escort Scene</h3>
            <p>{content.scene}</p>

            <h3>Popular Districts & Areas</h3>
            <p>{content.districts}</p>

            <h3>Tips for Booking Trans Escorts in {displayCity}</h3>
            <p>{content.tips}</p>

            {/* FAQ Section */}
            <h3 style={{ marginTop: '2rem' }}>Frequently Asked Questions</h3>
            <div className="city-faq">
              {content.faq.map((item, idx) => (
                <div key={idx} className="city-faq-item">
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>
                    {item.q}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{item.a}</p>
                </div>
              ))}
            </div>

            {/* Related Keywords */}
            <div style={{ marginTop: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Also searching for:
              </p>
              <div className="tags-container">
                {content.keywords.map((kw, idx) => (
                  <span key={idx} className="tag">{kw}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Country page link */}
        <div className="city-link-card" style={{ marginBottom: '2rem' }}>
          <Link
            to={`/${continent}/${country}`}
            className="glass-card"
            style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', gap: '1rem' }}
          >
            <Building2 size={24} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <strong>View all trans escorts in {displayCountry}</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                Browse the complete {displayCountry} directory including other cities
              </p>
            </div>
          </Link>
        </div>

        {/* Profile Cards */}
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>
          Featured Trans Escorts in {displayCity}
        </h2>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : profiles.length === 0 ? (
          <div className="empty-state">
            <p>No profiles found in {displayCity} yet.</p>
            <Link to={`/${continent}/${country}`} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Browse all {displayCountry} escorts
            </Link>
          </div>
        ) : (
          <>
            <div className="profiles-grid">
              {profiles.map(profile => (
                <Link to={`/profile/${profile.id}`} key={profile.id} className="glass-card">
                  <img
                    src={getProxiedImageUrl(profile.photos?.[0]?.photo_url)}
                    alt={profile.name}
                    className="profile-card-img"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x400?text=No+Photo'; }}
                  />
                  <div className="profile-card-content">
                    <h3 className="profile-card-title">{profile.name}</h3>
                    <div className="profile-card-meta">
                      <span>📍 {profile.location || 'Unknown'}</span>
                      {profile.age && <span>🎂 Age: {profile.age}</span>}
                      {profile.endowment && <span>🍆 {profile.endowment} cm</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View all link */}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link
                to={`/${continent}/${country}`}
                className="btn btn-primary"
                style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
              >
                View All {displayCountry} Escorts
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
