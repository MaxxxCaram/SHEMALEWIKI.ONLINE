import PARAMS_TABLE from '../data/parameters';

// Aplica modificadores de densidad y edad sobre la fluencia base
function applyModifiers(baseParams, density, age) {
  if (!baseParams || baseParams.efficacy === 'no_recomendado') return baseParams;

  const result = { ...baseParams, fluence: [...baseParams.fluence] };
  const warnings = baseParams.warning ? [baseParams.warning] : [];

  // Modificador por densidad del vello
  if (density === 'fino') {
    result.fluence[0] = Math.round(result.fluence[0] * 1.1);
    result.fluence[1] = Math.round(result.fluence[1] * 1.1);
  } else if (density === 'grueso') {
    result.fluence[0] = Math.round(result.fluence[0] * 0.9);
    result.fluence[1] = Math.round(result.fluence[1] * 0.9);
  }

  // Modificador por edad
  const ageNum = parseInt(age, 10);
  if (!isNaN(ageNum)) {
    if (ageNum < 18) {
      return {
        ...result,
        fluence: null,
        pulseWidth: null,
        pulses: null,
        delay: null,
        filter: null,
        efficacy: 'no_recomendado',
        warning: 'Paciente menor de 18 años. Tratamiento contraindicado sin consentimiento legal del tutor. Consultar regulaciones locales.',
      };
    }
    if (ageNum > 65) {
      result.fluence[0] = Math.round(result.fluence[0] * 0.88);
      result.fluence[1] = Math.round(result.fluence[1] * 0.88);
      warnings.push('Paciente mayor de 65 años: piel más delgada. Fluencia reducida 10-12%. Monitorear respuesta.');
    }
  }

  result.warning = warnings.length > 0 ? warnings.join(' ') : null;
  return result;
}

// Notas específicas por zona de tratamiento
const AREA_NOTES = {
  labio_superior: 'Zona facial sensible. Usa el spot más pequeño disponible. Evitar área del labio rojo.',
  menton_patilla: 'Zona facial. Precaución cerca de la línea mandibular. Spot pequeño.',
  axila: 'Piel más sensible. Iniciar en el rango bajo de fluencia.',
  bikini: 'Zona sensible. Iniciar con fluencia mínima. El vello de la línea interna puede ser más grueso.',
  piernas: 'Zona extensa. El vello suele ser más grueso. Spot grande posible.',
  brazos: 'Zona estándar. Vello generalmente fino en antebrazo.',
  espalda: 'Zona extensa. Puede requerir múltiples pasadas. Spot grande recomendado.',
  otro: 'Evaluar características de la zona específica antes de aplicar.',
};

export function calculateParameters({ fitzpatrick, hairColor, hairDensity, age, area }) {
  const baseParams = PARAMS_TABLE[fitzpatrick]?.[hairColor];
  if (!baseParams) return null;

  const result = applyModifiers(baseParams, hairDensity, age);
  result.areaNotes = AREA_NOTES[area] || null;

  return result;
}

export function getEfficacyInfo(efficacy) {
  const map = {
    excelente: { label: 'Excelente', color: '#00d4aa', icon: '★★★★★' },
    bueno: { label: 'Bueno', color: '#4CAF50', icon: '★★★★☆' },
    moderado: { label: 'Moderado', color: '#FFC107', icon: '★★★☆☆' },
    limitado: { label: 'Limitado', color: '#FF9800', icon: '★★☆☆☆' },
    no_recomendado: { label: 'No recomendado', color: '#F44336', icon: '✕' },
  };
  return map[efficacy] || map.no_recomendado;
}
