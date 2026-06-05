import { DEPILACION, REJUVENECIMIENTO, MANCHAS, VASCULAR, MELASMA, ACNE } from '../data/parameters';

const TABLES = {
  depilacion:       DEPILACION,
  rejuvenecimiento: REJUVENECIMIENTO,
  manchas:          MANCHAS,
  vascular:         VASCULAR,
  melasma:          MELASMA,
  acne:             ACNE,
};

// Notas por zona de tratamiento
const AREA_NOTES = {
  // depilacion
  labio_superior: 'Zona facial sensible. Usa el spot más pequeño disponible.',
  menton_patilla: 'Zona facial. Precaución cerca de la línea mandibular.',
  axila:          'Piel más sensible. Iniciar en el rango bajo de fluencia.',
  bikini:         'Zona sensible. El vello de la línea interna puede ser más grueso.',
  piernas:        'Zona extensa. El vello suele ser más grueso. Spot grande posible.',
  brazos:         'Zona estándar. Vello generalmente fino en antebrazo.',
  espalda:        'Zona extensa. Puede requerir múltiples pasadas.',
  // rejuvenecimiento / manchas / melasma / acne
  cara_completa:  'Proteger cejas, labios y contorno de ojos. Evitar zona periocular.',
  cuello:         'Piel delgada y sensible. Iniciar con fluencia mínima.',
  escote:         'Zona de fotoenvejecimiento frecuente. Precaución en piel muy seca.',
  manos:          'Piel fina. Evitar zona de tendones y articulaciones.',
  frente:         'Evitar línea del cabello. Proteger zona periocular.',
  mejillas:       'Zona estándar. Verificar ausencia de rellenos dérmicos recientes.',
  labio_sup:      'Zona muy sensible. Usar spot pequeño. Paciente puede sentir mayor calor.',
  // vascular
  cara:           'Proteger zona periocular. Usar goggles certificados. Spot pequeño en nariz.',
  nariz:          'Zona de alta sensibilidad vascular. Spot muy pequeño. Fluencia baja.',
  otro:           'Evaluar características de la zona antes de aplicar.',
};

// Intervalos entre sesiones por tratamiento
export const SESSION_INTERVALS = {
  depilacion:       { face: '4–5 sem.', body: '6–8 sem.', sessions: '6–10 sesiones' },
  rejuvenecimiento: { face: '3–4 sem.', body: '4–6 sem.', sessions: '4–6 sesiones' },
  manchas:          { face: '3–4 sem.', body: '4–6 sem.', sessions: '2–4 sesiones' },
  vascular:         { face: '4–6 sem.', body: '6–8 sem.', sessions: '2–5 sesiones' },
  melasma:          { face: '4–6 sem.', body: '—',        sessions: '4–8 sesiones (mantenimiento mensual)' },
  acne:             { face: '2–3 sem.', body: '2–3 sem.', sessions: '4–8 sesiones' },
};

// Pasos del protocolo por tratamiento
export const PROTOCOLS = {
  depilacion: [
    'Rasurar la zona 24h antes. No depilar con cera ni pinzas.',
    'Limpiar y secar la zona. No aplicar sobre piel bronceada o irritada.',
    'Aplicar gel de contacto frío en toda la zona.',
    'Ingresar parámetros. Comenzar por la fluencia MÍNIMA.',
    'Realizar 2 disparos de prueba. Esperar 5 min y evaluar respuesta.',
    'Aplicar crema calmante. Protector solar SPF 50+ obligatorio.',
  ],
  rejuvenecimiento: [
    'Limpiar el rostro sin maquillaje ni cremas.',
    'Aplicar gel de contacto frío uniformemente.',
    'Ingresar parámetros. Realizar disparo de prueba en zona poco visible.',
    'Aplicar en dirección cráneo-caudal con pasos superpuestos al 20%.',
    'Finalizar con sérum antioxidante y protector solar SPF 50+.',
    'Evitar exposición solar directa 4 semanas post-sesión.',
  ],
  manchas: [
    'Limpiar la zona. No aplicar sobre lesiones con signos de malignidad.',
    'Aplicar gel de contacto frío.',
    'Ingresar parámetros. Comenzar con disparo de prueba sobre una mancha pequeña.',
    'Esperar 5–10 min para observar eritema perimacular (respuesta normal).',
    'Aplicar sobre todas las lesiones marcadas. No solapar disparos.',
    'Post-tratamiento: evitar sol, aplicar SPF 50+. La mancha oscurecerá antes de caer (7–14 días).',
  ],
  vascular: [
    'Limpiar la zona. Fotografiar lesiones antes del tratamiento.',
    'Aplicar gel de contacto frío. Paciente debe usar goggles certificados.',
    'Ingresar parámetros. Realizar disparo de prueba en vaso pequeño.',
    'La respuesta normal es espasmo inmediato del vaso (desaparece transitoriamente).',
    'Aplicar a lo largo de cada vaso en sentido distal-proximal.',
    'Post-tratamiento: puede aparecer eritema o pequeña equimosis. Aplicar cold pack.',
  ],
  melasma: [
    'Limpiar el rostro. Evaluar tipo de melasma bajo luz de Wood si disponible.',
    'NUNCA tratar piel bronceada. Suspender retinoides 1 semana antes.',
    'Aplicar gel de contacto frío. Usar filtro de longitud de onda larga.',
    'Disparar con overlap mínimo. Evitar sobrecalentar la zona.',
    'Post-tratamiento: aplicar serum aclarante + SPF 50+. No exponerse al sol.',
    'Combinación con hidroquinona, ácido tranexámico o vitamina C potencia resultados.',
  ],
  acne: [
    'Limpiar la zona sin presionar lesiones activas.',
    'Aplicar gel de contacto frío.',
    'Ingresar parámetros. Aplicar sobre toda la zona afectada.',
    'Evitar pasar sobre quistes profundos sin evaluar primero.',
    'Post-tratamiento: puede aparecer eritema transitorio (normal). Aplicar calmante.',
    'Evitar maquillaje 24h. SPF 50+ durante el tratamiento.',
  ],
};

function applyAgeModifier(params, age) {
  if (!params || params.efficacy === 'no_recomendado') return params;
  const ageNum = parseInt(age, 10);
  if (isNaN(ageNum)) return params;

  const result = { ...params, fluence: [...params.fluence] };
  const warnings = params.warning ? [params.warning] : [];

  if (ageNum < 18) {
    return {
      ...result, fluence: null, pulseWidth: null, pulses: null, delay: null, filter: null,
      efficacy: 'no_recomendado',
      warning: 'Paciente menor de 18 años. Tratamiento contraindicado sin consentimiento legal del tutor.',
    };
  }
  if (ageNum > 65) {
    result.fluence[0] = Math.round(result.fluence[0] * 0.88);
    result.fluence[1] = Math.round(result.fluence[1] * 0.88);
    warnings.push('Paciente mayor de 65 años: piel más delgada. Fluencia reducida ~12%.');
  }
  result.warning = warnings.length > 0 ? warnings.join(' ') : null;
  return result;
}

function applyDensityModifier(params, density) {
  if (!params || params.efficacy === 'no_recomendado' || !density) return params;
  const result = { ...params, fluence: [...params.fluence] };
  if (density === 'fino') {
    result.fluence[0] = Math.round(result.fluence[0] * 1.10);
    result.fluence[1] = Math.round(result.fluence[1] * 1.10);
  } else if (density === 'grueso') {
    result.fluence[0] = Math.round(result.fluence[0] * 0.90);
    result.fluence[1] = Math.round(result.fluence[1] * 0.90);
  }
  return result;
}

export function calculateParameters(diagnosis) {
  const { treatment, fitzpatrick, age, area,
          hairColor, hairDensity,           // depilacion
          lesionColor,                       // manchas
          vesselSize,                        // vascular
          melasmaType,                       // melasma
          acneGrade,                         // acne
        } = diagnosis;

  const table = TABLES[treatment];
  if (!table) return null;

  const byFitz = table[fitzpatrick];
  if (!byFitz) return null;

  let base;
  if (treatment === 'depilacion')       base = byFitz[hairColor];
  else if (treatment === 'rejuvenecimiento') base = byFitz;
  else if (treatment === 'manchas')     base = byFitz[lesionColor];
  else if (treatment === 'vascular')    base = byFitz[vesselSize];
  else if (treatment === 'melasma')     base = byFitz[melasmaType];
  else if (treatment === 'acne')        base = byFitz[acneGrade];

  if (!base) return null;

  let result = { ...base };
  if (result.fluence) result = { ...result, fluence: [...result.fluence] };

  // Modificadores
  if (treatment === 'depilacion') result = applyDensityModifier(result, hairDensity);
  result = applyAgeModifier(result, age);

  result.areaNotes = AREA_NOTES[area] || null;
  result.protocol  = PROTOCOLS[treatment] || [];
  result.intervals = SESSION_INTERVALS[treatment] || null;

  return result;
}

export function getEfficacyInfo(efficacy) {
  const map = {
    excelente:       { label: 'Excelente',        color: '#00d4aa', icon: '★★★★★' },
    bueno:           { label: 'Bueno',             color: '#4CAF50', icon: '★★★★☆' },
    moderado:        { label: 'Moderado',          color: '#FFC107', icon: '★★★☆☆' },
    limitado:        { label: 'Limitado',          color: '#FF9800', icon: '★★☆☆☆' },
    no_recomendado:  { label: 'No recomendado',    color: '#F44336', icon: '✕' },
  };
  return map[efficacy] || map.no_recomendado;
}
