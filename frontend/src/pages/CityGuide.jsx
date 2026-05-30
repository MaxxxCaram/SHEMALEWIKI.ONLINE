import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Building2, Users, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase } from '../supabase';
import LazyImage from '../components/LazyImage';
import { getProxiedImageUrl } from '../utils';

// City guide content data — rich SEO text for each supported city
const cityContent = {
  amsterdam: {
    displayName: 'Amsterdam',
    country: 'Netherlands',
    continent: 'europe',
    intro: `Amsterdam is one of Europe's most vibrant and inclusive destinations for trans escorts and shemale companionship. Known worldwide for its progressive attitudes, liberal culture, and legendary Red Light District, Amsterdam offers a uniquely welcoming environment for the transgender community. The city’s famous tolerance and open-mindedness make it a premier destination for those seeking authentic connections with beautiful trans women, shemale escorts, and ladyboy companions.`,
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
  },
  rotterdam: {
    displayName: 'Rotterdam',
    country: 'Netherlands',
    continent: 'europe',
    intro: `Rotterdam is the Netherlands’ second-largest city and a rising star in the trans escort scene. Known for its cutting-edge modern architecture, massive port, and multicultural energy, Rotterdam offers a distinctly different experience from Amsterdam — edgier, more diverse, and full of surprises. The city's large international community and progressive Dutch attitudes make it an excellent destination for those seeking trans escorts and shemale companionship.`,
    scene: `Rotterdam's trans escort scene reflects the city's character: modern, diverse, and refreshingly straightforward. The city's status as Europe's largest port brings a constant flow of international visitors, creating steady demand for professional trans escorts. Rotterdam's trans women are known for their independence and professionalism, offering services ranging from intimate incall encounters in stylish apartments to upscale outcall arrangements at the city's best hotels and residences.`,
    districts: `The city center around the Markthal and Cube Houses is a prime location for trans escort encounters, with excellent transport links and plenty of discreet meeting spots. The trendy Witte de Withstraat area offers a vibrant cultural scene for pre-meeting drinks and dining. The Kop van Zuid district, with its stunning skyline views and luxury hotels like Hotel New York, provides upscale settings. The Kralingen and Hillegersberg neighborhoods offer more residential discretion while remaining well-connected.`,
    tips: `Rotterdam trans escort rates typically range from €130-280 per hour. Most escorts speak excellent English alongside Dutch, with many also speaking Turkish, Arabic, or Papiamento reflecting the city's diversity. Rotterdam's excellent metro and tram network makes any neighborhood easily accessible. Book in advance during major events like the International Film Festival Rotterdam and North Sea Jazz Festival when demand peaks.`,
    keywords: ['trans escorts Rotterdam', 'shemale escorts Rotterdam', 'ladyboy Rotterdam', 'Rotterdam trans escorts', 'ts escorts Netherlands', 'travestis Rotterdam'],
    faq: [
      { q: 'Is escorting legal in Rotterdam?', a: 'Yes, escorting is legal and regulated in the Netherlands. Rotterdam has the same legal framework as Amsterdam, with independent escorts operating legally throughout the city.' },
      { q: 'How does Rotterdam compare to Amsterdam for trans escorts?', a: 'Rotterdam offers a more modern, less touristy atmosphere than Amsterdam. Escorts here often cater to business travelers and locals, with rates slightly lower than Amsterdam on average.' },
      { q: 'What areas are best for meeting trans escorts in Rotterdam?', a: 'The Centrum (city center), Kop van Zuid, and the Witte de Withstraat area are prime locations. The area around Rotterdam Centraal station also offers excellent accessibility.' },
    ]
  },
  'den-haag': {
    displayName: 'The Hague (Den Haag)',
    country: 'Netherlands',
    continent: 'europe',
    intro: `The Hague (Den Haag) is the political heart of the Netherlands and a sophisticated destination for trans escort encounters. Home to the Dutch government, royal family, and international courts, Den Haag attracts diplomats, professionals, and discerning visitors who appreciate the finer things. The city's elegant architecture, seaside location, and international character create a uniquely refined environment for shemale escorts and trans companions.`,
    scene: `The trans escort scene in The Hague is characterized by discretion and sophistication. The city's diplomatic and professional clientele expect the highest standards of service and confidentiality. Den Haag's trans escorts are known for their elegance, education, and ability to blend seamlessly into the city's refined social fabric. The scene operates with a level of professionalism that reflects The Hague's status as a city of international justice and diplomacy.`,
    districts: `The Statenkwartier and Archipelbuurt neighborhoods are The Hague's most prestigious areas, with stunning 19th-century mansions providing elegant settings for upscale encounters. The Zeeheldenkwartier offers a more bohemian vibe with excellent dining and nightlife. For seaside romance, the Scheveningen beach district combines luxury hotels with stunning North Sea views. The city center around the Binnenhof and Lange Voorhout provides classic Dutch elegance in the shadow of parliament.`,
    tips: `The Hague trans escort rates typically range from €150-300 per hour, reflecting the city’s upscale clientele. Most escorts speak excellent English and many speak French given the international legal community. The city's compact size and excellent tram network make logistics easy. The Kurhaus Hotel in Scheveningen is a legendary venue for high-end encounters. Book discreetly — The Hague values privacy above all.`,
    keywords: ['trans escorts The Hague', 'shemale escorts Den Haag', 'ladyboy The Hague', 'Den Haag trans escorts', 'ts escorts Netherlands', 'travestis Den Haag'],
    faq: [
      { q: 'Is escorting legal in The Hague?', a: 'Yes, sex work is legal and regulated in the Netherlands. The Hague has the same progressive legal framework, with independent escorts operating freely.' },
      { q: 'What type of clients do trans escorts in The Hague serve?', a: 'Given the city’s international institutions, many clients are diplomats, legal professionals, and business travelers. Escorts here are accustomed to discretion and sophisticated clientele.' },
      { q: 'Is Scheveningen a good area for trans escort meetings?', a: 'Absolutely. The Scheveningen beach district offers luxury hotels with sea views, fine dining, and a resort atmosphere just 15 minutes from the city center. It is an ideal setting for memorable encounters.' },
    ]
  },
  paris: {
    displayName: 'Paris',
    country: 'France',
    continent: 'europe',
    intro: `Paris needs no introduction as the world’s city of love, but its trans escort scene is a hidden gem waiting to be discovered. The French capital's legendary elegance, world-class gastronomy, and romantic ambiance create an unparalleled backdrop for encounters with shemale escorts and trans companions. From the cobblestone streets of Montmartre to the chic avenues of the Champs-Élysées, Paris elevates every meeting into an affair to remember.`,
    scene: `The trans escort scene in Paris is sophisticated, discreet, and distinctly French in its approach to pleasure. The city's long tradition of courtesans and sophisticated companionship lives on in its modern trans escort community. Parisian trans women are renowned for their style, charm, and the unmistakable French art de vivre. The scene caters to an international clientele including business travelers, tourists seeking authentic Parisian experiences, and local connoisseurs of beauty.`,
    districts: `The Marais district is Paris’s LGBTQ+ heart and a natural hub for trans escort activity, with its historic architecture and vibrant nightlife. The Opéra and Madeleine area offers classic Parisian elegance with grand hotels like the Ritz and Le Meurice. The Champs-Élysées and 8th arrondissement provide the ultimate in luxury, while Saint-Germain-des-Prés combines intellectual cachet with discreet charm. The 16th arrondissement near the Eiffel Tower offers residential privacy in one of Paris's most prestigious quarters.`,
    tips: `Paris trans escort rates typically range from €200-500 per hour, with elite companions commanding significantly more. French is highly appreciated but many escorts speak English. The city's luxury hotels — from the Ritz to Le Bristol — are escort-friendly with appropriate discretion. Avoid the tourist-trap areas around Pigalle; the true Parisian escort scene operates with far more sophistication. Book well in advance during Fashion Week (February/March, September/October) when demand soars.`,
    keywords: ['trans escorts Paris', 'shemale escorts Paris', 'ladyboy Paris', 'Paris trans escorts', 'ts escorts France', 'travestis Paris'],
    faq: [
      { q: 'Is escorting legal in Paris?', a: 'Yes, sex work between consenting adults is legal in France, though solicitation in public is restricted. Independent escorts operate freely and the industry is well-established.' },
      { q: 'Where in Paris has the best trans escort scene?', a: 'The Marais (4th arrondissement) is the LGBTQ+ hub. The 8th and 16th arrondissements offer luxury and discretion, while Saint-Germain-des-Prés provides sophisticated charm.' },
      { q: 'Do trans escorts in Paris speak English?', a: 'Many do, particularly those catering to international clients. However, some French phrases are always appreciated and add to the Parisian experience.' },
    ]
  },
  london: {
    displayName: 'London',
    country: 'United Kingdom',
    continent: 'europe',
    intro: `London is one of the world’s truly global cities and a premier destination for trans escort encounters. The British capital's incredible diversity, unmatched cultural scene, and sophisticated adult services industry create exceptional opportunities for those seeking shemale escorts and trans companions. From the historic streets of Westminster to the trendy enclaves of Shoreditch, London offers endless possibilities for memorable meetings.`,
    scene: `London's trans escort scene is among the most diverse and professional globally. The city's status as a financial and cultural capital attracts escorts from across the UK, Europe, Asia, and Latin America. London trans escorts are known for their professionalism, education, and ability to navigate the city's sophisticated social landscape. The scene ranges from high-end companions serving Mayfair's elite to independent escorts operating throughout the city's diverse boroughs.`,
    districts: `Mayfair and Knightsbridge are London’s luxury heartlands, with five-star hotels like Claridge's and The Dorchester setting the stage for premium encounters. Soho has long been London's entertainment district and remains a hub for adult services. The City of London and Canary Wharf cater to financial professionals seeking discretion. Shoreditch and Dalston offer a more alternative, creative scene popular with younger clients and escorts. Kensington and Chelsea provide classic London elegance.`,
    tips: `London trans escort rates typically range from £150-400 per hour, with elite companions in central London commanding premium rates. English is universal. London's extensive Tube network makes any area accessible, though booking escorts near your location saves significant time given the city's size. The escort scene is most active in Zones 1-2. Book in advance, especially during London Fashion Week and major events at the O2 or Wembley.`,
    keywords: ['trans escorts London', 'shemale escorts London', 'ladyboy London', 'ts escorts London', 'trans escorts UK', 'shemale London'],
    faq: [
      { q: 'Is escorting legal in London?', a: 'Yes, sex work between consenting adults is legal in the UK. Independent escorts operate legally, though certain activities like street solicitation and brothel-keeping are restricted.' },
      { q: 'What is the best area in London for trans escorts?', a: 'Mayfair and Knightsbridge offer luxury and discretion. Soho is the historic entertainment hub. The City and Canary Wharf are ideal for business travelers.' },
      { q: 'How do I verify a trans escort in London?', a: 'Look for profiles with verified photos, consistent reviews across platforms, and professional communication. ShemaleWiki profiles provide a trusted starting point.' },
    ]
  },
  'rio-de-janeiro': {
    displayName: 'Rio de Janeiro',
    country: 'Brazil',
    continent: 'americas',
    intro: `Rio de Janeiro pulses with sensuality as Brazil's most iconic city and a legendary destination for trans escort encounters. Framed by stunning beaches, dramatic mountains, and the famous Christ the Redeemer statue, Rio's natural beauty is matched only by the beauty of its people. The city’s famous Carioca spirit — warm, welcoming, and uninhibited — creates an electric atmosphere for those seeking shemale escorts and trans companions.`,
    scene: `The trans escort scene in Rio de Janeiro is vibrant, diverse, and deeply woven into the city’s famous beach culture. Brazil's celebration of beauty and sensuality reaches its peak in Rio, where trans women are among the city's most sought-after companions. The scene ranges from high-end escorts serving Copacabana's luxury hotels to independent companions operating throughout the Zona Sul. Rio's trans escorts are famous for their stunning beauty, warm personality, and the passionate Brazilian way of connecting.`,
    districts: `Copacabana and Ipanema are Rio's most famous beach neighborhoods and prime areas for trans escort activity, with iconic hotels like the Copacabana Palace setting the stage for luxury encounters. Leblon offers the city's most exclusive residential setting for discreet, upscale meetings. The Lapa district provides a more bohemian, nightlife-oriented scene. Barra da Tijuca offers a more modern, spacious alternative popular with longer-term visitors. The Santa Teresa neighborhood provides a romantic, artistic atmosphere with stunning bay views.`,
    tips: `Rio trans escort rates typically range from R$300-700 per hour, with premium escorts in Zona Sul commanding higher rates. Portuguese is essential — English is less common than in São Paulo. The Zona Sul (South Zone) beaches are the safest and best-serviced area. Rio's notorious traffic means booking escorts near your location saves considerable time. During Carnival and Reveillon (New Year's), demand skyrockets and advance booking is absolutely essential. Always prioritize safety and stick to reputable profiles.`,
    keywords: ['trans escorts Rio de Janeiro', 'shemale escorts Rio', 'travestis Rio de Janeiro', 'ladyboy Rio', 'ts escorts Brazil', 'acompanhantes trans Rio'],
    faq: [
      { q: 'Is escorting legal in Rio de Janeiro?', a: 'Yes, sex work between consenting adults is legal in Brazil. Rio de Janeiro has a well-established adult services industry integrated into its tourism economy.' },
      { q: 'Is Rio safe for meeting trans escorts?', a: 'The Zona Sul (Copacabana, Ipanema, Leblon) is generally safe for tourists. Book escorts with verified profiles, arrange meetings at reputable hotels, and exercise normal urban precautions.' },
      { q: 'When is the best time to find trans escorts in Rio?', a: 'Year-round availability is excellent, but Carnival (February/March) and Reveillon (New Year’s Eve) bring the highest demand. Book weeks in advance during these peak periods.' },
    ]
  },
  brussels: {
    displayName: 'Brussels',
    country: 'Belgium',
    continent: 'europe',
    intro: `Brussels is Europe’s diplomatic capital and an underrated gem for trans escort encounters. The Belgian capital's international character, world-famous cuisine, and surprising nightlife create a unique environment for those seeking shemale escorts and trans companions. As the headquarters of the EU and NATO, Brussels attracts a sophisticated, multilingual clientele who appreciate quality, discretion, and the city's uniquely Belgian blend of cultures.`,
    scene: `The trans escort scene in Brussels reflects the city's position at the crossroads of Europe. With a diverse population drawing from Belgium's French and Flemish communities plus a massive international workforce, Brussels offers remarkable variety. Trans escorts here tend to be multilingual, well-educated, and accustomed to serving discerning clients from diplomatic and business circles. The scene is more discreet than Amsterdam but equally professional.`,
    districts: `The European Quarter around Schuman and Place du Luxembourg is the heart of Brussels's international community and a prime area for escort activity. The Ixelles and Saint-Gilles neighborhoods offer a trendy, multicultural atmosphere with excellent dining and discreet meeting spots. The historic Grand Place area provides stunning backdrops for luxury encounters at hotels like the Amigo. The Uccle and Woluwe areas offer residential privacy for longer arrangements.`,
    tips: `Brussels trans escort rates typically range from €150-350 per hour. French, Dutch, and English are all widely used — multilingual escorts are the norm here. The city's compact center is walkable, with excellent metro links to outer districts. Brussels's famous gastronomy — from Michelin-starred restaurants to the best chocolate in the world — makes it ideal for extended dinner-date arrangements.`,
    keywords: ['trans escorts Brussels', 'shemale escorts Brussels', 'ladyboy Brussels', 'ts escorts Belgium', 'trans escorts Belgium', 'travestis Brussels'],
    faq: [
      { q: 'Is escorting legal in Brussels?', a: 'Yes, sex work between consenting adults is legal in Belgium. Brussels has a well-regulated and professional adult services sector.' },
      { q: 'What languages do trans escorts in Brussels speak?', a: 'Most escorts speak French and many speak Dutch and English. Given the international character of the city, multilingualism is the norm rather than the exception.' },
      { q: 'Where is the best area in Brussels for escort encounters?', a: 'The European Quarter, Ixelles, and the area around the Grand Place are the prime locations, offering a mix of luxury hotels, fine dining, and discreet settings.' },
    ]
  },
  berlin: {
    displayName: 'Berlin',
    country: 'Germany',
    continent: 'europe',
    intro: `Berlin is Europe\\u2019s undisputed capital of cool — a city where alternative culture, world-class nightlife, and progressive attitudes converge to create one of the continent\\u2019s most exciting trans escort destinations. Germany\\u2019s capital is legendary for its sexual openness, thriving LGBTQ+ community, and anything-goes spirit. For those seeking shemale escorts and trans companions, Berlin offers an authentic, unpretentious, and remarkably diverse experience.`,
    scene: `The trans escort scene in Berlin is as diverse as the city itself. Berlin\\u2019s long tradition of sexual liberation and its status as a global party destination attract escorts from across Europe, Asia, and Latin America. The scene ranges from high-end companions serving business travelers near Potsdamer Platz to edgy, artistic escorts operating from the city\\u2019s famous alternative neighborhoods. German professionalism meets Berlin creativity — expect punctuality, clear communication, and a refreshing lack of judgment.`,
    districts: `Schöneberg has been Berlin\\u2019s LGBTQ+ heart for over a century and remains a prime area for trans escort encounters. The trendy Friedrichshain and Kreuzberg neighborhoods offer a more alternative, youthful vibe with countless bars, clubs, and discreet apartments. Charlottenburg provides a more upscale, classic Berlin atmosphere with luxury hotels. Mitte is the central district where many business travelers stay — ideal for high-end outcall arrangements. Prenzlauer Berg offers a more residential, family-friendly atmosphere with excellent dining for extended dinner-date encounters.`,
    tips: `Berlin trans escort rates typically range from €120-300 per hour. Most escorts speak excellent English alongside German, with many also speaking Russian, Turkish, or Arabic. Berlin\\u2019s excellent U-Bahn and S-Bahn network makes any neighborhood accessible 24/7. The city\\u2019s party culture means late-night and early-morning bookings are common. Book in advance during major events like Berlin Pride (Christopher Street Day) and the Berlinale film festival.`,
    keywords: ['trans escorts Berlin', 'shemale escorts Berlin', 'ladyboy Berlin', 'ts escorts Germany', 'trans escorts Germany', 'travestis Berlin'],
    faq: [
      { q: 'Is escorting legal in Berlin?', a: 'Yes, sex work is legal and regulated in Germany. Berlin has a long-established legal framework that protects both escorts and clients.' },
      { q: 'What is the best area in Berlin for trans escorts?', a: 'Schöneberg is the historic LGBTQ+ district and a top area. Friedrichshain, Kreuzberg, and Charlottenburg are also popular for their mix of hotels, nightlife, and discretion.' },
      { q: 'What languages do trans escorts in Berlin speak?', a: 'Most escorts speak German and English. Many also speak Russian, Turkish, Polish, or Arabic reflecting Berlin\\u2019s international character.' },
    ]
  },
  lisbon: {
    displayName: 'Lisbon',
    country: 'Portugal',
    continent: 'europe',
    intro: `Lisbon is Europe\\u2019s sun-drenched Atlantic capital — a city of seven hills, pastel-colored buildings, and a surprisingly vibrant trans escort scene. Portugal\\u2019s progressive social attitudes, affordable luxury, and booming tourism make Lisbon an increasingly popular destination for those seeking shemale escorts and trans companions. From the cobblestone streets of Alfama to the stylish avenues of Chiado, Lisbon offers old-world charm with a modern, open-minded spirit.`,
    scene: `The trans escort scene in Lisbon has grown significantly alongside the city\\u2019s tourism boom. Portugal decriminalized all drugs in 2001 and has consistently ranked among Europe\\u2019s most progressive countries on LGBTQ+ issues. Lisbon\\u2019s trans escorts include both Portuguese locals and a growing Brazilian community — Portuguese is the shared language, creating a distinctive Lusophone dynamic. The scene operates with discretion but without stigma, reflecting Portugal\\u2019s laid-back Mediterranean attitudes.`,
    districts: `Príncipe Real is Lisbon\\u2019s LGBTQ+ hub and the natural center for the trans escort scene, filled with stylish bars, boutique hotels, and a vibrant nightlife. The neighboring Bairro Alto district transforms from sleepy daytime streets to one of Europe\\u2019s liveliest nightlife zones after dark. Chiado offers sophisticated dining and luxury shopping — ideal for upscale encounters. The Parque das Nações district provides modern, waterfront settings near the casino and major hotels. Belém offers more residential privacy while remaining connected by Lisbon\\u2019s efficient tram network.`,
    tips: `Lisbon trans escort rates typically range from €100-250 per hour. Portuguese is the primary language; English is common among escorts serving tourists but less universal than in Northern Europe. Lisbon\\u2019s hills mean comfortable shoes and taxis/Uber are your friends. Book in advance during summer (June-September) and major events like Lisbon Pride and Web Summit when the city fills with visitors. The city\\u2019s famous pastéis de nata and port wine make for excellent icebreakers during extended encounters.`,
    keywords: ['trans escorts Lisbon', 'shemale escorts Lisbon', 'ladyboy Lisbon', 'ts escorts Portugal', 'trans escorts Portugal', 'travestis Lisboa'],
    faq: [
      { q: 'Is escorting legal in Lisbon?', a: 'Yes, sex work between consenting adults is legal in Portugal. Lisbon has a tolerant and professional adult services environment.' },
      { q: 'What is the best area in Lisbon for trans escorts?', a: 'Príncipe Real is the LGBTQ+ heart of Lisbon and the top area. Bairro Alto, Chiado, and Parque das Nações are also popular for their hotels, dining, and nightlife.' },
      { q: 'What languages do trans escorts in Lisbon speak?', a: 'Portuguese is the primary language. English is common, and many escorts from Brazil add a distinctive Lusophone flavor to the scene.' },
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
                  <LazyImage
                    src={profile.photos?.[0]?.photo_url}
                    alt={profile.name}
                    className="profile-card-img"
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
