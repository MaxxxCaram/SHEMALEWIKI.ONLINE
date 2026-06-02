// IPL M22 China — tabla de parámetros estándar para depilación
// Basada en escala Fitzpatrick + color/densidad del vello
// Fuente: protocolos clínicos IPL estándar (adaptados para M22 China)

export const FITZPATRICK = {
  1: { label: 'Tipo I', desc: 'Muy clara, siempre se quema, nunca broncea', color: '#FDDBB4', textColor: '#333' },
  2: { label: 'Tipo II', desc: 'Clara, se quema fácilmente, broncea poco', color: '#F5C798', textColor: '#333' },
  3: { label: 'Tipo III', desc: 'Media, a veces se quema, broncea gradual', color: '#E8A87C', textColor: '#333' },
  4: { label: 'Tipo IV', desc: 'Morena, rara vez se quema, siempre broncea', color: '#C68642', textColor: '#fff' },
  5: { label: 'Tipo V', desc: 'Marrón oscura, muy rara vez se quema', color: '#8D5524', textColor: '#fff' },
  6: { label: 'Tipo VI', desc: 'Muy oscura, nunca se quema', color: '#4A2912', textColor: '#fff' },
};

export const HAIR_COLORS = [
  { id: 'negro', label: 'Negro', color: '#1a1a1a', textColor: '#fff' },
  { id: 'castano_oscuro', label: 'Castaño oscuro', color: '#3B1F0F', textColor: '#fff' },
  { id: 'castano', label: 'Castaño', color: '#7B4F2E', textColor: '#fff' },
  { id: 'rubio_oscuro', label: 'Rubio oscuro', color: '#B8860B', textColor: '#fff' },
  { id: 'rubio_claro', label: 'Rubio claro / Rojo', color: '#E8C97A', textColor: '#333' },
  { id: 'gris_blanco', label: 'Gris / Blanco', color: '#D0D0D0', textColor: '#333' },
];

export const HAIR_DENSITY = [
  { id: 'fino', label: 'Fino', desc: 'Vello delgado y escaso' },
  { id: 'normal', label: 'Normal', desc: 'Densidad media' },
  { id: 'grueso', label: 'Grueso', desc: 'Vello grueso y abundante' },
];

export const TREATMENT_AREAS = [
  { id: 'labio_superior', label: 'Labio superior' },
  { id: 'menton_patilla', label: 'Mentón / Patilla' },
  { id: 'axila', label: 'Axila' },
  { id: 'bikini', label: 'Bikini / Ingles' },
  { id: 'piernas', label: 'Piernas' },
  { id: 'brazos', label: 'Brazos' },
  { id: 'espalda', label: 'Espalda / Pecho' },
  { id: 'otro', label: 'Otra zona' },
];

// Tabla base: [fitzpatrick][hairColor] → parámetros
// fluence: [min, max] J/cm²
// pulseWidth: ms
// pulses: cantidad de pulsos
// delay: ms entre pulsos (null = pulso único)
// filter: filtro recomendado nm
// efficacy: 'excelente' | 'bueno' | 'moderado' | 'limitado' | 'no_recomendado'
// warning: texto de advertencia adicional

const PARAMS_TABLE = {
  1: {
    negro: {
      fluence: [22, 26], pulseWidth: 10, pulses: 1, delay: null,
      filter: '530 nm', efficacy: 'excelente',
    },
    castano_oscuro: {
      fluence: [20, 24], pulseWidth: 12, pulses: 1, delay: null,
      filter: '530 nm', efficacy: 'excelente',
    },
    castano: {
      fluence: [18, 22], pulseWidth: 15, pulses: 1, delay: null,
      filter: '530 nm', efficacy: 'bueno',
    },
    rubio_oscuro: {
      fluence: [20, 26], pulseWidth: 18, pulses: 2, delay: 20,
      filter: '530 nm', efficacy: 'moderado',
      warning: 'Resultado variable. Evaluar respuesta tras primera sesión.',
    },
    rubio_claro: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Vello rubio claro/rojo/gris carece de melanina suficiente. IPL no es eficaz.',
    },
    gris_blanco: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Vello blanco/gris no absorbe la luz IPL. Tratamiento contraindicado.',
    },
  },
  2: {
    negro: {
      fluence: [20, 24], pulseWidth: 10, pulses: 1, delay: null,
      filter: '530 nm', efficacy: 'excelente',
    },
    castano_oscuro: {
      fluence: [18, 22], pulseWidth: 12, pulses: 1, delay: null,
      filter: '530 nm', efficacy: 'excelente',
    },
    castano: {
      fluence: [16, 20], pulseWidth: 15, pulses: 1, delay: null,
      filter: '530 nm', efficacy: 'bueno',
    },
    rubio_oscuro: {
      fluence: [18, 24], pulseWidth: 18, pulses: 2, delay: 20,
      filter: '530 nm', efficacy: 'moderado',
      warning: 'Resultado variable. Evaluar respuesta tras primera sesión.',
    },
    rubio_claro: {
      fluence: [22, 28], pulseWidth: 20, pulses: 2, delay: 25,
      filter: '530 nm', efficacy: 'limitado',
      warning: 'Eficacia muy limitada. Informar al paciente. Iniciar con fluencia mínima.',
    },
    gris_blanco: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Vello blanco/gris no absorbe la luz IPL. Tratamiento contraindicado.',
    },
  },
  3: {
    negro: {
      fluence: [16, 20], pulseWidth: 15, pulses: 2, delay: 15,
      filter: '560 nm', efficacy: 'excelente',
    },
    castano_oscuro: {
      fluence: [14, 18], pulseWidth: 18, pulses: 2, delay: 15,
      filter: '560 nm', efficacy: 'excelente',
    },
    castano: {
      fluence: [14, 18], pulseWidth: 20, pulses: 2, delay: 20,
      filter: '560 nm', efficacy: 'bueno',
    },
    rubio_oscuro: {
      fluence: [16, 20], pulseWidth: 25, pulses: 2, delay: 25,
      filter: '560 nm', efficacy: 'moderado',
      warning: 'Monitorear respuesta de la piel. Aplicar gel de contacto frío.',
    },
    rubio_claro: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Combinación de piel media y vello claro: riesgo de quemadura sin eficacia. Contraindicado.',
    },
    gris_blanco: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Vello blanco/gris no absorbe la luz IPL. Tratamiento contraindicado.',
    },
  },
  4: {
    negro: {
      fluence: [14, 18], pulseWidth: 20, pulses: 2, delay: 20,
      filter: '590 nm', efficacy: 'bueno',
      warning: 'Realizar patch test 24-48h antes. Usar filtro de corte alto.',
    },
    castano_oscuro: {
      fluence: [12, 16], pulseWidth: 25, pulses: 2, delay: 25,
      filter: '590 nm', efficacy: 'moderado',
      warning: 'Precaución. Iniciar con fluencia mínima. Riesgo de hiperpigmentación post-inflamatoria.',
    },
    castano: {
      fluence: [12, 15], pulseWidth: 30, pulses: 3, delay: 30,
      filter: '590 nm', efficacy: 'moderado',
      warning: 'Alto riesgo de hiperpigmentación. Patch test obligatorio. Evaluar con cautela.',
    },
    rubio_oscuro: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Piel oscura + vello claro: alto riesgo de quemadura sin resultado. No recomendado.',
    },
    rubio_claro: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Contraindicado. Alto riesgo de daño tisular.',
    },
    gris_blanco: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Contraindicado.',
    },
  },
  5: {
    negro: {
      fluence: [10, 14], pulseWidth: 30, pulses: 3, delay: 35,
      filter: '615 nm', efficacy: 'moderado',
      warning: 'PRECAUCIÓN ALTA. Patch test obligatorio. Iniciar siempre con fluencia mínima. Riesgo elevado de hiperpigmentación y quemadura.',
    },
    castano_oscuro: {
      fluence: [10, 12], pulseWidth: 35, pulses: 3, delay: 40,
      filter: '640 nm', efficacy: 'limitado',
      warning: 'Riesgo muy alto. Solo profesionales con experiencia en piel oscura. Patch test obligatorio. Considerar láser Nd:YAG como alternativa.',
    },
    castano: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'No recomendado para este fototipo. Derivar a láser Nd:YAG 1064nm.',
    },
    rubio_oscuro: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Contraindicado. Riesgo severo de quemadura.',
    },
    rubio_claro: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Contraindicado.',
    },
    gris_blanco: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Contraindicado.',
    },
  },
  6: {
    negro: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Fototipo VI: IPL contraindicado. Riesgo severo de quemadura e hiperpigmentación. Derivar a láser Nd:YAG 1064nm.',
    },
    castano_oscuro: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Fototipo VI: IPL contraindicado.',
    },
    castano: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Fototipo VI: IPL contraindicado.',
    },
    rubio_oscuro: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Fototipo VI: IPL contraindicado.',
    },
    rubio_claro: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Fototipo VI: IPL contraindicado.',
    },
    gris_blanco: {
      fluence: null, pulseWidth: null, pulses: null, delay: null,
      filter: null, efficacy: 'no_recomendado',
      warning: 'Fototipo VI: IPL contraindicado.',
    },
  },
};

export default PARAMS_TABLE;
