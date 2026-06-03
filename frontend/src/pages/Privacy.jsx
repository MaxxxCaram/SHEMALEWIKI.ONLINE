import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const isBT = () => typeof window !== 'undefined' && window.location.hostname.includes('buscatrans');

const getLang = () => {
  if (typeof window === 'undefined') return 'en';
  if (isBT() || (typeof window !== 'undefined' && window.location.pathname.startsWith('/es'))) return 'es';
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/pt')) return 'pt';
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/he')) return 'he';
  return 'en';
};

const company = { name: 'MissNL Productions', country: 'Países Bajos / Netherlands', email: 'legal@shemalewiki.online' };

const contents = {
  en: {
    title: 'Privacy Policy',
    sections: [
      { heading: '1. Data Controller', body: `The data controller responsible for processing your personal data is ${company.name}, with registered address in ${company.country}. Contact email: ${company.email}.` },
      { heading: '2. Data Collected', body: 'We collect the following data:\n• Information provided during registration: stage name, email, WhatsApp/Telegram, country, city.\n• Profile content: bio, photos, rates, services, availability.\n• Usage data: IP address, browser type, pages visited, access times.\n• Age verification data: birth year (not stored after session).' },
      { heading: '3. Purpose of Processing', body: 'Your data is processed for:\n• Publishing and managing member profiles on our directory.\n• Cross-listing between ShemaleWiki.online and BuscaTrans.com (with your consent).\n• Communication regarding your account and listings.\n• Improving our services and website functionality.\n• Compliance with legal obligations, including age verification.' },
      { heading: '4. Legal Basis', body: 'Processing is based on:\n• Your explicit consent when registering and publishing content.\n• Legitimate interest in operating the directory platform.\n• Compliance with legal obligations (age verification, prevention of illegal content).' },
      { heading: '5. Data Retention', body: '• Profile data: retained while your account is active. You may delete your account at any time.\n• Age verification: birth year is not stored after session verification.\n• Usage logs: retained for 12 months for security purposes.\n• Photos and listings: retained until you delete them or close your account.' },
      { heading: '6. Data Sharing', body: 'We do NOT sell your personal data. Data may be shared with:\n• Service providers: hosting (Vercel), database (Supabase), email services.\n• Competent authorities: when required by law or to report illegal content.\n• Cross-listing: if you opt in, your profile appears on both ShemaleWiki.online and BuscaTrans.com.' },
      { heading: '7. User Rights', body: 'You have the right to:\n• Access your personal data.\n• Rectify inaccurate data.\n• Delete your data ("right to be forgotten").\n• Restrict processing.\n• Data portability.\n• Object to processing.\n• Withdraw consent at any time.\n\nTo exercise these rights, contact: ${company.email}' },
      { heading: '8. Cookies', body: 'We use essential cookies for session management and age verification. No advertising or tracking cookies are used without consent. You can configure your browser to reject cookies, but this may affect site functionality.' },
      { heading: '9. Security', body: 'We implement appropriate technical and organizational measures to protect your data: SSL encryption, secure database with access controls, and limited staff access to personal data.' },
      { heading: '10. Changes', body: 'We reserve the right to modify this Privacy Policy. Changes will be published on this page. Continued use of the site constitutes acceptance.', lastUpdated: 'May 2026' },
    ],
  },
  es: {
    title: 'Política de Privacidad',
    sections: [
      { heading: '1. Responsable del Tratamiento', body: `El responsable del tratamiento de sus datos personales es ${company.name}, con domicilio en ${company.country}. Email de contacto: ${company.email}.` },
      { heading: '2. Datos Recogidos', body: 'Recogemos los siguientes datos:\n• Información facilitada en el registro: nombre artístico, email, WhatsApp/Telegram, país, ciudad.\n• Contenido del perfil: biografía, fotos, tarifas, servicios, disponibilidad.\n• Datos de uso: dirección IP, tipo de navegador, páginas visitadas, horarios de acceso.\n• Datos de verificación de edad: año de nacimiento (no se almacena tras la sesión).' },
      { heading: '3. Finalidad del Tratamiento', body: 'Sus datos son tratados para:\n• Publicar y gestionar perfiles en nuestro directorio.\n• Publicación cruzada entre BuscaTrans.com y ShemaleWiki.online (con su consentimiento).\n• Comunicación relativa a su cuenta y anuncios.\n• Mejora de nuestros servicios y funcionalidad del sitio.\n• Cumplimiento de obligaciones legales, incluyendo verificación de edad.' },
      { heading: '4. Base Legal', body: 'El tratamiento se basa en:\n• Su consentimiento explícito al registrarse y publicar contenido.\n• Interés legítimo en operar la plataforma de directorio.\n• Cumplimiento de obligaciones legales (verificación de edad, prevención de contenidos ilícitos).' },
      { heading: '5. Conservación de Datos', body: '• Datos de perfil: se conservan mientras su cuenta esté activa. Puede eliminar su cuenta en cualquier momento.\n• Verificación de edad: el año de nacimiento no se almacena tras la verificación de sesión.\n• Registros de uso: se conservan 12 meses por motivos de seguridad.\n• Fotos y anuncios: se conservan hasta que los elimine o cierre su cuenta.' },
      { heading: '6. Cesión de Datos', body: 'NO vendemos sus datos personales. Los datos pueden ser compartidos con:\n• Proveedores de servicios: hosting (Vercel), base de datos (Supabase), servicios de email.\n• Autoridades competentes: cuando sea requerido por ley o para denunciar contenidos ilícitos.\n• Publicación cruzada: si lo acepta, su perfil aparece en ambos BuscaTrans.com y ShemaleWiki.online.' },
      { heading: '7. Derechos del Usuario', body: 'Usted tiene derecho a:\n• Acceder a sus datos personales.\n• Rectificar datos inexactos.\n• Suprimir sus datos ("derecho al olvido").\n• Limitar el tratamiento.\n• Portabilidad de los datos.\n• Oponerse al tratamiento.\n• Retirar el consentimiento en cualquier momento.\n\nPara ejercer estos derechos, contacte: ${company.email}' },
      { heading: '8. Cookies', body: 'Utilizamos cookies esenciales para la gestión de sesión y verificación de edad. No se utilizan cookies publicitarias o de rastreo sin consentimiento. Puede configurar su navegador para rechazar cookies, pero esto puede afectar la funcionalidad del sitio.' },
      { heading: '9. Seguridad', body: 'Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos: cifrado SSL, base de datos segura con controles de acceso, y acceso limitado del personal a datos personales.' },
      { heading: '10. Modificaciones', body: 'Nos reservamos el derecho a modificar esta Política de Privacidad. Los cambios se publicarán en esta página. El uso continuado del sitio constituye su aceptación.', lastUpdated: 'Mayo 2026' },
    ],
  },
  pt: {
    title: 'Política de Privacidade',
    sections: [
      { heading: '1. Responsável pelo Tratamento', body: `O responsável pelo tratamento dos seus dados pessoais é ${company.name}, com domicílio em ${company.country}. Email de contacto: ${company.email}.` },
      { heading: '2. Dados Recolhidos', body: 'Recolhemos os seguintes dados:\n• Informação fornecida no registo: nome artístico, email, WhatsApp/Telegram, país, cidade.\n• Conteúdo do perfil: biografia, fotos, tarifas, serviços, disponibilidade.\n• Dados de uso: endereço IP, tipo de navegador, páginas visitadas, horários de acesso.\n• Dados de verificação de idade: ano de nascimento (não armazenado após a sessão).' },
      { heading: '3. Finalidade do Tratamento', body: 'Os seus dados são tratados para:\n• Publicar e gerir anúncios de acompanhantes no nosso diretório.\n• Publicação cruzada entre ShemaleWiki.online e BuscaTrans.com (com o seu consentimento).\n• Comunicação relativa à sua conta e anúncios.\n• Melhoria dos nossos serviços e funcionalidade do site.\n• Cumprimento de obrigações legais, incluindo verificação de idade.' },
      { heading: '4. Base Legal', body: 'O tratamento baseia-se em:\n• Seu consentimento explícito ao registar-se e publicar conteúdo.\n• Interesse legítimo em operar a plataforma de diretório.\n• Cumprimento de obrigações legais (verificação de idade, prevenção de conteúdos ilícitos).' },
      { heading: '5. Conservação de Dados', body: '• Dados de perfil: conservados enquanto a sua conta estiver ativa. Pode eliminar a sua conta a qualquer momento.\n• Verificação de idade: o ano de nascimento não é armazenado após a verificação de sessão.\n• Registos de uso: conservados 12 meses por motivos de segurança.\n• Fotos e anúncios: conservados até que os elimine ou feche a sua conta.' },
      { heading: '6. Partilha de Dados', body: 'NÃO vendemos os seus dados pessoais. Os dados podem ser partilhados com:\n• Prestadores de serviços: alojamento (Vercel), base de dados (Supabase), serviços de email.\n• Autoridades competentes: quando exigido por lei ou para denunciar conteúdos ilícitos.\n• Publicação cruzada: se aceitar, o seu perfil aparece em ambos ShemaleWiki.online e BuscaTrans.com.' },
      { heading: '7. Direitos do Utilizador', body: 'Tem direito a:\n• Aceder aos seus dados pessoais.\n• Retificar dados inexatos.\n• Eliminar os seus dados ("direito ao esquecimento").\n• Limitar o tratamento.\n• Portabilidade dos dados.\n• Opor-se ao tratamento.\n• Retirar o consentimento a qualquer momento.\n\nPara exercer estes direitos, contacte: ${company.email}' },
      { heading: '8. Cookies', body: 'Utilizamos cookies essenciais para a gestão de sessão e verificação de idade. Não são utilizados cookies publicitários ou de rastreamento sem consentimento. Pode configurar o seu navegador para rejeitar cookies, mas isso pode afetar a funcionalidade do site.' },
      { heading: '9. Segurança', body: 'Implementamos medidas técnicas e organizativas apropriadas para proteger os seus dados: encriptação SSL, base de dados segura com controlos de acesso, e acesso limitado do pessoal a dados pessoais.' },
      { heading: '10. Modificações', body: 'Reservamo-nos o direito de modificar esta Política de Privacidade. As alterações serão publicadas nesta página. O uso continuado do site constitui a sua aceitação.', lastUpdated: 'Maio 2026' },
    ],
  },
  he: {
    title: 'מדיניות פרטיות',
    sections: [
      { heading: '1. בקר/ת הנתונים', body: `בקר/ת הנתונים האחראי/ת לעיבוד המידע האישי שלך היא ${company.name}, עם כתובת רשומה ב${company.country}. אימייל ליצירת קשר: ${company.email}.` },
      { heading: '2. נתונים שנאספים', body: 'אנו אוספים את הנתונים הבאים:\n• מידע שנמסר בעת ההרשמה: שם במה, אימייל, וואטסאפ/טלגרם, מדינה, עיר.\n• תוכן הפרופיל: ביוגרפיה, תמונות, תעריפים, שירותים, זמינות.\n• נתוני שימוש: כתובת IP, סוג דפדפן, דפים שבוקרו, זמני גישה.\n• נתוני אימות גיל: שנת לידה (לא נשמרת לאחר אימות).' },
      { heading: '3. מטרת העיבוד', body: 'הנתונים שלך מעובדים לצורך:\n• פרסום וניהול פרופילים בפלטפורמה.\n• פרסום צולב בין ShemaleWiki.online ו-BuscaTrans.com (בהסכמתך).\n• תקשורת בנוגע לחשבון ולמודעות שלך.\n• שיפור השירותים והפונקציונליות של האתר.\n• עמידה בהתחייבויות חוקיות, כולל אימות גיל.' },
      { heading: '4. בסיס חוקי', body: 'העיבוד מבוסס על:\n• הסכמתך המפורשת בעת ההרשמה ופרסום התוכן.\n• אינטרס לגיטימי בתפעול פלטפורמת המדריך.\n• עמידה בהתחייבויות חוקיות (אימות גיל, מניעת תוכן בלתי חוקי).' },
      { heading: '5. שמירת נתונים', body: '• נתוני פרופיל: נשמרים כל עוד החשבון פעיל. ניתן למחוק את החשבון בכל עת.\n• אימות גיל: שנת לידה אינה נשמרת לאחר אימות.\n• יומני שימוש: נשמרים למשך 12 חודשים לצורכי אבטחה.\n• תמונות ומודעות: נשמרות עד למחיקתן או סגירת החשבון.' },
      { heading: '6. שיתוף נתונים', body: 'איננו מוכרים את הנתונים האישיים שלך. נתונים עשויים להיות משותפים עם:\n• ספקי שירות: אחסון (Vercel), מסד נתונים (Supabase), שירותי אימייל.\n• רשויות מוסמכות: כאשר הדבר נדרש על פי חוק או לדיווח על תוכן בלתי חוקי.\n• פרסום צולב: אם תסכים/י, הפרופיל שלך יופיע בשני האתרים ShemaleWiki.online ו-BuscaTrans.com.' },
      { heading: '7. זכויות המשתמש/ת', body: 'יש לך זכות ל:\n• גישה לנתונים האישיים שלך.\n• תיקון נתונים לא מדויקים.\n• מחיקת הנתונים שלך (\"הזכות להישכח\").\n• הגבלת עיבוד.\n• ניידות נתונים.\n• התנגדות לעיבוד.\n• ביטול הסכמה בכל עת.\n\nלמימוש זכויות אלה, צור/צרי קשר: ${company.email}' },
      { heading: '8. עוגיות (Cookies)', body: 'אנו משתמשים בעוגיות חיוניות לניהול מושב ולאימות גיל. לא נעשה שימוש בעוגיות פרסום או מעקב ללא הסכמה. ניתן להגדיר את הדפדפן לדחות עוגיות, אך הדבר עלול להשפיע על פונקציונליות האתר.' },
      { heading: '9. אבטחה', body: 'אנו מיישמים אמצעים טכניים וארגוניים מתאימים להגנה על הנתונים שלך: הצפנת SSL, מסד נתונים מאובטח עם בקרות גישה, וגישת צוות מוגבלת לנתונים אישיים.' },
      { heading: '10. שינויים', body: 'אנו שומרים לעצמנו את הזכות לשנות מדיניות פרטיות זו. שינויים יפורסמו בדף זה. שימוש מתמשך באתר מהווה הסכמה.', lastUpdated: 'מאי 2026' },
    ],
  },
};

export default function Privacy() {
  const lang = getLang();
  const t = contents[lang] || contents.en;
  const bt = isBT();
  const brand = bt ? 'BuscaTrans' : 'ShemaleWiki';
  const backLabels = { en: '← Back to home', es: '← Volver al inicio', pt: '← Voltar ao início', he: 'חזרה לדף הבית ←' };

  return (
    <>
      <SEO title={`${t.title} | ${brand}`} description={t.title} lang={lang} />
      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '860px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>{t.title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {brand} · {company.name} · {company.country}
        </p>
        <div className="glass" style={{ padding: '2.5rem' }}>
          {t.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: i < t.sections.length - 1 ? '2rem' : 0 }}>
              <h2 style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{s.heading}</h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{s.body}</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <Link to={bt ? '/es/' : '/'} style={{ color: 'var(--accent-primary)' }}>{backLabels[lang]}</Link>
        </p>
      </div>
    </>
  );
}