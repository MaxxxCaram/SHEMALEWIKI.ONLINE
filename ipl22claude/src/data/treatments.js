// Catálogo de tratamientos IPL M22
// Cada tratamiento define sus inputs específicos y sus parámetros por fototipo

export const TREATMENTS = [
  {
    id: 'depilacion',
    label: 'Depilación',
    icon: '✦',
    desc: 'Reducción permanente del vello',
    color: '#00d4aa',
  },
  {
    id: 'rejuvenecimiento',
    label: 'Rejuvenecimiento',
    icon: '◈',
    desc: 'Fotorejuvenecimiento facial y corporal',
    color: '#a78bfa',
  },
  {
    id: 'manchas',
    label: 'Manchas / Lentigos',
    icon: '◉',
    desc: 'Manchas solares, lentigos, efélides',
    color: '#f59e0b',
  },
  {
    id: 'vascular',
    label: 'Telangiectasia',
    icon: '❋',
    desc: 'Capilares, rosácea, lesiones vasculares',
    color: '#f87171',
  },
  {
    id: 'melasma',
    label: 'Melasma',
    icon: '◎',
    desc: 'Hiperpigmentación hormonal / melasma',
    color: '#60a5fa',
  },
  {
    id: 'acne',
    label: 'Acné activo',
    icon: '◆',
    desc: 'Tratamiento de acné inflamatorio',
    color: '#34d399',
  },
];

export const FITZPATRICK = {
  1: { label: 'Tipo I', desc: 'Muy clara, siempre se quema, nunca broncea', color: '#FDDBB4', textColor: '#333' },
  2: { label: 'Tipo II', desc: 'Clara, se quema fácilmente, broncea poco', color: '#F5C798', textColor: '#333' },
  3: { label: 'Tipo III', desc: 'Media, a veces se quema, broncea gradual', color: '#E8A87C', textColor: '#333' },
  4: { label: 'Tipo IV', desc: 'Morena, rara vez se quema, siempre broncea', color: '#C68642', textColor: '#fff' },
  5: { label: 'Tipo V', desc: 'Marrón oscura, muy rara vez se quema', color: '#8D5524', textColor: '#fff' },
  6: { label: 'Tipo VI', desc: 'Muy oscura, nunca se quema', color: '#4A2912', textColor: '#fff' },
};

// ── Inputs específicos por tratamiento ──────────────────────────────────────

export const HAIR_COLORS = [
  { id: 'negro',         label: 'Negro',              color: '#1a1a1a', textColor: '#fff' },
  { id: 'castano_oscuro',label: 'Castaño oscuro',     color: '#3B1F0F', textColor: '#fff' },
  { id: 'castano',       label: 'Castaño',            color: '#7B4F2E', textColor: '#fff' },
  { id: 'rubio_oscuro',  label: 'Rubio oscuro',       color: '#B8860B', textColor: '#fff' },
  { id: 'rubio_claro',   label: 'Rubio claro / Rojo', color: '#E8C97A', textColor: '#333' },
  { id: 'gris_blanco',   label: 'Gris / Blanco',      color: '#D0D0D0', textColor: '#333' },
];

export const HAIR_DENSITY = [
  { id: 'fino',   label: 'Fino',   desc: 'Vello delgado y escaso' },
  { id: 'normal', label: 'Normal', desc: 'Densidad media' },
  { id: 'grueso', label: 'Grueso', desc: 'Vello grueso y abundante' },
];

export const LESION_COLORS = [
  { id: 'muy_oscura',  label: 'Muy oscura',   desc: 'Marrón intenso / negro' },
  { id: 'oscura',      label: 'Oscura',        desc: 'Marrón definido' },
  { id: 'media',       label: 'Media',         desc: 'Marrón claro / café' },
  { id: 'clara',       label: 'Clara',         desc: 'Beige / marrón muy tenue' },
];

export const VESSEL_SIZES = [
  { id: 'fino',   label: 'Fino',   desc: 'Capilares finos (< 0.5 mm)' },
  { id: 'medio',  label: 'Medio',  desc: 'Vasos medianos (0.5–1 mm)' },
  { id: 'grueso', label: 'Grueso', desc: 'Vasos gruesos (> 1 mm)' },
];

export const MELASMA_TYPES = [
  { id: 'epidermico',  label: 'Epidérmico', desc: 'Superficial, bordes definidos, acentúa bajo luz UV' },
  { id: 'dermico',     label: 'Dérmico',    desc: 'Profundo, bordes difusos, no cambia bajo UV' },
  { id: 'mixto',       label: 'Mixto',      desc: 'Combinación epidérmico y dérmico' },
];

export const ACNE_GRADES = [
  { id: 'leve',     label: 'Leve',     desc: 'Pápulas y pústulas escasas' },
  { id: 'moderado', label: 'Moderado', desc: 'Múltiples pápulas y pústulas' },
  { id: 'severo',   label: 'Severo',   desc: 'Nódulos, quistes, inflamación extensa' },
];

export const TREATMENT_AREAS = {
  depilacion: [
    { id: 'labio_superior', label: 'Labio superior' },
    { id: 'menton_patilla', label: 'Mentón / Patilla' },
    { id: 'axila',          label: 'Axila' },
    { id: 'bikini',         label: 'Bikini / Ingles' },
    { id: 'piernas',        label: 'Piernas' },
    { id: 'brazos',         label: 'Brazos' },
    { id: 'espalda',        label: 'Espalda / Pecho' },
    { id: 'otro',           label: 'Otra zona' },
  ],
  rejuvenecimiento: [
    { id: 'cara_completa',  label: 'Cara completa' },
    { id: 'cuello',         label: 'Cuello' },
    { id: 'escote',         label: 'Escote' },
    { id: 'manos',          label: 'Manos' },
    { id: 'otro',           label: 'Otra zona' },
  ],
  manchas: [
    { id: 'cara',    label: 'Cara' },
    { id: 'manos',   label: 'Manos' },
    { id: 'escote',  label: 'Escote' },
    { id: 'espalda', label: 'Espalda' },
    { id: 'otro',    label: 'Otra zona' },
  ],
  vascular: [
    { id: 'cara',    label: 'Cara / Rosácea' },
    { id: 'piernas', label: 'Piernas' },
    { id: 'nariz',   label: 'Nariz' },
    { id: 'otro',    label: 'Otra zona' },
  ],
  melasma: [
    { id: 'cara_completa', label: 'Cara completa' },
    { id: 'frente',        label: 'Frente' },
    { id: 'mejillas',      label: 'Mejillas' },
    { id: 'labio_sup',     label: 'Labio superior' },
    { id: 'otro',          label: 'Otra zona' },
  ],
  acne: [
    { id: 'cara_completa', label: 'Cara completa' },
    { id: 'frente',        label: 'Frente' },
    { id: 'mejillas',      label: 'Mejillas' },
    { id: 'espalda',       label: 'Espalda' },
    { id: 'otro',          label: 'Otra zona' },
  ],
};
