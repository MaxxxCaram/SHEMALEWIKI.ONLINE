import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const isBT = () => typeof window !== 'undefined' && window.location.hostname.includes('buscatrans');

const getLang = () => {
  if (typeof window === 'undefined') return 'en';
  if (isBT() || (typeof window !== 'undefined' && window.location.pathname.startsWith('/es'))) return 'es';
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/pt')) return 'pt';
  return 'en';
};

/* ── Company data ── */
const company = {
  name: 'MissNL Productions',
  country: 'Países Bajos / Netherlands',
  email: 'legal@shemalewiki.online',
};

/* ── Content ── */
const en = {
  title: 'Terms of Use — Legal Notice',
  brand: 'ShemaleWiki',
  object: {
    heading: '1. PURPOSE',
    body: `This legal notice governs the use of the website shemalewiki.online and buscatrans.com (hereinafter "the Website"), owned by ${company.name} (hereinafter "THE WEBSITE OWNER").\n\nBrowsing the Website attributes the condition of USER and implies full and unreserved acceptance of each and every one of the conditions published in this legal notice, noting that said conditions may be modified without prior notice by THE WEBSITE OWNER, in which case they will be published and notified as far in advance as possible.\n\nIt is therefore advisable to read its content carefully if you wish to access and make use of the information and services offered from this Website.\n\nTHE WEBSITE OWNER, through ShemaleWiki and BuscaTrans, offers advertising services through online directories, by means of listings published by the professionals themselves and their dissemination. Listings referencing sexual services in exchange for money are strictly prohibited.\n\nThe USER undertakes to make correct use of the Website in accordance with the laws, good faith, public order, traffic uses and this Legal Notice, and will be liable to THE WEBSITE OWNER or third parties for any damages that may be caused as a result of breach of this obligation.\n\nAny use other than that authorized is expressly prohibited, and THE WEBSITE OWNER may deny or withdraw access and use at any time.`,
  },
  identification: {
    heading: '2. IDENTIFICATION',
    body: `THE WEBSITE OWNER, in compliance with EU Directive 2000/31/EC on electronic commerce, informs you that:\n\nCompany name: ${company.name}\nRegistered address: ${company.country}\nContact email: ${company.email}`,
  },
  communications: {
    heading: '3. COMMUNICATIONS',
    body: `To communicate with us, we provide the following means of contact:\n\nEmail: ${company.email}\n\nAll notifications and communications between users and THE WEBSITE OWNER will be considered effective, for all purposes, when made through any of the means detailed above.`,
  },
  conditions: {
    heading: '4. CONDITIONS OF ACCESS AND USE',
    body: `The Website and its services are freely accessible. However, THE WEBSITE OWNER may condition the use of some of the services offered on its Website to the prior completion of the corresponding form.\n\nThe USER guarantees the authenticity and currency of all data communicated to THE WEBSITE OWNER and will be solely responsible for any false or inaccurate statements made.\n\nThe USER expressly undertakes to make appropriate use of the contents and services of THE WEBSITE OWNER and not to use them for, among others:\n\na) Disseminating criminal, violent, pornographic, racist, xenophobic, offensive content, content that advocates terrorism, or, in general, content contrary to law or public order.\n\nb) Introducing computer viruses into the network or performing actions likely to alter, damage, interrupt or generate errors or damage to electronic documents, data or physical and logical systems of THE WEBSITE OWNER or third parties; as well as hindering the access of other users to the Website and its services.\n\nc) Attempting to access the email accounts of other users or restricted areas of the computer systems of THE WEBSITE OWNER or third parties and, where appropriate, extracting information.\n\nd) Violating intellectual or industrial property rights, as well as violating the confidentiality of information of THE WEBSITE OWNER or third parties.\n\ne) Impersonating the identity of any other user.\n\nf) Reproducing, copying, distributing, making available, or any other form of public communication, transforming or modifying the contents, unless authorized by the owner of the corresponding rights or this is legally permitted.\n\ng) Collecting data for advertising purposes and sending advertising of any kind and communications for sales purposes or others of a commercial nature without prior request or consent.\n\nAll contents of the Website, such as texts, photographs, graphics, images, icons, technology, software, as well as its graphic design and source codes, constitute a work whose property belongs to THE WEBSITE OWNER, without any of the exploitation rights over them being understood to be transferred to the USER beyond what is strictly necessary for the correct use of the Website.\n\nUsers accessing this Website may view the contents and make, where appropriate, authorized private copies provided that the reproduced elements are not subsequently transferred to third parties, nor installed on servers connected to networks, nor subject to any type of exploitation.\n\nLikewise, all trademarks, trade names or distinctive signs of any kind that appear on the Website are the property of THE WEBSITE OWNER, without it being understood that the use of or access to the same attributes any right over them to the USER.\n\nThe distribution, modification, transfer or public communication of the contents and any other act that has not been expressly authorized by the owner of the exploitation rights are prohibited.\n\nThe establishment of a hyperlink does not imply in any case the existence of relations between THE WEBSITE OWNER and the owner of the website on which it is established, nor the acceptance and approval by THE WEBSITE OWNER of its contents or services.\n\nTHE WEBSITE OWNER is not responsible for the use that each USER makes of the materials made available on this Website or for the actions performed based on them.`,
  },
  age: {
    heading: '4.1 Age of Majority',
    body: `This WEBSITE is intended exclusively for persons over 18 years of age. Therefore, the use of the WEBSITE and browsing through it by minors is expressly prohibited. Likewise, we do not admit minors with parental permission, nor legally emancipated minors. If you are a minor, leave the WEBSITE immediately.\n\nThe SERVICE PROVIDER reserves the right to delete, block and not allow new publications to any USER about whom there are suspicions or indications that they are a minor.\n\nThe SERVICE PROVIDER reserves the right to ask any USER for a legal accrediting document (ID, Passport) showing their age and an identifying photograph to RESUME the service.\n\nEvery PERSONAL WEBSITE has a form with a "REPORT" button where you can report the minority of any of our USERS and we will act FORCEFULLY.\n\nWe take the control of the age of majority of USERS very seriously, so if we detect false reports by a USER against another USER, we may PERMANENTLY restrict the service to whoever misuses the WEBSITE reporting system.`,
  },
  exclusion: {
    heading: '4.2 Exclusion of Warranties and Liability',
    body: `The content of this Website is of a general nature and has a merely informative purpose, without fully guaranteeing access to all contents, nor their completeness, correctness, validity or timeliness, nor their suitability or usefulness for a specific purpose.\n\nTHE WEBSITE OWNER excludes, to the extent permitted by law, any liability for damages of any kind arising from:\n\na) The impossibility of accessing the Website or the lack of truthfulness, accuracy, completeness and/or currency of the contents, as well as the existence of defects of all kinds in the contents transmitted, disseminated, stored, made available, accessed through the Website or the services offered.\n\nb) The presence of viruses or other elements in the contents that may cause alterations in the computer systems, electronic documents or user data.\n\nc) Breach of laws, good faith, public order, traffic uses and this legal notice as a consequence of incorrect use of the Website.\n\nLikewise, THE WEBSITE OWNER declines any responsibility regarding information found outside this Website and not managed directly by our webmaster. The function of the links appearing on this Website is exclusively to inform the USER about the existence of other sources likely to expand the contents offered by this Website. THE WEBSITE OWNER does not guarantee nor is responsible for the operation or accessibility of the linked sites; nor does it suggest, invite or recommend visiting them, so it will also not be responsible for the result obtained. THE WEBSITE OWNER is not responsible for the establishment of hyperlinks by third parties.`,
  },
  illegal: {
    heading: '4.3 Procedure in Case of Illegal Activities',
    body: `In the event that any USER or third party considers that there are facts or circumstances revealing the illegal nature of the use of any content and/or the performance of any activity on the web pages included or accessible through the Website, they must send a notification to THE WEBSITE OWNER duly identifying themselves and specifying the alleged infringements.`,
  },
  publications: {
    heading: '4.4 Publications',
    body: `The administrative information provided through the Website does not replace the legal publication of laws, regulations, plans, general provisions and acts that must be formally published in the official gazettes of public administrations, which constitute the only instrument that attests to their authenticity and content. The information available on this Website should be understood as a guide without purpose of legal validity.`,
  },
  contentReview: {
    heading: '4.5 Content Review and Control',
    body: `Following the modification of new requirements of payment processing systems, verification of the age of users publishing adult content on the Website is mandatory. Therefore, the Website through automated methods and/or manual verification will try to ensure compliance with such requirements in users between 18 and 21 years of age.\n\nTo this end, no listing will be published without prior review (between 24-72 hours), and once reviewed, when the circumstances mentioned in the previous point occur, the advertiser will be required to prove their age of majority. This process includes verification of the identification document, i.e., National Identity Document ("ID"), Passport, or other identification document from the corresponding country of issuance, always complying with the highest standards of confidentiality and privacy.\n\nThe Website will deny registration to Users or will delete or cancel the account of Users who, having completed the age verification process:\n\n• Are under 18 years of age;\n• Present discrepancies between the data provided during registration and the person appearing in the content;\n• It has not been possible to verify with complete certainty the age of the advertiser;\n• Or if the information and data provided by the advertiser may give rise to a false identity.\n\nLikewise, the Website will carry out periodic reviews and manual checks of all content alterations that occur. Abusive content will be automatically blocked through a prohibited word filtering recognition system, as well as a fake photo detection system. Publication that includes:\n\n• Any nudity or sexual exhibition, even of persons over 18 years of age;\n• Proposals for prostitution, human trafficking and/or slavery of any kind, including modern slavery;\n• Rape or any type of physical abuse;\n• Bestiality (sexual interaction with animals);\n• Drug and alcohol abuse.\n\nIn the event of detecting or having indications of the commission of any crime through the platform, the Website will bring such facts to the attention of the competent authorities, providing all required information through the established legal procedures.`,
  },
  intellectual: {
    heading: '5. INTELLECTUAL AND INDUSTRIAL PROPERTY',
    body: `THE WEBSITE OWNER, by itself or as assignee, is the owner of all intellectual and industrial property rights of its Website, as well as the elements contained therein (including but not limited to images, sound, audio, video, software or texts; trademarks or logos, color combinations, structure and design, selection of materials used, computer programs necessary for its operation, access and use, etc.), owned by THE WEBSITE OWNER. They will therefore be works protected as intellectual property by the Dutch legal system, with both Dutch and EU regulations applicable in this field, as well as international treaties relating to the matter and signed by the Netherlands.\n\nAll rights reserved. Pursuant to EU Directive 2001/29/EC on copyright, the reproduction, distribution and public communication, including its modality of making available, of all or part of the contents of this Website, for commercial purposes, in any medium and by any technical means, without the authorization of THE WEBSITE OWNER, is expressly prohibited.\n\nThe USER undertakes to respect the Intellectual and Industrial Property rights owned by THE WEBSITE OWNER. You may view the elements of the portal and even print, copy and store them on the hard drive of your computer or on any other physical medium provided it is solely and exclusively for your personal and private use. The USER must refrain from deleting, altering, circumventing or manipulating any protection device or security system that may be installed on the pages of THE WEBSITE OWNER.`,
  },
  legal: {
    heading: '6. LEGAL ACTIONS, APPLICABLE LAW AND JURISDICTION',
    body: `THE WEBSITE OWNER also reserves the right to bring any civil or criminal actions it deems appropriate for the improper use of its Website and contents, or for breach of these conditions.\n\nThe relationship between the USER and the provider shall be governed by the regulations in force and applicable in the Netherlands. Should any dispute arise, the parties may submit their conflicts to arbitration or resort to ordinary jurisdiction in compliance with the rules on jurisdiction and competence in this regard. THE WEBSITE OWNER is domiciled in ${company.country}.\n\nThe language used shall be English, Spanish and Portuguese.`,
  },
};

/* ── Spanish ── */
const es = {
  title: 'Condiciones de Uso — Aviso Legal',
  brand: 'BuscaTrans',
  object: {
    heading: '1. OBJETO',
    body: `El presente aviso legal regula el uso y utilización de los sitios web buscatrans.com y shemalewiki.online (en adelante "el Sitio Web"), del que es titular ${company.name} (en adelante, EL PROPIETARIO DE LA WEB).\n\nLa navegación por el Sitio Web le atribuye la condición de USUARIO del mismo y conlleva su aceptación plena y sin reservas de todas y cada una de las condiciones publicadas en este aviso legal, advirtiendo de que dichas condiciones podrán ser modificadas sin notificación previa por parte de EL PROPIETARIO DE LA WEB, en cuyo caso se procederá a su publicación y aviso con la máxima antelación posible.\n\nPor ello es recomendable leer atentamente su contenido en caso de desear acceder y hacer uso de la información y de los servicios ofrecidos desde este Sitio Web.\n\nEL PROPIETARIO DE LA WEB, a través de BuscaTrans y ShemaleWiki, ofrece servicios de publicidad a través de directorios online, por medio de anuncios publicados por los propios profesionales y difusión de estos, existiendo dos tipos:\n\nDe profesionales de compañía o escorts. En ambos casos quedarán prohibidos publicitar anuncios de servicios de acompañamiento donde se promueva la prostitución, entendiendo aquellos donde ese acompañamiento es referido a una prestación de servicios sexuales con contraprestación económica.\n\nDe contactos de profesionales dedicados a la realización de masajes eróticos y videollamadas.\n\nEl USUARIO, además, se obliga a hacer un uso correcto del Sitio Web de conformidad con las leyes, la buena fe, el orden público, los usos del tráfico y el presente Aviso Legal, y responderá frente a EL PROPIETARIO DE LA WEB o frente a terceros, de cualesquiera daños y perjuicios que pudieran causarse como consecuencia del incumplimiento de dicha obligación.\n\nCualquier utilización distinta a la autorizada está expresamente prohibida, pudiendo EL PROPIETARIO DE LA WEB denegar o retirar el acceso y su uso en cualquier momento.`,
  },
  identification: {
    heading: '2. IDENTIFICACIÓN',
    body: `EL PROPIETARIO DE LA WEB, en cumplimiento de la Directiva 2000/31/CE de comercio electrónico, le informa de que:\n\nSu denominación social es: ${company.name}\nDomicilio: ${company.country}\nEmail de contacto: ${company.email}`,
  },
  communications: {
    heading: '3. COMUNICACIONES',
    body: `Para comunicarse con nosotros, ponemos a su disposición los siguientes medios de contacto:\n\nEmail: ${company.email}\n\nTodas las notificaciones y comunicaciones entre los usuarios y EL PROPIETARIO DE LA WEB se considerarán eficaces, a todos los efectos, cuando se realicen a través de cualquiera de los medios detallados anteriormente.`,
  },
  conditions: {
    heading: '4. CONDICIONES DE ACCESO Y UTILIZACIÓN',
    body: `El Sitio Web y sus servicios son de acceso libre y gratuito. No obstante, EL PROPIETARIO DE LA WEB puede condicionar la utilización de algunos de los servicios ofrecidos en su web a la previa cumplimentación del correspondiente formulario.\n\nEl USUARIO garantiza la autenticidad y actualidad de todos aquellos datos que comunique a EL PROPIETARIO DE LA WEB y será el único responsable de las manifestaciones falsas o inexactas que realice.\n\nEl USUARIO se compromete expresamente a hacer un uso adecuado de los contenidos y servicios de EL PROPIETARIO DE LA WEB y a no emplearlos para, entre otros:\n\na) Difundir contenidos delictivos, violentos, pornográficos, racistas, xenófobos, ofensivos, de apología del terrorismo o, en general, contrarios a la ley o al orden público.\n\nb) Introducir en la red virus informáticos o realizar actuaciones susceptibles de alterar, estropear, interrumpir o generar errores o daños en los documentos electrónicos, datos o sistemas físicos y lógicos de EL PROPIETARIO DE LA WEB o de terceras personas; así como obstaculizar el acceso de otros usuarios al Sitio Web y a sus servicios mediante el consumo masivo de los recursos informáticos a través de los cuales EL PROPIETARIO DE LA WEB presta sus servicios.\n\nc) Intentar acceder a las cuentas de correo electrónico de otros usuarios o a áreas restringidas de los sistemas informáticos de EL PROPIETARIO DE LA WEB o de terceros y, en su caso, extraer información.\n\nd) Vulnerar los derechos de propiedad intelectual o industrial, así como violar la confidencialidad de la información de EL PROPIETARIO DE LA WEB o de terceros.\n\ne) Suplantar la identidad de cualquier otro usuario.\n\nf) Reproducir, copiar, distribuir, poner a disposición de, o cualquier otra forma de comunicación pública, transformar o modificar los contenidos, a menos que se cuente con la autorización del titular de los correspondientes derechos o ello resulte legalmente permitido.\n\ng) Recabar datos con finalidad publicitaria y de remitir publicidad de cualquier clase y comunicaciones con fines de venta u otras de naturaleza comercial sin que medie su previa solicitud o consentimiento.\n\nTodos los contenidos del Sitio Web, como textos, fotografías, gráficos, imágenes, iconos, tecnología, software, así como su diseño gráfico y códigos fuente, constituyen una obra cuya propiedad pertenece a EL PROPIETARIO DE LA WEB, sin que puedan entenderse cedidos al USUARIO ninguno de los derechos de explotación sobre los mismos más allá de lo estrictamente necesario para el correcto uso de la web.\n\nEn definitiva, los usuarios que accedan a este Sitio Web pueden visualizar los contenidos y efectuar, en su caso, copias privadas autorizadas siempre que los elementos reproducidos no sean cedidos posteriormente a terceros, ni se instalen a servidores conectados a redes, ni sean objeto de ningún tipo de explotación.\n\nAsimismo, todas las marcas, nombres comerciales o signos distintivos de cualquier clase que aparecen en el Sitio Web son propiedad de EL PROPIETARIO DE LA WEB, sin que pueda entenderse que el uso o acceso al mismo atribuya al USUARIO derecho alguno sobre los mismos.\n\nLa distribución, modificación, cesión o comunicación pública de los contenidos y cualquier otro acto que no haya sido expresamente autorizado por el titular de los derechos de explotación quedan prohibidos.\n\nEl establecimiento de un hiperenlace no implica en ningún caso la existencia de relaciones entre EL PROPIETARIO DE LA WEB y el propietario del sitio web en la que se establezca, ni la aceptación y aprobación por parte de EL PROPIETARIO DE LA WEB de sus contenidos o servicios.\n\nEL PROPIETARIO DE LA WEB no se responsabiliza del uso que cada USUARIO les dé a los materiales puestos a disposición en este Sitio Web ni de las actuaciones que realice en base a los mismos.`,
  },
  age: {
    heading: '4.1 Mayoría de edad',
    body: `El presente SITIO WEB está destinado exclusivamente a personas mayores de 18 años. Por ello, queda expresamente prohibida la utilización del SITIO WEB y navegación a través del mismo por menores de edad. Asimismo, no admitimos menores con permiso paterno, ni menores legalmente emancipados. Si eres menor de edad, abandona inmediatamente el SITIO WEB.\n\nEl PROVEEDOR DE SERVICIOS se reserva el derecho de borrar, bloquear y no permitir nuevas publicaciones a cualquier USUARIO sobre el cual existiesen sospechas o indicios de que es menor de edad.\n\nEl PROVEEDOR DE SERVICIOS se reserva el derecho de pedir a cualquier USUARIO un documento legal acreditativo (DNI, Cédula, IFE, Pasaporte) donde se muestre su edad y una fotografía identificativa para REANUDAR el servicio.\n\nToda PÁGINA WEB DE CARÁCTER PERSONAL posee un formulario con botón "DENUNCIAR" donde puede reportarnos la minoría de edad de cualquiera de nuestros USUARIOS y actuaremos con CONTUNDENCIA.\n\nNos tomamos muy en serio el control de la mayoría de edad de los USUARIOS, de modo que si detectamos falsas denuncias por parte de un USUARIO a otro USUARIO, podemos restringir el servicio de forma PERMANENTE al que haga mal uso del sistema de denuncias del SITIO WEB.`,
  },
  exclusion: {
    heading: '4.2 EXCLUSIÓN DE GARANTÍAS Y DE RESPONSABILIDAD EN EL ACCESO Y LA UTILIZACIÓN',
    body: `El contenido del presente Sitio Web es de carácter general y tiene una finalidad meramente informativa, sin que se garantice plenamente el acceso a todos los contenidos, ni su exhaustividad, corrección, vigencia o actualidad, ni su idoneidad o utilidad para un objetivo específico.\n\nEL PROPIETARIO DE LA WEB excluye, hasta donde permite el ordenamiento jurídico, cualquier responsabilidad por los daños y perjuicios de toda naturaleza derivados de:\n\na) La imposibilidad de acceso al Sitio Web o la falta de veracidad, exactitud, exhaustividad y/o actualidad de los contenidos, así como la existencia de vicios y defectos de toda clase de los contenidos transmitidos, difundidos, almacenados, puestos a disposición, a los que se haya accedido a través del Sitio Web o de los servicios que se ofrecen.\n\nb) La presencia de virus o de otros elementos en los contenidos que puedan producir alteraciones en los sistemas informáticos, documentos electrónicos o datos de los usuarios.\n\nc) El incumplimiento de las leyes, la buena fe, el orden público, los usos del tráfico y el presente aviso legal como consecuencia del uso incorrecto del Sitio Web. En particular, y a modo ejemplificativo, EL PROPIETARIO DE LA WEB no se hace responsable de las actuaciones de terceros que vulneren derechos de propiedad intelectual e industrial, secretos empresariales, derechos al honor, a la intimidad personal y familiar y a la propia imagen, así como la normativa en materia de competencia desleal y publicidad ilícita.\n\nAsimismo, EL PROPIETARIO DE LA WEB declina cualquier responsabilidad respecto a la información que se halle fuera de esta web y no sea gestionada directamente por nuestro webmaster. La función de los links que aparecen en esta web es exclusivamente la de informar al usuario sobre la existencia de otras fuentes susceptibles de ampliar los contenidos que ofrece este Sitio Web. EL PROPIETARIO DE LA WEB no garantiza ni se responsabiliza del funcionamiento o accesibilidad de los sitios enlazados; ni sugiere, invita o recomienda la visita a los mismos, por lo que tampoco será responsable del resultado obtenido. EL PROPIETARIO DE LA WEB no se responsabiliza del establecimiento de hipervínculos por parte de terceros.`,
  },
  illegal: {
    heading: '4.3 PROCEDIMIENTO EN CASO DE REALIZACIÓN DE ACTIVIDADES DE CARÁCTER ILÍCITO',
    body: `En el caso de que cualquier USUARIO o un tercero considere que existen hechos o circunstancias que revelen el carácter ilícito de la utilización de cualquier contenido y/o de la realización de cualquier actividad en las páginas web incluidas o accesibles a través del Sitio Web, deberá enviar una notificación a EL PROPIETARIO DE LA WEB identificándose debidamente y especificando las supuestas infracciones.`,
  },
  publications: {
    heading: '4.4 PUBLICACIONES',
    body: `La información administrativa facilitada a través del Sitio Web no sustituye la publicidad legal de las leyes, normativas, planes, disposiciones generales y actos que tengan que ser publicados formalmente a los diarios oficiales de las administraciones públicas, que constituyen el único instrumento que da fe de su autenticidad y contenido. La información disponible en este Sitio Web debe entenderse como una guía sin propósito de validez legal.`,
  },
  contentReview: {
    heading: '4.5 Revisión y control de contenidos',
    body: `Tras la modificación de las nuevas exigencias de los sistemas de procesamiento de pagos, es de obligado cumplimiento la verificación de la edad de los usuarios que publican contenido adulto en la web. Por eso el Sitio Web a través de métodos automatizados y/o a través de una comprobación manual tratará de garantizar el cumplimiento de tales requisitos en aquellos usuarios comprendidos entre los 18 a 21 años.\n\nPara ello no se publicará ningún anuncio sin antes revisar el mismo (entre 24-72 horas), y una vez revisado, cuando se den las circunstancias mencionadas en el punto anterior, se requerirá al anunciante que acredite su mayoría de edad. Este proceso incluye la comprobación del documento acreditativo de identificación, esto es, Documento Nacional de Identidad ("DNI"), Pasaporte, u otro documento identificativo del país de emisión correspondiente, siempre cumpliendo con los estándares más altos de confidencialidad y privacidad.\n\nEl Sitio Web denegará el registro a los Usuarios o eliminará o cancelará la cuenta de los Usuarios que, habiendo realizado el proceso de verificación de edad:\n\n• Son menores de 18 años de edad;\n• Presentan discrepancias entre los datos proporcionados durante el registro y la persona que aparece en el contenido;\n• No ha sido posible verificar con total certeza la edad del anunciante;\n• O si la información y datos facilitados por el anunciante pueden dar lugar a una identidad falsa.\n\nAsimismo, el Sitio Web realizará revisiones periódicas y hará comprobaciones manuales de todas las alteraciones de contenidos que se produzcan. Los contenidos de tipo abusivos se bloquearán automáticamente mediante un sistema de reconocimiento de filtrado de palabras prohibidas, así como un sistema de detección de fotografías falsas que informan de la edad de la misma. No se permitirá la publicación que incluya:\n\n• Cualquier desnudez o exhibición sexual, incluso de personas mayores de 18 años;\n• Propuestas de prostitución, el tráfico de personas y/o la esclavitud de cualquier tipo, incluyendo la esclavitud moderna;\n• Violación o cualquier tipo de abuso físico;\n• Bestialidad (interacción sexual con animales);\n• Abuso de drogas y alcohol.\n\nEn el supuesto de detectar o tener indicios de la comisión de cualquier delito a través de la plataforma, el Sitio Web se pondrá en conocimiento de tales hechos a las autoridades competentes aportando toda la información requerida mediante los trámites legales establecidos.`,
  },
  intellectual: {
    heading: '5. PROPIEDAD INTELECTUAL E INDUSTRIAL',
    body: `EL PROPIETARIO DE LA WEB por sí misma o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo, imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.), titularidad de EL PROPIETARIO DE LA WEB. Serán, por consiguiente, obras protegidas como propiedad intelectual por el ordenamiento jurídico neerlandés, siéndoles aplicables tanto la normativa neerlandesa y comunitaria en este campo, como los tratados internacionales relativos a la materia y suscritos por los Países Bajos.\n\nTodos los derechos reservados. Quedan expresamente prohibidas la reproducción, la distribución y la comunicación pública, incluida su modalidad de puesta a disposición, de la totalidad o parte de los contenidos de esta página web, con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización de EL PROPIETARIO DE LA WEB.\n\nEl USUARIO se compromete a respetar los derechos de Propiedad Intelectual e Industrial titularidad de EL PROPIETARIO DE LA WEB. Podrá visualizar los elementos del portal e incluso imprimirlos, copiarlos y almacenarlos en el disco duro de su ordenador o en cualquier otro soporte físico siempre y cuando sea, única y exclusivamente, para su uso personal y privado. El USUARIO deberá abstenerse de suprimir, alterar, eludir o manipular cualquier dispositivo de protección o sistema de seguridad que estuviera instalado en las páginas de EL PROPIETARIO DE LA WEB.`,
  },
  legal: {
    heading: '6. ACCIONES LEGALES, LEGISLACIÓN APLICABLE Y JURISDICCIÓN',
    body: `EL PROPIETARIO DE LA WEB se reserva, asimismo, la facultad de presentar las acciones civiles o penales que considere oportunas por la utilización indebida de su Sitio Web y contenidos, o por el incumplimiento de las presentes condiciones.\n\nLa relación entre el USUARIO y el prestador se regirá por la normativa vigente y de aplicación en los Países Bajos. De surgir cualquier controversia las partes podrán someter sus conflictos a arbitraje o acudir a la jurisdicción ordinaria cumpliendo con las normas sobre jurisdicción y competencia al respecto. EL PROPIETARIO DE LA WEB tiene su domicilio en ${company.country}.\n\nLos idiomas utilizados serán el español, inglés y portugués.`,
  },
};

/* ── Portuguese ── */
const pt = {
  title: 'Termos de Uso — Aviso Legal',
  brand: 'ShemaleWiki',
  object: {
    heading: '1. OBJETO',
    body: `O presente aviso legal regula o uso e utilização dos sites shemalewiki.online e buscatrans.com (doravante "o Site"), de que é titular ${company.name} (doravante, O PROPRIETÁRIO DO SITE).\n\nA navegação pelo Site atribui-lhe a condição de UTILIZADOR do mesmo e implica a sua aceitação plena e sem reservas de todas e cada uma das condições publicadas neste aviso legal, advertindo que as referidas condições poderão ser modificadas sem aviso prévio por parte de O PROPRIETÁRIO DO SITE, caso em que se procederá à sua publicação e aviso com a máxima antecedência possível.\n\nPelo que é recomendável ler atentamente o seu conteúdo caso deseje aceder e fazer uso da informação e dos serviços oferecidos a partir deste Site.\n\nO PROPRIETÁRIO DO SITE, através de ShemaleWiki e BuscaTrans, oferece serviços de publicidade através de diretórios online, por meio de anúncios publicados pelos próprios profissionais e divulgação destes. Ficam proibidos anúncios de serviços de acompanhamento onde se promova a prostituição, entendendo aqueles onde esse acompanhamento é referido a uma prestação de serviços sexuais com contrapartida económica.\n\nO UTILIZADOR, além disso, obriga-se a fazer um uso correto do Site de acordo com as leis, a boa-fé, a ordem pública, os usos do tráfego e o presente Aviso Legal, e responderá perante O PROPRIETÁRIO DO SITE ou perante terceiros, por quaisquer danos e prejuízos que possam ser causados como consequência do incumprimento de tal obrigação.\n\nQualquer utilização diferente da autorizada está expressamente proibida, podendo O PROPRIETÁRIO DO SITE negar ou retirar o acesso e seu uso a qualquer momento.`,
  },
  identification: {
    heading: '2. IDENTIFICAÇÃO',
    body: `O PROPRIETÁRIO DO SITE, em cumprimento da Diretiva 2000/31/CE sobre comércio eletrónico, informa que:\n\nA sua denominação social é: ${company.name}\nDomicílio: ${company.country}\nEmail de contacto: ${company.email}`,
  },
  communications: {
    heading: '3. COMUNICAÇÕES',
    body: `Para comunicar connosco, colocamos à sua disposição os seguintes meios de contacto:\n\nEmail: ${company.email}\n\nTodas as notificações e comunicações entre os utilizadores e O PROPRIETÁRIO DO SITE considerar-se-ão eficazes, para todos os efeitos, quando realizadas através de qualquer dos meios detalhados anteriormente.`,
  },
  conditions: {
    heading: '4. CONDIÇÕES DE ACESSO E UTILIZAÇÃO',
    body: `O Site e os seus serviços são de acesso livre e gratuito. No entanto, O PROPRIETÁRIO DO SITE pode condicionar a utilização de alguns dos serviços oferecidos no seu site ao preenchimento prévio do correspondente formulário.\n\nO UTILIZADOR garante a autenticidade e atualidade de todos os dados que comunique a O PROPRIETÁRIO DO SITE e será o único responsável pelas declarações falsas ou inexatas que realize.\n\nO UTILIZADOR compromete-se expressamente a fazer um uso adequado dos conteúdos e serviços de O PROPRIETÁRIO DO SITE e a não os empregar para, entre outros:\n\na) Difundir conteúdos delituosos, violentos, pornográficos, racistas, xenófobos, ofensivos, de apologia do terrorismo ou, em geral, contrários à lei ou à ordem pública.\n\nb) Introduzir na rede vírus informáticos ou realizar atuações suscetíveis de alterar, danificar, interromper ou gerar erros ou danos nos documentos eletrónicos, dados ou sistemas físicos e lógicos de O PROPRIETÁRIO DO SITE ou de terceiros; bem como obstaculizar o acesso de outros utilizadores ao Site e aos seus serviços.\n\nc) Tentar aceder às contas de correio eletrónico de outros utilizadores ou a áreas restritas dos sistemas informáticos de O PROPRIETÁRIO DO SITE ou de terceiros e, se for o caso, extrair informação.\n\nd) Violar os direitos de propriedade intelectual ou industrial, bem como violar a confidencialidade da informação de O PROPRIETÁRIO DO SITE ou de terceiros.\n\ne) Suplantar a identidade de qualquer outro utilizador.\n\nf) Reproduzir, copiar, distribuir, disponibilizar, ou qualquer outra forma de comunicação pública, transformar ou modificar os conteúdos, a menos que se conte com a autorização do titular dos correspondentes direitos ou isso resulte legalmente permitido.\n\ng) Recolher dados com finalidade publicitária e de remeter publicidade de qualquer tipo e comunicações com fins de venda ou outras de natureza comercial sem que haja solicitação ou consentimento prévios.\n\nTodos os conteúdos do Site, como textos, fotografias, gráficos, imagens, ícones, tecnologia, software, bem como o seu design gráfico e códigos fonte, constituem uma obra cuja propriedade pertence a O PROPRIETÁRIO DO SITE, sem que possam entender-se cedidos ao UTILIZADOR nenhum dos direitos de exploração sobre os mesmos para além do estritamente necessário para o correto uso do site.\n\nOs utilizadores que acedam a este Site podem visualizar os conteúdos e efetuar, se for o caso, cópias privadas autorizadas desde que os elementos reproduzidos não sejam posteriormente cedidos a terceiros, nem se instalem em servidores conectados a redes, nem sejam objeto de nenhum tipo de exploração.\n\nTodas as marcas, nomes comerciais ou signos distintivos de qualquer tipo que aparecem no Site são propriedade de O PROPRIETÁRIO DO SITE, sem que possa entender-se que o uso ou acesso ao mesmo atribui ao UTILIZADOR direito algum sobre os mesmos.\n\nA distribuição, modificação, cedência ou comunicação pública dos conteúdos e qualquer outro ato que não tenha sido expressamente autorizado pelo titular dos direitos de exploração ficam proibidos.\n\nO estabelecimento de um hiperlink não implica em caso algum a existência de relações entre O PROPRIETÁRIO DO SITE e o proprietário do site no qual se estabeleça, nem a aceitação e aprovação por parte de O PROPRIETÁRIO DO SITE dos seus conteúdos ou serviços.\n\nO PROPRIETÁRIO DO SITE não se responsabiliza pelo uso que cada UTILIZADOR dê aos materiais colocados à disposição neste Site nem pelas atuações que realize com base nos mesmos.`,
  },
  age: {
    heading: '4.1 Maioridade',
    body: `O presente SITE está destinado exclusivamente a pessoas maiores de 18 anos. Por isso, fica expressamente proibida a utilização do SITE e navegação através do mesmo por menores de idade. Do mesmo modo, não admitimos menores com permissão parental, nem menores legalmente emancipados. Se fores menor de idade, abandona imediatamente o SITE.\n\nO PRESTADOR DE SERVIÇOS reserva-se o direito de apagar, bloquear e não permitir novas publicações a qualquer UTILIZADOR sobre o qual existam suspeitas ou indícios de que é menor de idade.\n\nO PRESTADOR DE SERVIÇOS reserva-se o direito de pedir a qualquer UTILIZADOR um documento legal comprovativo (Cartão de Cidadão, Passaporte) onde se mostre a sua idade e uma fotografia identificativa para RETOMAR o serviço.\n\nCada PÁGINA WEB PESSOAL possui um formulário com botão "DENUNCIAR" onde pode reportar a menoridade de qualquer dos nossos UTILIZADORES e atuaremos com CONTUNDÊNCIA.\n\nLevamos muito a sério o controlo da maioridade dos UTILIZADORES, de modo que se detetarmos falsas denúncias por parte de um UTILIZADOR a outro UTILIZADOR, podemos restringir o serviço de forma PERMANENTE a quem faça mau uso do sistema de denúncias do SITE.`,
  },
  exclusion: {
    heading: '4.2 EXCLUSÃO DE GARANTIAS E RESPONSABILIDADE',
    body: `O conteúdo do presente Site é de carácter geral e tem uma finalidade meramente informativa, sem que se garanta plenamente o acesso a todos os conteúdos, nem a sua exaustividade, correção, vigência ou atualidade, nem a sua idoneidade ou utilidade para um objetivo específico.\n\nO PROPRIETÁRIO DO SITE exclui, até onde permite o ordenamento jurídico, qualquer responsabilidade por danos e prejuízos de toda a natureza derivados de:\n\na) A impossibilidade de acesso ao Site ou a falta de veracidade, exatidão, exaustividade e/ou atualidade dos conteúdos, bem como a existência de vícios e defeitos de toda a classe dos conteúdos transmitidos, difundidos, armazenados, colocados à disposição, aos que se tenha acedido através do Site ou dos serviços que se oferecem.\n\nb) A presença de vírus ou de outros elementos nos conteúdos que possam produzir alterações nos sistemas informáticos, documentos eletrónicos ou dados dos utilizadores.\n\nc) O incumprimento das leis, a boa-fé, a ordem pública, os usos do tráfego e o presente aviso legal como consequência do uso incorreto do Site.\n\nDo mesmo modo, O PROPRIETÁRIO DO SITE declina qualquer responsabilidade com respeito à informação que se encontre fora deste site e não seja gerida diretamente pelo nosso webmaster. A função dos links que aparecem neste site é exclusivamente a de informar o utilizador sobre a existência de outras fontes suscetíveis de ampliar os conteúdos que oferece este Site. O PROPRIETÁRIO DO SITE não garante nem se responsabiliza pelo funcionamento ou acessibilidade dos sites linkados; nem sugere, convida ou recomenda a visita aos mesmos, pelo que também não será responsável pelo resultado obtido. O PROPRIETÁRIO DO SITE não se responsabiliza pelo estabelecimento de hiperlinks por parte de terceiros.`,
  },
  illegal: { heading: '4.3 Procedimento em caso de atividades ilícitas', body: en.illegal.body },
  publications: { heading: '4.4 Publicações', body: en.publications.body },
  contentReview: { heading: '4.5 Revisão e controlo de conteúdos', body: en.contentReview.body },
  intellectual: {
    heading: '5. PROPRIEDADE INTELECTUAL E INDUSTRIAL',
    body: `O PROPRIETÁRIO DO SITE por si mesmo ou como cessionário, é titular de todos os direitos de propriedade intelectual e industrial do seu site, bem como dos elementos nele contidos (a título enunciativo, imagens, som, áudio, vídeo, software ou textos; marcas ou logótipos, combinações de cores, estrutura e design, seleção de materiais usados, programas de computador necessários para o seu funcionamento, acesso e uso, etc.), titularidade de O PROPRIETÁRIO DO SITE. Serão, por conseguinte, obras protegidas como propriedade intelectual pelo ordenamento jurídico neerlandês, sendo-lhes aplicáveis tanto a normativa neerlandesa e comunitária neste campo, como os tratados internacionais relativos à matéria e subscritos pelos Países Baixos.\n\nTodos os direitos reservados. Ficam expressamente proibidas a reprodução, a distribuição e a comunicação pública, incluindo a sua modalidade de colocação à disposição, da totalidade ou parte dos conteúdos deste site, com fins comerciais, em qualquer suporte e por qualquer meio técnico, sem a autorização de O PROPRIETÁRIO DO SITE.\n\nO UTILIZADOR compromete-se a respeitar os direitos de Propriedade Intelectual e Industrial titularidade de O PROPRIETÁRIO DO SITE. Poderá visualizar os elementos do portal e inclusive imprimi-los, copiá-los e armazená-los no disco rígido do seu computador ou em qualquer outro suporte físico sempre e quando seja, única e exclusivamente, para seu uso pessoal e privado. O UTILIZADOR deverá abster-se de suprimir, alterar, eludir ou manipular qualquer dispositivo de proteção ou sistema de segurança que estiver instalado nas páginas de O PROPRIETÁRIO DO SITE.`,
  },
  legal: {
    heading: '6. AÇÕES LEGAIS, LEGISLAÇÃO APLICÁVEL E JURISDIÇÃO',
    body: `O PROPRIETÁRIO DO SITE reserva-se, igualmente, a faculdade de apresentar as ações civis ou penais que considere oportunas pela utilização indevida do seu Site e conteúdos, ou pelo incumprimento das presentes condições.\n\nA relação entre o UTILIZADOR e o prestador reger-se-á pela normativa vigente e de aplicação nos Países Baixos. Se surgir qualquer controvérsia, as partes poderão submeter os seus conflitos a arbitragem ou recorrer à jurisdição ordinária cumprindo as normas sobre jurisdição e competência a respeito. O PROPRIETÁRIO DO SITE tem o seu domicílio em ${company.country}.\n\nOs idiomas utilizados serão o português, espanhol e inglês.`,
  },
};

const contents = { en, es, pt };

export default function Terms() {
  const lang = getLang();
  const t = contents[lang] || en;
  const bt = isBT();
  const brand = bt ? 'BuscaTrans' : 'ShemaleWiki';

  const sections = [
    t.object,
    t.identification,
    t.communications,
    t.conditions,
    t.age,
    t.exclusion,
    t.illegal,
    t.publications,
    t.contentReview,
    t.intellectual,
    t.legal,
  ];

  const backLabels = { en: '← Back to home', es: '← Volver al inicio', pt: '← Voltar ao início' };

  return (
    <>
      <SEO
        title={`${t.title} | ${brand}`}
        description={t.title}
        lang={lang}
      />
      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '860px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.5rem',
          marginBottom: '0.5rem',
        }}>{t.title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {brand} · {company.name} · {company.country}
        </p>

        <div className="glass" style={{ padding: '2.5rem' }}>
          {sections.map((s, i) => (
            <div key={i} style={{ marginBottom: i < sections.length - 1 ? '2.5rem' : 0 }}>
              <h2 style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                marginBottom: '0.75rem',
              }}>{s.heading}</h2>
              <div style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                lineHeight: 1.9,
                whiteSpace: 'pre-line',
              }}>{s.body}</div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <Link to={bt ? '/es/' : '/'} style={{ color: 'var(--accent-primary)' }}>
            {backLabels[lang]}
          </Link>
        </p>
      </div>
    </>
  );
}