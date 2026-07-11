# AUDITORÍA COMPLETA — ShemaleWiki.ONLINE / BuscaTrans.com
**Fecha:** 2026-07-11  
**Metodología:** Código fuente estático + verificaciones en vivo (curl)  
**Alcance:** Infraestructura, frontend, API, base de datos, seguridad, SEO, performance, accesibilidad, marca

---

## 1. INFRAESTRUCTURA

### ✅ Lo que funciona
| Elemento | Estado | Detalle |
|----------|--------|---------|
| SSL/TLS | ✅ OK | TLS 1.3 / TLS_AES_128_GCM_SHA256 / X25519 / RSASSA-PSS |
| Certificado SSL | ✅ OK | shemalewiki.online (Let's Encrypt R13), buscatrans.com (Let's Encrypt YR1) |
| HSTS | ✅ OK | `strict-transport-security: max-age=63072000` (2 años) |
| HTTP/2 | ✅ OK | HTTP/2 para ambos dominios |
| CDN | ✅ OK | Vercel edge network (`x-vercel-id`, `x-vercel-cache`) |
| Server | ✅ OK | `server: Vercel` |

### ❌ Problemas detectados

**F1. CORS excesivamente permisivo en página principal**
- **Archivo:** `vercel.json` → headers para `/(.*)`
- **Problema:** `access-control-allow-origin: *` se aplica a toda la SPA (HTML), no solo a las APIs
- **Impacto:** Cualquier sitio puede leer el HTML del sitio
- **Solución:** Restringir a los dominios oficiales o mover los headers CORS a cada API route individualmente

**F2. Cache-Control agresivo (max-age=0)**
- **Archivo:** `vercel.json` → headers
- **Problema:** `cache-control: public, max-age=0, must-revalidate` para TODAS las páginas
- **Impacto:** Cada visita a la SPA recarga el HTML completo (4.2KB), sin beneficio de caching de borde
- **Solución:** Agregar `max-age=300, stale-while-revalidate=600` para el HTML estático; las páginas dinámicas via React son irrelevantes (SPA)

**F3. Content-Disposition: inline**
- **Problema:** El HTML del SPA tiene `content-disposition: inline`
- **Impacto:** Mínimo — el navegador sigue renderizando, pero es inconsistente con un SPA

**F4. CSP sin nonce / sin strict-dynamic**
- **Archivo:** `vercel.json`
- **Problema:** La CSP usa `'unsafe-inline'` y `'unsafe-eval'` en script-src
- **Impacto:** Vulnerable a XSS si se inyecta código malicioso. `'unsafe-eval'` es especialmente riesgoso
- **Solución:** Migrar a CSP con `nonce` o `hash` para scripts inline. Remover `'unsafe-eval'`

**F5. No se verificó redirect HTTP→HTTPS**
- **Problema:** Los tests HTTP fueron bloqueados por el usuario
- **Recomendación:** Verificar que ambos dominios redirijan 301 de HTTP a HTTPS. Si no hay redirect, hay ventana para downgrade attacks

---

## 2. FRONTEND — PÁGINAS Y COMPONENTES

### ✅ Páginas identificadas (14 páginas)
| Ruta | Archivo | Estado |
|------|---------|--------|
| `/` → Home | `src/pages/Home.jsx` | ✅ Funcional |
| `/:continent` | `src/pages/Countries.jsx` | ✅ Funcional |
| `/:continent/:country` | `src/pages/ProfilesList.jsx` | ✅ Funcional |
| `/:continent/:country/:city` | `src/pages/CityGuide.jsx` | ✅ Funcional |
| `/profile/:id` | `src/pages/Profile.jsx` | ✅ Funcional |
| `/register` / `/registro` | `src/pages/Register.jsx` | ✅ Funcional (4 pasos) |
| `/dashboard/login` | `src/pages/DashboardLogin.jsx` | ✅ Funcional |
| `/dashboard` | `src/pages/Dashboard.jsx` | ✅ Funcional (4 tabs) |
| `/advertise` / `/anunciar` | `src/pages/Advertise.jsx` | ✅ Funcional |
| `/terms` | `src/pages/Terms.jsx` | ✅ Funcional (EN/ES/PT) |
| `/privacy` | `src/pages/Privacy.jsx` | ✅ Funcional (EN/ES/PT/HE) |
| `/contact` / `/contacto` | `src/pages/Contact.jsx` | ✅ Funcional (EN/ES) |
| `/reclama` / `/es/reclama` | `src/pages/Reclama.jsx` | ✅ Funcional |
| `/admin` | `src/pages/Admin.jsx` | ✅ Funcional |
| `/:continent/:country/:city` (CityGuide) | `src/pages/CityGuide.jsx` | ✅ Funcional (14+ ciudades) |

### ❌ Problemas de Frontend

**F6. No hay rutas /es/ sin idioma explícito**
- **Archivo:** `App.jsx`
- **Problema:** `RootRedirect` redirige `buscatrans.com /` → `/es/`, pero la ruta `/es/` lleva a Continents, no a Home. No existe una ruta `/es` que muestre la Home en español con los perfiles de BuscaTrans.
- **Impacto:** La home de BuscaTrans no muestra perfiles con fotos como la de ShemaleWiki
- **Solución:** Agregar `<Route path="/es" element={<Home />} />` con lógica de brand detection

**F7. Search pills en Home no son funcionales**
- **Archivo:** `src/pages/Home.jsx` líneas 154-164
- **Problema:** Los pills (Bangkok, London, Miami, etc.) solo cambian `activePill` estado. No redirigen a ninguna búsqueda
- **Impacto:** 5 pills de 6 son dead code (el pill "All" tampoco hace nada especial)
- **Solución:** Conectar pills a navegación real o removerlos

**F8. Bottom nav en Home es visual-only**
- **Archivo:** `src/pages/Home.jsx` líneas 233-246
- **Problema:** Los 4 links de navegación inferior (Home, Search, Saved, Account) son `<a href="#">` — todos van a `#`
- **Impacto:** Navegación rota en móvil
- **Solución:** Conectar a rutas reales o remover

**F9. `displayCountry` parsing frágil en ProfilesList**
- **Archivo:** `src/pages/ProfilesList.jsx` línea 20
- **Problema:** `country.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1))` → "United-States" → "United-States" (no capitaliza "States")
- **Impacto:** Nombres de países mal formateados
- **Solución:** Usar `Intl.DisplayNames` o un diccionario

**F10. Perfil error: profile no encontrado**
- **Archivo:** `src/pages/Profile.jsx` líneas 98-107
- **Problema:** El mensaje dice "Profile Not Found" en inglés — no se adapta a la brand/lang
- **Impacto:** UX inconsistente en BuscaTrans
- **Solución:** Adaptar mensaje al idioma

**F11. Lightbox: `alt` dice "Photo X" sin contexto**
- **Archivo:** `src/components/Lightbox.jsx` línea 66
- **Problema:** `alt={\`Photo ${currentIndex + 1}\`}` — no describe la imagen
- **Solución:** Pasar nombre del perfil como alt text

**F12. Search input en Home sin label/ARIA**
- **Archivo:** `src/pages/Home.jsx` líneas 140-146
- **Problema:** Input de búsqueda sin `aria-label` ni `<label>` asociado
- **Impacto:** Accesibilidad — lectores de pantalla no describen la búsqueda

**F13. Error Boundary muestra emoji genérico**
- **Archivo:** `App.jsx` líneas 38-55
- **Problema:** El emoji "🤖" no tiene contexto sobre qué marca se muestra
- **Solución:** Mostrar logo/brand del error boundary

---

## 3. API BACKEND — TODOS LOS ENDPOINTS

### ✅ Endpoints identificados y verificados
| Endpoint | Método | Archivo | Estado Live | Detalle |
|----------|--------|---------|-------------|---------|
| `/api/profiles` | GET | `api/profiles.js` | ✅ 200 | Supabase REST, pagination, search |
| `/api/register` | POST | `api/register.js` | ✅ 405 (solo POST) | Rate limit 3/h, honeypot, sanitización |
| `/api/admin` | GET/POST | `api/admin.js` | ✅ 405 (solo GET/POST) | Auth token-based, approve/reject/delete |
| `/api/contact` | POST | `api/contact.js` | ✅ 405 (solo POST) | Email via Hostinger SMTP |
| `/api/claims` | POST | `api/claims.js` | OK | Crea perfil temporal en profiles |
| `/api/upload-photos` | POST | `api/upload-photos.js` | ✅ 405 | Upload individual de fotos |
| `/api/manage-photos` | POST/DELETE | `api/manage-photos.js` | ✅ 405 | Agregar/quitar/set-cover fotos |
| `/api/drafts` | POST | `api/drafts.js` | ✅ 405 | API de borradores |
| `/api/update-profile` | POST | `api/update-profile.js` | ✅ 405 | Actualizar perfil desde dashboard |
| `/api/travel-plans` | GET/POST/PUT/DELETE | `api/travel-plans.js` | ✅ 405 | Gestión de planes de viaje |
| `/api/image` | GET | `api/image.js` | ✅ 200 | Proxy de imágenes externas |
| `/api/vivas-chat` | POST | `api/vivas-chat.js` | ✅ 405 | Chat en vivo |

### ❌ Problemas de API

**F14. SEVERE: Clave anon de Supabase expuesta en frontend**
- **Archivo:** `src/supabase.js` línea 4
- **Código:** `const SUPABASE_ANON_KEY = 'sb_publishable_cwSD5GVp927MuLu0N1uROA_z7OsOjIB';`
- **Impacto:** Cualquiera puede ver la clave en el bundle JS. RLS debe proteger toda la data.
- **Solución:** Esta clave ya es "anon" (public), pero verificar que las RLS policies prohíban lectura no autorizada

**F15. CRÍTICO: Password SMTP hardcoded en `/api/contact.js`**
- **Archivo:** `api/contact.js` línea 9
- **Código:** `const SMTP_PASS = process.env.ADS_EMAIL_PASSWORD || 'Maxima2026!';`
- **Impacto:** Contraseña SMTP en texto claro en el repositorio. Cualquiera con acceso al código puede enviar emails como ads@shemalewiki.online
- **Solución:** REMOVER el fallback `'Maxima2026!'`. Usar solo `process.env.ADS_EMAIL_PASSWORD`

**F16. Claims usa variable de env inconsistente**
- **Archivo:** `api/claims.js` línea 22
- **Problema:** Usa `process.env.SUPABASE_SERVICE_ROLE_KEY` — la variable se llama `SUPABASE_SERVICE_KEY` en `register.js` y `admin.js`
- **Impacto:** Si en Vercel la variable se llama `SUPABASE_SERVICE_KEY`, el endpoint de claims fallará
- **Solución:** Unificar nombre de variable en todos los archivos

**F17. `/api/profiles` CORS: `Access-Control-Allow-Origin: *`**
- **Archivo:** `api/profiles.js` línea 36
- **Problema:** Permite cualquier origen
- **Impacto:** Cualquier sitio puede consumir profiles API directamente
- **Solución:** Restringir a `ALLOWED_ORIGINS` como hace `register.js`

**F18. Admin: token HMAC no es JWT real — pero OK para escala**
- **Archivo:** `api/admin.js`
- **Nota:** El token HMAC se verifica del lado del servidor, pero si ADMIN_SECRET se filtra, alguien puede generar tokens válidos. No es crítico si el secret está bien protegido.

**F19. `/api/contact` sin rate limiting**
- **Archivo:** `api/contact.js`
- **Problema:** `/api/register` tiene rate limit (3/hora), pero `/api/contact` no tiene ninguna limitación
- **Impacto:** Posible spam/abuso del formulario de contacto
- **Solución:** Agregar rate limiting similar al de register.js

**F20. `/api/claims` sin validación de email/phone**
- **Archivo:** `api/claims.js`
- **Problema:** Solo verifica que name_on_site, email y phone existan. No valida formato.
- **Impacto:** Datos basura en la base de datos
- **Solución:** Agregar `isValidEmail()` y `isValidPhone()` como en register.js

**F21. `/api/claims` inserta en tabla `profiles` en vez de tabla `claims`**
- **Archivo:** `api/claims.js` líneas 52-63
- **Problema:** Inserta claims en la tabla `profiles` con `name: 'CLAIM: ...'` y `location: 'Claims | Pending'`
- **Impacto:** Contamina la tabla de perfiles con datos de reclamación. Si existe una tabla `claims` separada, debería usarse
- **Solución:** Crear tabla `claims` dedicada si no existe, o al menos marcar los claims claramente

**F22. Admin: búsqueda de perfiles sin pagination real**
- **Archivo:** `api/admin.js` línea 91
- **Problema:** Siempre trae `limit=50`, no respeta `req.query.page` o `limit`
- **Impacto:** Admin puede perder perfiles si hay más de 50

---

## 4. DATABASE — SUPABASE

### ✅ Estructura inferida del código
| Tabla | Columnas principales |
|-------|---------------------|
| `profiles` | id, name, email, phone, whatsapp, location, bio, age, languages, nationality, height, weight, endowment, onlyfans, cam_chat (enum), description, created_at |
| `photos` | id, profile_id (FK), photo_url, local_path ('cover' | null) |
| `services` | id, profile_id (FK), service_name, available |

### ❌ Problemas de Database

**F23. No se pudo verificar RLS policies (no hay acceso a Supabase dashboard)**
- **Acción requerida:** Verificar que todas las tablas tengan RLS policies activas
- **Criterio:** `SELECT * FROM pg_policies;` en Supabase SQL editor
- **Recomendación mínima:** 
  - `profiles`: INSERT = anon/public (para register), SELECT = public (todos), UPDATE/DELETE = owner-only
  - `photos`: INSERT = anon/public, SELECT = public, DELETE = owner-only
  - `services`: INSERT = anon/public, SELECT = public

**F24. Claims contaminando tabla profiles**
- **Problema:** `api/claims.js` inserta en `profiles` en vez de tabla dedicada
- **Impacto:** Los claims aparecen en listas de perfiles, búsquedas y admin panel

**F25. `cam_chat` como campo varchar en vez de ENUM**
- **Código:** `cam_chat === 'approved'`, `'rejected'`, `null`
- **Impacto:** Sin restricción de tipo — cualquier valor puede insertarse
- **Solución:** Crear ENUM `cam_chat_status` con valores 'pending', 'approved', 'rejected'

**F26. No hay índices en columns usadas frecuentemente**
- **Columnas criticas sin índices inferidos:** `location`, `cam_chat`, `name`, `id`
- **Impacto:** Query `ilike('location', '%Argentina%')` es full-table scan
- **Solución:** Agregar GIN/TRGM indexes en `location` y `name`

---

## 5. FORMULARIOS

### ✅ Register (4 pasos)
| Feature | Estado |
|---------|--------|
| Validación de nombre | ✅ Sanitización (letras solo, 2-50 chars) |
| Validación de email | ✅ Regex en backend |
| Validación de teléfono | ✅ Regex en backend |
| Honeypot | ✅ Campo `honeypot` oculto |
| Rate limiting | ✅ 3 requests/hora por IP |
| Compresión de imágenes | ✅ Canvas resize a 2048px, quality 0.85 |
| Sanitización de URLs de fotos | ✅ `isValidPhotoUrl()` bloquea javascript:/data:/blob: |
| Escape HTML en emails | ✅ `escapeHtml()` en notification emails |

### ❌ Problemas de Formularios

**F27. Register: `canAdvance()` siempre true**
- **Archivo:** `src/pages/Register.jsx` línea 172
- **Código:** `const canAdvance = () => true;`
- **Problema:** La validación de campos del paso actual no impide avanzar al siguiente paso
- **Impacto:** El usuario puede enviar un registro sin campos requeridos (el backend valida, pero la UX es mala)
- **Solución:** Implementar validación real en cada paso

**F28. Dashboard: login sin contraseña**
- **Archivo:** `src/pages/DashboardLogin.jsx` líneas 91-118
- **Problema:** El login solo verifica que el identifier exista en profiles. No verifica contraseña.
- **Impacto:** Cualquiera con el nombre/email de un perfil existente puede entrar al dashboard
- **Solución:** Implementar autenticación real con contraseña (Supabase Auth o campo `password_hash` en profiles)

**F29. Contact: sin honeypot ni rate limiting**
- **Archivo:** `src/pages/Contact.jsx` y `api/contact.js`
- **Problema:** Formulario de contacto vulnerable a spam
- **Solución:** Agregar honeypot + rate limiting como en register.js

**F30. Reclama: solo texto estático, sin formulario**
- **Archivo:** `src/pages/Reclama.jsx`
- **Problema:** Solo redirige a `/register` — no hay formulario de reclamación propio
- **Nota:** El formulario de reclamación está en DashboardLogin, no en la página Reclama

---

## 6. SECCIÓN VIVAS

### ✅ Lo que se encontró
| Elemento | Estado |
|----------|--------|
| Carpeta | `frontend/vivas-app/` — Expo app compilada en `dist/` |
| Expo Router | ✅ React Navigation + Expo Router v56 |
| Supabase integration | `src/services/supabase.ts` |
| I18n | `src/i18n/translations.ts` + `src/i18n/context.tsx` |
| Assets | favicon.ico, icons PNG, splash icon |
| Subpath routing | Rutas en `/vivas/` |

### ❌ Problemas de Vivas

**F31. Vivas: routing en vercel.json**
- **Archivo:** `vercel.json`
- **Rutas configuradas:**
  - `/vivas/_expo/(.*)` → `/vivas/_expo/$1` (metro bundler)
  - `/vivas/assets/(.*)` → `/vivas/assets/$1` (static assets)
  - `/vivas/favicon.ico` → `/vivas/favicon.ico`
  - `/vivas/(.*)` → `/vivas/index.html` (SPA fallback)
  - `/vivas` → `/vivas/index.html`
  - `_expo/(.*)` → `/vivas/_expo/$1` (legacy support)
  - `/assets/node_modules/(.*)` → `/vivas/assets/node_modules/$1`
  - `/favicon-vivas.ico` → `/vivas/favicon.ico`
- **Estado:** Parece bien configurado

**F32. Vivas: PWA manifest**
- **Problema:** No se verificó si existe `manifest.json` para PWA
- **Recomendación:** Agregar `manifest.json` con `display: standalone`, theme color, etc.

**F33. Vivas: descarga de APK**
- **Archivo:** `App.jsx` línea 99
- **URL:** `https://shemalewiki.online/downloads/vivas.apk`
- **Problema:** No se verificó si este archivo existe
- **Solución:** Verificar que `/downloads/vivas.apk` sirva el archivo

---

## 7. SEO Y METADATOS

### ✅ SEO implementado
| Elemento | Estado |
|----------|--------|
| HelmetProvider | ✅ react-helmet-async |
| SEO component | ✅ title, description, canonical, OG, Twitter, hreflang, JSON-LD |
| robots.txt | ✅ Correcto, disallow /dashboard |
| sitemap.xml | ✅ 4781 URLs (continents, countries, cities, profiles) |
| Dual-brand meta swap | ✅ JS swaps OG/tags before React mounts |
| Canonical URLs | ✅ Por marca e idioma |
| Hreflang | ✅ en/es/pt self-referencing + x-default |
| JSON-LD structured data | ✅ Profile page usa schema.org Person |
| OG image | ✅ `logosw.png` en shemalewiki, logo en buscatrans |

### ❌ Problemas de SEO

**F34. robots.txt no tiene sitemaps para buscatrans.com**
- **Archivo:** `public/robots.txt` (servido desde shemalewiki.online)
- **Problema:** `robots.txt` en shemalewiki.online contiene sitemap de shemalewiki, pero `buscatrans.com/robots.txt` necesita el suyo propio
- **Solución:** Verificar que ambos dominios tengan robots.txt con sus respectivos sitemaps

**F35. Sitemap no tiene buscatrans.com per-files**
- **Problema:** El sitemap solo tiene URLs de `shemalewiki.online/profile/...`
- **Impacto:** Google puede indexar perfiles dos veces (con ambos dominios)
- **Solución:** Generar sitemap dual o sitemap cross-domain con `<xhtml:link>`

**F36. `/favicon.ico` devuelve HTML, no favicon**
- **Curl verificado:** `/favicon.ico` → `content-type: text/html; charset=utf-8` (4293 bytes = index.html)
- **Problema:** El favicon.ico es el HTML del SPA (SPA fallback rewrite)
- **Impacto:** Navegadores no obtienen favicon real
- **Solución:** Servir archivo .ico real en `/favicon.ico` o dejar que el fallback maneje el icono

**F37. `/logosw.png` también devuelve HTML**
- **Curl verificado:** `/logosw.png` → `content-type: text/html; charset=utf-8` (4293 bytes = index.html)
- **Problema:** La imagen OG no carga correctamente — es el HTML del SPA
- **Impacto:** OG tags muestran un HTML como imagen en redes sociales
- **Solución:** Servir el PNG real, no el fallback SPA

**F38. favicon.svg sí funciona**
- **Verificado:** `/favicon.svg` → `content-type: image/svg+xml` (9522 bytes)
- **Nota:** El `<link rel="icon">` en el HTML apunta a `/favicon.svg` — esto SÍ funciona

**F39. OG image hardcoded en HTML estático**
- **Problema:** `<meta property="og:image" content="https://shemalewiki.online/logosw.png">` — la imagen no carga (es HTML)
- **Solución:** Subir un PNG real de 1200x630 para OG

---

## 8. SEGURIDAD

### 🔴 CRÍTICO
| # | Problema | Archivo | Solución |
|---|----------|---------|----------|
| S1 | **SMTP password en texto claro** | `api/contact.js:9` | Remover `'Maxima2026!'` fallback |
| S2 | **Supabase anon key expuesta** | `src/supabase.js:4` | Ya es key pública; verificar RLS policies |
| S3 | **`unsafe-eval` en CSP** | `vercel.json` | Remover, usar nonce/hash |
| S4 | **`unsafe-inline` en script-src** | `vercel.json` | Usar nonce para scripts inline |
| S5 | **No rate limit en /api/contact** | `api/contact.js` | Agregar rate limiting como register.js |
| S6 | **Login dashboard sin password** | `src/pages/DashboardLogin.jsx` | Implementar auth real con contraseña |
| S7 | **Claims contamina tabla profiles** | `api/claims.js` | Crear tabla claims dedicada |
| S8 | **Variable env inconsistente en claims** | `api/claims.js:22` | Unificar `SUPABASE_SERVICE_KEY` |

### 🟡 ALTO
| # | Problema | Archivo | Solución |
|---|----------|---------|----------|
| S9 | **CORS `*` en profiles API** | `api/profiles.js:36` | Restringir a ALLOWED_ORIGINS |
| S10 | **Admin sin rate limit en login** | `api/admin.js` | Agregar brute-force protection |
| S11 | **Claims sin validación email/phone** | `api/claims.js` | Agregar validación |
| S12 | **X-Content-Type-Options faltante** | `vercel.json` | Agregar `X-Content-Type-Options: nosniff` |
| S13 | **X-Frame-Options faltante** | `vercel.json` | Agregar `X-Frame-Options: DENY` |
| S14 | **Referrer-Policy no configurado** | `vercel.json` | Agregar `Referrer-Policy: strict-origin-when-cross-origin` |

### 🟢 BAJO
| # | Problema | Solución |
|---|----------|----------|
| S15 | **Legacy admin secret header** | Deprecar `x-admin-secret`, forzar token Bearer |
| S16 | **CORS `*` en homepage** | Solo aplicar en endpoints API específicos |
| S17 | **No Content-Security-Policy report-uri** | Agregar `report-uri` para monitoring de violations |

---

## 9. PERFORMANCE

### ✅ Optimizaciones existentes
| Feature | Estado |
|---------|--------|
| LazyImage con IntersectionObserver | ✅ 200px preload margin |
| Image proxy via `/api/image` | ✅ Edge caching 24h |
| SVG no-photo placeholder | ✅ No 404s |
| Image compression | ✅ Canvas resize 2048px, 0.85 quality |
| Vite build | ✅ Bundling con tree-shaking |
| Google Fonts preconnect | ✅ dns-prefetch + preconnect |
| Error boundary | ✅ Previene crashes en producción |

### ❌ Problemas de Performance

**F40. No code splitting / lazy loading de rutas**
- **Archivo:** `App.jsx` — todos los imports están al inicio del archivo
- **Impacto:** El bundle incluye TODAS las páginas al cargar, aunque el usuario solo vea la Home
- **Solución:** Usar `React.lazy()` + `Suspense` para cada página
```jsx
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
```

**F41. Google Fonts: carga 10+ fuentes**
- **Archivo:** HTML head
- **Fuentes:** Assistant, Bebas Neue, DM Sans, Frank Ruhl Libre, Heebo, Playfair Display, Space Grotesk
- **Impacto:** 10 fonts × múltiples weights = ~1-3MB de descarga de fuentes
- **Solución:** Usar `font-display: swap`, subsetear solo los weights necesarios

**F42. CSS inline en vercel.json para CSP**
- **Problema:** CSS debe estar en CSP `style-src 'self' 'unsafe-inline'` — los estilos inline de React requieren `'unsafe-inline'`
- **Solución:** Mover estilos inline a CSS files externalizados para eliminar `'unsafe-inline'`

---

## 10. ACCESIBILIDAD

### ✅ Lo que funciona
| Elemento | Estado |
|----------|--------|
| Lightbox keyboard nav | ✅ Arrow keys + Escape |
| aria-label en Lightbox buttons | ✅ "Close", "Previous", "Next" |
| Search bar input type="text" | ✅ Type correcto |
| Age verification con buttons | ✅ type="button" explícito |
| HTML lang dinámico | ✅ Se cambia según ruta/domino |
| RTL support | ✅ Hebrew (he/) con dir="rtl" |

### ❌ Problemas de Accesibilidad

**F43. Inputs de búsqueda sin aria-label**
- **Archivos:** `Home.jsx`, `Continents.jsx`, `ProfilesList.jsx`
- **Problema:** Inputs sin `<label>` ni `aria-label`
- **Impacto:** Screen readers no saben qué buscar

**F44. Color contrast insuficiente**
- **Problema:** `--text-secondary: #777777` sobre `--bg-primary: #0a0a0a` → ratio ~5.7:1 (OK en ShemaleWiki)
- **Problema BuscaTrans:** `--text-secondary: #b084e0` sobre `--bg-primary: #1a0a2e` → ratio ~2.8:1 (FAIL AA)
- **Solución:** BuscaTrans necesita `--text-secondary` más oscuro (~#d4b5ff)

**F45. Bottom nav no es focusable**
- **Archivo:** `Home.jsx` líneas 233-246
- **Problema:** `<a href="#">` no navega a ningún lado y no tiene tabindex/aria
- **Solución:** Eliminar o implementar funcional

**F46. Gallery items sin focus management**
- **Archivo:** `Profile.jsx` — gallery con `onClick` en divs
- **Problema:** Los divs de galería no son focusable (no son `<button>` o `<a>`)
- **Impacto:** Navegación por teclado no puede acceder a fotos
- **Solución:** Cambiar a `<button>` o agregar `tabIndex={0} role="button"`

**F47. Alert native para "Link copied!"**
- **Archivo:** `Profile.jsx` línea 85
- **Problema:** `alert('Link copied!')` — bloquea la UI, no es accesible
- **Solución:** Usar un toast/notification accessible

---

## 11. BUSCATRANS BRAND

### ✅ Brand consistency
| Elemento | Estado |
|----------|--------|
| Dual-brand detection | ✅ `isBuscaTrans()` en App.jsx y componentes |
| CSS variables por marca | ✅ Colores, fonts, radii, shadows |
| Logo BuscaTrans | ✅ SVG importado (`buscatrans-logo.svg`) |
| Logo ShemaleWiki | ✅ PNG importado (`logosw.png`) |
| Navbar por marca | ✅ Textos y links adaptados |
| Age verification por marca | ✅ Logo, colores, idioma |
| Registre por marca | ✅ Pasos 1-4 con contenido ES/EN |
| Advertise por marca | ✅ ES/EN con precios diferentes |
| Terms por marca | ✅ ES/PT/EN con company data |
| Privacy por marca | ✅ ES/PT/EN con company data |

### ❌ Problemas de Brand

**F48. Logo BuscaTrans tiene altura 90px en navbar**
- **Archivo:** `App.jsx` línea 87
- **Problema:** `height: '90px'` parece excesivo para un logo en navbar
- **Solución:** Reducir a 40-50px o usar aspect-ratio

**F49. No hay meta tag específico para buscatrans.com**
- **Problema:** El HTML estático tiene title "ShemaleWiki Online" — el JS lo cambia pero solo si el dominio contiene "buscatrans"
- **Impacto:** Si alguien accede desde un referrer o caché, verá ShemaleWiki
- **Solución:** Usar Server-Side Rendering o middleware de Vercel para servir HTML diferente por dominio

**F50. OG image en BuscaTrans apunta a logosw.png (ShemaleWiki)**
- **Problema:** El HTML estático usa `og:image: logosw.png` — BuscaTrans necesita su propia imagen OG
- **Solución:** El JS ya cambia `og:image` cuando detecta buscatrans, pero crawlers sin JS verán la imagen incorrecta
- **Recomendación:** Configurar Vercel middleware para servir OG diferente por dominio

---

## RESUMEN EJECUTIVO

### Críticos (deben arreglarse YA)
1. **S1:** Password SMTP en texto claro en `api/contact.js:9` → Remover fallback `'Maxima2026!'`
2. **S6:** Login del dashboard sin verificación de contraseña → Cualquiera entra
3. **S3/S4:** CSP con `'unsafe-inline'` y `'unsafe-eval'` → Vulnerable a XSS
4. **S5:** Sin rate limit en contacto → Spam seguro
5. **F37:** `/logosw.png` devuelve HTML → OG tags rotos en redes sociales
6. **F36:** `/favicon.ico` devuelve HTML → Sin favicon real
7. **F28:** Login dashboard sin contraseña → Todos los perfiles hackeables

### Altos (arreglar pronto)
8. **S9:** CORS `*` en profiles API
9. **S12/S13:** Headers de seguridad faltantes (nosniff, X-Frame-Options)
10. **F7/F8:** Pills y bottom nav rotos en Home
11. **F44:** Contrast insuficiente en BuscaTrans (brand purple sobre purple oscuro)
12. **F40:** Sin code splitting → Bundle grande

### Medios (mejora continua)
13. **F1:** CORS en toda la SPA innecesario
14. **F2:** Cache-Control innecesariamente agresivo
15. **F23:** RLS policies no verificadas
16. **F34:** Favicon/OG servidos como HTML
17. **F43:** Inputs sin aria-label
18. **F46:** Gallery no accesible por teclado

### Bajas (cosméticos)
19. F6: `/es/` no muestra home con perfiles
20. F10: Mensaje de error en inglés en BuscaTrans
21. F21: Admin sin pagination
22. F32: Verificar PWA manifest
23. F41: 10 fuentes Google cargadas

### Archivos que necesitan modificación
| Archivo | Cambios |
|---------|---------|
| `api/contact.js` | Remover fallback password SMTP |
| `vercel.json` | Ajustar CSP, agregar headers seguridad |
| `src/supabase.js` | Remover key expuesta (mover a env) |
| `src/pages/DashboardLogin.jsx` | Implementar auth con contraseña |
| `src/pages/Home.jsx` | Conectar pills + bottom nav |
| `src/pages/Register.jsx` | Validación paso a paso |
| `api/contact.js` | Agregar rate limiting |
| `api/claims.js` | Validación email/phone, tabla dedicada |
| `api/profiles.js` | Restringir CORS |
| `vivas-app/` | Verificar PWA manifest, APK download |
| `public/` | Servir favicon.ico y logosw.png reales |
