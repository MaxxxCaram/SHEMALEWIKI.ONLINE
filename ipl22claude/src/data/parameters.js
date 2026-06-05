// ── PARÁMETROS IPL M22 por tratamiento ────────────────────────────────────
// Fuente: protocolos clínicos estándar adaptados para IPL M22 China
// Estructura: { fluence:[min,max], pulseWidth, pulses, delay, filter, efficacy, warning }

// ── 1. DEPILACIÓN ─────────────────────────────────────────────────────────
export const DEPILACION = {
  1: {
    negro:         { fluence:[22,26], pulseWidth:10, pulses:1, delay:null, filter:'530 nm', efficacy:'excelente' },
    castano_oscuro:{ fluence:[20,24], pulseWidth:12, pulses:1, delay:null, filter:'530 nm', efficacy:'excelente' },
    castano:       { fluence:[18,22], pulseWidth:15, pulses:1, delay:null, filter:'530 nm', efficacy:'bueno' },
    rubio_oscuro:  { fluence:[20,26], pulseWidth:18, pulses:2, delay:20,   filter:'530 nm', efficacy:'moderado', warning:'Resultado variable. Evaluar respuesta en primera sesión.' },
    rubio_claro:   { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Vello rubio claro/rojo/gris carece de melanina suficiente. IPL no es eficaz.' },
    gris_blanco:   { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Vello blanco/gris no absorbe la luz IPL. Tratamiento contraindicado.' },
  },
  2: {
    negro:         { fluence:[20,24], pulseWidth:10, pulses:1, delay:null, filter:'530 nm', efficacy:'excelente' },
    castano_oscuro:{ fluence:[18,22], pulseWidth:12, pulses:1, delay:null, filter:'530 nm', efficacy:'excelente' },
    castano:       { fluence:[16,20], pulseWidth:15, pulses:1, delay:null, filter:'530 nm', efficacy:'bueno' },
    rubio_oscuro:  { fluence:[18,24], pulseWidth:18, pulses:2, delay:20,   filter:'530 nm', efficacy:'moderado', warning:'Resultado variable. Evaluar respuesta en primera sesión.' },
    rubio_claro:   { fluence:[22,28], pulseWidth:20, pulses:2, delay:25,   filter:'530 nm', efficacy:'limitado', warning:'Eficacia muy limitada. Informar al paciente. Iniciar con fluencia mínima.' },
    gris_blanco:   { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Vello blanco/gris no absorbe la luz IPL. Tratamiento contraindicado.' },
  },
  3: {
    negro:         { fluence:[16,20], pulseWidth:15, pulses:2, delay:15, filter:'560 nm', efficacy:'excelente' },
    castano_oscuro:{ fluence:[14,18], pulseWidth:18, pulses:2, delay:15, filter:'560 nm', efficacy:'excelente' },
    castano:       { fluence:[14,18], pulseWidth:20, pulses:2, delay:20, filter:'560 nm', efficacy:'bueno' },
    rubio_oscuro:  { fluence:[16,20], pulseWidth:25, pulses:2, delay:25, filter:'560 nm', efficacy:'moderado', warning:'Monitorear respuesta. Aplicar gel de contacto frío.' },
    rubio_claro:   { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Piel media + vello claro: riesgo sin eficacia. Contraindicado.' },
    gris_blanco:   { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Vello blanco/gris no absorbe la luz IPL. Contraindicado.' },
  },
  4: {
    negro:         { fluence:[14,18], pulseWidth:20, pulses:2, delay:20, filter:'590 nm', efficacy:'bueno',     warning:'Patch test obligatorio 24-48h antes.' },
    castano_oscuro:{ fluence:[12,16], pulseWidth:25, pulses:2, delay:25, filter:'590 nm', efficacy:'moderado', warning:'Iniciar con fluencia mínima. Riesgo de hiperpigmentación post-inflamatoria.' },
    castano:       { fluence:[12,15], pulseWidth:30, pulses:3, delay:30, filter:'590 nm', efficacy:'moderado', warning:'Alto riesgo de hiperpigmentación. Patch test obligatorio.' },
    rubio_oscuro:  { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Piel oscura + vello claro: alto riesgo sin resultado.' },
    rubio_claro:   { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado. Alto riesgo de daño tisular.' },
    gris_blanco:   { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
  },
  5: {
    negro:         { fluence:[10,14], pulseWidth:30, pulses:3, delay:35, filter:'615 nm', efficacy:'moderado', warning:'PRECAUCIÓN ALTA. Patch test obligatorio. Iniciar con fluencia mínima.' },
    castano_oscuro:{ fluence:[10,12], pulseWidth:35, pulses:3, delay:40, filter:'640 nm', efficacy:'limitado', warning:'Riesgo muy alto. Solo profesionales con experiencia. Considerar Nd:YAG.' },
    castano:       { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'No recomendado. Derivar a láser Nd:YAG 1064nm.' },
    rubio_oscuro:  { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
    rubio_claro:   { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
    gris_blanco:   { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
  },
  6: {
    negro:         { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo VI: IPL contraindicado. Derivar a Nd:YAG 1064nm.' },
    castano_oscuro:{ fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo VI: IPL contraindicado.' },
    castano:       { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo VI: IPL contraindicado.' },
    rubio_oscuro:  { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo VI: IPL contraindicado.' },
    rubio_claro:   { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo VI: IPL contraindicado.' },
    gris_blanco:   { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo VI: IPL contraindicado.' },
  },
};

// ── 2. REJUVENECIMIENTO ────────────────────────────────────────────────────
// Solo depende de fototipo. Target: colágeno, textura, poros.
export const REJUVENECIMIENTO = {
  1: { fluence:[14,18], pulseWidth:30, pulses:3, delay:40, filter:'515 nm', efficacy:'excelente' },
  2: { fluence:[13,17], pulseWidth:32, pulses:3, delay:40, filter:'515 nm', efficacy:'excelente' },
  3: { fluence:[11,15], pulseWidth:35, pulses:3, delay:45, filter:'560 nm', efficacy:'bueno' },
  4: { fluence:[9,13],  pulseWidth:40, pulses:3, delay:50, filter:'590 nm', efficacy:'moderado', warning:'Patch test obligatorio. Riesgo de hiperpigmentación post-inflamatoria.' },
  5: { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'No recomendado para fototipo V. Alto riesgo de hiperpigmentación y quemadura.' },
  6: { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo VI: IPL contraindicado para rejuvenecimiento.' },
};

// ── 3. MANCHAS / LENTIGOS ─────────────────────────────────────────────────
// Depende de fototipo + color de la lesión
export const MANCHAS = {
  1: {
    muy_oscura:{ fluence:[18,22], pulseWidth:10, pulses:1, delay:null, filter:'515 nm', efficacy:'excelente' },
    oscura:    { fluence:[16,20], pulseWidth:12, pulses:1, delay:null, filter:'515 nm', efficacy:'excelente' },
    media:     { fluence:[14,18], pulseWidth:15, pulses:1, delay:null, filter:'515 nm', efficacy:'bueno' },
    clara:     { fluence:[14,18], pulseWidth:18, pulses:2, delay:20,   filter:'515 nm', efficacy:'moderado', warning:'Lesiones claras responden con menor eficacia. Evaluar en primera sesión.' },
  },
  2: {
    muy_oscura:{ fluence:[16,20], pulseWidth:10, pulses:1, delay:null, filter:'515 nm', efficacy:'excelente' },
    oscura:    { fluence:[14,18], pulseWidth:12, pulses:1, delay:null, filter:'515 nm', efficacy:'excelente' },
    media:     { fluence:[13,17], pulseWidth:15, pulses:1, delay:null, filter:'560 nm', efficacy:'bueno' },
    clara:     { fluence:[13,17], pulseWidth:18, pulses:2, delay:20,   filter:'560 nm', efficacy:'moderado', warning:'Lesiones claras: resultado variable.' },
  },
  3: {
    muy_oscura:{ fluence:[13,17], pulseWidth:12, pulses:1, delay:null, filter:'560 nm', efficacy:'bueno',    warning:'Patch test recomendado.' },
    oscura:    { fluence:[12,16], pulseWidth:15, pulses:1, delay:null, filter:'560 nm', efficacy:'bueno',    warning:'Patch test recomendado.' },
    media:     { fluence:[11,15], pulseWidth:18, pulses:2, delay:20,   filter:'560 nm', efficacy:'moderado', warning:'Iniciar con fluencia mínima. Patch test obligatorio.' },
    clara:     { fluence:[11,14], pulseWidth:20, pulses:2, delay:25,   filter:'590 nm', efficacy:'limitado', warning:'Lesión clara en piel media: riesgo de hiperpigmentación. Patch test obligatorio.' },
  },
  4: {
    muy_oscura:{ fluence:[10,14], pulseWidth:18, pulses:2, delay:25, filter:'590 nm', efficacy:'moderado', warning:'PRECAUCIÓN. Patch test obligatorio. Alto riesgo de hiperpigmentación post-inflamatoria.' },
    oscura:    { fluence:[9,13],  pulseWidth:20, pulses:2, delay:30, filter:'590 nm', efficacy:'limitado', warning:'Patch test obligatorio. Iniciar con fluencia mínima. Riesgo elevado.' },
    media:     { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Piel IV + mancha media: riesgo de hiperpigmentación mayor que beneficio.' },
    clara:     { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'No recomendado.' },
  },
  5: {
    muy_oscura:{ fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo V: alto riesgo de hiperpigmentación. Contraindicado.' },
    oscura:    { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
    media:     { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
    clara:     { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
  },
  6: {
    muy_oscura:{ fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo VI: IPL contraindicado.' },
    oscura:    { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
    media:     { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
    clara:     { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
  },
};

// ── 4. TELANGIECTASIA / VASCULAR ──────────────────────────────────────────
// Depende de fototipo + tamaño del vaso
export const VASCULAR = {
  1: {
    fino:  { fluence:[12,16], pulseWidth:20, pulses:2, delay:20, filter:'515 nm', efficacy:'excelente' },
    medio: { fluence:[14,18], pulseWidth:25, pulses:2, delay:30, filter:'530 nm', efficacy:'excelente' },
    grueso:{ fluence:[16,20], pulseWidth:30, pulses:3, delay:35, filter:'560 nm', efficacy:'bueno',    warning:'Vasos gruesos pueden requerir múltiples sesiones. Evaluar respuesta.' },
  },
  2: {
    fino:  { fluence:[11,15], pulseWidth:20, pulses:2, delay:20, filter:'515 nm', efficacy:'excelente' },
    medio: { fluence:[13,17], pulseWidth:25, pulses:2, delay:30, filter:'530 nm', efficacy:'excelente' },
    grueso:{ fluence:[15,19], pulseWidth:30, pulses:3, delay:35, filter:'560 nm', efficacy:'bueno',    warning:'Evaluar respuesta tras primera sesión.' },
  },
  3: {
    fino:  { fluence:[10,14], pulseWidth:25, pulses:2, delay:25, filter:'560 nm', efficacy:'bueno',    warning:'Patch test recomendado.' },
    medio: { fluence:[12,16], pulseWidth:28, pulses:2, delay:30, filter:'560 nm', efficacy:'bueno',    warning:'Patch test recomendado.' },
    grueso:{ fluence:[13,17], pulseWidth:35, pulses:3, delay:40, filter:'590 nm', efficacy:'moderado', warning:'Patch test obligatorio. Riesgo de púrpura post-tratamiento.' },
  },
  4: {
    fino:  { fluence:[9,12],  pulseWidth:30, pulses:2, delay:35, filter:'590 nm', efficacy:'moderado', warning:'PRECAUCIÓN. Patch test obligatorio. Riesgo de hiperpigmentación.' },
    medio: { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo IV + vasos medianos: riesgo elevado. No recomendado.' },
    grueso:{ fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
  },
  5: {
    fino:  { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo V: IPL vascular contraindicado.' },
    medio: { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
    grueso:{ fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
  },
  6: {
    fino:  { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo VI: IPL contraindicado.' },
    medio: { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
    grueso:{ fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
  },
};

// ── 5. MELASMA ────────────────────────────────────────────────────────────
// Muy delicado — IPL puede empeorar el melasma si no se usa correctamente
// Depende de fototipo + tipo de melasma
export const MELASMA = {
  1: {
    epidermico:{ fluence:[10,14], pulseWidth:35, pulses:3, delay:50, filter:'590 nm', efficacy:'bueno',    warning:'Usar filtro de corte alto para evitar estimular melanocitos. Protección solar estricta post-tratamiento.' },
    dermico:   { fluence:[9,12],  pulseWidth:40, pulses:3, delay:55, filter:'615 nm', efficacy:'moderado', warning:'Melasma dérmico: respuesta más lenta. Combinar con tratamiento tópico.' },
    mixto:     { fluence:[9,13],  pulseWidth:38, pulses:3, delay:52, filter:'615 nm', efficacy:'moderado', warning:'Iniciar con parámetros conservadores. Evaluar respuesta sesión a sesión.' },
  },
  2: {
    epidermico:{ fluence:[9,13],  pulseWidth:35, pulses:3, delay:50, filter:'590 nm', efficacy:'bueno',    warning:'Protección solar SPF 50+ obligatoria. Evitar sol 4 semanas post-sesión.' },
    dermico:   { fluence:[8,11],  pulseWidth:40, pulses:3, delay:55, filter:'615 nm', efficacy:'moderado', warning:'Melasma dérmico responde lentamente. Resultados graduales.' },
    mixto:     { fluence:[8,12],  pulseWidth:38, pulses:3, delay:52, filter:'615 nm', efficacy:'moderado', warning:'Protocolo conservador. No sobretratar.' },
  },
  3: {
    epidermico:{ fluence:[8,11],  pulseWidth:40, pulses:3, delay:55, filter:'615 nm', efficacy:'moderado', warning:'PRECAUCIÓN. Patch test obligatorio. Riesgo de hiperpigmentación paradójica.' },
    dermico:   { fluence:[7,10],  pulseWidth:45, pulses:3, delay:60, filter:'640 nm', efficacy:'limitado', warning:'Alto riesgo. Resultados impredecibles en piel III. Evaluar alternativas.' },
    mixto:     { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo III + melasma mixto: riesgo de empeoramiento. No recomendado con IPL.' },
  },
  4: {
    epidermico:{ fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo IV con melasma: IPL contraindicado. Alto riesgo de hiperpigmentación paradójica. Derivar a tratamiento tópico.' },
    dermico:   { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
    mixto:     { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
  },
  5: {
    epidermico:{ fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo V: IPL contraindicado para melasma.' },
    dermico:   { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
    mixto:     { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
  },
  6: {
    epidermico:{ fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo VI: IPL contraindicado.' },
    dermico:   { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
    mixto:     { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
  },
};

// ── 6. ACNÉ ACTIVO ────────────────────────────────────────────────────────
// Depende de fototipo + grado del acné
// Mecanismo: luz azul/verde destruye P. acnes, reduce inflamación
export const ACNE = {
  1: {
    leve:    { fluence:[8,12],  pulseWidth:20, pulses:2, delay:20, filter:'515 nm', efficacy:'bueno' },
    moderado:{ fluence:[9,13],  pulseWidth:25, pulses:3, delay:25, filter:'515 nm', efficacy:'bueno' },
    severo:  { fluence:[9,13],  pulseWidth:25, pulses:3, delay:25, filter:'515 nm', efficacy:'moderado', warning:'Acné severo: resultados moderados. Combinar con tratamiento médico.' },
  },
  2: {
    leve:    { fluence:[7,11],  pulseWidth:20, pulses:2, delay:20, filter:'515 nm', efficacy:'bueno' },
    moderado:{ fluence:[8,12],  pulseWidth:25, pulses:3, delay:25, filter:'515 nm', efficacy:'bueno' },
    severo:  { fluence:[8,12],  pulseWidth:25, pulses:3, delay:25, filter:'515 nm', efficacy:'moderado', warning:'Acné severo: combinar con tratamiento sistémico.' },
  },
  3: {
    leve:    { fluence:[6,10],  pulseWidth:25, pulses:2, delay:25, filter:'560 nm', efficacy:'bueno' },
    moderado:{ fluence:[7,11],  pulseWidth:28, pulses:3, delay:30, filter:'560 nm', efficacy:'moderado', warning:'Patch test recomendado.' },
    severo:  { fluence:[7,11],  pulseWidth:28, pulses:3, delay:30, filter:'560 nm', efficacy:'moderado', warning:'Patch test obligatorio. Combinar con tratamiento médico.' },
  },
  4: {
    leve:    { fluence:[5,9],   pulseWidth:30, pulses:2, delay:30, filter:'590 nm', efficacy:'moderado', warning:'Patch test obligatorio. Riesgo de hiperpigmentación post-inflamatoria.' },
    moderado:{ fluence:[5,8],   pulseWidth:32, pulses:3, delay:35, filter:'590 nm', efficacy:'limitado', warning:'Iniciar con fluencia mínima. Alto riesgo de hiperpigmentación.' },
    severo:  { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Acné severo en fototipo IV: riesgo de empeoramiento de hiperpigmentación. Derivar a dermatólogo.' },
  },
  5: {
    leve:    { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo V: IPL para acné contraindicado. Riesgo de hiperpigmentación severa.' },
    moderado:{ fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
    severo:  { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
  },
  6: {
    leve:    { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Fototipo VI: IPL contraindicado.' },
    moderado:{ fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
    severo:  { fluence:null, pulseWidth:null, pulses:null, delay:null, filter:null, efficacy:'no_recomendado', warning:'Contraindicado.' },
  },
};
