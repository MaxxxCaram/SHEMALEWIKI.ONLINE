import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Building2, Users, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase } from '../supabase';
import LazyImage from '../components/LazyImage';
import { isLoadablePhoto } from '../utils/photoFilter';
import { getProxiedImageUrl } from '../utils';

// City guide content data — rich SEO text for each supported city
const cityContent = {
  amsterdam: {
    displayName: 'Amsterdam',
    country: 'Netherlands',
    continent: 'europe',
    intro: `Amsterdam is one of Europe's most vibrant and inclusive destinations for trans companions and shemale companionship. Known worldwide for its progressive attitudes, liberal culture, and legendary Red Light District, Amsterdam offers a uniquely welcoming environment for the transgender community. The city’s famous tolerance and open-mindedness make it a premier destination for those seeking authentic connections with beautiful trans women, shemale companions, and ladyboy companions.`,
    scene: `The trans companion scene in Amsterdam is remarkably diverse and professional. From the historic canal-lined streets of De Wallen to the trendy neighborhoods of De Pijp and Jordaan, independent trans companions operate throughout the city. Amsterdam's legal framework for sex work provides greater safety and professionalism than most cities worldwide. Many trans companions in Amsterdam offer incall services in well-appointed private apartments near the city center, while others provide outcall services to upscale hotels and residences.`,
    districts: `Popular districts for trans companion encounters include the Centrum area near Dam Square, the fashionable Oud-Zuid district, and the rapidly developing Noord area across the IJ river. The Leidseplein and Rembrandtplein entertainment districts are also hotspots where many companions arrange meetings. For those preferring discretion, the leafy residential neighborhoods of Oud-Zuid and Amstelveen offer privacy while remaining well-connected by Amsterdam's excellent tram network.`,
    tips: `When booking a trans companion in Amsterdam, communication is key. Most companions speak excellent English alongside Dutch. It's customary to book in advance, especially during major events like Amsterdam Pride and King's Day. Rates typically range from €150-300 per hour for independent companions. Always verify profiles and read reviews before booking. The city's excellent public transport and abundance of boutique hotels make logistics easy for both incall and outcall arrangements.`,
    keywords: ['trans companions Amsterdam', 'shemale companions Amsterdam', 'ladyboy Amsterdam', 'Amsterdam trans companions', 'ts companions Netherlands'],
    faq: [
      { q: 'Is companionship work legal in Amsterdam?', a: 'Yes, companionship services between consenting adults are legal in the Netherlands. Independent companions operate legally throughout Amsterdam and the country.' },
      { q: 'What areas of Amsterdam have the most trans companions?', a: 'The Centrum (city center), De Pijp, Oud-Zuid, and areas near the Red Light District have the highest concentration of trans companions, though many operate throughout greater Amsterdam.' },
      { q: 'How do I verify a trans companion profile in Amsterdam?', a: 'Look for profiles with multiple verified photos, detailed service descriptions, and positive reviews. ShemaleWiki profiles include verification indicators and real photos.' },
    ]
  },
  barcelona: {
    displayName: 'Barcelona',
    country: 'Spain',
    continent: 'europe',
    intro: `Barcelona stands as one of the Mediterranean's most exciting cities for trans companion encounters. This sun-drenched Catalan capital combines cosmopolitan sophistication with a famously open-minded culture, making it an ideal destination for those seeking shemale companions, trans companions, and ladyboy experiences. From the Gothic Quarter's medieval charm to the modernist wonders of Eixample, Barcelona provides a stunning backdrop for unforgettable meetings.`,
    scene: `The trans companion scene in Barcelona is dynamic, diverse, and increasingly visible. The city's large international community means you'll find companions from across Europe, Latin America, and Asia. Barcelona's liberal social attitudes and strong LGBTQ+ community in the Eixample district (known as "Gaixample") create a naturally welcoming environment. Many trans companions in Barcelona offer multilingual services in Spanish, English, and Catalan, catering to both local clients and the millions of tourists who visit annually.`,
    districts: `The Eixample district is the heart of Barcelona's LGBTQ+ scene and a hub for trans companions. The beachfront Barceloneta neighborhood offers scenic meeting spots, while the upscale Sarrià-Sant Gervasi area provides discreet venues for high-end encounters. The Gothic Quarter and El Born offer charming boutique hotels perfect for incall arrangements. For those seeking nightlife-adjacent meetings, the Port Olímpic and Vila Olímpica areas combine beach vibes with excellent dining and entertainment options.`,
    tips: `Barcelona's trans companion market reflects the city's cosmopolitan character. Rates typically range from €120-250 per hour. Summer months (June-September) see increased demand due to tourism, so advance booking is recommended. The city's excellent metro system makes any neighborhood easily accessible. Many companions offer both incall and outcall services, with popular meeting spots near Plaça Catalunya, Passeig de Gràcia, and the beachfront areas.`,
    keywords: ['trans companions Barcelona', 'shemale companions Barcelona', 'ladyboy Barcelona', 'Barcelona trans companions', 'ts companions Spain', 'travestis Barcelona'],
    faq: [
      { q: 'Is companionship work legal in Barcelona?', a: 'Companionship is legal in Spain, though street solicitation is restricted. Independent companions operate freely in Barcelona, and the city has a well-established adult services sector.' },
      { q: 'Where is the best area to meet trans companions in Barcelona?', a: 'The Eixample (Gaixample) district is the LGBTQ+ hub and a prime area. Other popular zones include the Gothic Quarter, Barceloneta, and the areas around Plaça Catalunya.' },
      { q: 'What languages do trans companions in Barcelona speak?', a: 'Most companions in Barcelona speak Spanish and many speak English. Catalan, Portuguese, Italian, and French are also common given the city\'s international character.' },
    ]
  },
  madrid: {
    displayName: 'Madrid',
    country: 'Spain',
    continent: 'europe',
    intro: `Madrid pulses with energy as Spain's capital and one of Europe's premier destinations for trans companion companionship. The city that never sleeps offers an electrifying mix of culture, nightlife, and a thriving LGBTQ+ scene centered around the famous Chueca neighborhood. For those seeking shemale companions and trans companions in Madrid, the city delivers an unparalleled combination of discretion, diversity, and passion.`,
    scene: `Madrid's trans companion scene is sophisticated and well-established. The city's status as a global business hub means companions here cater to an international clientele with high expectations. You'll find a remarkable diversity of trans women from across Spain, Latin America, and beyond. Madrid's companions are known for their professionalism, style, and the warmth characteristic of Spanish culture. The scene operates with a level of discretion and organization that reflects Madrid's position as a world capital.`,
    districts: `Chueca is Madrid's iconic LGBTQ+ neighborhood and a natural starting point for the trans companion scene. The upscale Salamanca district offers luxury settings for high-end encounters, while Malasaña provides a more bohemian, artistic atmosphere. The business-focused AZCA and Cuatro Torres areas near Paseo de la Castellana are popular for discreet meetings with professionals. For those staying near tourist attractions, the area around Gran Vía and Puerta del Sol offers convenient access to many companions.`,
    tips: `Madrid's trans companion rates typically range from €120-250 per hour, with premium companions commanding higher rates. The city's world-class hotel infrastructure means excellent options for both incall and outcall arrangements. Madrid's metro is one of Europe's best, making any neighborhood accessible. The best times to visit are spring (March-May) and fall (September-November) when the weather is perfect and the city's cultural calendar is at its peak.`,
    keywords: ['trans companions Madrid', 'shemale companions Madrid', 'ladyboy Madrid', 'Madrid trans companions', 'ts companions Spain', 'travestis Madrid'],
    faq: [
      { q: 'Is companionship work legal in Madrid?', a: 'Yes, companionship between consenting adults is legal in Spain. Madrid has a sophisticated adult services scene with companions operating freely throughout the city.' },
      { q: 'Which neighborhoods are best for meeting trans companions in Madrid?', a: 'Chueca is the LGBTQ+ heart of Madrid and a top area. Salamanca offers upscale discretion, and the Gran Vía/Puerta del Sol area provides central convenience for tourists.' },
      { q: 'How does Madrid compare to Barcelona for trans companions?', a: 'Both cities have excellent scenes. Madrid offers more of a business-oriented, energetic vibe with a larger local scene, while Barcelona has more of a beach-resort atmosphere with a higher proportion of tourist-oriented companions.' },
    ]
  },
  'sao-paulo': {
    displayName: 'São Paulo',
    country: 'Brazil',
    continent: 'americas',
    intro: `São Paulo is the undisputed capital of trans companion culture in South America. As Brazil's largest city and one of the world's most populous metropolitan areas, São Paulo offers an unmatched variety of trans companions, shemale companions, and stunning Brazilian trans women. The city's legendary diversity, vibrant nightlife, and world-famous Brazilian beauty standards combine to create an environment where trans companion encounters reach their highest expression.`,
    scene: `The trans companion scene in São Paulo is among the largest and most diverse globally. Brazil's cultural celebration of beauty and sensuality creates a uniquely rich environment. São Paulo's companions range from high-end companions serving the city's elite in Jardins and Itaim Bibi to more accessible options throughout the sprawling metropolis. Many of Brazil's most famous trans adult performers and companions are based in São Paulo, setting trends that influence the entire Latin American market.`,
    districts: `The upscale Jardins neighborhood is São Paulo's prime area for high-end trans companions, with luxury apartments and five-star hotels setting the stage for premium encounters. The bustling Avenida Paulista corridor offers central convenience, while Itaim Bibi and Vila Olímpia cater to the city's financial elite. For nightlife-oriented meetings, the Vila Madalena and Pinheiros districts buzz with bars and clubs where connections are made. The Moema and Brooklin areas offer a balance of quality and discretion.`,
    tips: `São Paulo's trans companion rates typically range from R$300-800 per hour, with premium companions commanding significantly more. Portuguese is essential, though many companions in upscale areas speak some English. The city's notorious traffic means you should plan logistics carefully — booking companions near your location or hotel saves significant time. São Paulo has excellent luxury hotels in Jardins, Itaim, and along Avenida Paulista that are companion-friendly and discreet.`,
    keywords: ['trans companions São Paulo', 'shemale companions São Paulo', 'travestis São Paulo', 'acompanhantes trans SP', 'ladyboy São Paulo', 'ts companions Brazil'],
    faq: [
      { q: 'Is companionship work legal in São Paulo?', a: 'Yes, sex work between consenting adults is legal in Brazil. São Paulo has a well-established adult services industry with companions operating independently throughout the city.' },
      { q: 'What languages do trans companions in São Paulo speak?', a: 'Portuguese is the primary language. English is spoken by companions catering to international clients, particularly in upscale areas like Jardins and Itaim Bibi. Spanish is also common.' },
      { q: 'What are the best areas to find trans companions in São Paulo?', a: 'Jardins, Avenida Paulista, Itaim Bibi, and Moema are the prime districts. These areas combine luxury accommodations, discretion, and the highest concentration of quality companions.' },
    ]
  },
  'buenos-aires': {
    displayName: 'Buenos Aires',
    country: 'Argentina',
    continent: 'americas',
    intro: `Buenos Aires captivates visitors with its European elegance, passionate culture, and thriving trans companion scene. Argentina's cosmopolitan capital combines Parisian-style boulevards with Latin American sensuality, creating a uniquely alluring environment for those seeking shemale companions and trans companions. From the colorful streets of La Boca to the sophisticated Recoleta district, Buenos Aires offers an unforgettable experience for trans companion encounters.`,
    scene: `The trans companion scene in Buenos Aires is one of South America's most developed and professional. Argentina's progressive gender identity laws and strong LGBTQ+ rights framework provide a supportive environment. Buenos Aires's companions are known for their striking beauty, sophistication, and the distinctive Argentine charm. The scene includes everyone from elite companions serving international clients in Puerto Madero to independent companions operating throughout the city's diverse neighborhoods.`,
    districts: `Palermo is Buenos Aires's trendiest district and a hub for trans companion activity, subdivided into Palermo Soho, Palermo Hollywood, and Palermo Chico. Recoleta offers classic European elegance with luxury hotels ideal for high-end encounters. The modern Puerto Madero waterfront district is Buenos Aires's most exclusive area, home to five-star hotels popular for companion meetings. Belgrano and Las Cañitas provide a more residential, discreet atmosphere while remaining well-connected to the city center.`,
    tips: `Buenos Aires trans companion rates typically range from ARS $40,000-100,000 per hour (approximately $100-250 USD at informal rates). Many companions prefer dollars or euros due to Argentina's currency fluctuations. Spanish is essential; English is less common than in European cities. Palermo and Recoleta offer the best combination of quality companions, excellent hotels, and vibrant dining/nightlife. The city's late-night culture — dinner at 10 PM, clubs at 2 AM — means encounters often extend into the early morning hours.`,
    keywords: ['trans companions Buenos Aires', 'shemale companions Buenos Aires', 'travestis Buenos Aires', 'ladyboy Buenos Aires', 'ts companions Argentina', 'acompañantes trans Buenos Aires'],
    faq: [
      { q: 'Is companionship work legal in Buenos Aires?', a: 'Yes, sex work between consenting adults is legal in Argentina. Buenos Aires has a well-established and professional adult services industry.' },
      { q: 'What are the best neighborhoods for meeting trans companions in Buenos Aires?', a: 'Palermo (Soho, Hollywood, and Chico) is the top district. Recoleta offers elegance and discretion, while Puerto Madero provides the most luxurious settings.' },
      { q: 'Should I pay in pesos or dollars in Buenos Aires?', a: 'Many companions prefer payment in US dollars or euros due to currency stability. Discuss payment currency when booking to avoid misunderstandings.' },
    ]
  },
  rotterdam: {
    displayName: 'Rotterdam',
    country: 'Netherlands',
    continent: 'europe',
    intro: `Rotterdam is the Netherlands’ second-largest city and a rising star in the trans companion scene. Known for its cutting-edge modern architecture, massive port, and multicultural energy, Rotterdam offers a distinctly different experience from Amsterdam — edgier, more diverse, and full of surprises. The city's large international community and progressive Dutch attitudes make it an excellent destination for those seeking trans companions and shemale companionship.`,
    scene: `Rotterdam's trans companion scene reflects the city's character: modern, diverse, and refreshingly straightforward. The city's status as Europe's largest port brings a constant flow of international visitors, creating steady demand for professional trans companions. Rotterdam's trans women are known for their independence and professionalism, offering services ranging from intimate incall encounters in stylish apartments to upscale outcall arrangements at the city's best hotels and residences.`,
    districts: `The city center around the Markthal and Cube Houses is a prime location for trans companion encounters, with excellent transport links and plenty of discreet meeting spots. The trendy Witte de Withstraat area offers a vibrant cultural scene for pre-meeting drinks and dining. The Kop van Zuid district, with its stunning skyline views and luxury hotels like Hotel New York, provides upscale settings. The Kralingen and Hillegersberg neighborhoods offer more residential discretion while remaining well-connected.`,
    tips: `Rotterdam trans companion rates typically range from €130-280 per hour. Most companions speak excellent English alongside Dutch, with many also speaking Turkish, Arabic, or Papiamento reflecting the city's diversity. Rotterdam's excellent metro and tram network makes any neighborhood easily accessible. Book in advance during major events like the International Film Festival Rotterdam and North Sea Jazz Festival when demand peaks.`,
    keywords: ['trans companions Rotterdam', 'shemale companions Rotterdam', 'ladyboy Rotterdam', 'Rotterdam trans companions', 'ts companions Netherlands', 'travestis Rotterdam'],
    faq: [
      { q: 'Is companionship work legal in Rotterdam?', a: 'Yes, companionship is legal and regulated in the Netherlands. Rotterdam has the same legal framework as Amsterdam, with independent companions operating legally throughout the city.' },
      { q: 'How does Rotterdam compare to Amsterdam for trans companions?', a: 'Rotterdam offers a more modern, less touristy atmosphere than Amsterdam. Companions here often cater to business travelers and locals, with rates slightly lower than Amsterdam on average.' },
      { q: 'What areas are best for meeting trans companions in Rotterdam?', a: 'The Centrum (city center), Kop van Zuid, and the Witte de Withstraat area are prime locations. The area around Rotterdam Centraal station also offers excellent accessibility.' },
    ]
  },
  'den-haag': {
    displayName: 'The Hague (Den Haag)',
    country: 'Netherlands',
    continent: 'europe',
    intro: `The Hague (Den Haag) is the political heart of the Netherlands and a sophisticated destination for trans companion encounters. Home to the Dutch government, royal family, and international courts, Den Haag attracts diplomats, professionals, and discerning visitors who appreciate the finer things. The city's elegant architecture, seaside location, and international character create a uniquely refined environment for shemale companions and trans companions.`,
    scene: `The trans companion scene in The Hague is characterized by discretion and sophistication. The city's diplomatic and professional clientele expect the highest standards of service and confidentiality. Den Haag's trans companions are known for their elegance, education, and ability to blend seamlessly into the city's refined social fabric. The scene operates with a level of professionalism that reflects The Hague's status as a city of international justice and diplomacy.`,
    districts: `The Statenkwartier and Archipelbuurt neighborhoods are The Hague's most prestigious areas, with stunning 19th-century mansions providing elegant settings for upscale encounters. The Zeeheldenkwartier offers a more bohemian vibe with excellent dining and nightlife. For seaside romance, the Scheveningen beach district combines luxury hotels with stunning North Sea views. The city center around the Binnenhof and Lange Voorhout provides classic Dutch elegance in the shadow of parliament.`,
    tips: `The Hague trans companion rates typically range from €150-300 per hour, reflecting the city’s upscale clientele. Most companions speak excellent English and many speak French given the international legal community. The city's compact size and excellent tram network make logistics easy. The Kurhaus Hotel in Scheveningen is a legendary venue for high-end encounters. Book discreetly — The Hague values privacy above all.`,
    keywords: ['trans companions The Hague', 'shemale companions Den Haag', 'ladyboy The Hague', 'Den Haag trans companions', 'ts companions Netherlands', 'travestis Den Haag'],
    faq: [
      { q: 'Is companionship work legal in The Hague?', a: 'Yes, sex work is legal and regulated in the Netherlands. The Hague has the same progressive legal framework, with independent companions operating freely.' },
      { q: 'What type of clients do trans companions in The Hague serve?', a: 'Given the city’s international institutions, many clients are diplomats, legal professionals, and business travelers. Companions here are accustomed to discretion and sophisticated clientele.' },
      { q: 'Is Scheveningen a good area for trans companion meetings?', a: 'Absolutely. The Scheveningen beach district offers luxury hotels with sea views, fine dining, and a resort atmosphere just 15 minutes from the city center. It is an ideal setting for memorable encounters.' },
    ]
  },
  paris: {
    displayName: 'Paris',
    country: 'France',
    continent: 'europe',
    intro: `Paris needs no introduction as the world’s city of love, but its trans companion scene is a hidden gem waiting to be discovered. The French capital's legendary elegance, world-class gastronomy, and romantic ambiance create an unparalleled backdrop for encounters with shemale companions and trans companions. From the cobblestone streets of Montmartre to the chic avenues of the Champs-Élysées, Paris elevates every meeting into an affair to remember.`,
    scene: `The trans companion scene in Paris is sophisticated, discreet, and distinctly French in its approach to pleasure. The city's long tradition of courtesans and sophisticated companionship lives on in its modern trans companion community. Parisian trans women are renowned for their style, charm, and the unmistakable French art de vivre. The scene caters to an international clientele including business travelers, tourists seeking authentic Parisian experiences, and local connoisseurs of beauty.`,
    districts: `The Marais district is Paris’s LGBTQ+ heart and a natural hub for trans companion activity, with its historic architecture and vibrant nightlife. The Opéra and Madeleine area offers classic Parisian elegance with grand hotels like the Ritz and Le Meurice. The Champs-Élysées and 8th arrondissement provide the ultimate in luxury, while Saint-Germain-des-Prés combines intellectual cachet with discreet charm. The 16th arrondissement near the Eiffel Tower offers residential privacy in one of Paris's most prestigious quarters.`,
    tips: `Paris trans companion rates typically range from €200-500 per hour, with elite companions commanding significantly more. French is highly appreciated but many companions speak English. The city's luxury hotels — from the Ritz to Le Bristol — are companion-friendly with appropriate discretion. Avoid the tourist-trap areas around Pigalle; the true Parisian companion scene operates with far more sophistication. Book well in advance during Fashion Week (February/March, September/October) when demand soars.`,
    keywords: ['trans companions Paris', 'shemale companions Paris', 'ladyboy Paris', 'Paris trans companions', 'ts companions France', 'travestis Paris'],
    faq: [
      { q: 'Is companionship work legal in Paris?', a: 'Yes, sex work between consenting adults is legal in France, though solicitation in public is restricted. Independent companions operate freely and the industry is well-established.' },
      { q: 'Where in Paris has the best trans companion scene?', a: 'The Marais (4th arrondissement) is the LGBTQ+ hub. The 8th and 16th arrondissements offer luxury and discretion, while Saint-Germain-des-Prés provides sophisticated charm.' },
      { q: 'Do trans companions in Paris speak English?', a: 'Many do, particularly those catering to international clients. However, some French phrases are always appreciated and add to the Parisian experience.' },
    ]
  },
  london: {
    displayName: 'London',
    country: 'United Kingdom',
    continent: 'europe',
    intro: `London is one of the world’s truly global cities and a premier destination for trans companion encounters. The British capital's incredible diversity, unmatched cultural scene, and sophisticated adult services industry create exceptional opportunities for those seeking shemale companions and trans companions. From the historic streets of Westminster to the trendy enclaves of Shoreditch, London offers endless possibilities for memorable meetings.`,
    scene: `London's trans companion scene is among the most diverse and professional globally. The city's status as a financial and cultural capital attracts companions from across the UK, Europe, Asia, and Latin America. London trans companions are known for their professionalism, education, and ability to navigate the city's sophisticated social landscape. The scene ranges from high-end companions serving Mayfair's elite to independent companions operating throughout the city's diverse boroughs.`,
    districts: `Mayfair and Knightsbridge are London’s luxury heartlands, with five-star hotels like Claridge's and The Dorchester setting the stage for premium encounters. Soho has long been London's entertainment district and remains a hub for adult services. The City of London and Canary Wharf cater to financial professionals seeking discretion. Shoreditch and Dalston offer a more alternative, creative scene popular with younger clients and companions. Kensington and Chelsea provide classic London elegance.`,
    tips: `London trans companion rates typically range from £150-400 per hour, with elite companions in central London commanding premium rates. English is universal. London's extensive Tube network makes any area accessible, though booking companions near your location saves significant time given the city's size. The companion scene is most active in Zones 1-2. Book in advance, especially during London Fashion Week and major events at the O2 or Wembley.`,
    keywords: ['trans companions London', 'shemale companions London', 'ladyboy London', 'ts companions London', 'trans companions UK', 'shemale London'],
    faq: [
      { q: 'Is companionship work legal in London?', a: 'Yes, sex work between consenting adults is legal in the UK. Independent companions operate legally, though certain activities like street solicitation and brothel-keeping are restricted.' },
      { q: 'What is the best area in London for trans companions?', a: 'Mayfair and Knightsbridge offer luxury and discretion. Soho is the historic entertainment hub. The City and Canary Wharf are ideal for business travelers.' },
      { q: 'How do I verify a trans companion in London?', a: 'Look for profiles with verified photos, consistent reviews across platforms, and professional communication. ShemaleWiki profiles provide a trusted starting point.' },
    ]
  },
  'rio-de-janeiro': {
    displayName: 'Rio de Janeiro',
    country: 'Brazil',
    continent: 'americas',
    intro: `Rio de Janeiro pulses with sensuality as Brazil's most iconic city and a legendary destination for trans companion encounters. Framed by stunning beaches, dramatic mountains, and the famous Christ the Redeemer statue, Rio's natural beauty is matched only by the beauty of its people. The city’s famous Carioca spirit — warm, welcoming, and uninhibited — creates an electric atmosphere for those seeking shemale companions and trans companions.`,
    scene: `The trans companion scene in Rio de Janeiro is vibrant, diverse, and deeply woven into the city’s famous beach culture. Brazil's celebration of beauty and sensuality reaches its peak in Rio, where trans women are among the city's most sought-after companions. The scene ranges from high-end companions serving Copacabana's luxury hotels to independent companions operating throughout the Zona Sul. Rio's trans companions are famous for their stunning beauty, warm personality, and the passionate Brazilian way of connecting.`,
    districts: `Copacabana and Ipanema are Rio's most famous beach neighborhoods and prime areas for trans companion activity, with iconic hotels like the Copacabana Palace setting the stage for luxury encounters. Leblon offers the city's most exclusive residential setting for discreet, upscale meetings. The Lapa district provides a more bohemian, nightlife-oriented scene. Barra da Tijuca offers a more modern, spacious alternative popular with longer-term visitors. The Santa Teresa neighborhood provides a romantic, artistic atmosphere with stunning bay views.`,
    tips: `Rio trans companion rates typically range from R$300-700 per hour, with premium companions in Zona Sul commanding higher rates. Portuguese is essential — English is less common than in São Paulo. The Zona Sul (South Zone) beaches are the safest and best-serviced area. Rio's notorious traffic means booking companions near your location saves considerable time. During Carnival and Reveillon (New Year's), demand skyrockets and advance booking is absolutely essential. Always prioritize safety and stick to reputable profiles.`,
    keywords: ['trans companions Rio de Janeiro', 'shemale companions Rio', 'travestis Rio de Janeiro', 'ladyboy Rio', 'ts companions Brazil', 'acompanhantes trans Rio'],
    faq: [
      { q: 'Is companionship work legal in Rio de Janeiro?', a: 'Yes, companionship between consenting adults is legal in Brazil. Rio de Janeiro has well-established adult services integrated into its tourism economy.' },
      { q: 'Is Rio safe for meeting trans companions?', a: 'The Zona Sul (Copacabana, Ipanema, Leblon) is generally safe for tourists. Book companions with verified profiles, arrange meetings at reputable hotels, and exercise normal urban precautions.' },
      { q: 'When is the best time to find trans companions in Rio?', a: 'Year-round availability is excellent, but Carnival (February/March) and Reveillon (New Year’s Eve) bring the highest demand. Book weeks in advance during these peak periods.' },
    ]
  },
  brussels: {
    displayName: 'Brussels',
    country: 'Belgium',
    continent: 'europe',
    intro: `Brussels is Europe’s diplomatic capital and an underrated gem for trans companion encounters. The Belgian capital's international character, world-famous cuisine, and surprising nightlife create a unique environment for those seeking shemale companions and trans companions. As the headquarters of the EU and NATO, Brussels attracts a sophisticated, multilingual clientele who appreciate quality, discretion, and the city's uniquely Belgian blend of cultures.`,
    scene: `The trans companion scene in Brussels reflects the city's position at the crossroads of Europe. With a diverse population drawing from Belgium's French and Flemish communities plus a massive international workforce, Brussels offers remarkable variety. Trans companions here tend to be multilingual, well-educated, and accustomed to serving discerning clients from diplomatic and business circles. The scene is more discreet than Amsterdam but equally professional.`,
    districts: `The European Quarter around Schuman and Place du Luxembourg is the heart of Brussels's international community and a prime area for companion activity. The Ixelles and Saint-Gilles neighborhoods offer a trendy, multicultural atmosphere with excellent dining and discreet meeting spots. The historic Grand Place area provides stunning backdrops for luxury encounters at hotels like the Amigo. The Uccle and Woluwe areas offer residential privacy for longer arrangements.`,
    tips: `Brussels trans companion rates typically range from €150-350 per hour. French, Dutch, and English are all widely used — multilingual companions are the norm here. The city's compact center is walkable, with excellent metro links to outer districts. Brussels's famous gastronomy — from Michelin-starred restaurants to the best chocolate in the world — makes it ideal for extended dinner-date arrangements.`,
    keywords: ['trans companions Brussels', 'shemale companions Brussels', 'ladyboy Brussels', 'ts companions Belgium', 'trans companions Belgium', 'travestis Brussels'],
    faq: [
      { q: 'Is companionship work legal in Brussels?', a: 'Yes, companionship between consenting adults is legal in Belgium. Brussels has a well-regulated professional adult services sector.' },
      { q: 'What languages do trans companions in Brussels speak?', a: 'Most companions speak French and many speak Dutch and English. Given the international character of the city, multilingualism is the norm rather than the exception.' },
      { q: 'Where is the best area in Brussels for companion encounters?', a: 'The European Quarter, Ixelles, and the area around the Grand Place are the prime locations, offering a mix of luxury hotels, fine dining, and discreet settings.' },
    ]
  },
  berlin: {
    displayName: 'Berlin',
    country: 'Germany',
    continent: 'europe',
    intro: `Berlin is Europe\\u2019s undisputed capital of cool — a city where alternative culture, world-class nightlife, and progressive attitudes converge to create one of the continent\\u2019s most exciting trans companion destinations. Germany\\u2019s capital is legendary for its sexual openness, thriving LGBTQ+ community, and anything-goes spirit. For those seeking shemale companions and trans companions, Berlin offers an authentic, unpretentious, and remarkably diverse experience.`,
    scene: `The trans companion scene in Berlin is as diverse as the city itself. Berlin\\u2019s long tradition of sexual liberation and its status as a global party destination attract companions from across Europe, Asia, and Latin America. The scene ranges from high-end companions serving business travelers near Potsdamer Platz to edgy, artistic companions operating from the city\\u2019s famous alternative neighborhoods. German professionalism meets Berlin creativity — expect punctuality, clear communication, and a refreshing lack of judgment.`,
    districts: `Schöneberg has been Berlin\\u2019s LGBTQ+ heart for over a century and remains a prime area for trans companion encounters. The trendy Friedrichshain and Kreuzberg neighborhoods offer a more alternative, youthful vibe with countless bars, clubs, and discreet apartments. Charlottenburg provides a more upscale, classic Berlin atmosphere with luxury hotels. Mitte is the central district where many business travelers stay — ideal for high-end outcall arrangements. Prenzlauer Berg offers a more residential, family-friendly atmosphere with excellent dining for extended dinner-date encounters.`,
    tips: `Berlin trans companion rates typically range from €120-300 per hour. Most companions speak excellent English alongside German, with many also speaking Russian, Turkish, or Arabic. Berlin\\u2019s excellent U-Bahn and S-Bahn network makes any neighborhood accessible 24/7. The city\\u2019s party culture means late-night and early-morning bookings are common. Book in advance during major events like Berlin Pride (Christopher Street Day) and the Berlinale film festival.`,
    keywords: ['trans companions Berlin', 'shemale companions Berlin', 'ladyboy Berlin', 'ts companions Germany', 'trans companions Germany', 'travestis Berlin'],
    faq: [
      { q: 'Is companionship work legal in Berlin?', a: 'Yes, companionship is legal and regulated in Germany. Berlin has a long-established legal framework that protects both companions and clients.' },
      { q: 'What is the best area in Berlin for trans companions?', a: 'Schöneberg is the historic LGBTQ+ district and a top area. Friedrichshain, Kreuzberg, and Charlottenburg are also popular for their mix of hotels, nightlife, and discretion.' },
      { q: 'What languages do trans companions in Berlin speak?', a: 'Most companions speak German and English. Many also speak Russian, Turkish, Polish, or Arabic reflecting Berlin\\u2019s international character.' },
    ]
  },
  lisbon: {
    displayName: 'Lisbon',
    country: 'Portugal',
    continent: 'europe',
    intro: `Lisbon is Europe\\u2019s sun-drenched Atlantic capital — a city of seven hills, pastel-colored buildings, and a surprisingly vibrant trans companion scene. Portugal\\u2019s progressive social attitudes, affordable luxury, and booming tourism make Lisbon an increasingly popular destination for those seeking shemale companions and trans companions. From the cobblestone streets of Alfama to the stylish avenues of Chiado, Lisbon offers old-world charm with a modern, open-minded spirit.`,
    scene: `The trans companion scene in Lisbon has grown significantly alongside the city\\u2019s tourism boom. Portugal decriminalized all drugs in 2001 and has consistently ranked among Europe\\u2019s most progressive countries on LGBTQ+ issues. Lisbon\\u2019s trans companions include both Portuguese locals and a growing Brazilian community — Portuguese is the shared language, creating a distinctive Lusophone dynamic. The scene operates with discretion but without stigma, reflecting Portugal\\u2019s laid-back Mediterranean attitudes.`,
    districts: `Príncipe Real is Lisbon\\u2019s LGBTQ+ hub and the natural center for the trans companion scene, filled with stylish bars, boutique hotels, and a vibrant nightlife. The neighboring Bairro Alto district transforms from sleepy daytime streets to one of Europe\\u2019s liveliest nightlife zones after dark. Chiado offers sophisticated dining and luxury shopping — ideal for upscale encounters. The Parque das Nações district provides modern, waterfront settings near the casino and major hotels. Belém offers more residential privacy while remaining connected by Lisbon\\u2019s efficient tram network.`,
    tips: `Lisbon trans companion rates typically range from €100-250 per hour. Portuguese is the primary language; English is common among companions serving tourists but less universal than in Northern Europe. Lisbon\\u2019s hills mean comfortable shoes and taxis/Uber are your friends. Book in advance during summer (June-September) and major events like Lisbon Pride and Web Summit when the city fills with visitors. The city\\u2019s famous pastéis de nata and port wine make for excellent icebreakers during extended encounters.`,
    keywords: ['trans companions Lisbon', 'shemale companions Lisbon', 'ladyboy Lisbon', 'ts companions Portugal', 'trans companions Portugal', 'travestis Lisboa'],
    faq: [
      { q: 'Is companionship work legal in Lisbon?', a: 'Yes, companionship between consenting adults is legal in Portugal. Lisbon has a tolerant and professional environment.' },
      { q: 'What is the best area in Lisbon for trans companions?', a: 'Príncipe Real is the LGBTQ+ heart of Lisbon and the top area. Bairro Alto, Chiado, and Parque das Nações are also popular for their hotels, dining, and nightlife.' },
      { q: 'What languages do trans companions in Lisbon speak?', a: 'Portuguese is the primary language. English is common, and many companions from Brazil add a distinctive Lusophone flavor to the scene.' },
    ]
  },
  eindhoven: {
      displayName: 'Eindhoven',
      country: 'Netherlands',
      continent: 'europe',
      intro: `Eindhoven, the design and technology capital of the Netherlands, offers a surprisingly vibrant scene for trans companion encounters. This dynamic city in the province of North Brabant combines cutting-edge innovation with southern Dutch warmth. Known for its Design Academy and the annual Dutch Design Week, Eindhoven attracts a creative, open-minded crowd that values authentic connections with beautiful trans women and shemale companions.`,
      scene: `The trans companion scene in Eindhoven is intimate but well-connected. While smaller than Amsterdam, the city's international character — driven by the High Tech Campus and TU/e university — creates a cosmopolitan environment where companions serve a diverse, multilingual clientele. The scene is centered around the city center and Stratumseind, one of the Netherlands' longest entertainment streets. Eindhoven companions are known for their professionalism and discretion.`,
      districts: `The city center around the Markt square and the lively Stratumseind entertainment strip are natural starting points for meetings. The upscale Strijp-S district, with its converted Philips factories turned into trendy lofts and creative spaces, offers stylish venues for high-end encounters. The green residential area of Tongelre provides privacy while remaining well-connected. For those near the technology campus, the Meerhoven area offers convenience.`,
      tips: `Eindhoven rates typically range from €120-200 per hour. Advance booking is recommended, especially during major events like Dutch Design Week (October) and GLOW light festival (November). The compact city center is walkable, and the excellent bus network reaches all districts. Eindhoven Airport connects to 80+ European destinations, making it convenient for international visitors.`,
      keywords: ['trans companions Eindhoven', 'shemale companions Eindhoven', 'Eindhoven trans companions', 'ts companions Netherlands', 'ladyboy Eindhoven'],
      faq: [
      { q: 'Is companionship work legal in Eindhoven?', a: 'Yes, companionship between consenting adults is legal in the Netherlands. Eindhoven operates under the same legal framework as Amsterdam and other Dutch cities.' },
      { q: 'What is the best area for trans companion encounters in Eindhoven?', a: 'The city center around the Markt and Stratumseind, and the creative Strijp-S district, are the most popular areas for meetings.' },
      { q: 'How does Eindhoven compare to Amsterdam for trans companions?', a: 'Eindhoven offers a more intimate, laid-back scene compared to Amsterdam. It is ideal for those who prefer discretion and a less tourist-heavy environment.' },
      ]
      },
      arnhem: {
      displayName: 'Arnhem',
      country: 'Netherlands',
      continent: 'europe',
      intro: `Arnhem, the capital of Gelderland province, combines green hills, post-war modernism, and a thriving arts scene to create a unique backdrop for trans companion encounters. Unlike the flat canal cities of western Netherlands, Arnhem's elevated landscape and proximity to the Veluwe national park give it a distinctive character. The city is known for its fashion district, the Modekwartier, and its welcoming, artistic community.`,
      scene: `The trans companion scene in Arnhem is discreet and quality-focused. The city's position as a regional hub for eastern Netherlands means companions serve clients from across Gelderland and nearby German border towns. Arnhem's companions are known for their warm, personal approach that reflects the city's approachable character. The scene benefits from Arnhem's excellent rail connections to Utrecht (35 min) and Amsterdam (1 hour).`,
      districts: `The city center around the Korenmarkt and the Modekwartier (Fashion Quarter) in the Klarendal neighborhood offer charming settings for meetings. The Rijnkade along the Rhine River provides scenic spots. The modern Rijnboog development near the central station offers contemporary hotel options. The leafy northern districts of Sonsbeek and Velperweg provide privacy and tranquility.`,
      tips: `Arnhem rates typically range from €100-180 per hour. The city is easily reached by train from Amsterdam (1h), Utrecht (35min), and German cities like Düsseldorf (1.5h). The best times to visit are spring and summer when the surrounding nature is at its finest. Book in advance during the Airborne commemorations in September and the Fashion + Design Festival in June.`,
      keywords: ['trans companions Arnhem', 'shemale Arnhem', 'trans escorts Arnhem', 'ts companions Gelderland', 'ladyboy Arnhem'],
      faq: [
      { q: 'Is companionship work legal in Arnhem?', a: 'Yes, companionship between consenting adults is legal in the Netherlands. Arnhem has a professional and discreet scene.' },
      { q: 'What areas of Arnhem are best for trans companion meetings?', a: 'The Korenmarkt area, Modekwartier, and the Rijnkade riverside are popular. Hotels near the central station also offer excellent meeting venues.' },
      { q: 'Is Arnhem easy to reach for international visitors?', a: 'Yes. Arnhem Centraal station has direct ICE trains from Germany (Düsseldorf, Frankfurt) and frequent connections to Amsterdam and Utrecht.' },
      ]
      },
      antwerpen: {
      displayName: 'Antwerp',
      country: 'Belgium',
      continent: 'europe',
      intro: `Antwerp is Belgium's diamond capital, a city of refined taste, avant-garde fashion, and a surprisingly dynamic trans companion scene. This Flemish metropolis on the Scheldt River combines old-world charm with cutting-edge creativity. Antwerp's sophistication extends to its adult companionship sector, where trans companions offer premium experiences to a discerning international clientele.`,
      scene: `The trans companion community in Antwerp is professional, diverse, and well-established. The city's status as a global fashion and diamond hub attracts visitors from around the world, creating demand for multilingual companions who can cater to international tastes. Antwerp companions are known for their elegance and sophistication — reflecting the city's fashion-forward identity. The scene is centered around the historic city center and the trendy Eilandje harbor district.`,
      districts: `The historic center near the Grote Markt and the fashion district around Nationalestraat offer prime locations for upscale encounters. The Eilandje (Little Island) neighborhood, centered around the MAS museum, provides modern waterfront settings. The Zuid district is Antwerp's artistic quarter with excellent restaurants and boutique hotels. The residential areas of Berchem offer privacy with easy tram access.`,
      tips: `Antwerp rates typically range from €120-250 per hour. The city is easily reached by Thalys high-speed train from Paris (2h), Amsterdam (1.5h), and London (3h via Brussels). The best times to visit are during the Antwerp Fashion Festival (September) and Christmas market season. Most companions speak Dutch, English, and French.`,
      keywords: ['trans companions Antwerp', 'shemale Antwerp', 'trans escorts Belgium', 'ts companions Belgium', 'ladyboy Antwerp'],
      faq: [
      { q: 'Is companionship work legal in Antwerp?', a: 'Yes, companionship between consenting adults is legal in Belgium. Antwerp has a professional and well-regulated scene.' },
      { q: 'What is the best area in Antwerp for trans companion encounters?', a: 'The historic center, the Eilandje waterfront district, and the fashion quarter around Nationalestraat are the preferred areas for high-end meetings.' },
      { q: 'What languages do trans companions in Antwerp speak?', a: 'Most companions speak Dutch, English, and French. Many also speak German or Spanish, reflecting Antwerp\'s international character.' },
      ]
      },
      utrecht: {
      displayName: 'Utrecht',
      country: 'Netherlands',
      continent: 'europe',
      intro: `Utrecht, the beating heart of the Netherlands — literally at the country's geographic center — offers a charming and historic setting for trans companion encounters. This university city is known for its iconic Dom Tower, unique wharf cellars along the Oudegracht canal, and a young, vibrant population. Utrecht's medieval beauty combined with its modern, progressive attitude makes it an appealing alternative to the larger Amsterdam scene.`,
      scene: `The trans companion scene in Utrecht is youthful, educated, and refreshingly authentic. With one of Europe's largest universities, the city has an intelligent and open-minded population that values genuine connections. Utrecht's companions cater to a mix of local professionals, visiting academics, and tourists drawn to the city's rich history. The scene is concentrated around the Binnenstad and benefits from Utrecht's position as the national railway hub.`,
      districts: `The Oudegracht canal area, with its distinctive two-level wharves now converted into restaurants and boutiques, offers a romantic backdrop for encounters. The Museumkwartier provides cultural sophistication, while the quiet residential areas of Oost and Wittevrouwen offer privacy. The newly developed Leidsche Rijn area offers modern accommodation options. Hoog Catharijne near Central Station provides maximum convenience for travelers.`,
      tips: `Utrecht rates typically range from €120-200 per hour. As the Netherlands' main railway junction, Utrecht is accessible from virtually anywhere in the country in under an hour. The compact city center is entirely walkable. Best times to visit are spring and summer when the canal-side terraces come alive. During the Nederlands Film Festival (September), the city buzzes with cultural energy.`,
      keywords: ['trans companions Utrecht', 'shemale Utrecht', 'ts companions Utrecht', 'ladyboy Utrecht', 'trans escorts Netherlands'],
      faq: [
      { q: 'Is companionship work legal in Utrecht?', a: 'Yes, companionship between consenting adults is legal throughout the Netherlands, including Utrecht.' },
      { q: 'What makes Utrecht different from Amsterdam?', a: 'Utrecht offers a more relaxed, authentic experience with fewer tourists. The scene is centered around the beautiful canal district and has a youthful, intellectual character.' },
      { q: 'How do I reach Utrecht from Amsterdam?', a: 'Utrecht Centraal is just 26 minutes from Amsterdam Centraal by train, with services running every 10-15 minutes.' },
      ]
      },
      nijmegen: {
      displayName: 'Nijmegen',
      country: 'Netherlands',
      continent: 'europe',
      intro: `Nijmegen, the oldest city in the Netherlands, sits gracefully on the banks of the Waal River near the German border. This historic city — once a Roman settlement — combines ancient heritage with a youthful, rebellious spirit driven by its renowned Radboud University. Nijmegen's unique blend of history, nature, and progressive politics makes it a charming destination for trans companion encounters in eastern Netherlands.`,
      scene: `Nijmegen's trans companion scene is small, selective, and community-oriented. The city's strong left-wing political tradition and active LGBTQ+ community create a naturally welcoming environment. Companions in Nijmegen serve a mixed clientele of local residents, university affiliates, and visitors from nearby German cities like Kleve and Duisburg. The scene reflects Nijmegen's character: intellectual, unpretentious, and warm.`,
      districts: `The Benedenstad (Lower Town) along the Waalkade offers lively riverside settings. The city center around the Grote Markt provides convenient meeting spots. The Hunnerberg neighborhood near the university campus caters to the academic crowd. The Ooijpolder offers scenic countryside escapes just minutes from the city. The recently redeveloped Waalfront combines modern architecture with river views.`,
      tips: `Nijmegen's rates are typically €100-180 per hour. The city is reached by train from Amsterdam (1.5h), Utrecht (1h), and German cities like Düsseldorf (1.5h). The highlight is the Vierdaagsefeesten (Four Days Marches festival) in July — the Netherlands' biggest party. Book well in advance during this period.`,
      keywords: ['trans companions Nijmegen', 'shemale Nijmegen', 'ts companions Nijmegen', 'ladyboy Nijmegen', 'trans escorts Gelderland'],
      faq: [
      { q: 'Is companionship work legal in Nijmegen?', a: 'Yes, companionship between consenting adults is legal in the Netherlands throughout all cities.' },
      { q: 'Is Nijmegen worth visiting for trans companion encounters?', a: 'Absolutely. Nijmegen offers 2,000 years of history, vibrant university energy, and beautiful natural surroundings with a welcoming, progressive atmosphere.' },
      { q: 'How close is Nijmegen to Germany?', a: 'The German border is just 5 km away. Cities like Kleve and Duisburg are a short drive, and many German visitors enjoy Nijmegen\'s relaxed ambiance.' },
    ]
  }
};


// ── Spanish content (es) ──
const cityContentEs = {
  amsterdam: {
    displayName: 'Ámsterdam',
    country: 'Países Bajos',
    continent: 'europe',
    intro: `Ámsterdam es uno de los destinos más vibrantes e inclusivos de Europa para compañía trans premium. Conocida mundialmente por sus actitudes progresistas, su cultura liberal y su legendario Barrio Rojo, Ámsterdam ofrece un entorno excepcionalmente acogedor para la comunidad trans. La famosa tolerancia y mentalidad abierta de la ciudad la convierten en un destino de primer nivel para quienes buscan conexiones auténticas con hermosas mujeres trans.`,
    scene: `La comunidad trans en Ámsterdam es notablemente diversa y profesional. Desde las históricas calles de los canales de De Wallen hasta los modernos barrios de De Pijp y Jordaan, las profesionales independientes operan en toda la ciudad. El marco legal holandés proporciona mayor seguridad y profesionalismo que la mayoría de las ciudades del mundo. Muchas ofrecen servicios en apartamentos privados bien equipados cerca del centro, mientras que otras brindan servicios a hoteles y residencias de lujo.`,
    districts: `Los barrios populares incluyen la zona Centrum cerca de Dam Square, el elegante distrito de Oud-Zuid y el área de Noord en desarrollo al otro lado del río IJ. Las zonas de ocio de Leidseplein y Rembrandtplein también son puntos de encuentro frecuentes. Para quienes prefieren discreción, los tranquilos barrios residenciales de Oud-Zuid y Amstelveen ofrecen privacidad con excelentes conexiones de tranvía.`,
    tips: `Al reservar en Ámsterdam, la comunicación es clave. La mayoría habla excelente inglés además de holandés. Se recomienda reservar con anticipación, especialmente durante eventos como el Orgullo de Ámsterdam y el Día del Rey. Las tarifas suelen oscilar entre €150-300 por hora para profesionales independientes. Siempre verifica perfiles y lee reseñas antes de reservar. El excelente transporte público y la abundancia de hoteles boutique facilitan la logística.`,
    keywords: ['trans Ámsterdam', 'shemale Ámsterdam', 'travestis Ámsterdam', 'acompañantes trans Ámsterdam', 'ts Países Bajos'],
    faq: [
      { q: '¿Es legal el acompañamiento en Ámsterdam?', a: 'Sí, los servicios de compañía entre adultos que consienten son legales en los Países Bajos. Las trabajadoras independientes operan legalmente en toda la ciudad.' },
      { q: '¿Qué zonas de Ámsterdam tienen más acompañantes trans?', a: 'El Centrum (centro), De Pijp, Oud-Zuid y las áreas cercanas al Barrio Rojo tienen la mayor concentración, aunque muchas operan en todo el Gran Ámsterdam.' },
      { q: '¿Cómo verifico un perfil en Ámsterdam?', a: 'Busca perfiles con múltiples fotos verificadas, descripciones detalladas de servicios y reseñas positivas. Los perfiles de ShemaleWiki incluyen indicadores de verificación y fotos reales.' },
    ]
  },
  barcelona: {
    displayName: 'Barcelona',
    country: 'España',
    continent: 'europe',
    intro: `Barcelona se destaca como una de las ciudades más emocionantes del Mediterráneo para encuentros con acompañantes trans. Esta soleada capital catalana combina sofisticación cosmopolita con una cultura famosamente abierta, convirtiéndola en un destino ideal para quienes buscan compañía trans premium. Desde el encanto medieval del Barrio Gótico hasta las maravillas modernistas del Eixample, Barcelona ofrece un impresionante telón de fondo para experiencias inolvidables.`,
    scene: `La escena trans en Barcelona es dinámica, diversa y cada vez más visible. La gran comunidad internacional de la ciudad significa que encontrarás acompañantes de toda Europa, Latinoamérica y Asia. Las actitudes sociales liberales y la fuerte comunidad LGBTQ+ en el distrito del Eixample (conocido como "Gaixample") crean un ambiente naturalmente acogedor. Muchas ofrecen servicios multilingües en español, inglés y catalán.`,
    districts: `El Eixample es el corazón de la escena LGBTQ+ de Barcelona y un centro para acompañantes trans. El barrio costero de la Barceloneta ofrece lugares escénicos, mientras que la exclusiva zona de Sarrià-Sant Gervasi brinda espacios discretos para encuentros de alto nivel. El Barrio Gótico y El Born ofrecen encantadores hoteles boutique perfectos para encuentros íntimos. Para quienes buscan vida nocturna, Port Olímpic y Vila Olímpica combinan ambiente playero con excelentes opciones gastronómicas.`,
    tips: `Las tarifas en Barcelona suelen oscilar entre €120-250 por hora. Los meses de verano (junio-septiembre) registran mayor demanda debido al turismo, por lo que se recomienda reservar con anticipación. El excelente sistema de metro hace que cualquier barrio sea accesible. Muchas ofrecen servicios a domicilio, con puntos de encuentro populares cerca de Plaça Catalunya, Passeig de Gràcia y las zonas de playa.`,
    keywords: ['trans Barcelona', 'shemale Barcelona', 'travestis Barcelona', 'acompañantes trans Barcelona', 'ts España'],
    faq: [
      { q: '¿Es legal el acompañamiento en Barcelona?', a: 'Sí, la actividad profesional independiente entre adultos es legal en España. Barcelona tiene un sector de servicios para adultos bien establecido.' },
      { q: '¿Cuál es la mejor zona para acompañantes trans en Barcelona?', a: 'El Eixample (Gaixample) es el centro LGBTQ+ y una zona privilegiada. Otras zonas populares incluyen el Barrio Gótico, la Barceloneta y las áreas alrededor de Plaça Catalunya.' },
      { q: '¿Qué idiomas hablan las acompañantes trans en Barcelona?', a: 'La mayoría habla español y muchas hablan inglés. Catalán, portugués, italiano y francés también son comunes dado el carácter internacional de la ciudad.' },
    ]
  },
  madrid: {
    displayName: 'Madrid',
    country: 'España',
    continent: 'europe',
    intro: `Madrid palpita con energía como capital de España y uno de los destinos más destacados de Europa para compañía trans premium. La ciudad que nunca duerme ofrece una mezcla electrizante de cultura, vida nocturna y una próspera escena LGBTQ+ centrada alrededor del famoso barrio de Chueca. Para quienes buscan acompañantes trans en Madrid, la ciudad ofrece una combinación inigualable de discreción, diversidad y pasión.`,
    scene: `La escena trans en Madrid es sofisticada y bien establecida. El estatus de la ciudad como centro de negocios global significa que las acompañantes atienden a una clientela internacional con altas expectativas. Encontrarás una notable diversidad de mujeres trans de toda España, Latinoamérica y más allá. Las acompañantes de Madrid son conocidas por su profesionalismo, estilo y la calidez característica de la cultura española.`,
    districts: `Chueca es el icónico barrio LGBTQ+ de Madrid y un punto de partida natural para la escena trans. El exclusivo distrito de Salamanca ofrece entornos de lujo para encuentros de alto nivel, mientras que Malasaña brinda un ambiente más bohemio y artístico. Las zonas comerciales de AZCA y Cuatro Torres cerca del Paseo de la Castellana son populares para encuentros discretos con profesionales. Para quienes se alojan cerca de atracciones turísticas, el área alrededor de Gran Vía y Puerta del Sol ofrece acceso conveniente.`,
    tips: `Las tarifas en Madrid suelen oscilar entre €120-250 por hora, con acompañantes premium que cobran tarifas más altas. La infraestructura hotelera de clase mundial de la ciudad significa excelentes opciones. El metro de Madrid es uno de los mejores de Europa. Las mejores épocas para visitar son primavera (marzo-mayo) y otoño (septiembre-noviembre) cuando el clima es perfecto y el calendario cultural está en su apogeo.`,
    keywords: ['trans Madrid', 'shemale Madrid', 'travestis Madrid', 'acompañantes trans Madrid', 'ts España'],
    faq: [
      { q: '¿Es legal el acompañamiento en Madrid?', a: 'Sí, la compañía entre adultos que consienten es legal en España. Madrid tiene una sofisticada escena de servicios para adultos que opera libremente en toda la ciudad.' },
      { q: '¿Qué barrios son mejores para acompañantes trans en Madrid?', a: 'Chueca es el corazón LGBTQ+ de Madrid. Salamanca ofrece discreción de lujo, y la zona de Gran Vía/Puerta del Sol brinda comodidad central para turistas.' },
      { q: '¿Cómo se compara Madrid con Barcelona para acompañantes trans?', a: 'Ambas ciudades tienen excelentes escenas. Madrid ofrece más un ambiente orientado a negocios con una escena local más grande, mientras que Barcelona tiene más atmósfera de playa con mayor proporción de acompañantes orientadas al turismo.' },
    ]
  },
  'buenos-aires': {
    displayName: 'Buenos Aires',
    country: 'Argentina',
    continent: 'americas',
    intro: `Buenos Aires cautiva con su elegancia europea, su cultura apasionada y su próspera escena trans. La cosmopolita capital argentina combina bulevares de estilo parisino con la sensualidad latinoamericana, creando un ambiente singularmente seductor para quienes buscan compañía trans premium. Desde las coloridas calles de La Boca hasta el sofisticado barrio de Recoleta, Buenos Aires ofrece una experiencia inolvidable.`,
    scene: `La escena trans en Buenos Aires es una de las más desarrolladas y profesionales de Sudamérica. Las leyes progresistas de identidad de género y el sólido marco de derechos LGBTQ+ de Argentina proporcionan un entorno de apoyo. Las acompañantes de Buenos Aires son conocidas por su impresionante belleza, sofisticación y el distintivo encanto argentino. La escena incluye desde acompañantes de élite en Puerto Madero hasta profesionales independientes en los diversos barrios de la ciudad.`,
    districts: `Palermo es el barrio más moderno de Buenos Aires y un centro de actividad trans, subdividido en Palermo Soho, Palermo Hollywood y Palermo Chico. Recoleta ofrece elegancia clásica europea con hoteles de lujo ideales para encuentros de alto nivel. El moderno barrio de Puerto Madero es la zona más exclusiva, con hoteles cinco estrellas populares para encuentros. Belgrano y Las Cañitas brindan un ambiente más residencial y discreto.`,
    tips: `Las tarifas en Buenos Aires suelen oscilar entre ARS $40.000-100.000 por hora. Muchas prefieren dólares o euros debido a las fluctuaciones. El español es esencial; el inglés es menos común que en ciudades europeas. Palermo y Recoleta ofrecen la mejor combinación de acompañantes de calidad, excelentes hoteles y vibrante gastronomía. La cultura nocturna de la ciudad — cena a las 22:00, boliches a las 2:00 — significa que los encuentros a menudo se extienden hasta altas horas.`,
    keywords: ['trans Buenos Aires', 'shemale Buenos Aires', 'travestis Buenos Aires', 'acompañantes trans Buenos Aires', 'ts Argentina'],
    faq: [
      { q: '¿Es legal el acompañamiento en Buenos Aires?', a: 'Sí, el acompañamiento entre adultos que consienten es legal en Argentina. Buenos Aires tiene una industria de servicios para adultos bien establecida y profesional.' },
      { q: '¿Cuáles son los mejores barrios para acompañantes trans en Buenos Aires?', a: 'Palermo (Soho, Hollywood y Chico) es el distrito principal. Recoleta ofrece elegancia y discreción, mientras que Puerto Madero brinda los entornos más lujosos.' },
      { q: '¿Se paga en pesos o dólares en Buenos Aires?', a: 'Muchas prefieren el pago en dólares estadounidenses o euros debido a la estabilidad monetaria. Discute la moneda de pago al reservar para evitar malentendidos.' },
    ]
  },
  rotterdam: {
    displayName: 'Róterdam',
    country: 'Países Bajos',
    continent: 'europe',
    intro: `Róterdam es la segunda ciudad más grande de los Países Bajos y una estrella en ascenso en la escena trans. Conocida por su arquitectura moderna de vanguardia, su enorme puerto y su energía multicultural, Róterdam ofrece una experiencia notablemente diferente a Ámsterdam: más audaz, más diversa y llena de sorpresas. La gran comunidad internacional de la ciudad y las actitudes progresistas holandesas la convierten en un destino excelente.`,
    scene: `La escena trans en Róterdam refleja el carácter de la ciudad: moderna, diversa y refrescantemente directa. El estatus de la ciudad como el puerto más grande de Europa atrae un flujo constante de visitantes internacionales, creando una demanda estable de acompañantes trans profesionales. Las mujeres trans de Róterdam son conocidas por su independencia y profesionalismo.`,
    districts: `El centro de la ciudad alrededor del Markthal y las Casas Cubo es una ubicación privilegiada, con excelentes conexiones de transporte y muchos puntos de encuentro discretos. La moderna zona de Witte de Withstraat ofrece una vibrante escena cultural. El distrito de Kop van Zuid, con sus impresionantes vistas al horizonte y hoteles de lujo como Hotel New York, brinda entornos de alto nivel. Los barrios de Kralingen y Hillegersberg ofrecen más discreción residencial.`,
    tips: `Las tarifas en Róterdam suelen oscilar entre €130-280 por hora. La mayoría habla excelente inglés además de holandés. La excelente red de metro y tranvía hace que cualquier barrio sea accesible. Reserva con anticipación durante eventos importantes como el Festival Internacional de Cine de Róterdam y el North Sea Jazz Festival cuando la demanda alcanza su punto máximo.`,
    keywords: ['trans Róterdam', 'shemale Róterdam', 'travestis Róterdam', 'acompañantes trans Róterdam', 'ts Países Bajos'],
    faq: [
      { q: '¿Es legal el acompañamiento en Róterdam?', a: 'Sí, la actividad profesional independiente es legal y está regulada en los Países Bajos. Róterdam tiene el mismo marco legal que Ámsterdam.' },
      { q: '¿Cómo se compara Róterdam con Ámsterdam?', a: 'Róterdam ofrece un ambiente más moderno y menos turístico que Ámsterdam. Las acompañantes aquí suelen atender a viajeros de negocios y locales, con tarifas ligeramente más bajas en promedio.' },
      { q: '¿Qué zonas son mejores en Róterdam?', a: 'El Centrum, Kop van Zuid y la zona de Witte de Withstraat son ubicaciones principales. El área alrededor de la estación Rotterdam Centraal también ofrece excelente accesibilidad.' },
    ]
  },
  'den-haag': {
    displayName: 'La Haya',
    country: 'Países Bajos',
    continent: 'europe',
    intro: `La Haya (Den Haag) es el corazón político de los Países Bajos y un destino sofisticado para encuentros con acompañantes trans. Sede del gobierno holandés, la familia real y los tribunales internacionales, La Haya atrae a diplomáticos, profesionales y visitantes exigentes que aprecian las cosas buenas. La arquitectura elegante, la ubicación costera y el carácter internacional de la ciudad crean un ambiente singularmente refinado.`,
    scene: `La escena trans en La Haya se caracteriza por la discreción y la sofisticación. La clientela diplomática y profesional espera los más altos estándares de servicio y confidencialidad. Las acompañantes trans de La Haya son conocidas por su elegancia, educación y capacidad para integrarse perfectamente en el refinado tejido social de la ciudad.`,
    districts: `Los barrios de Statenkwartier y Archipelbuurt son las zonas más prestigiosas de La Haya, con impresionantes mansiones del siglo XIX que brindan entornos elegantes para encuentros de alto nivel. El Zeeheldenkwartier ofrece un ambiente más bohemio. Para romance costero, el distrito de playa de Scheveningen combina hoteles de lujo con impresionantes vistas al Mar del Norte. El centro alrededor del Binnenhof y Lange Voorhout ofrece elegancia clásica holandesa.`,
    tips: `Las tarifas en La Haya suelen oscilar entre €150-300 por hora, reflejando la clientela de alto nivel. La mayoría habla excelente inglés y muchas hablan francés. El Hotel Kurhaus en Scheveningen es un lugar legendario para encuentros de alto nivel. Reserva con discreción: La Haya valora la privacidad por encima de todo.`,
    keywords: ['trans La Haya', 'shemale Den Haag', 'travestis La Haya', 'acompañantes trans La Haya', 'ts Países Bajos'],
    faq: [
      { q: '¿Es legal el acompañamiento en La Haya?', a: 'Sí, la actividad profesional independiente es legal y está regulada en los Países Bajos. La Haya tiene el mismo marco legal progresista.' },
      { q: '¿Qué tipo de clientes atienden las acompañantes trans en La Haya?', a: 'Dadas las instituciones internacionales de la ciudad, muchos clientes son diplomáticos, profesionales legales y viajeros de negocios. Las acompañantes están acostumbradas a la discreción y la clientela sofisticada.' },
      { q: '¿Es Scheveningen una buena zona para encuentros?', a: 'Absolutamente. El distrito de playa de Scheveningen ofrece hoteles de lujo con vistas al mar, excelente gastronomía y un ambiente de resort a solo 15 minutos del centro.' },
    ]
  },
  paris: {
    displayName: 'París',
    country: 'Francia',
    continent: 'europe',
    intro: `París no necesita presentación como la ciudad del amor mundial, pero su escena trans es una joya oculta esperando ser descubierta. La legendaria elegancia de la capital francesa, su gastronomía de clase mundial y su ambiente romántico crean un telón de fondo incomparable para encuentros con acompañantes trans. Desde las calles empedradas de Montmartre hasta las elegantes avenidas de los Campos Elíseos, París eleva cada encuentro a una aventura memorable.`,
    scene: `La escena trans en París es sofisticada, discreta y distintivamente francesa en su enfoque del placer. La larga tradición de cortesanas y acompañamiento sofisticado de la ciudad vive en su comunidad trans moderna. Las mujeres trans parisinas son reconocidas por su estilo, encanto y el inconfundible arte de vivir francés.`,
    districts: `El Marais es el corazón LGBTQ+ de París y un centro natural para la actividad trans, con su arquitectura histórica y vibrante vida nocturna. La zona de Ópera y Madeleine ofrece elegancia parisina clásica con grandes hoteles como el Ritz y Le Meurice. Los Campos Elíseos y el distrito 8 brindan el máximo lujo, mientras que Saint-Germain-des-Prés combina prestigio intelectual con encanto discreto.`,
    tips: `Las tarifas en París suelen oscilar entre €200-500 por hora. El francés es muy apreciado pero muchas hablan inglés. Los hoteles de lujo — desde el Ritz hasta Le Bristol — reciben acompañantes con discreción apropiada. Evita las trampas para turistas alrededor de Pigalle; la verdadera escena parisina opera con mucha más sofisticación. Reserva con anticipación durante la Semana de la Moda cuando la demanda se dispara.`,
    keywords: ['trans París', 'shemale París', 'travestis París', 'acompañantes trans París', 'ts Francia'],
    faq: [
      { q: '¿Es legal el acompañamiento en París?', a: 'Sí, la actividad profesional entre adultos que consienten es legal en Francia. Las acompañantes independientes operan libremente.' },
      { q: '¿Dónde está la mejor escena trans en París?', a: 'El Marais (distrito 4) es el centro LGBTQ+. Los distritos 8 y 16 ofrecen lujo y discreción, mientras que Saint-Germain-des-Prés brinda encanto sofisticado.' },
      { q: '¿Hablan inglés las acompañantes trans en París?', a: 'Muchas sí, particularmente aquellas que atienden a clientes internacionales. Sin embargo, algunas frases en francés siempre son apreciadas.' },
    ]
  },
  london: {
    displayName: 'Londres',
    country: 'Reino Unido',
    continent: 'europe',
    intro: `Londres es una de las ciudades verdaderamente globales del mundo y un destino de primer nivel para encuentros con acompañantes trans. La increíble diversidad de la capital británica, su inigualable escena cultural y su sofisticada industria de servicios para adultos crean oportunidades excepcionales para quienes buscan compañía trans premium.`,
    scene: `La escena trans en Londres está entre las más diversas y profesionales del mundo. El estatus de la ciudad como capital financiera y cultural atrae a acompañantes de todo el Reino Unido, Europa, Asia y Latinoamérica. Las acompañantes trans de Londres son conocidas por su profesionalismo y educación.`,
    districts: `Mayfair y Knightsbridge son los corazones de lujo de Londres, con hoteles cinco estrellas como Claridge's y The Dorchester. Soho ha sido durante mucho tiempo el distrito de entretenimiento de Londres. La City de Londres y Canary Wharf atienden a profesionales financieros que buscan discreción. Shoreditch y Dalston ofrecen una escena más alternativa y creativa.`,
    tips: `Las tarifas en Londres suelen oscilar entre £150-400 por hora. El inglés es universal. La extensa red de metro hace que cualquier zona sea accesible, aunque reservar cerca de tu ubicación ahorra tiempo significativo. La escena es más activa en las Zonas 1-2. Reserva con anticipación durante la Semana de la Moda de Londres y eventos importantes.`,
    keywords: ['trans Londres', 'shemale Londres', 'travestis Londres', 'acompañantes trans Londres', 'ts Reino Unido'],
    faq: [
      { q: '¿Es legal el acompañamiento en Londres?', a: 'Sí, la actividad profesional entre adultos que consienten es legal en el Reino Unido. Las acompañantes independientes operan legalmente.' },
      { q: '¿Cuál es la mejor zona para acompañantes trans en Londres?', a: 'Mayfair y Knightsbridge ofrecen lujo y discreción. Soho es el centro histórico de entretenimiento. La City y Canary Wharf son ideales para viajeros de negocios.' },
      { q: '¿Cómo verifico un perfil en Londres?', a: 'Busca perfiles con fotos verificadas, reseñas consistentes en plataformas y comunicación profesional. Los perfiles de ShemaleWiki proporcionan un punto de partida confiable.' },
    ]
  },
  berlin: {
    displayName: 'Berlín',
    country: 'Alemania',
    continent: 'europe',
    intro: `Berlín es la capital indiscutible del estilo alternativo en Europa: una ciudad donde la cultura alternativa, la vida nocturna de clase mundial y las actitudes progresistas convergen para crear uno de los destinos trans más emocionantes del continente. La capital alemana es legendaria por su apertura sexual, su próspera comunidad LGBTQ+ y su espíritu libre.`,
    scene: `La escena trans en Berlín es tan diversa como la ciudad misma. La larga tradición de liberación sexual de Berlín y su estatus como destino global de fiesta atraen a acompañantes de toda Europa, Asia y Latinoamérica. El profesionalismo alemán se encuentra con la creatividad berlinesa: puntualidad, comunicación clara y una refrescante falta de prejuicios.`,
    districts: `Schöneberg ha sido el corazón LGBTQ+ de Berlín durante más de un siglo. Los modernos barrios de Friedrichshain y Kreuzberg ofrecen un ambiente más alternativo y juvenil. Charlottenburg brinda un ambiente más clásico y de lujo. Mitte es el distrito central ideal para arreglos de alto nivel. Prenzlauer Berg ofrece un ambiente más residencial.`,
    tips: `Las tarifas en Berlín suelen oscilar entre €120-300 por hora. La mayoría habla excelente inglés además de alemán. La excelente red de U-Bahn y S-Bahn hace que cualquier barrio sea accesible las 24 horas. La cultura de fiesta significa que los encuentros nocturnos y de madrugada son comunes. Reserva con anticipación durante el Orgullo de Berlín y el festival de cine Berlinale.`,
    keywords: ['trans Berlín', 'shemale Berlín', 'travestis Berlín', 'acompañantes trans Berlín', 'ts Alemania'],
    faq: [
      { q: '¿Es legal el acompañamiento en Berlín?', a: 'Sí, la actividad profesional independiente es legal y está regulada en Alemania. Berlín tiene un marco legal establecido desde hace mucho tiempo.' },
      { q: '¿Cuál es la mejor zona en Berlín?', a: 'Schöneberg es el distrito LGBTQ+ histórico. Friedrichshain, Kreuzberg y Charlottenburg también son populares por su mezcla de hoteles, vida nocturna y discreción.' },
      { q: '¿Qué idiomas hablan las acompañantes en Berlín?', a: 'La mayoría habla alemán e inglés. Muchas también hablan ruso, turco, polaco o árabe reflejando el carácter internacional de Berlín.' },
    ]
  },
  brussels: {
    displayName: 'Bruselas',
    country: 'Bélgica',
    continent: 'europe',
    intro: `Bruselas es la capital diplomática de Europa y una joya subestimada para encuentros con acompañantes trans. El carácter internacional de la capital belga, su cocina de fama mundial y su sorprendente vida nocturna crean un ambiente único. Como sede de la UE y la OTAN, Bruselas atrae a una clientela sofisticada y multilingüe que aprecia la calidad y la discreción.`,
    scene: `La escena trans en Bruselas refleja la posición de la ciudad en la encrucijada de Europa. Las acompañantes trans tienden a ser multilingües, bien educadas y acostumbradas a atender a clientes exigentes de círculos diplomáticos y empresariales. La escena es más discreta que Ámsterdam pero igualmente profesional.`,
    districts: `El Barrio Europeo alrededor de Schuman y Place du Luxembourg es el corazón de la comunidad internacional. Los barrios de Ixelles y Saint-Gilles ofrecen un ambiente moderno y multicultural. La zona de la Grand Place brinda impresionantes telones de fondo para encuentros de lujo en hoteles como el Amigo. Las áreas de Uccle y Woluwe ofrecen privacidad residencial.`,
    tips: `Las tarifas en Bruselas suelen oscilar entre €150-350 por hora. Francés, holandés e inglés son ampliamente utilizados. El centro compacto es transitable a pie, con excelentes conexiones de metro. La famosa gastronomía de Bruselas la hace ideal para encuentros prolongados con cena.`,
    keywords: ['trans Bruselas', 'shemale Bruselas', 'travestis Bruselas', 'acompañantes trans Bruselas', 'ts Bélgica'],
    faq: [
      { q: '¿Es legal el acompañamiento en Bruselas?', a: 'Sí, la actividad profesional entre adultos que consienten es legal en Bélgica. Bruselas tiene un sector de servicios para adultos bien regulado.' },
      { q: '¿Qué idiomas hablan las acompañantes trans en Bruselas?', a: 'La mayoría habla francés y muchas hablan holandés e inglés. Dado el carácter internacional de la ciudad, el multilingüismo es la norma.' },
      { q: '¿Dónde está la mejor zona en Bruselas?', a: 'El Barrio Europeo, Ixelles y el área alrededor de la Grand Place son las ubicaciones principales, ofreciendo una mezcla de hoteles de lujo, excelente gastronomía y entornos discretos.' },
    ]
  },
  lisbon: {
    displayName: 'Lisboa',
    country: 'Portugal',
    continent: 'europe',
    intro: `Lisboa es la soleada capital atlántica de Europa: una ciudad de siete colinas, edificios de colores pastel y una escena trans sorprendentemente vibrante. Las actitudes sociales progresistas de Portugal, el lujo asequible y el auge del turismo hacen de Lisboa un destino cada vez más popular para quienes buscan compañía trans premium.`,
    scene: `La escena trans en Lisboa ha crecido significativamente junto con el auge turístico de la ciudad. Portugal despenalizó todas las drogas en 2001 y se ha clasificado constantemente entre los países más progresistas de Europa en temas LGBTQ+. Las acompañantes trans de Lisboa incluyen tanto portuguesas locales como una creciente comunidad brasileña.`,
    districts: `Príncipe Real es el centro LGBTQ+ de Lisboa y el centro natural de la escena trans, lleno de bares con estilo, hoteles boutique y vibrante vida nocturna. El vecino Bairro Alto se transforma de calles tranquilas durante el día a una de las zonas de vida nocturna más animadas de Europa al anochecer. Chiado ofrece gastronomía sofisticada y compras de lujo. El distrito de Parque das Nações brinda entornos modernos frente al mar.`,
    tips: `Las tarifas en Lisboa suelen oscilar entre €100-250 por hora. El portugués es el idioma principal; el inglés es común entre quienes atienden a turistas. Las colinas de Lisboa significan que los taxis/Uber son tus amigos. Reserva con anticipación durante el verano (junio-septiembre) y eventos importantes como el Orgullo de Lisboa y la Web Summit.`,
    keywords: ['trans Lisboa', 'shemale Lisboa', 'travestis Lisboa', 'acompañantes trans Lisboa', 'ts Portugal'],
    faq: [
      { q: '¿Es legal el acompañamiento en Lisboa?', a: 'Sí, la actividad profesional entre adultos que consienten es legal en Portugal. Lisboa tiene un ambiente tolerante y profesional.' },
      { q: '¿Cuál es la mejor zona en Lisboa?', a: 'Príncipe Real es el corazón LGBTQ+ de Lisboa. Bairro Alto, Chiado y Parque das Nações también son populares por sus hoteles, gastronomía y vida nocturna.' },
      { q: '¿Qué idiomas hablan las acompañantes trans en Lisboa?', a: 'El portugués es el idioma principal. El inglés es común, y muchas acompañantes de Brasil añaden un distintivo sabor lusófono a la escena.' },
    ]
  },
  eindhoven: {
    displayName: 'Eindhoven',
    country: 'Países Bajos',
    continent: 'europe',
    intro: `Eindhoven, la capital del diseño y la tecnología de los Países Bajos, ofrece una escena sorprendentemente vibrante para encuentros con acompañantes trans. Esta dinámica ciudad en la provincia de Brabante Septentrional combina innovación de vanguardia con la calidez del sur holandés. Conocida por su Design Academy y el Dutch Design Week anual, Eindhoven atrae a un público creativo y de mente abierta que valora las conexiones auténticas.`,
    scene: `La escena trans en Eindhoven es íntima pero bien conectada. Aunque más pequeña que Ámsterdam, el carácter internacional de la ciudad — impulsado por el High Tech Campus y la Universidad TU/e — crea un ambiente cosmopolita donde las acompañantes atienden a una clientela diversa y multilingüe. La escena se concentra en el centro de la ciudad y Stratumseind, una de las calles de ocio más largas de los Países Bajos.`,
    districts: `El centro de la ciudad alrededor de la plaza Markt y la animada calle Stratumseind son puntos de partida naturales para encuentros. El moderno distrito Strijp-S, con sus antiguas fábricas de Philips convertidas en lofts y espacios creativos, ofrece lugares con estilo. La zona verde de Tongelre brinda privacidad bien conectada. Para quienes están cerca del campus tecnológico, la zona de Meerhoven ofrece comodidad.`,
    tips: `Las tarifas en Eindhoven suelen oscilar entre €120-200 por hora. Se recomienda reservar con anticipación, especialmente durante eventos como el Dutch Design Week (octubre) y el festival de luces GLOW (noviembre). El centro compacto es transitable a pie y la excelente red de autobuses llega a todos los distritos. El aeropuerto de Eindhoven conecta con más de 80 destinos europeos.`,
    keywords: ['acompañantes trans Eindhoven', 'shemale Eindhoven', 'travestis Eindhoven', 'ts Países Bajos', 'escorts trans Eindhoven'],
    faq: [
      { q: '¿Es legal el acompañamiento en Eindhoven?', a: 'Sí, el acompañamiento entre adultos que consienten es legal en los Países Bajos. Eindhoven opera bajo el mismo marco legal que Ámsterdam y otras ciudades holandesas.' },
      { q: '¿Cuál es la mejor zona para encuentros en Eindhoven?', a: 'El centro alrededor de Markt y Stratumseind, y el creativo distrito Strijp-S, son las zonas más populares para encuentros.' },
    ]
  },
  arnhem: {
    displayName: 'Arnhem',
    country: 'Países Bajos',
    continent: 'europe',
    intro: `Arnhem, la capital de la provincia de Güeldres, combina colinas verdes, modernismo de posguerra y una próspera escena artística para crear un escenario único para encuentros con acompañantes trans. A diferencia de las ciudades planas de canales del oeste holandés, el paisaje elevado de Arnhem y su proximidad al parque nacional Veluwe le dan un carácter distintivo.`,
    scene: `La escena trans en Arnhem es discreta y enfocada en la calidad. La posición de la ciudad como centro regional para el este de los Países Bajos significa que las acompañantes atienden a clientes de toda Güeldres y ciudades fronterizas alemanas cercanas. Las acompañantes de Arnhem son conocidas por su enfoque cálido y personal. La escena se beneficia de las excelentes conexiones ferroviarias con Utrecht (35 min) y Ámsterdam (1 hora).`,
    districts: `El centro alrededor de Korenmarkt y el Modekwartier en el barrio de Klarendal ofrecen entornos encantadores. El Rijnkade a lo largo del río Rin ofrece lugares pintorescos. El moderno desarrollo Rijnboog cerca de la estación central ofrece opciones de hoteles contemporáneos. Los frondosos distritos del norte de Sonsbeek y Velperweg brindan privacidad y tranquilidad.`,
    tips: `Las tarifas en Arnhem suelen oscilar entre €100-180 por hora. Se llega fácilmente en tren desde Ámsterdam (1h), Utrecht (35min) y ciudades alemanas como Düsseldorf (1.5h). Las mejores épocas para visitar son primavera y verano. Reserve con anticipación durante las conmemoraciones aerotransportadas en septiembre y el Festival de Moda y Diseño en junio.`,
    keywords: ['acompañantes trans Arnhem', 'shemale Arnhem', 'travestis Arnhem', 'ts Güeldres', 'escorts trans Arnhem'],
    faq: [
      { q: '¿Es legal el acompañamiento en Arnhem?', a: 'Sí, el acompañamiento entre adultos que consienten es legal en los Países Bajos. Arnhem tiene una escena profesional y discreta.' },
      { q: '¿Es fácil llegar a Arnhem para visitantes internacionales?', a: 'Sí. La estación Arnhem Centraal tiene trenes ICE directos desde Alemania y conexiones frecuentes con Ámsterdam y Utrecht.' },
    ]
  },
  antwerpen: {
    displayName: 'Amberes',
    country: 'Bélgica',
    continent: 'europe',
    intro: `Amberes es la capital del diamante de Bélgica, una ciudad de gusto refinado, moda vanguardista y una escena trans sorprendentemente dinámica. Esta metrópolis flamenca a orillas del río Escalda combina encanto histórico con creatividad de vanguardia. La sofisticación de Amberes se extiende a su sector de acompañamiento adulto, donde las acompañantes trans ofrecen experiencias premium a una clientela internacional exigente.`,
    scene: `La comunidad trans en Amberes es profesional, diversa y bien establecida. El estatus de la ciudad como centro mundial de moda y diamantes atrae a visitantes de todo el mundo, creando demanda de acompañantes multilingües. Las acompañantes de Amberes son conocidas por su elegancia y sofisticación, reflejando la identidad vanguardista de la ciudad. La escena se centra en el centro histórico y el moderno distrito portuario de Eilandje.`,
    districts: `El centro histórico cerca de Grote Markt y el distrito de la moda alrededor de Nationalestraat ofrecen ubicaciones privilegiadas. El barrio de Eilandje, centrado alrededor del museo MAS, ofrece entornos modernos frente al agua. El distrito Zuid es el barrio artístico de Amberes con excelentes restaurantes y hoteles boutique. Las zonas residenciales de Berchem ofrecen privacidad con fácil acceso en tranvía.`,
    tips: `Las tarifas en Amberes suelen oscilar entre €120-250 por hora. Se llega fácilmente en tren de alta velocidad Thalys desde París (2h), Ámsterdam (1.5h) y Londres (3h vía Bruselas). Las mejores épocas son durante el Festival de Moda de Amberes (septiembre) y la temporada de mercados navideños. La mayoría de las acompañantes hablan holandés, inglés y francés.`,
    keywords: ['acompañantes trans Amberes', 'shemale Amberes', 'travestis Amberes', 'ts Bélgica', 'escorts trans Bélgica'],
    faq: [
      { q: '¿Es legal el acompañamiento en Amberes?', a: 'Sí, el acompañamiento entre adultos que consienten es legal en Bélgica. Amberes tiene una escena profesional y bien regulada.' },
      { q: '¿Qué idiomas hablan las acompañantes trans en Amberes?', a: 'La mayoría hablan holandés, inglés y francés. Muchas también hablan alemán o español, reflejando el carácter internacional de Amberes.' },
    ]
  },
  utrecht: {
    displayName: 'Utrecht',
    country: 'Países Bajos',
    continent: 'europe',
    intro: `Utrecht, el corazón palpitante de los Países Bajos — literalmente en el centro geográfico del país — ofrece un entorno encantador e histórico para encuentros con acompañantes trans. Esta ciudad universitaria es conocida por su icónica Torre Dom, sus singulares sótanos de muelle a lo largo del canal Oudegracht y una población joven y vibrante. La belleza medieval de Utrecht combinada con su actitud moderna y progresista la convierte en una alternativa atractiva a Ámsterdam.`,
    scene: `La escena trans en Utrecht es juvenil, educada y refrescantemente auténtica. Con una de las universidades más grandes de Europa, la ciudad tiene una población inteligente y de mente abierta que valora las conexiones genuinas. Las acompañantes de Utrecht atienden a una mezcla de profesionales locales, académicos visitantes y turistas atraídos por la rica historia de la ciudad.`,
    districts: `La zona del canal Oudegracht, con sus distintivos muelles de dos niveles convertidos en restaurantes y boutiques, ofrece un telón de fondo romántico. El Museumkwartier proporciona sofisticación cultural. Las tranquilas zonas residenciales de Oost y Wittevrouwen ofrecen privacidad. El recién desarrollado Leidsche Rijn ofrece opciones de alojamiento modernas. Hoog Catharijne cerca de la Estación Central brinda máxima comodidad.`,
    tips: `Las tarifas en Utrecht suelen oscilar entre €120-200 por hora. Como principal nodo ferroviario de los Países Bajos, se puede llegar desde cualquier lugar del país en menos de una hora. El centro compacto es totalmente transitable a pie. Las mejores épocas son primavera y verano cuando las terrazas junto al canal cobran vida.`,
    keywords: ['acompañantes trans Utrecht', 'shemale Utrecht', 'travestis Utrecht', 'ts Utrecht', 'escorts trans Países Bajos'],
    faq: [
      { q: '¿Es legal el acompañamiento en Utrecht?', a: 'Sí, el acompañamiento entre adultos que consienten es legal en todos los Países Bajos, incluido Utrecht.' },
      { q: '¿En qué se diferencia Utrecht de Ámsterdam?', a: 'Utrecht ofrece una experiencia más relajada y auténtica con menos turistas. La escena se centra alrededor del hermoso distrito de canales y tiene un carácter juvenil e intelectual.' },
    ]
  },
  nijmegen: {
    displayName: 'Nimega',
    country: 'Países Bajos',
    continent: 'europe',
    intro: `Nimega, la ciudad más antigua de los Países Bajos, se asienta con gracia a orillas del río Waal cerca de la frontera alemana. Esta ciudad histórica — antiguo asentamiento romano — combina patrimonio milenario con un espíritu juvenil y rebelde impulsado por su reconocida Universidad Radboud. La mezcla única de historia, naturaleza y política progresista de Nimega la convierte en un destino encantador para encuentros trans en el este holandés.`,
    scene: `La escena trans de Nimega es pequeña, selectiva y orientada a la comunidad. La fuerte tradición política de izquierda de la ciudad y su activa comunidad LGBTQ+ crean un ambiente naturalmente acogedor. Las acompañantes en Nimega atienden a una clientela mixta de residentes locales, afiliados universitarios y visitantes de ciudades alemanas cercanas como Kleve y Duisburgo.`,
    districts: `El Benedenstad a lo largo del Waalkade ofrece animados entornos ribereños. El centro alrededor de Grote Markt proporciona puntos de encuentro convenientes. El barrio de Hunnerberg cerca del campus universitario atiende al público académico. El Ooijpolder ofrece escapadas pintorescas a minutos de la ciudad. El recientemente remodelado Waalfront combina arquitectura moderna con vistas al río.`,
    tips: `Las tarifas en Nimega suelen ser de €100-180 por hora. Se llega en tren desde Ámsterdam (1.5h), Utrecht (1h) y ciudades alemanas como Düsseldorf (1.5h). El plato fuerte son las Vierdaagsefeesten en julio — la fiesta más grande de los Países Bajos. Reserve con mucha anticipación durante este período.`,
    keywords: ['acompañantes trans Nimega', 'shemale Nimega', 'travestis Nimega', 'ts Güeldres', 'escorts trans Nimega'],
    faq: [
      { q: '¿Es legal el acompañamiento en Nimega?', a: 'Sí, el acompañamiento entre adultos que consienten es legal en los Países Bajos en todas las ciudades.' },
      { q: '¿Vale la pena visitar Nimega?', a: 'Absolutamente. Nimega ofrece 2.000 años de historia, energía universitaria vibrante y hermosos entornos naturales con un ambiente acogedor y progresista.' },
    ]
  },
};

// ── HEBREW CITY CONTENT ──
const cityContentHe = {
  'tel-aviv': {
    displayName: 'תל אביב',
    country: 'Israel',
    continent: 'asia',
    intro: 'תל אביב היא העיר התוססת והקוסמופוליטית ביותר במזרח התיכון, וידועה בתרבות הליברלית שלה, חיי הלילה המפורסמים, וקהילת הלהטב"ק הגאה. העיר הלבנה לחוף הים התיכון מושכת אליה מבקרים מכל העולם, והסצנה הטרנסית כאן משקפת את הפתיחות והאנרגיה הייחודית של תל אביב.',
    scene: 'הסצנה הטרנסית בתל אביב מגוונת ומשגשגת. תוכלו למצוא כאן יזמיות עצמאיות מהארץ ומהעולם, המציעות חוויות וחברה ברמה הגבוהה ביותר. המרכזים הפופולריים כוללים את שדרות רוטשילד, נווה צדק, אזור הנמל, ודרום העיר — כל אחד עם האופי הייחודי שלו.',
    districts: `מרכז העיר (רוטשילד, אלנבי) — לב העיר הפועם: בתי קפה, מסעדות יוקרה, חיי לילה תוססים ומלונות בוטיק. האזור המבוקש ביותר. נווה צדק — שכונה ציורית עם סמטאות רומנטיות, גלריות ומסעדות שף, מושלמת למפגש אלגנטי ושקט. נמל תל אביב — מתחם בילויים על קו המים עם מסעדות, ברים ומועדונים, אווירה צעירה ותוססת. דרום תל אביב (פלורנטין, נווה שאנן) — אזור אמנותי רב-תרבותי עם אווירה אורבנית ייחודית ומחירים נגישים יותר.`,
    tips: `רוב היזמיות בתל אביב דוברות עברית ואנגלית — חלקן גם רוסית, צרפתית או ערבית. סופי השבוע בתל אביב (שישי-שבת) רגועים יותר — ימי חול הם הזמן העמוס ביותר. המלונות לאורך הטיילת מציעים דיסקרטיות ונוף לים — אזור מושלם למפגש. התחבורה הציבורית מצוינת, אבל מוניות ושירותי הסעות פרטיים זמינים ונוחים מאוד.`,
    keywords: ['תל אביב', 'טרנס', 'ישראל', 'חוויות', 'מפגשים', 'חברה', 'עצמאיות', 'להטב"ק', 'דיסקרטי'],
    faq: [
      { q: 'האם החוויות בתל אביב חוקיות?', a: 'כן. מפגשים בין בגירים בהסכמה הם חוקיים בישראל. תל אביב ידועה בסביבה הבטוחה והליברלית שלה.' },
      { q: 'מה האזור המומלץ ביותר בתל אביב?', a: 'מרכז העיר — רוטשילד, אלנבי ונווה צדק — הוא האזור הפופולרי ביותר. הנמל מצוין לאווירה צעירה, ודרום העיר מציע אלטרנטיבה אמנותית.' },
      { q: 'איך יוצרים קשר עם יזמיות עצמאיות בתל אביב?', a: 'פשוט — כל פרופיל מציג מספר טלפון, וואטסאפ או אימייל. אפשר ליצור קשר ישירות.' },
    ],
  },
};

// Helper from display name
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
  const [travelers, setTravelers] = useState([]);

  // Detect language from URL path
  const lang = typeof window !== 'undefined' 
    ? (window.location.pathname.startsWith('/es/') || window.location.pathname.startsWith('/es') ? 'es'
      : window.location.pathname.startsWith('/he/') || window.location.pathname.startsWith('/he') ? 'he'
      : 'en')
    : 'en';
  const contentMap = lang === 'es' ? cityContentEs : lang === 'he' ? cityContentHe : cityContent;

  const displayCountry = country.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const displayCity = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Find matching content by city slug from the correct language map
  useEffect(() => {
    const match = contentMap[city.toLowerCase()];
    setContent(match || null);
  }, [city, lang]);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        // Query profiles that match this city in location
        const locationPattern = `% | ${displayCity}`;
        const { data, error } = await supabase
          .from('profiles')
          .select('*, photos(photo_url, local_path)')
          .ilike('location', locationPattern)
          .not('cam_chat', 'eq', 'rejected')
          .order('created_at', { ascending: false })
          .limit(12);

        if (error) throw error;
        if (data) {
          // Keep ALL profiles (show even without photo — card renders a clean
          // local placeholder). Still drop clearly-broken photo urls.
          const arr = Array.isArray(data) ? data : [];
          const cleaned = arr.map(p => ({
            ...p,
            photos: (p.photos || []).filter(ph => isLoadablePhoto(ph.photo_url))
          }));
          setProfiles(cleaned);
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

  // Fetch active travelers for this city
  useEffect(() => {
    const fetchTravelers = async () => {
      try {
        const resp = await fetch(`https://shemalewiki.online/api/travel-plans/active?city=${encodeURIComponent(displayCity)}`);
        if (resp.ok) {
          const data = await resp.json();
          setTravelers(data.active || []);
        }
      } catch (e) {
        // Silently fail — travelers section is non-critical
      }
    };
    fetchTravelers();
  }, [displayCity]);

  // i18n helpers — lookup by language
  const i18n = {
    en: {
      seoTitle: `Trans Companions in ${displayCity} — Verified Profiles`,
      seoDesc: (content
        ? `Find ${profileCount} verified trans companions in ${displayCity}, ${displayCountry}. Browse profiles with photos and contact info. ${(content.keywords || []).slice(0, 3).join(', ')}.`
        : `Find verified trans companions in ${displayCity}, ${displayCountry}. Browse ${profileCount} active profiles with photos and contact info.`),
      home: 'Home',
      backTo: `Back to ${displayCountry}`,
      community: `Trans Community in ${displayCity}`,
      guideTagline: `Your guide to trans companions and verified profiles in ${displayCity}, ${displayCountry}`,
      about: `About Trans Community in ${displayCity}`,
      theScene: 'The Trans Community',
      districts: 'Popular Districts & Areas',
      tips: `Tips for Booking Trans Community in ${displayCity}`,
      faq: 'Frequently Asked Questions',
      featured: `Featured Trans Community in ${displayCity}`,
      viewAllCountry: `View all members in ${displayCountry}`,
      viewAllCountryDesc: `Browse the complete ${displayCountry} directory including other cities`,
      viewAllBtn: `View All ${displayCountry} Members`,
    },
    es: {
      seoTitle: `Acompañantes Trans en ${displayCity} — Perfiles Verificados`,
      seoDesc: (content
        ? `Encuentra ${profileCount} acompañantes trans verificadas en ${displayCity}, ${displayCountry}. Perfiles con fotos e información de contacto. ${(content.keywords || []).slice(0, 3).join(', ')}.`
        : `Encuentra acompañantes trans verificadas en ${displayCity}, ${displayCountry}. ${profileCount} perfiles activos con fotos e información de contacto.`),
      home: 'Inicio',
      backTo: `Volver a ${displayCountry}`,
      community: `Comunidad Trans en ${displayCity}`,
      guideTagline: `Tu guía de acompañantes trans y perfiles verificados en ${displayCity}, ${displayCountry}`,
      about: `Sobre la Comunidad Trans en ${displayCity}`,
      theScene: 'La Comunidad Trans',
      districts: 'Barrios y Zonas Populares',
      tips: `Consejos para Reservar en ${displayCity}`,
      faq: 'Preguntas Frecuentes',
      featured: `Acompañantes Destacadas en ${displayCity}`,
      viewAllCountry: `Ver todos los miembros en ${displayCountry}`,
      viewAllCountryDesc: `Explora el directorio completo de ${displayCountry} incluyendo otras ciudades`,
      viewAllBtn: `Ver Todos los Miembros de ${displayCountry}`,
    },
    he: {
      seoTitle: `חוויות פרימיום ב${displayCity} — פרופילים מאומתים`,
      seoDesc: (content
        ? `גלו ${profileCount} פרופילים מאומתים ב${displayCity}, ${displayCountry}. דפדפו בפרופילים עם תמונות ופרטי קשר. ${(content.keywords || []).slice(0, 3).join(', ')}.`
        : `גלו פרופילים מאומתים ב${displayCity}, ${displayCountry}. ${profileCount} פרופילים פעילים עם תמונות ופרטי קשר.`),
      home: 'דף הבית',
      backTo: `חזרה ל${displayCountry}`,
      community: `הקהילה הטרנסית ב${displayCity}`,
      guideTagline: `המדריך שלכם לחוויות פרימיום ופרופילים מאומתים ב${displayCity}, ${displayCountry}`,
      about: `על הקהילה הטרנסית ב${displayCity}`,
      theScene: 'הקהילה הטרנסית',
      districts: 'אזורים פופולריים',
      tips: `טיפים למפגש ב${displayCity}`,
      faq: 'שאלות נפוצות',
      featured: `פרופילים מובילים ב${displayCity}`,
      viewAllCountry: `צפו בכל החברים ב${displayCountry}`,
      viewAllCountryDesc: `דפדפו במדריך המלא של ${displayCountry} כולל ערים נוספות`,
      viewAllBtn: `צפו בכל החברים מ${displayCountry}`,
    },
  };
  const t = i18n[lang] || i18n.en;

  return (
    <>
      <SEO
        title={t.seoTitle}
        description={t.seoDesc}
        canonicalPath={`/${continent}/${country}/${city}`}
        lang={lang}
        alternates={(lang === 'en' 
          ? [{ lang: 'es', path: `/es/${continent}/${country}/${city}` }, { lang: 'he', path: `/he/${continent}/${country}/${city}` }]
          : lang === 'es'
          ? [{ lang: 'en', path: `/en/${continent}/${country}/${city}` }, { lang: 'he', path: `/he/${continent}/${country}/${city}` }]
          : [{ lang: 'en', path: `/en/${continent}/${country}/${city}` }, { lang: 'es', path: `/es/${continent}/${country}/${city}` }]
        )}
      />
      <div className="container" style={{ padding: '2rem 0 4rem' }}>
        {/* Breadcrumb navigation */}
        <div className="city-breadcrumb">
          <Link to="/" className="breadcrumb-link">{t.home}</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to={`/${lang === 'en' ? '' : lang + '/'}${continent}`} className="breadcrumb-link">
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
          {t.backTo}
        </button>

        {/* Hero Section */}
        <div className="city-hero glass" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>
            {t.community}
          </h1>
          <p className="page-subtitle" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
            {t.guideTagline}
          </p>
          <div className="city-stats" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div className="city-stat">
              <Users size={20} style={{ color: 'var(--accent-primary)' }} />
              <span><strong>{profileCount}</strong> {lang === 'es' ? 'perfiles activos' : 'active profiles'}</span>
            </div>
            <div className="city-stat">
              <MapPin size={20} style={{ color: 'var(--accent-primary)' }} />
              <span>{displayCountry}</span>
            </div>
          </div>
        </div>

        {/* ✈️ Active Travelers — profiles arriving within 48h */}
        {travelers.length > 0 && (
          <div className="city-travelers glass" style={{ padding: '1.8rem 2.5rem', marginBottom: '2rem', borderLeft: '3px solid var(--accent-primary)' }}>
            <h2 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>✈️</span> 
              {lang === 'es' ? `Viajeras en ${displayCity}` : `Travelers in ${displayCity}`}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {lang === 'es' 
                ? `${travelers.length} acompañante${travelers.length > 1 ? 's' : ''} llegando en las próximas 48 horas. ¡Reservá ahora!`
                : `${travelers.length} companion${travelers.length > 1 ? 's' : ''} arriving in the next 48 hours. Book now!`}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {travelers.map((t, i) => (
                <div key={t.plan_id || i} style={{
                  background: 'rgba(124, 58, 237, 0.1)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '12px',
                  padding: '0.8rem 1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span>🌟</span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>
                    {t.city || displayCity}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(t.arrival_date).toLocaleDateString(lang === 'es' ? 'es' : 'en', { day: 'numeric', month: 'short' })}
                    {' → '}
                    {new Date(t.departure_date).toLocaleDateString(lang === 'es' ? 'es' : 'en', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* City Guide Content */}
        {content && (
          <div className="city-content glass" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            <h2>{t.about}</h2>
            <p>{content.intro}</p>

            <h3>{t.theScene}</h3>
            <p>{content.scene}</p>

            <h3>{t.districts}</h3>
            <p>{Array.isArray(content.districts) ? content.districts.map(d => typeof d === 'object' ? `${d.name}: ${d.description}` : d).join(' ') : content.districts}</p>

            <h3>{t.tips}</h3>
            <p>{Array.isArray(content.tips) ? content.tips.join(' ') : content.tips}</p>

            {/* FAQ Section */}
            <h3 style={{ marginTop: '2rem' }}>{t.faq}</h3>
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
                {lang === 'es' ? 'También buscando:' : 'Also searching for:'}
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
              <strong>{t.viewAllCountry}</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                {t.viewAllCountryDesc}
              </p>
            </div>
          </Link>
        </div>

        {/* Profile Cards */}
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>
          {t.featured}
        </h2>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : profiles.length === 0 ? (
          <div className="empty-state">
            <p>{lang === 'es' ? `Aún no hay perfiles en ${displayCity}.` : `No profiles found in ${displayCity} yet.`}</p>
            <Link to={`/${continent}/${country}`} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              {lang === 'es' ? `Explorar todos los miembros de ${displayCountry}` : `Browse all ${displayCountry} members`}
            </Link>
          </div>
        ) : (
          <>
            <div className="profiles-grid">
              {profiles.map(profile => (
                <Link to={`/profile/${profile.id}`} key={profile.id} className="glass-card">
                  <LazyImage
                    src={(profile.photos || []).find(p => p.local_path === 'cover')?.photo_url
                      ? getProxiedImageUrl((profile.photos || []).find(p => p.local_path === 'cover')?.photo_url)
                      : (profile.photos?.[0]?.photo_url
                          ? getProxiedImageUrl(profile.photos?.[0]?.photo_url)
                          : undefined)}
                    alt={profile.name}
                    className="profile-card-img"
                    placeholder="/placeholder-profile.svg"
                  />
                  <div className="profile-card-content">
                    <h3 className="profile-card-title">{profile.name}</h3>
                    <div className="profile-card-meta">
                      <span>📍 {profile.location || 'Unknown'}</span>
                      {profile.age && <span>🎂 {lang === 'es' ? `Edad: ${profile.age}` : `Age: ${profile.age}`}</span>}
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
                {t.viewAllBtn}
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
