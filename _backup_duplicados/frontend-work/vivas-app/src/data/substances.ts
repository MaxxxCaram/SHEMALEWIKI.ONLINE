// ============================================================
// Vivas Nos Queremos — Guía de Sustancias (Reducción de Daños)
// ============================================================
// Información factual para educación en uso responsable.
// NO promueve el consumo. NO juzga. Informa para cuidar.

export interface Substance {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  appearance: string;
  administration: string;
  onset: string;
  duration: string;
  effects: string;
  risks: string;
  interactions: string;
  harmReduction: string;
  emoji: string;
}

export const SUBSTANCES: Substance[] = [
  {
    id: 'cocaina',
    name: 'Cocaína',
    aliases: ['merca', 'falopa', 'blanca', 'farlopa', 'perico', 'talco'],
    category: 'Estimulante',
    emoji: '❄️',
    appearance: 'Polvo blanco o blanquecino, cristalino. A veces viene en bloques compactos (piedra) o en escamas brillantes. La cocaína de baja pureza puede ser amarillenta o grisácea. Si tiene olor a gasolina o queroseno, es pasta base (no es cocaína).',
    administration: 'Inhalada (esnifada) es la vía más común. También se fuma en forma de crack o pasta base (efecto mucho más intenso y corto, mayor riesgo de adicción). Algunas personas la aplican en encías (absorción mucosa) o la inyectan (máximo riesgo).',
    onset: 'Esnifada: 1-3 minutos. Fumada (crack): 5-10 segundos. En encías: 10-20 minutos.',
    duration: 'Esnifada: 15-45 minutos. Fumada: 5-15 minutos. El bajón (crash) puede durar horas.',
    effects: 'Euforia intensa, sensación de poder y confianza, mucha energía, locuacidad, aceleración del pensamiento. Disminuye el hambre y el sueño. En dosis altas: paranoia, ansiedad, irritabilidad, agresividad, ideas persecutorias. El bajón produce tristeza profunda, fatiga y deseo intenso de consumir más.',
    risks: 'Sobredosis: convulsiones, infarto, ACV, hipertermia. El uso frecuente daña la mucosa nasal (perforación del tabique). Mezclada con alcohol forma cocaetileno en el hígado — mucho más tóxico y cardiotóxico que cada sustancia por separado. Altísimo potencial de adicción psicológica.',
    interactions: '⚠️ + ALCOHOL: cocaetileno (muy tóxico, daño hepático y cardíaco grave). ⚠️ + MDMA/anfetaminas: sobrecarga cardíaca extrema. ⚠️ + Viagra: riesgo cardiovascular severo. ⚠️ + ketamina: puede causar colapso respiratorio. ⚠️ + benzodiacepinas: enmascaran sobredosis.',
    harmReduction: 'Usá tu propio tubo/billete, no compartas (hepatitis C). Molé bien el polvo para no dañar la mucosa. Hidratate. No mezcles con alcohol — es la combinación más peligrosa. Si sentís el pecho raro, dolor o taquicardia extrema: pará y buscá ayuda. Después del consumo: comé algo aunque no tengas hambre, tomá agua, intentá dormir.'
  },
  {
    id: 'tussi',
    name: 'Tussi / Tusibí / 2C-B',
    aliases: ['tussi', 'tusibí', 'polvo rosa', 'pink cocaine', 'nexus', '2cb', 'cocaína rosa'],
    category: 'Psicodélico / Entactógeno',
    emoji: '🩷',
    appearance: '⚠️ IMPORTANTE: Lo que en LATAM se vende como "tussi" o "polvo rosa" CASI NUNCA es 2C-B puro. Generalmente es una mezcla impredecible de ketamina + MDMA + cafeína + colorante rosa, a veces con opioides. El 2C-B auténtico es un polvo blanco o beige, no rosa. El color rosa se lo ponen para que parezca "exclusivo".',
    administration: 'El 2C-B real se toma oral (cápsulas o papel) o esnifado (duele mucho). El "tussi" callejero se esnifa como cocaína.',
    onset: 'Oral: 45-75 minutos. Esnifado: 10-20 minutos.',
    duration: 'Oral: 4-8 horas. Esnifado: 2-4 horas.',
    effects: '2C-B real: euforia suave, empatía, alteraciones visuales coloridas (psicodélico suave), tacto placentero, música intensa. El "tussi" callejero: efectos impredecibles — mezcla de estimulación (MDMA/anfetas) + disociación (ketamina) + posible sedación (si tiene opioides). Cada lote es distinto. No sabés qué estás tomando.',
    risks: 'El mayor riesgo es NO SABER qué contiene. Puede tener fentanilo. La mezcla de ketamina + MDMA produce desorientación peligrosa. Si tiene opioides: depresión respiratoria. La gente lo consume pensando que es "seguro" porque es "rosa" y "fashion".',
    interactions: '⚠️ + alcohol: náuseas severas, deshidratación. ⚠️ + Viagra: interacción impredecible con lo que sea que tenga la mezcla. ⚠️ + antidepresivos (ISRS): síndrome serotoninérgico si contiene MDMA. ⚠️ + otros depresores (alcohol, benzos, GHB): si contiene opioides, riesgo de paro respiratorio.',
    harmReduction: 'No confíes en el "tussi" callejero — no existe un estándar. Si decidís consumir: probá una dosis mínima primero (micro-test). No mezcles con nada más esa noche. Si podés, testeá con tiras reactivas de fentanilo. El 2C-B real es psicodélico — necesita set & setting tranquilo, no para trabajar.'
  },
  {
    id: 'ketamina',
    name: 'Ketamina',
    aliases: ['keta', 'k', 'special K', 'ketanest', 'polvo k'],
    category: 'Disociativo',
    emoji: '🐴',
    appearance: 'Líquido transparente (uso veterinario/médico) o polvo cristalino blanco/traslúcido cuando se evapora. A veces viene en escamas pequeñas (shards). Si está amarillenta puede tener impurezas.',
    administration: 'Esnifada (más común). También inyectada (intramuscular o IV — uso médico). Oral tiene baja biodisponibilidad. Se puede fumar pero es raro.',
    onset: 'Esnifada: 5-15 minutos. Inyectada: 1-5 minutos.',
    duration: 'Esnifada: 45-90 minutos. Los efectos residuales (confusión, torpeza) pueden durar 2-3 horas.',
    effects: 'Dosis bajas: sensación de flotar, relajación, leve euforia, desinhibición, música más intensa. Dosis medias: distorsión del cuerpo (sentirse grande/chico), dificultad para moverse, pensamiento fragmentado. Dosis altas: "K-hole" — experiencia de desconexión total del cuerpo, viajes internos intensos, sensación de muerte y renacimiento, imposibilidad de moverse o hablar. ES UN ANESTÉSICO DISOCIATIVO. La persona parece dormida o en coma pero está consciente internamente.',
    risks: 'En dosis altas la persona NO puede moverse ni defenderse — riesgo altísimo de abuso sexual o robo. Náuseas y vómito (peligro de ahogarse si está acostada boca arriba). Uso frecuente: daño a la vejiga (cistitis por ketamina, irreversible), dolor abdominal crónico, tolerancia rápida. El K-hole puede ser aterrador si no estás preparada.',
    interactions: '⚠️ + alcohol/benzos/GHB: depresión respiratoria severa, vómito con riesgo de aspiración. ⚠️ + opioides: paro respiratorio. ⚠️ + MDMA: confusión, amnesia, pánico. ⚠️ + cocaína: colapso cardiovascular.',
    harmReduction: 'NUNCA consumas sola, especialmente dosis altas. Posición de recuperación (de costado) si alguien entra en K-hole. No mezcles con alcohol ni otros depresores. No uses en lugares públicos o desconocidos — no podrás moverte. Si la usás seguido y sentís dolor al orinar o sangre: es la vejiga, pará inmediatamente. Hidratate antes y después.'
  },
  {
    id: 'ghb',
    name: 'GHB / GBL',
    aliases: ['g', 'éxtasis líquido', 'gamma', 'bote', 'chorro', 'líquido'],
    category: 'Depresor',
    emoji: '💧',
    appearance: 'Líquido incoloro e inodoro (GHB es salado, GBL tiene sabor químico). Generalmente viene en botellitas pequeñas o frascos goteros. ES IMPOSIBLE DIFERENCIARLO DEL AGUA A SIMPLE VISTA. GBL es más potente (1ml GBL ≈ 1.6ml GHB).',
    administration: 'Oral (mezclado con bebida o directo). La dosis se mide en MILILITROS (ml) — una diferencia de 0.5ml puede ser la diferencia entre un efecto recreativo y un coma. JAMÁS se inyecta.',
    onset: '15-30 minutos. Con estómago vacío: 10-15 minutos.',
    duration: '1.5-3 horas. Desaparece rápido — la gente suele redosificar, lo cual es PELIGROSO.',
    effects: 'Sensación de euforia, desinhibición, calidez, sociabilidad, aumento del deseo sexual. Es un depresor del sistema nervioso central: a dosis altas produce somnolencia intensa, confusión, mareo y pérdida de conciencia. La ventana entre "dosis recreativa" y "sobredosis" es MUY ESTRECHA.',
    risks: '⚠️ SOBREDOSIS ACCIDENTAL MUY FRECUENTE. La diferencia entre una dosis segura y un coma puede ser 1ml. NUNCA redosifiques antes de 2 horas. NUNCA mezcles con alcohol u otros depresores — sinergia letal. Riesgo altísimo de sumisión química (violación por drogas): es incoloro, inodoro e insípido. La persona intoxicada parece dormida — pero puede estar en coma. Si ronca fuerte: emergencia médica.',
    interactions: '☠️ + ALCOHOL: COMBINACIÓN LETAL. Sinergia depresora extrema, paro respiratorio. ☠️ + benzodiacepinas/ketamina/opioides: igual de peligroso. ☠️ + Viagra: hipotensión severa, colapso. ⚠️ + metanfetamina/cocaína: enmascara los efectos del GHB — riesgo de sobredosis al no sentir los efectos depresores.',
    harmReduction: 'MEDÍ SIEMPRE CON JERINGA DOSIFICADORA (sin aguja) — NUNCA a ojo. Anotá la hora de cada dosis. No aceptes bebidas abiertas de nadie. Si salís con amigas, avisales que consumiste y cuánto. Si alguien se desmaya: posición de recuperación (de costado), NO la dejes sola, llamá emergencias. El ronquido fuerte es señal de paro respiratorio inminente — ACTUÁ.'
  },
  {
    id: 'metanfetamina',
    name: 'Metanfetamina',
    aliases: ['cristal', 'meth', 'tina', 'ice', 'crico', 'meta'],
    category: 'Estimulante',
    emoji: '💎',
    appearance: 'Cristales transparentes o blancos, como vidrio roto o hielo picado. También puede ser polvo blanco cristalino. A veces tiene color azulado (referencia a Breaking Bad, aunque no indica pureza). Si es amarilla o marrón tiene impurezas.',
    administration: 'Fumada en pipa de vidrio (más común). También esnifada, inyectada (altísimo riesgo) u oral (menos común). Algunas personas la usan rectal (booty bump) para evitar daño nasal.',
    onset: 'Fumada: segundos, inmediato. Esnifada: 3-5 minutos. Oral: 20-30 minutos.',
    duration: 'Fumada/esnifada: 4-8 horas. Oral: 8-12 horas. El bajón puede durar DÍAS — fatiga extrema, depresión, anhedonia.',
    effects: 'Euforia EXTREMA y prolongada, energía inagotable, hiperconcentración, aumento masivo de la líbido, supresión total del sueño y el hambre. Las personas pueden estar despiertas y activas por 24-72 horas. En sesiones prolongadas: paranoia severa, psicosis (alucinaciones, ideas persecutorias, "shadow people"), agresividad, comportamientos compulsivos y repetitivos.',
    risks: 'Altísimo potencial de adicción — una de las sustancias más adictivas que existen. Psicosis por privación de sueño (puede ser permanente en algunos casos). Daño dental severo ("boca de meth"). Daño cerebral por neurotoxicidad. Adelgazamiento extremo, envejecimiento prematuro. Riesgo de HIV/hepatitis si se comparte pipa o jeringa. La inyección conlleva todos los riesgos de la vía IV (abscesos, endocarditis, sepsis).',
    interactions: '⚠️ + alcohol: enmascara intoxicación, riesgo de sobredosis. ☠️ + Viagra: combinación frecuente y peligrosa — priapismo (erección que no baja, requiere cirugía), infarto. ⚠️ + cocaína/MDMA: sobrecarga cardíaca masiva, hipertermia, rabdomiólisis. ⚠️ + antidepresivos (ISRS): síndrome serotoninérgico. ⚠️ + GHB/benzos: mezcla "speedball" — riesgo de paro cuando pasa el estimulante.',
    harmReduction: 'La reducción de daños más efectiva: DORMÍ. La psicosis viene de no dormir, no tanto de la sustancia. Forzate a comer y tomar agua aunque no quieras. No compartas pipas (hepatitis C, herpes). Usá lubricante si hay sexo — la mucosa se reseca. Si alguien entra en psicosis: ambiente tranquilo, luces bajas, hablarle suave, no confrontar. Si los síntomas no ceden en 24h: emergencia psiquiátrica.'
  },
  {
    id: 'poppers',
    name: 'Poppers',
    aliases: ['nitritos', 'rush', 'liquid gold', 'aroma', 'vídeo head cleaner'],
    category: 'Vasodilatador',
    emoji: '🧴',
    appearance: 'Líquido amarillento o transparente en frasco pequeño. Olor fuerte, químico, como a solvente o media vieja. Se vende como "ambientador" o "limpiador de cabezales" para evadir regulaciones.',
    administration: 'Inhalado directamente del frasco (NO ingerir — es tóxico si se traga). Se destapa y se aspira el vapor por la nariz. El líquido NO debe tocar la piel (quemaduras químicas).',
    onset: 'Inmediato (10-30 segundos).',
    duration: '1-3 minutos. Pico en 30 segundos, desaparece rápido.',
    effects: 'Euforia breve e intensa ("rush"), calor en la cabeza y el cuello, mareo placentero, desinhibición, relajación de esfínteres (por eso se usa en sexo anal). Música puede sonar distorsionada. Baja la presión arterial bruscamente — taquicardia refleja.',
    risks: 'Quemaduras químicas si el líquido toca la piel. Dolor de cabeza intenso después del uso. Puede causar metahemoglobinemia (la sangre no transporta oxígeno) — labios/ufias azules requieren emergencia. Uso frecuente daña la mucosa nasal. NO ES INOFENSIVO aunque dure poco.',
    interactions: '☠️ + VIAGRA/CIALIS/LEVITRA (inhibidores PDE5): COMBINACIÓN POTENCIALMENTE LETAL. Ambos bajan la presión arterial — juntos causan colapso cardiovascular, infarto, muerte súbita. NO NEGOCIABLE: si tomaste Viagra, NADA de poppers, y viceversa. ⚠️ + alcohol: hipotensión aditiva. ⚠️ + cocaína/metanfetamina: tensión cardíaca contradictoria (vasodilatador + vasoconstrictor).',
    harmReduction: 'NO TOCAR el líquido — solo aspirar el vapor. NUNCA ingerir (tóxico). Cerrá bien el frasco después de usar (se evapora). No uses poppers si tenés presión baja, anemia o problemas cardíacos. La regla de ORO: NUNCA, bajo ninguna circunstancia, combines poppers con Viagra, Cialis o similares — es una de las interacciones más letales documentadas.'
  },
  {
    id: 'alcohol',
    name: 'Alcohol',
    aliases: ['birra', 'vino', 'fernet', 'escabio', 'trago', 'chela', 'chupi'],
    category: 'Depresor',
    emoji: '🍺',
    appearance: 'Líquido de color variable (transparente, dorado, ámbar, rojo). Legal y socialmente aceptado en casi todo el mundo, lo que lleva a subestimar sus riesgos.',
    administration: 'Oral. En exceso puede causar vómito, pérdida de conciencia y muerte.',
    onset: '10-30 minutos (más rápido con estómago vacío).',
    duration: '2-6 horas dependiendo de la cantidad y metabolismo. La resaca dura hasta 24h.',
    effects: 'Desinhibición, euforia, sociabilidad. En dosis crecientes: pérdida de coordinación, dificultad para hablar, mareo, náuseas, vómito. Intoxicación severa: confusión, estupor, coma, hipotermia, depresión respiratoria. Afecta el juicio — decisiones sexuales y de seguridad comprometidas.',
    risks: 'Sobredosis (intoxicación etílica aguda): coma, paro respiratorio, muerte. El alcohol está involucrado en una proporción enorme de violencias y abusos — tanto quien consume como quien es agredida tienen el juicio alterado. Daño hepático crónico (cirrosis), pancreatitis, cáncer. Síndrome de abstinencia potencialmente letal (delirium tremens) en personas con dependencia.',
    interactions: '⚠️ + cocaína: cocaetileno (cardiotóxico, hepatotóxico). ☠️ + GHB/benzos/ketamina/opioides: sinergia depresora — paro respiratorio. ⚠️ + MDMA: deshidratación severa + sobrecarga hepática. ⚠️ + metanfetamina: enmascaramiento de intoxicación, riesgo de sobredosis de ambas.',
    harmReduction: 'Comé antes de tomar (ralentiza absorción). Alterná con agua. Conocé tu límite. Si estás en un encuentro: el alcohol afecta tu capacidad de negociar límites, detectar peligro y reaccionar. Si vas a tomar, que sea en entorno seguro y con gente de confianza. Si alguien está inconsciente: posición de recuperación, NO dejarla sola, llamá emergencias.'
  },
  {
    id: 'cannabis',
    name: 'Cannabis / Marihuana',
    aliases: ['maría', 'porro', 'faso', 'churro', 'yerba', 'weed', 'ganja', 'cogollo'],
    category: 'Cannabinoide',
    emoji: '🌿',
    appearance: 'Cogollos (flores secas) verdes, a veces con tonos violetas o naranjas, cubiertos de tricomas brillantes (cristalitos). Olor fuerte y penetrante. También en resina (hachís — bloque marrón oscuro) o aceite (concentrado viscoso ámbar).',
    administration: 'Fumada (porro, pipa, bong) es lo más común. Vaporizada (menos daño pulmonar). Comestibles (galletitas, brownies, gomitas): efecto más tardado, intenso y prolongado — CUIDADO con la dosis. Aceite sublingual o tópico.',
    onset: 'Fumada: 1-5 minutos. Vaporizada: 1-5 minutos. Comestibles: 30-90 minutos (NO redosificar antes de 2 horas).',
    duration: 'Fumada: 2-4 horas. Comestibles: 4-8 horas (puede extenderse a 12h).',
    effects: 'Relajación, euforia suave, risa, aumento del apetito, percepción sensorial intensificada (música, tacto, comida). Alteración del tiempo (pasa más lento). En dosis altas o personas sensibles: ansiedad, paranoia, taquicardia, pánico. Con comestibles estos efectos negativos son más frecuentes por la dificultad de dosificar.',
    risks: 'Dependencia psicológica (menor que otras sustancias, pero existe). Puede desencadenar o empeorar cuadros de ansiedad y psicosis en personas predispuestas. Fumada: daño pulmonar similar al tabaco (aunque sin cáncer comprobado). Interfiere con la memoria a corto plazo y la coordinación. Comestibles: sobredosis accidental muy frecuente ("no me pega" → comen más → mal viaje de 8 horas).',
    interactions: '⚠️ + alcohol: "blanqueo" — náuseas, mareo, vómito intenso (especialmente si fumás después de tomar). ⚠️ + estimulantes (cocaína, meta): puede aumentar ansiedad y paranoia. ⚠️ + psicodélicos: potencia y puede desencadenar mal viaje. Relativamente segura en comparación con otras combinaciones, pero no es inocua.',
    harmReduction: 'Empezá con poco, especialmente comestibles. Si te pega mal (pánico, taquicardia): recordá que pasa, NADIE murió por cannabis, enfocate en la respiración, tomá agua con azúcar, masticá pimienta negra (ayuda con la ansiedad). Si consumís por ansiedad/depresión, el cannabis puede ser un parche que empeora las cosas a largo plazo. No mezcles con alcohol si no tenés tolerancia.'
  },
  {
    id: 'benzodiacepinas',
    name: 'Benzodiacepinas',
    aliases: ['benzos', 'alprazolam', 'clonazepam', 'rivotril', 'trankimazin', 'valium', 'lorazepam', 'diacepam', 'pastillas', 'tranquis'],
    category: 'Depresor / Ansiolítico',
    emoji: '💊',
    appearance: 'Pastillas o comprimidos de diferentes colores según la marca y dosis. Alprazolam (Xanax/Trankimazin): blanca, ovalada o rectangular. Clonazepam (Rivotril): blanca o azul, redonda. Diazepam (Valium): blanca, amarilla o azul, redonda. MUCHO CUIDADO: pastillas falsas prensadas con fentanilo son cada vez más comunes.',
    administration: 'Oral (pastilla). Algunas personas las trituran y esnifan (mala idea — excipientes dañinos, efecto no mejora). La vía inyectable existe médicamente pero es rarísima fuera del hospital.',
    onset: '15-40 minutos dependiendo del tipo. Alprazolam es de acción rápida (15-20 min), clonazepam más lento (30-60 min).',
    duration: '4-12 horas según el tipo. Alprazolam: 4-6h. Clonazepam: 8-12h. Diazepam: 6-12h (metabolitos activos duran días).',
    effects: 'Sedación, relajación muscular, calma mental, reducción de ansiedad, somnolencia. En dosis altas: amnesia (lagunas mentales — no recordás lo que hiciste), desinhibición parecida al alcohol, confusión. NO producen euforia en la mayoría de las personas — solo alivio de ansiedad o sueño.',
    risks: 'Dependencia física rápida y la abstinencia es una de las PEORES y más peligrosas (convulsiones, delirio, muerte). La mezcla con alcohol u opioides es la causa más común de muerte por sobredosis accidental en muchos países. Amnesia en dosis altas — vulnerabilidad extrema a abuso. Pastillas falsas con fentanilo: epidemia actual en toda América.',
    interactions: '☠️ + ALCOHOL: sinergia depresora LETAL. Causa más común de muerte por sobredosis. ☠️ + GHB/opioides/ketamina: igual — paro respiratorio. ⚠️ + metanfetamina/cocaína: "speedball" — riesgo de sobredosis cuando el estimulante se va y queda solo el depresor. ⚠️ + otras benzodiacepinas: efecto aditivo.',
    harmReduction: 'NUNCA mezcles con alcohol. Si las usás para bajar el bajón de estimulantes (cocaína, meta): es un patrón peligroso que puede volverse cíclico. No suspendas bruscamente si las tomás hace semanas — abstinencia con supervisión médica. Testeá pastillas con tiras de fentanilo. Si te dan pastillas "de marca" a precio muy bajo: probablemente son falsas. Guardá naloxona si hay riesgo de fentanilo.'
  },
  {
    id: 'fentanilo',
    name: 'Fentanilo (contaminación)',
    aliases: ['fenta', 'fentanyl', 'china white', 'heroína sintética'],
    category: 'Opioide sintético',
    emoji: '☠️',
    appearance: 'Polvo blanco (similar a la cocaína o ketamina). Puede estar mezclado con CUALQUIER otra droga en polvo o prensado en pastillas falsas (benzos, oxicodona). ES INVISIBLE, INODORO E INSÍPIDO. La dosis letal es tan pequeña como 2 miligramos (el tamaño de 2 granitos de sal).',
    administration: 'Generalmente la persona NO SABE que lo está consumiendo. Viene como contaminante en cocaína, metanfetamina, pastillas (benzos falsas), y heroína. También se vende intencionalmente como "heroína sintética".',
    onset: 'Inmediato a 2 minutos.',
    duration: '30-60 minutos. La depresión respiratoria puede durar más.',
    effects: 'Sedación extrema, euforia, pupilas puntiformes (como cabeza de alfiler), somnolencia incontrolable. EN SOBREDOSIS: la persona deja de respirar. Piel azul/gris (cianosis), ronquido fuerte, no responde a estímulos. MUERTE POR PARO RESPIRATORIO en minutos.',
    risks: '100 VECES MÁS POTENTE QUE LA MORFINA. 2mg pueden matar. Está contaminando el suministro de drogas en TODO el continente americano y Europa. Las tiras reactivas pueden detectarlo pero no todos los lotes están contaminados uniformemente (efecto "chocolate chip" — una parte del polvo tiene fentanilo y otra no). La naloxona (Narcan) revierte la sobredosis pero puede requerir múltiples dosis.',
    interactions: '☠️ + CUALQUIER DEPRESOR (alcohol, benzos, GHB, ketamina): el riesgo de paro respiratorio se multiplica. ☠️ + estimulantes: enmascaran los efectos — cuando pasa el estimulante, el fentanilo causa paro.',
    harmReduction: 'SIEMPRE testeá con tiras de fentanilo cualquier polvo o pastilla que no venga de farmacia. Conseguí naloxona (Narcan) y aprendé a usarla — salva vidas. No consumas sola. Si alguien se está sobredosificando: llamá a emergencias YA, administrá naloxona si tenés, hacé respiración boca a boca. Muchos países tienen leyes de "buen samaritano" — no vas presa por llamar una ambulancia.'
  },
  {
    id: 'mdma',
    name: 'MDMA / Éxtasis',
    aliases: ['éxtasis', 'pastilla', 'rola', 'eme', 'molly', 'droga del amor', 'pasti'],
    category: 'Entactógeno / Estimulante',
    emoji: '💙',
    appearance: 'Cristales o polvo blanco/beige/marrón (MDMA en cristal, "molly"). Pastillas de colores con logotipos o formas (éxtasis). Las pastillas pueden contener solo MDMA o mezclas con cafeína, anfetaminas, metanfetamina u otras sustancias.',
    administration: 'Oral (más común). Algunas personas lo esnifan (duele mucho, efecto más corto). Rara vez inyectado.',
    onset: 'Oral: 30-60 minutos.',
    duration: '3-6 horas. Algunas personas sienten el "afterglow" por 24h. El "bajón" (Tuesday blues) aparece 1-3 días después.',
    effects: 'Empatía y amor intenso, conexión emocional profunda, euforia, energía, ganas de bailar y abrazar. Música increíble, tacto placentero. Supresión del hambre y el sueño. En dosis altas: mandíbula trabada (bruxismo), nistagmo (ojos vibrando), náuseas, confusión, hipertermia (golpe de calor). El bajón: tristeza, fatiga, vacío emocional (por agotamiento de serotonina).',
    risks: 'Hipertermia / golpe de calor (principal causa de muerte por MDMA en fiestas). Hiponatremia: beber DEMASIADA agua sin electrolitos puede matar (edema cerebral). Hepatotoxicidad en dosis altas. No es físicamente adictiva pero la gente abusa por el bajón. Neurotoxicidad con uso muy frecuente (daño a neuronas serotoninérgicas). Pastillas adulteradas con metanfetamina, PMA/PMMA (mucho más tóxicos).',
    interactions: '☠️ + ANTIDEPRESIVOS ISRS (fluoxetina, sertralina, paroxetina): síndrome serotoninérgico (confusión, rigidez, fiebre, muerte). ☠️ + IMAO (algunos antidepresivos, ayahuasca): crisis hipertensiva letal. ⚠️ + alcohol: deshidratación + sobrecarga hepática. ⚠️ + cocaína/metanfetamina: sobrecarga cardíaca, hipertermia masiva. ⚠️ + Viagra: hipotensión + cardiotoxicidad.',
    harmReduction: 'Tomá 250ml de agua por hora — ni más ni menos. No bailes sin descansar (sobrecalentamiento). Medí la temperatura corporal si estás en una fiesta. No mezcles con alcohol. Esperá MÍNIMO 6 semanas entre usos para que tu cerebro recupere serotonina. Si tomás antidepresivos ISRS NO tomes MDMA — no te va a hacer efecto Y es peligroso. Testeá tus pastillas con Marquis reagent (se vuelve negro/púrpura con MDMA real).'
  },
  {
    id: 'viagra',
    name: 'Viagra / Cialis (Sildenafilo / Tadalafilo)',
    aliases: ['viagra', 'cialis', 'sildenafilo', 'tadalafilo', 'pastilla azul', 'levitra'],
    category: 'Vasodilatador (Inhibidor PDE5)',
    emoji: '🔵',
    appearance: 'Pastillas. Viagra: azul, romboidal. Cialis: amarilla, ovalada. Genéricos: blancos o azules. Las falsificaciones son COMUNES.',
    administration: 'Oral, 30-60 minutos antes de la actividad sexual.',
    onset: 'Viagra: 30-60 minutos. Cialis: 30-120 minutos (dura mucho más).',
    duration: 'Viagra: 4-6 horas. Cialis: 24-36 horas ("la pastilla del fin de semana").',
    effects: 'Facilita y mantiene la erección (solo con estimulación sexual — no causa erección espontánea). Puede causar rubor facial, congestión nasal, dolor de cabeza, acidez.',
    risks: 'Priapismo: erección que dura más de 4 horas — EMERGENCIA MÉDICA, puede causar daño permanente al pene. Hipotensión (baja de presión). Problemas cardíacos en personas con condiciones preexistentes. Las falsificaciones pueden contener cualquier cosa.',
    interactions: '☠️ + POPPERS (nitritos): COMBINACIÓN LETAL. Hipotensión severa, colapso cardiovascular, infarto, muerte súbita. NO NEGOCIABLE. ☠️ + "tussi" (mezcla desconocida): riesgo impredecible. ⚠️ + cocaína/metanfetamina: sobrecarga cardíaca. ⚠️ + GHB/alcohol: hipotensión aditiva. ⚠️ + MDMA: cardiotoxicidad.',
    harmReduction: 'NUNCA combines con poppers. Es la regla de oro y no hay excepción. Si estás consumiendo otras sustancias (cocaína, meta, tussi) EVITÁ el Viagra — tu corazón ya está bajo estrés. Si una erección dura más de 4 horas: EMERGENCIA, andá al hospital. No te de vergüenza — el priapismo no tratado causa daño irreversible.'
  }
];

export function getSubstanceById(id: string): Substance | undefined {
  return SUBSTANCES.find(s => s.id === id);
}
