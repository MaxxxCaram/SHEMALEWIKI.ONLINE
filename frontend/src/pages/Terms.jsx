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
  domains: 'shemalewiki.online y buscatrans.com',
  domainsEn: 'shemalewiki.online and buscatrans.com',
};

/* ══════════════════════════════════════════════
   ENGLISH
   ══════════════════════════════════════════════ */
const en = {
  title: 'Terms and Conditions',
  brand: 'ShemaleWiki',
  lastUpdate: 'June 2026',

  definitions: {
    heading: '1. DEFINITIONS',
    body: `In these Terms and Conditions, the following definitions apply, both in singular and plural.

1.1 Account: the ability to use the Services.
1.2 Advertiser: the natural or legal person who, via the Website, makes themselves available to provide erotic and sexual services.
1.3 Advertisement: an advertisement on the Website in which erotic and/or sexual services are offered by the Advertiser, including all image and video material.
1.4 Terms and Conditions: these terms and conditions, regardless of the form in which they are made known.
1.5 Visitor: the natural person who uses the Website, for example by creating an Account.
1.6 User, you, your: an Advertiser or Visitor.
1.7 Services: the services offered by ${company.name} on the Website, consisting of providing a platform where Advertisers and Visitors can connect through Advertisements for the provision of erotic/sexual services.
1.8 ${company.name}, we, us: ${company.name}, based in ${company.country}.
1.9 Website: the websites ${company.domainsEn}.`,
  },

  general: {
    heading: '2. GENERAL',
    body: `2.1 These Terms and Conditions apply to the use of the Website and Services and all agreements and any other legal acts between the User and ${company.name}. ${company.name} expressly rejects any general terms and conditions of the User. ${company.name} is entitled at all times to amend or supplement these Terms and Conditions. We therefore recommend consulting the Terms and Conditions regularly. If you do not agree with the changes, you may immediately cease using the Website and Services.

2.2 Deviations from the Terms and Conditions are only valid if expressly agreed in writing or by email between ${company.name} and the User.

2.3 If and to the extent that any provision of these Terms and Conditions is declared void or annulled, the remaining provisions shall remain in full force and effect. ${company.name} shall then establish a new provision to replace the void/annulled provision, taking into account the purpose of the void/annulled provision as much as possible.`,
  },

  services: {
    heading: '3. SERVICES',
    body: `3.1 Through the Website, we offer an online platform where Advertisers and Visitors can connect for the provision of erotic and sexual services. Our Services consist of:
• For Advertisers: providing (i) advertising space on the Website for offering erotic and sexual services, and (ii) communication tools (e.g., messaging functions) to connect with Visitors.
• For Visitors: providing an advertising platform with the ability to contact Advertisers about the erotic and sexual services they offer.
The Website may only be used for legal erotic and sexual services.

3.2 We have a facilitating role only and cannot be held responsible for the actions or omissions of Users. We are expressly not involved in the erotic service that an Advertiser offers and/or provides to a Visitor and remain outside any contact between Users and/or any arrangements or agreements that may arise between an Advertiser and a Visitor through use of the Website. We expressly accept no liability for any damage suffered by a Visitor and/or Advertiser as a result of contact between the Visitor and the Advertiser and/or the (erotic) activities between the Visitor and the Advertiser.

3.3 We do not guarantee that the Website or Services will function error-free and meet your expectations. In particular, we do not guarantee that: (i) the information on the Website (including information posted by Users) is accurate, complete, suitable, or current, does not infringe the (property) rights of third parties, or is otherwise unlawful; (ii) the Website will operate uninterrupted, be free of viruses, trojans, and other errors and/or defects, and that any defects will be remedied; (iii) third parties will not use the Website and/or Services unlawfully.

3.4 Content on the Website relating to Advertisements, reviews, and any responses originates from Users. These Users are themselves responsible for the accuracy and completeness of the content they post. We bear no responsibility whatsoever for the content of material posted by Users.`,
  },

  conditions: {
    heading: '4. CONDITIONS FOR USE OF THE WEBSITE AND SERVICES',
    body: `4.1 Visitors must be at least 18 years of age or older. If the Advertiser is a natural person, they must be at least 21 years of age or older. If the Advertiser is a legal entity with multiple sex workers, the sex workers for whom the Advertiser places the Service and/or Advertisement must be at least 21 years of age or older. We are entitled to verify age and, in case of doubt, to request additional proof (e.g., a copy of an ID). The copy of your ID is processed in accordance with the Privacy Policy. If we have doubts about your age, we are also entitled to refuse and/or terminate access to the Website and Services.

4.2 To use certain Services, you must create an Account and provide certain (personal) data (including at least an email address and in some cases name, address, and phone number). For the Account, you will receive a password. The Account and password are strictly personal; you may not allow third parties to use them. We are entitled to modify the password if necessary in the interest of the functioning of the Service. You are liable for any use made of your Account and indemnify us against any third-party claims regarding damages or otherwise, in any way arising from the use made of the Service through your Account.

4.3 One Account may be created per User. Sharing Accounts or registering multiple Accounts is not permitted unless we have given express prior written (or email) consent.

4.4 You guarantee that all (personal) data you provide in the context of the Service (including but not limited to name, address details, phone number, date of birth, ID, and email address) is complete, accurate, and current, and that you use the Website and Service exclusively for yourself or your own organization (in the case of an Advertiser with multiple sex workers). You also guarantee that you will comply with all applicable laws and regulations regarding the provision of erotic/sexual services.

4.5 By posting Advertisements, (personal) data, reviews, or other content on the Website and/or within the Service, you expressly grant ${company.name} permission to publish this (personal) data, Advertisements, reviews, and/or other content on the Website. You guarantee that you are authorized to grant such permission. You acknowledge that the positioning of Advertisements and other information on the Website depends on a number of factors, including but not limited to the fee paid, and that no rights can be derived from this.

4.6 You are responsible and liable for the content of the Advertisements, (personal) data, reviews, and other content you publish on the Website. You guarantee that the content is accurate, current, and reliable, and does not violate applicable laws and regulations, and is not unlawful. You also guarantee that with this data you do not mistreat other Users, do not violate their privacy, and will not harm the interests and good name of ${company.name}.

4.7 The following content may not be posted in Advertisements, reviews, responses to reviews, or anywhere else on the Website or within the Service:
a) content that violates any law or regulation or these Terms and Conditions;
b) content that refers to or relates to any form of illegal prostitution, including but not limited to forced prostitution, blackmail, threats of violence, or otherwise involuntary prostitution, as well as child prostitution, child pornography, and any other illegal/criminal conduct, services, or products, or services or products that could in any way cause harm to third parties;
c) content that infringes intellectual property rights or privacy rights of third parties or violates other rights of ${company.name} or third parties;
d) content featuring sex workers younger than 21 years of age;
e) content that, in our opinion, is contrary to public decency or good taste, violent, threatening, blasphemous, defamatory or libelous, or incites violence or hatred against another or others;
f) content with computer programs (including auto-refreshers/mouse clickers, etc.), files and/or other material containing destructive and unpredictable features such as manipulated files, "hidden" files (e.g., images integrated into audio files), worms, Trojan horses, or bots for scrolling or other activities that disrupt or could disrupt the integrity or functioning of the Website or online communication in general;
g) content that in any way mentions or refers to another website competing with or similar to the Website.
We are at all times entitled, at our own discretion, to modify, shorten, or remove User content from the Website, without this leading in any way to any right of the User to compensation. We will do so, for example, if the content is in violation of Article 4.

4.8 Any (personal) data obtained through the Website may only be used for the purpose for which the User received it, namely responding to an Advertisement or a message received via the Website. It is not permitted to collect and process this data for any other purpose, including — but not limited to — any form of unsolicited communication (spam). If you act in violation of this Article 4.8, you shall forfeit, without further warning or notice of default and without judicial intervention being required, an immediately payable fine of EUR 500 (five hundred euros) per event or per day that the data is used, without prejudice to ${company.name}'s right to take other measures available to it against you and/or claim damages.`,
  },

  zeroTolerance: {
    heading: '5. ZERO TOLERANCE POLICY REGARDING ABUSES',
    body: `5.1 If there is suspicion that you are acting in violation of Article 4.7, we may immediately terminate the agreement and use of the Website and Services without this leading in any way to any right to compensation. We also reserve the right, at our own discretion, to inform the police, judicial authorities, and other relevant bodies and organizations and to file a report. We will, at our own discretion, cooperate with legally valid requests from government/judicial authorities to provide data in the context of investigating the abuses referred to in Article 4.7.

5.2 In the context of our zero tolerance policy regarding abuses in the sex industry, we also call on Visitors to report abuses to us and to the relevant authorities.

5.3 Although we prohibit the use of our Services by Advertisers under 21 years of age and perform age checks, we unfortunately cannot guarantee that an Advertiser is always 21 years or older. If you contact an Advertiser, we ask you to also check the Advertiser's age yourself. If you doubt whether the Advertiser is older than 21, or find that the Advertiser is a minor, you must immediately refrain from any contact with that Advertiser and immediately inform us and/or the police and judicial authorities of your doubt or finding. You may do so anonymously if desired via the appropriate reporting channels.

5.4 If you suspect or have reasonable grounds to believe that an Advertiser is offering their (erotic) services under duress, blackmail, threat of violence, or otherwise involuntarily, you must immediately refrain from any contact with the Advertiser and immediately inform us and/or the police and judicial authorities. You may do so anonymously if desired via the appropriate reporting channels.

5.5 If you believe that certain information on the Website is unlawful, you may also report this to us. We will process the report, provided it meets all the requirements we have set. If the report shows that the contested material is unmistakably unlawful, we will remove it.

5.6 Reports can be made via email: ${company.email}.`,
  },

  privacy: {
    heading: '6. PROCESSING OF PERSONAL DATA',
    body: `${company.name} as Data Controller

6.1 Through the Website and Services (including the Account), we process your (special) personal data with your explicit consent, including data about sexual behavior or sexual orientation. We ensure that the processing of this personal data complies with the General Data Protection Regulation (GDPR) and applicable implementation laws. The Privacy Policy published on the Website applies to the processing of this (special) personal data by us as data controller. We advise you to read this Privacy Policy carefully and save it. Your rights regarding the processing of your personal data are also described there.

${company.name} as Data Processor

6.2 If we process personal data of sex workers affiliated with an Advertiser on behalf of the Advertiser, we process the personal data on behalf of the Advertiser and act as processor, with the Advertiser as the data controller of the personal data of these sex workers, within the meaning of the GDPR. In this case, Articles 6.3 through 6.12 apply.

6.3 We process personal data only if necessary for the fulfillment of our obligations under the agreement with the Advertiser. Other processing will only be carried out after receipt of written instructions from the Advertiser, an order from a court, investigative or other authority, or if a legal obligation exists. We will inform the Advertiser in advance, unless the relevant legal provision does not permit this. We will not retain personal data longer than necessary for the performance of our obligations under the agreement and will delete them afterwards.

6.4 The Advertiser guarantees that the sex worker has given explicit and legally valid consent to process their (special) personal data, including data about sexual behavior or sexual orientation, in an Advertisement or otherwise within the Service. The Advertiser also guarantees that they do not harm the privacy of the sex worker or other third parties and do not act in violation of the GDPR or other applicable laws and regulations.

6.5 The Advertiser indemnifies ${company.name} and holds ${company.name} harmless against all claims, actions, demands from third parties (including sex workers and Visitors) and for any fines and penalty payments from the Data Protection Authority or another supervisory authority resulting from a violation of laws and regulations, in particular the GDPR, or another attributable failure by the Advertiser in fulfilling obligations under these Terms and Conditions.

6.6 We will implement appropriate technical and organizational measures to secure personal data against loss or any form of unlawful processing. These measures guarantee, taking into account the state of the art and the costs of implementation, an appropriate level of security given the risks that the processing and the nature of the data to be protected entail. The measures are also aimed at preventing unnecessary collection and further processing of personal data.

6.7 Upon written request from the Advertiser, we will (i) provide the Advertiser with information about the processing of personal data, including the security measures we have taken, and/or (ii) grant an accredited auditor engaged by the Advertiser access to our systems so that it can be verified whether we act in accordance with the security obligation laid down in Article 6.6. Such investigation will always take place during normal office hours. The costs of the investigation are borne by the Advertiser.

6.8 We will endeavor to provide reasonable cooperation in carrying out the checks referred to in Article 6.7. In addition, we will provide all reasonable cooperation to the Advertiser in fulfilling their obligation to respond to requests from data subjects regarding the exercise of the rights laid down in the GDPR.

6.9 The Advertiser gives us permission to engage sub-processors for the processing of personal data; these are listed in the Privacy Policy. If we wish to add or change sub-processors, we will inform the Advertiser in advance and allow them to object to the change/addition. We will enter into an agreement with these sub-processors incorporating all relevant obligations from this article and the GDPR.

6.10 We will inform the Advertiser as soon as possible, but in any case at least within 48 hours after we discover a breach or a serious attempt thereto, of breaches of the security measures taken by us or a sub-processor engaged by us, if it can reasonably be assumed that this breach leads to a significant risk of loss or unlawful processing of personal data with adverse consequences for this personal data and the privacy of the data subject. This notification contains relevant information about (i) the nature of the breach, (ii) the identified and presumed consequences of the breach for the processing of personal data, and (iii) the measures that will be taken to end or prevent the breach and to limit the negative consequences of the breach.

6.11 We will maintain confidentiality regarding all personal data that we process in the context of the agreement on behalf of the Advertiser. We will not make personal data available to third parties (other than sub-processors), unless there is an order from a court, investigative or other authority, or we are obliged to do so under relevant laws and regulations or a court ruling.

6.12 We will not process or have processed personal data by ourselves or by sub-processors in countries outside the European Economic Area ("EEA") without an adequate level of protection, unless we have obtained prior consent from the Advertiser.`,
  },

  intellectual: {
    heading: '7. INTELLECTUAL PROPERTY RIGHTS',
    body: `7.1 All intellectual property rights relating to the Website belong exclusively to ${company.name} and/or its licensors.

7.2 To the extent that intellectual property rights rest on the content that the User publishes on the Website (e.g., content of an Advertisement), these intellectual property rights remain with the User. The User grants ${company.name} a free, irrevocable, non-exclusive, transferable, sub-licensable, and unlimited right to use the content on and for the benefit of the Website, until the content is removed from the Website by the User. This use includes, but is not limited to, modifying, shortening, reproducing, and making public the content on the Website or in other (advertising) media for the promotion of the Website.

7.3 The User guarantees that the content they post on the Website, including Advertisements, does not infringe any (intellectual property) rights of third parties. The User fully indemnifies ${company.name} against all possible claims of third parties in any way arising from and/or related to the content they have posted on the Website, including any claim based on the assertion that the relevant content infringes any (intellectual property) rights of third parties.

7.4 You may not, without our written consent, make the Website or any content thereof available to third parties in any way, nor reproduce, distribute, transmit, or process it in any other material. This also means that you may not, without prior written consent of ${company.name}, request and/or reuse a substantial part of the content of (a) database(s) and/or repeatedly and systematically request and/or reuse non-substantial parts of the content of a database(s) within the meaning of the Database Act.`,
  },

  liability: {
    heading: '8. LIABILITY AND INDEMNIFICATION',
    body: `8.1 ${company.name} is not liable for any damage suffered by the User as a result of their use of the Website or Services or the inability to use the Website and Services, including (non-exhaustively) damage caused by malware, viruses, and/or the inaccuracy and incompleteness of information on the Website, unless such damage is the result of intent or gross negligence on the part of ${company.name} or its personnel.

8.2 The total liability of ${company.name} is always limited to compensation for direct damage up to a maximum of EUR 25 per event, whereby a series of events is regarded as one event. Direct damage in this context is exclusively understood to mean: (i) the costs you have reasonably had to incur to remedy or resolve the shortcoming of ${company.name} so that the performance of ${company.name} does comply with the agreement; (ii) reasonable costs to prevent or limit damage; and (iii) reasonable costs to determine the cause and extent thereof.

8.3 Any liability of ${company.name} for indirect damage, including but not limited to consequential damage, loss of profit, and loss of revenue, is excluded.

8.4 You indemnify and hold harmless ${company.name} (including its officers and employees) against all liabilities, losses, expenses, legal costs, professional and other costs of any nature whatsoever, as a result of or arising from: (a) any violation by you of these Terms and Conditions; (b) the content you posted on the Website; (c) your violation of the rights of other Users or your unlawful conduct towards other Users.`,
  },

  paidAds: {
    heading: '9. PAID ADVERTISEMENTS AND SUBSCRIPTIONS',
    body: `9.1 Advertisers have the option to publish Advertisements in specific positions on the Website for a fee, giving the Advertisement greater visibility. From the moment the Advertisement is published in the agreed position on the Website, the Advertiser owes the agreed fee. All prices stated on the Website are in euros and include VAT where applicable.

9.2 ${company.name} offers the following subscription tiers for Advertisers:
• Basic (Free): Standard listing with basic visibility on city/country pages.
• Featured (€29/month): Premium placement at the top of search results and city pages, "Verified" badge eligibility, and extended profile features.
• Agency (€99/month): Bulk listing management for agencies with multiple performers, priority support, and dedicated account management.

9.3 The fee owed can be paid via the payment service offered on the Website. If payment is not made or not made on time, or is reversed, we are entitled to remove the posted Advertisement and still charge the amount owed. We are also entitled to charge statutory commercial interest.

9.4 ${company.name} offers Advertisers the option to purchase credit bundles. These credit bundles can be used to pay the fees referred to in Article 9.1. You can view the amount of the credit bundle in your Account. The credit bundle cannot be exchanged for cash and is not otherwise redeemable with ${company.name}. The credit bundle automatically expires if the agreement ends and/or your Account is terminated.`,
  },

  reviews: {
    heading: '10. USE OF REVIEWS',
    body: `10.1 Only if the Advertiser has opted for this can a Visitor publish a review on the Advertiser's Advertisement. The Visitor must be logged in to do so.

10.2 Reviews are checked by a moderator and, upon approval, published with the relevant Advertisement. The Advertiser receives a notification and has the option to respond once. This response is also checked by the moderator and, upon approval, published. The moderator is at all times entitled to reject a review or response. Rejection may occur, for example, if the review or response is in violation of Article 10.3.

10.3 You are responsible and liable for the content of your review and/or response to the review and guarantee that:
a) the review and/or response does not violate the privacy of third parties (including the Advertiser, the relevant sex worker, or Visitor) and does not contain personal data or other descriptions that can be traced to a person;
b) the content of the review is not false, deceptive, misleading, or fraudulent, does not constitute a threat, does not promote or encourage illegal activities, or is otherwise unlawful and/or contrary to the law;
c) with the review or response, you do not mistreat others, including the Advertiser, the sex worker, or Visitor, for example by posting discriminatory, offensive, unnecessarily hurtful, or insulting texts;
d) the review is based on your own experience with the Advertiser or sex worker;
e) the review and/or response does not harm minors;
f) the review and/or response does not contain an advertisement and does not otherwise promote the sale of other products or services, unless expressly agreed that this is permitted;
g) the review and/or response does not contain viruses, corrupt files, or other software or programs that could disrupt or damage the operation of the Website or other computers; and
h) you will not harm the interests and good name of the Website and ${company.name}.

10.4 The Visitor is aware and agrees that their Username (Nickname) will be published with the review.

10.5 If you believe that a review or response is in violation of the Terms and Conditions or Privacy Policy, you can report your complaint via email to ${company.email}. The email must include further reasoning, substantiation, and evidence. ${company.name} will process the complaint and, if applicable, forward it to the relevant Visitor or Advertiser for defense. The complaint will be handled as soon as possible. During the handling of the complaint, the review or response may be (temporarily) removed. Notwithstanding the foregoing, ${company.name} is at all times entitled to remove your review for its own reasons, for example following a complaint.

10.6 If the agreement with a Visitor ends, their reviews are also automatically removed. If the agreement with an Advertiser ends, the reviews relating to this Advertiser and their responses to reviews are automatically removed.

10.7 If the Advertiser removes their Advertisement or withdraws permission to allow reviews on the Advertisement but maintains their Account, the reviews relating to this Advertisement or Advertiser and the responses to those reviews will no longer be displayed on the Website. However, these reviews and responses are retained within ${company.name}'s platform so that they can be displayed again as soon as the Advertiser republishes the Advertisement or chooses to allow reviews again.`,
  },

  duration: {
    heading: '11. DURATION OF THE AGREEMENT',
    body: `11.1 Each agreement between the User and ${company.name} is entered into for an indefinite period. The User may terminate the agreement at any time by deleting the Account and ceasing use.

11.2 ${company.name} will terminate the agreement with immediate effect and delete your Account, without obligation to pay compensation, if you have not logged into your Account for more than six months and you also fail to log in within the further period specified in the reminder sent by us.

11.3 In addition to Article 11.2, ${company.name} reserves the right to terminate the agreement with immediate effect and exclude you from any (further) use of the Services, by, among other things, blocking and/or deleting your Account, without obligation to pay compensation or refund already collected amounts, if you:
– act in any way in violation of these Terms and Conditions;
– infringe (intellectual property) rights of third parties;
– act in violation of applicable laws and regulations.

11.4 In addition to the foregoing, ${company.name} is at all times entitled to terminate the agreement, for any reason, with a notice period of one (1) month.

11.5 Each party is entitled to dissolve the agreement without judicial intervention and without notice of default, in whole or in part, with immediate effect, if the other party has applied for a suspension of payments or this has been granted to them, and/or has been declared bankrupt or a bankruptcy petition has been filed against them.`,
  },

  disputes: {
    heading: '12. DISPUTES AND COMPLAINTS',
    body: `12.1 These Terms and Conditions are governed by Dutch law.

12.2 Disputes arising from or relating to these Terms and Conditions or agreements to which these Terms and Conditions have been declared applicable in whole or in part shall be exclusively settled by the competent court in The Hague (Den Haag), Netherlands.

12.3 If you are a consumer, you may also submit your complaint to the EU Online Dispute Resolution Platform ("ODR Platform"). The ODR Platform is an interactive website that can be consulted online free of charge. The ODR Platform is intended as a simple way for consumers to reach an amicable settlement (online) in the event of disputes with local and international traders, including marketplaces. The ODR Platform is accessible via the following link: http://ec.europa.eu/consumers/odr. Naturally, we advise you to first submit any complaint to us by sending an email to ${company.email}.`,
  },
};

/* ══════════════════════════════════════════════
   SPANISH
   ══════════════════════════════════════════════ */
const es = {
  title: 'Términos y Condiciones',
  brand: 'BuscaTrans',
  lastUpdate: 'Junio 2026',

  definitions: {
    heading: '1. DEFINICIONES',
    body: `En estos Términos y Condiciones, se aplican las siguientes definiciones, tanto en singular como en plural.

1.1 Cuenta: la posibilidad de utilizar los Servicios.
1.2 Anunciante: la persona física o jurídica que, a través del Sitio Web, se pone a disposición para prestar servicios eróticos y sexuales.
1.3 Anuncio: un anuncio en el Sitio Web en el que el Anunciante ofrece servicios eróticos y/o sexuales, incluido todo el material visual y de video.
1.4 Términos y Condiciones: estos términos y condiciones, independientemente de la forma en que se den a conocer.
1.5 Visitante: la persona física que utiliza el Sitio Web, por ejemplo, creando una Cuenta.
1.6 Usuario, tú, usted: un Anunciante o Visitante.
1.7 Servicios: los servicios ofrecidos por ${company.name} en el Sitio Web, que consisten en proporcionar una plataforma donde Anunciantes y Visitantes pueden ponerse en contacto a través de Anuncios para la prestación de servicios eróticos/sexuales.
1.8 ${company.name}, nosotros: ${company.name}, con domicilio en ${company.country}.
1.9 Sitio Web: los sitios web ${company.domains}.`,
  },

  general: {
    heading: '2. DISPOSICIONES GENERALES',
    body: `2.1 Estos Términos y Condiciones se aplican al uso del Sitio Web y los Servicios, así como a todos los acuerdos y cualquier otro acto jurídico entre el Usuario y ${company.name}. ${company.name} rechaza expresamente cualquier término y condición general del Usuario. ${company.name} tiene derecho en todo momento a modificar o complementar estos Términos y Condiciones. Por lo tanto, recomendamos consultar los Términos y Condiciones regularmente. Si no estás de acuerdo con los cambios, puedes dejar de usar el Sitio Web y los Servicios inmediatamente.

2.2 Las desviaciones de los Términos y Condiciones solo son válidas si se acuerdan expresamente por escrito o por correo electrónico entre ${company.name} y el Usuario.

2.3 Si alguna disposición de estos Términos y Condiciones es declarada nula o anulada, las disposiciones restantes permanecerán en pleno vigor y efecto. ${company.name} establecerá una nueva disposición para reemplazar la disposición nula/anulada, teniendo en cuenta en la medida de lo posible el propósito de la disposición nula/anulada.`,
  },

  services: {
    heading: '3. SERVICIOS',
    body: `3.1 A través del Sitio Web, ofrecemos una plataforma en línea donde Anunciantes y Visitantes pueden ponerse en contacto para la prestación de servicios eróticos y sexuales. Nuestros Servicios consisten en:
• Para Anunciantes: proporcionar (i) espacio publicitario en el Sitio Web para ofrecer servicios eróticos y sexuales, y (ii) herramientas de comunicación (por ejemplo, funciones de mensajería) para conectarse con Visitantes.
• Para Visitantes: proporcionar una plataforma publicitaria con la posibilidad de contactar a Anunciantes sobre los servicios eróticos y sexuales que ofrecen.
El Sitio Web solo puede ser utilizado para servicios eróticos y sexuales legales.

3.2 Tenemos un rol meramente facilitador y no podemos ser considerados responsables de las acciones u omisiones de los Usuarios. No estamos involucrados expresamente en el servicio erótico que un Anunciante ofrece y/o presta a un Visitante y permanecemos al margen de cualquier contacto entre Usuarios y/o cualquier acuerdo que pueda surgir entre un Anunciante y un Visitante a través del uso del Sitio Web. No aceptamos expresamente ninguna responsabilidad por cualquier daño sufrido por un Visitante y/o Anunciante como resultado del contacto entre el Visitante y el Anunciante y/o las actividades (eróticas) entre el Visitante y el Anunciante.

3.3 No garantizamos que el Sitio Web o los Servicios funcionen sin errores y cumplan con tus expectativas. En particular, no garantizamos que: (i) la información en el Sitio Web (incluida la información publicada por los Usuarios) sea precisa, completa, adecuada o actual, no infrinja los derechos (de propiedad) de terceros o sea de otro modo ilegal; (ii) el Sitio Web funcione de manera ininterrumpida, esté libre de virus, troyanos y otros errores y/o defectos, y que cualquier defecto sea subsanado; (iii) terceros no utilicen el Sitio Web y/o los Servicios de manera ilegal.

3.4 El contenido del Sitio Web relacionado con Anuncios, reseñas y cualquier respuesta proviene de los Usuarios. Estos Usuarios son responsables de la exactitud e integridad del contenido que publican. No asumimos ninguna responsabilidad por el contenido del material publicado por los Usuarios.`,
  },

  conditions: {
    heading: '4. CONDICIONES DE USO DEL SITIO WEB Y LOS SERVICIOS',
    body: `4.1 Los Visitantes deben tener al menos 18 años de edad. Si el Anunciante es una persona física, debe tener al menos 21 años de edad. Si el Anunciante es una persona jurídica con varios trabajadores sexuales, los trabajadores sexuales para los cuales el Anunciante publica el Servicio y/o Anuncio deben tener al menos 21 años de edad. Tenemos derecho a verificar la edad y, en caso de duda, a solicitar pruebas adicionales (por ejemplo, una copia de un documento de identidad). La copia de tu documento de identidad se procesa de acuerdo con la Política de Privacidad. Si tenemos dudas sobre tu edad, también tenemos derecho a rechazar y/o terminar el acceso al Sitio Web y los Servicios.

4.2 Para utilizar ciertos Servicios, debes crear una Cuenta y proporcionar ciertos datos (personales) (incluyendo al menos una dirección de correo electrónico y, en algunos casos, nombre, dirección y número de teléfono). Para la Cuenta, recibirás una contraseña. La Cuenta y la contraseña son estrictamente personales; no puedes permitir que terceros las utilicen. Tenemos derecho a modificar la contraseña si es necesario en interés del funcionamiento del Servicio. Eres responsable de cualquier uso que se haga de tu Cuenta y nos indemnizas contra cualquier reclamación de terceros por daños o de otro modo, que surja de cualquier manera del uso que se haga del Servicio a través de tu Cuenta.

4.3 Solo se puede crear una Cuenta por Usuario. No está permitido compartir Cuentas ni registrar múltiples Cuentas, a menos que hayamos dado nuestro consentimiento previo expreso por escrito (o por correo electrónico).

4.4 Garantizas que todos los datos (personales) que proporcionas en el contexto del Servicio (incluidos, entre otros, nombre, dirección, número de teléfono, fecha de nacimiento, documento de identidad y dirección de correo electrónico) son completos, precisos y actuales, y que utilizas el Sitio Web y el Servicio exclusivamente para ti mismo o tu propia organización (en el caso de un Anunciante con varios trabajadores sexuales). También garantizas que cumplirás con todas las leyes y regulaciones aplicables en relación con la prestación de servicios eróticos/sexuales.

4.5 Al publicar Anuncios, datos (personales), reseñas u otro contenido en el Sitio Web y/o dentro del Servicio, otorgas expresamente a ${company.name} permiso para publicar estos datos (personales), Anuncios, reseñas y/u otro contenido en el Sitio Web. Garantizas que estás autorizado para otorgar dicho permiso. Reconoces que la posición de los Anuncios y otra información en el Sitio Web depende de una serie de factores, incluida, entre otros, la tarifa pagada, y que no se pueden derivar derechos de esto.

4.6 Eres responsable de la exactitud del contenido de los Anuncios, datos (personales), reseñas y otro contenido que publiques en el Sitio Web. Garantizas que el contenido es preciso, actual y fiable, y no viola las leyes y regulaciones aplicables, y no es ilegal. También garantizas que con estos datos no maltratas a otros Usuarios, no violas su privacidad y no perjudicarás los intereses y el buen nombre de ${company.name}.

4.7 El siguiente contenido no puede ser publicado en Anuncios, reseñas, respuestas a reseñas ni en ningún otro lugar del Sitio Web o dentro del Servicio:
a) contenido que viole cualquier ley o regulación o estos Términos y Condiciones;
b) contenido que se refiera o esté relacionado con cualquier forma de prostitución ilegal, incluida, entre otras, la prostitución forzada, el chantaje, las amenazas de violencia o la prostitución involuntaria, así como la prostitución infantil, la pornografía infantil y cualquier otra conducta, servicio o producto ilegal/delictivo, o servicios o productos que puedan causar daño a terceros;
c) contenido que infrinja derechos de propiedad intelectual o derechos de privacidad de terceros o viole otros derechos de ${company.name} o terceros;
d) contenido con trabajadores sexuales menores de 21 años;
e) contenido que, en nuestra opinión, sea contrario a la decencia pública o al buen gusto, violento, amenazante, blasfemo, difamatorio o calumnioso, o incite a la violencia o al odio contra otro u otros;
f) contenido con programas informáticos (incluidos auto-refreshers/mouse clickers, etc.), archivos y/u otro material que contenga características destructivas e impredecibles como archivos manipulados, archivos "ocultos" (por ejemplo, imágenes integradas en archivos de audio), gusanos, caballos de Troya o bots para desplazamiento u otras actividades que interrumpan o puedan interrumpir la integridad o el funcionamiento del Sitio Web o la comunicación en línea en general;
g) contenido que de alguna manera mencione o se refiera a otro sitio web que compita con el Sitio Web o sea similar a este.
Tenemos derecho en todo momento, a nuestra entera discreción, a modificar, acortar o eliminar el contenido del Usuario del Sitio Web, sin que esto conduzca de ninguna manera a ningún derecho del Usuario a compensación. Lo haremos, por ejemplo, si el contenido infringe el Artículo 4.

4.8 Cualquier dato (personal) obtenido a través del Sitio Web solo puede ser utilizado para el propósito para el cual el Usuario lo recibió, es decir, responder a un Anuncio o a un mensaje recibido a través del Sitio Web. No está permitido recopilar y procesar estos datos para ningún otro propósito, incluida —entre otros— cualquier forma de comunicación no solicitada (spam). Si actúas en violación de este Artículo 4.8, incurrirás, sin más advertencia ni requerimiento previo y sin que sea necesaria intervención judicial, en una multa inmediatamente exigible de EUR 500 (quinientos euros) por evento o por día que se utilicen los datos, sin perjuicio del derecho de ${company.name} a tomar otras medidas disponibles contra ti y/o reclamar daños y perjuicios.`,
  },

  zeroTolerance: {
    heading: '5. POLÍTICA DE TOLERANCIA CERO CONTRA ABUSOS',
    body: `5.1 Si existe sospecha de que estás actuando en violación del Artículo 4.7, podemos terminar inmediatamente el acuerdo y el uso del Sitio Web y los Servicios sin que esto conduzca de ninguna manera a ningún derecho a compensación. También nos reservamos el derecho, a nuestra entera discreción, de informar a la policía, las autoridades judiciales y otros organismos y organizaciones relevantes y de presentar una denuncia. Cooperaremos, a nuestra entera discreción, con solicitudes legalmente válidas de las autoridades gubernamentales/judiciales para proporcionar datos en el contexto de la investigación de los abusos mencionados en el Artículo 4.7.

5.2 En el contexto de nuestra política de tolerancia cero con respecto a los abusos en la industria del sexo, también hacemos un llamado a los Visitantes para que denuncien los abusos ante nosotros y ante las autoridades pertinentes.

5.3 Aunque prohibimos el uso de nuestros Servicios por parte de Anunciantes menores de 21 años y realizamos controles de edad, desafortunadamente no podemos garantizar que un Anunciante tenga siempre 21 años o más. Si contactas a un Anunciante, te pedimos que también verifiques la edad del Anunciante por ti mismo. Si dudas de si el Anunciante es mayor de 21 años, o descubres que el Anunciante es menor de edad, debes abstenerte inmediatamente de cualquier contacto con ese Anunciante e informarnos inmediatamente a nosotros y/o a la policía y autoridades judiciales sobre tu duda o descubrimiento. Puedes hacerlo de forma anónima si lo deseas a través de los canales de denuncia apropiados.

5.4 Si sospechas o tienes motivos razonables para creer que un Anunciante está ofreciendo sus servicios (eróticos) bajo coacción, chantaje, amenaza de violencia o de manera involuntaria, debes abstenerte inmediatamente de cualquier contacto con el Anunciante e informarnos inmediatamente a nosotros y/o a la policía y autoridades judiciales. Puedes hacerlo de forma anónima si lo deseas a través de los canales de denuncia apropiados.

5.5 Si crees que cierta información en el Sitio Web es ilegal, también puedes informarnos. Procesaremos el informe, siempre que cumpla con todos los requisitos que hemos establecido. Si el informe muestra que el material impugnado es indudablemente ilegal, lo eliminaremos.

5.6 Los informes pueden realizarse a través del correo electrónico: ${company.email}.`,
  },

  privacy: {
    heading: '6. TRATAMIENTO DE DATOS PERSONALES',
    body: `${company.name} como Responsable del Tratamiento

6.1 A través del Sitio Web y los Servicios (incluida la Cuenta), tratamos tus datos personales (especiales) con tu consentimiento explícito, incluidos datos sobre comportamiento sexual u orientación sexual. Nos aseguramos de que el tratamiento de estos datos personales cumpla con el Reglamento General de Protección de Datos (RGPD) y las leyes de implementación aplicables. La Política de Privacidad publicada en el Sitio Web se aplica al tratamiento de estos datos personales (especiales) por nuestra parte como responsable del tratamiento. Te recomendamos leer atentamente esta Política de Privacidad y guardarla. Tus derechos con respecto al tratamiento de tus datos personales también se describen allí.

${company.name} como Encargado del Tratamiento

6.2 Si tratamos datos personales de trabajadores sexuales afiliados a un Anunciante en nombre del Anunciante, tratamos los datos personales en nombre del Anunciante y actuamos como encargado del tratamiento, siendo el Anunciante el responsable del tratamiento de los datos personales de estos trabajadores sexuales, en el sentido del RGPD. En este caso, se aplican los Artículos 6.3 a 6.12.

6.3 Tratamos datos personales solo si es necesario para el cumplimiento de nuestras obligaciones bajo el acuerdo con el Anunciante. Otros tratamientos solo se llevarán a cabo después de recibir instrucciones por escrito del Anunciante, una orden de un tribunal, autoridad de investigación u otra autoridad, o si existe una obligación legal. Informaremos al Anunciante con antelación, a menos que la disposición legal pertinente no lo permita. No conservaremos los datos personales más tiempo del necesario para el cumplimiento de nuestras obligaciones bajo el acuerdo y los eliminaremos después.

6.4 El Anunciante garantiza que el trabajador sexual ha dado su consentimiento explícito y legalmente válido para tratar sus datos personales (especiales), incluidos datos sobre comportamiento sexual u orientación sexual, en un Anuncio o de otro modo dentro del Servicio. El Anunciante también garantiza que no perjudica la privacidad del trabajador sexual u otros terceros y no actúa en violación del RGPD u otras leyes y regulaciones aplicables.

6.5 El Anunciante indemniza a ${company.name} y mantiene a ${company.name} indemne frente a todas las reclamaciones, acciones, demandas de terceros (incluidos trabajadores sexuales y Visitantes) y por cualquier multa y sanción de la Autoridad de Protección de Datos u otra autoridad supervisora que resulte de una violación de las leyes y regulaciones, en particular el RGPD, u otro incumplimiento atribuible por parte del Anunciante en el cumplimiento de las obligaciones bajo estos Términos y Condiciones.

6.6 Implementaremos medidas técnicas y organizativas apropiadas para proteger los datos personales contra pérdida o cualquier forma de tratamiento ilegal. Estas medidas garantizan, teniendo en cuenta el estado de la técnica y los costos de implementación, un nivel de seguridad apropiado dados los riesgos que el tratamiento y la naturaleza de los datos a proteger conllevan. Las medidas también están destinadas a prevenir la recopilación innecesaria y el tratamiento posterior de datos personales.

6.7 A solicitud por escrito del Anunciante, (i) proporcionaremos al Anunciante información sobre el tratamiento de los datos personales, incluidas las medidas de seguridad que hemos tomado, y/o (ii) otorgaremos a un auditor acreditado contratado por el Anunciante acceso a nuestros sistemas para que se pueda verificar si actuamos de acuerdo con la obligación de seguridad establecida en el Artículo 6.6. Dicha investigación siempre tendrá lugar durante el horario normal de oficina. Los costos de la investigación corren a cargo del Anunciante.

6.8 Nos esforzaremos por proporcionar una cooperación razonable en la realización de los controles mencionados en el Artículo 6.7. Además, proporcionaremos toda la cooperación razonable al Anunciante en el cumplimiento de su obligación de responder a las solicitudes de los interesados con respecto al ejercicio de los derechos establecidos en el RGPD.

6.9 El Anunciante nos da permiso para contratar subencargados del tratamiento para el procesamiento de datos personales; estos se enumeran en la Política de Privacidad. Si deseamos agregar o cambiar subencargados, informaremos al Anunciante con antelación y le permitiremos oponerse al cambio/adiciones. Celebraremos un acuerdo con estos subencargados que incorpore todas las obligaciones relevantes de este artículo y el RGPD.

6.10 Informaremos al Anunciante lo antes posible, pero en cualquier caso al menos dentro de las 48 horas posteriores a que descubramos una violación o un intento grave de la misma, de las violaciones de las medidas de seguridad tomadas por nosotros o un subencargado contratado por nosotros, si se puede suponer razonablemente que esta violación conduce a un riesgo significativo de pérdida o tratamiento ilegal de datos personales con consecuencias adversas para estos datos personales y la privacidad del interesado. Esta notificación contiene información relevante sobre (i) la naturaleza de la violación, (ii) las consecuencias identificadas y presuntas de la violación para el tratamiento de los datos personales, y (iii) las medidas que se tomarán para poner fin o prevenir la violación y limitar las consecuencias negativas de la misma.

6.11 Mantendremos confidencialidad con respecto a todos los datos personales que tratemos en el contexto del acuerdo en nombre del Anunciante. No pondremos datos personales a disposición de terceros (que no sean subencargados), a menos que exista una orden de un tribunal, autoridad de investigación u otra autoridad, o estemos obligados a hacerlo en virtud de las leyes y regulaciones pertinentes o una sentencia judicial.

6.12 No trataremos ni haremos tratar datos personales por nosotros mismos o por subencargados en países fuera del Espacio Económico Europeo ("EEE") sin un nivel adecuado de protección, a menos que hayamos obtenido el consentimiento previo del Anunciante.`,
  },

  intellectual: {
    heading: '7. DERECHOS DE PROPIEDAD INTELECTUAL',
    body: `7.1 Todos los derechos de propiedad intelectual relacionados con el Sitio Web pertenecen exclusivamente a ${company.name} y/o sus licenciantes.

7.2 En la medida en que los derechos de propiedad intelectual recaigan sobre el contenido que el Usuario publica en el Sitio Web (por ejemplo, contenido de un Anuncio), estos derechos de propiedad intelectual permanecen con el Usuario. El Usuario otorga a ${company.name} un derecho gratuito, irrevocable, no exclusivo, transferible, sublicenciable e ilimitado para usar el contenido en y para el beneficio del Sitio Web, hasta que el contenido sea eliminado del Sitio Web por el Usuario. Este uso incluye, entre otros, modificar, acortar, reproducir y hacer público el contenido en el Sitio Web o en otros medios (publicitarios) para la promoción del Sitio Web.

7.3 El Usuario garantiza que el contenido que publica en el Sitio Web, incluidos los Anuncios, no infringe ningún derecho (de propiedad intelectual) de terceros. El Usuario indemniza completamente a ${company.name} contra todas las posibles reclamaciones de terceros que de alguna manera surjan y/o estén relacionadas con el contenido que ha publicado en el Sitio Web, incluida cualquier reclamación basada en la afirmación de que el contenido relevante infringe algún derecho (de propiedad intelectual) de terceros.

7.4 No puedes, sin nuestro consentimiento por escrito, poner el Sitio Web o cualquier contenido del mismo a disposición de terceros de ninguna manera, ni reproducirlo, distribuirlo, transmitirlo o procesarlo en cualquier otro material. Esto también significa que no puedes, sin el consentimiento previo por escrito de ${company.name}, solicitar y/o reutilizar una parte sustancial del contenido de (una) base(s) de datos y/o solicitar y/o reutilizar repetida y sistemáticamente partes no sustanciales del contenido de una(s) base(s) de datos en el sentido de la Ley de Bases de Datos.`,
  },

  liability: {
    heading: '8. RESPONSABILIDAD E INDEMNIZACIÓN',
    body: `8.1 ${company.name} no es responsable de ningún daño sufrido por el Usuario como resultado del uso del Sitio Web o los Servicios o la imposibilidad de usar el Sitio Web y los Servicios, incluido (de manera no exhaustiva) el daño causado por malware, virus y/o la inexactitud e incompletitud de la información en el Sitio Web, a menos que dicho daño sea el resultado de dolo o negligencia grave por parte de ${company.name} o su personal.

8.2 La responsabilidad total de ${company.name} siempre está limitada a la compensación por daños directos hasta un máximo de EUR 25 por evento, considerándose una serie de eventos como un solo evento. Por daño directo en este contexto se entiende exclusivamente: (i) los costos que razonablemente hayas tenido que incurrir para remediar o resolver el incumplimiento de ${company.name} para que la prestación de ${company.name} cumpla con el acuerdo; (ii) costos razonables para prevenir o limitar el daño; y (iii) costos razonables para determinar la causa y el alcance del mismo.

8.3 Queda excluida cualquier responsabilidad de ${company.name} por daños indirectos, incluidos, entre otros, daños consecuentes, lucro cesante y pérdida de ingresos.

8.4 Indemnizas y mantienes indemne a ${company.name} (incluidos sus directivos y empleados) contra todas las responsabilidades, pérdidas, gastos, costas legales, costos profesionales y de otro tipo de cualquier naturaleza, como resultado de o derivados de: (a) cualquier violación por tu parte de estos Términos y Condiciones; (b) el contenido que publicaste en el Sitio Web; (c) tu violación de los derechos de otros Usuarios o tu conducta ilegal hacia otros Usuarios.`,
  },

  paidAds: {
    heading: '9. ANUNCIOS DE PAGO Y SUSCRIPCIONES',
    body: `9.1 Los Anunciantes tienen la opción de publicar Anuncios en posiciones específicas del Sitio Web por una tarifa, lo que otorga al Anuncio una mayor visibilidad. Desde el momento en que el Anuncio se publica en la posición acordada en el Sitio Web, el Anunciante debe la tarifa acordada. Todos los precios indicados en el Sitio Web están en euros e incluyen IVA cuando corresponda.

9.2 ${company.name} ofrece los siguientes planes de suscripción para Anunciantes:
• Basic (Gratuito): Anuncio estándar con visibilidad básica en páginas de ciudad/país.
• Featured (€29/mes): Ubicación premium en la parte superior de resultados de búsqueda y páginas de ciudad, elegibilidad para insignia "Verificado" y funciones de perfil extendidas.
• Agency (€99/mes): Gestión de anuncios por volumen para agencias con múltiples performers, soporte prioritario y gestión de cuenta dedicada.

9.3 La tarifa adeudada se puede pagar a través del servicio de pago ofrecido en el Sitio Web. Si el pago no se realiza o no se realiza a tiempo, o se revierte, tenemos derecho a eliminar el Anuncio publicado y aun así cobrar el monto adeudado. También tenemos derecho a cobrar intereses comerciales legales.

9.4 ${company.name} ofrece a los Anunciantes la opción de comprar paquetes de crédito. Estos paquetes de crédito se pueden utilizar para pagar las tarifas mencionadas en el Artículo 9.1. Puedes ver el monto del paquete de crédito en tu Cuenta. El paquete de crédito no se puede canjear por efectivo y no es reembolsable de otro modo con ${company.name}. El paquete de crédito caduca automáticamente si el acuerdo termina y/o tu Cuenta es cancelada.`,
  },

  reviews: {
    heading: '10. USO DE RESEÑAS',
    body: `10.1 Solo si el Anunciante ha optado por ello, un Visitante puede publicar una reseña en el Anuncio del Anunciante. El Visitante debe haber iniciado sesión para hacerlo.

10.2 Las reseñas son revisadas por un moderador y, tras su aprobación, se publican con el Anuncio correspondiente. El Anunciante recibe una notificación y tiene la opción de responder una vez. Esta respuesta también es revisada por el moderador y, tras su aprobación, se publica. El moderador tiene derecho en todo momento a rechazar una reseña o respuesta. El rechazo puede ocurrir, por ejemplo, si la reseña o respuesta infringe el Artículo 10.3.

10.3 Eres responsable del contenido de tu reseña y/o respuesta a la reseña y garantizas que:
a) la reseña y/o respuesta no viola la privacidad de terceros (incluidos el Anunciante, el trabajador sexual correspondiente o el Visitante) y no contiene datos personales u otras descripciones que puedan rastrearse hasta una persona;
b) el contenido de la reseña no es falso, engañoso, fraudulento, no constituye una amenaza, no promueve o fomenta actividades ilegales, o no es de otro modo ilegal y/o contrario a la ley;
c) con la reseña o respuesta, no maltratas a otros, incluidos el Anunciante, el trabajador sexual o el Visitante, por ejemplo, publicando textos discriminatorios, ofensivos, innecesariamente hirientes o insultantes;
d) la reseña se basa en tu propia experiencia con el Anunciante o trabajador sexual;
e) la reseña y/o respuesta no perjudica a menores de edad;
f) la reseña y/o respuesta no contiene publicidad y no promueve de otro modo la venta de otros productos o servicios, a menos que se acuerde expresamente que esto está permitido;
g) la reseña y/o respuesta no contiene virus, archivos corruptos u otro software o programas que puedan interrumpir o dañar el funcionamiento del Sitio Web u otras computadoras; y
h) no perjudicarás los intereses y el buen nombre del Sitio Web y de ${company.name}.

10.4 El Visitante es consciente y acepta que su Nombre de Usuario (Apodo) se publicará con la reseña.

10.5 Si crees que una reseña o respuesta infringe los Términos y Condiciones o la Política de Privacidad, puedes informar tu queja por correo electrónico a ${company.email}. El correo electrónico debe incluir mayor razonamiento, fundamentación y evidencia. ${company.name} procesará la queja y, si corresponde, la remitirá al Visitante o Anunciante correspondiente para su defensa. La queja se manejará lo antes posible. Durante el manejo de la queja, la reseña o respuesta puede ser eliminada (temporalmente). Sin perjuicio de lo anterior, ${company.name} tiene derecho en todo momento a eliminar tu reseña por sus propios motivos, por ejemplo, después de una queja.

10.6 Si el acuerdo con un Visitante termina, sus reseñas también se eliminan automáticamente. Si el acuerdo con un Anunciante termina, las reseñas relacionadas con este Anunciante y sus respuestas a las reseñas se eliminan automáticamente.

10.7 Si el Anunciante elimina su Anuncio o retira el permiso para permitir reseñas en el Anuncio pero mantiene su Cuenta, las reseñas relacionadas con este Anuncio o Anunciante y las respuestas a esas reseñas ya no se mostrarán en el Sitio Web. Sin embargo, estas reseñas y respuestas se conservan dentro de la plataforma de ${company.name} para que puedan mostrarse nuevamente tan pronto como el Anunciante vuelva a publicar el Anuncio o elija permitir reseñas nuevamente.`,
  },

  duration: {
    heading: '11. DURACIÓN DEL ACUERDO',
    body: `11.1 Cada acuerdo entre el Usuario y ${company.name} se celebra por un período indefinido. El Usuario puede terminar el acuerdo en cualquier momento eliminando la Cuenta y cesando el uso.

11.2 ${company.name} terminará el acuerdo con efecto inmediato y eliminará tu Cuenta, sin obligación de pagar compensación, si no has iniciado sesión en tu Cuenta durante más de seis meses y tampoco inicias sesión dentro del plazo adicional especificado en el recordatorio enviado por nosotros.

11.3 Además del Artículo 11.2, ${company.name} se reserva el derecho de terminar el acuerdo con efecto inmediato y excluirte de cualquier uso (posterior) de los Servicios, bloqueando y/o eliminando tu Cuenta, entre otras cosas, sin obligación de pagar compensación o reembolsar cantidades ya cobradas, si:
– actúas de alguna manera en violación de estos Términos y Condiciones;
– infringes derechos (de propiedad intelectual) de terceros;
– actúas en violación de las leyes y regulaciones aplicables.

11.4 Además de lo anterior, ${company.name} tiene derecho en todo momento a terminar el acuerdo, por cualquier motivo, con un plazo de preaviso de un (1) mes.

11.5 Cada parte tiene derecho a disolver el acuerdo sin intervención judicial y sin aviso de incumplimiento, total o parcialmente, con efecto inmediato, si la otra parte ha solicitado una suspensión de pagos o esta le ha sido concedida, y/o ha sido declarada en quiebra o se ha presentado una solicitud de quiebra en su contra.`,
  },

  disputes: {
    heading: '12. DISPUTAS Y RECLAMACIONES',
    body: `12.1 Estos Términos y Condiciones se rigen por la legislación neerlandesa.

12.2 Las disputas que surjan de o estén relacionadas con estos Términos y Condiciones o los acuerdos a los que estos Términos y Condiciones se hayan declarado aplicables total o parcialmente serán resueltas exclusivamente por el tribunal competente de La Haya (Den Haag), Países Bajos.

12.3 Si eres consumidor, también puedes presentar tu reclamación ante la Plataforma de Resolución de Disputas en Línea de la UE ("Plataforma ODR"). La Plataforma ODR es un sitio web interactivo que se puede consultar en línea de forma gratuita. La Plataforma ODR está destinada a ser una forma sencilla para que los consumidores lleguen a un acuerdo amistoso (en línea) en caso de disputas con comerciantes locales e internacionales, incluidos los mercados en línea. Se puede acceder a la Plataforma ODR a través del siguiente enlace: http://ec.europa.eu/consumers/odr. Naturalmente, te recomendamos que primero nos presentes cualquier reclamación enviando un correo electrónico a ${company.email}.`,
  },
};

/* ══════════════════════════════════════════════
   PORTUGUESE
   ══════════════════════════════════════════════ */
const pt = {
  title: 'Termos e Condições',
  brand: 'ShemaleWiki',
  lastUpdate: 'Junho 2026',

  definitions: {
    heading: '1. DEFINIÇÕES',
    body: `Nestes Termos e Condições, aplicam-se as seguintes definições, tanto no singular como no plural.

1.1 Conta: a possibilidade de utilizar os Serviços.
1.2 Anunciante: a pessoa singular ou coletiva que, através do Site, se disponibiliza para prestar serviços eróticos e sexuais.
1.3 Anúncio: um anúncio no Site no qual o Anunciante oferece serviços eróticos e/ou sexuais, incluindo todo o material visual e de vídeo.
1.4 Termos e Condições: estes termos e condições, independentemente da forma como sejam divulgados.
1.5 Visitante: a pessoa singular que utiliza o Site, por exemplo, criando uma Conta.
1.6 Utilizador, você: um Anunciante ou Visitante.
1.7 Serviços: os serviços oferecidos por ${company.name} no Site, que consistem em fornecer uma plataforma onde Anunciantes e Visitantes podem entrar em contacto através de Anúncios para a prestação de serviços eróticos/sexuais.
1.8 ${company.name}, nós: ${company.name}, com sede em ${company.country}.
1.9 Site: os sites ${company.domains}.`,
  },

  general: {
    heading: '2. DISPOSIÇÕES GERAIS',
    body: `2.1 Estes Termos e Condições aplicam-se ao uso do Site e dos Serviços, bem como a todos os acordos e quaisquer outros atos jurídicos entre o Utilizador e ${company.name}. ${company.name} rejeita expressamente quaisquer termos e condições gerais do Utilizador. ${company.name} tem o direito, a todo momento, de alterar ou complementar estes Termos e Condições. Recomendamos, portanto, consultar os Termos e Condições regularmente. Se não concordares com as alterações, podes deixar de usar o Site e os Serviços imediatamente.

2.2 Os desvios dos Termos e Condições só são válidos se acordados expressamente por escrito ou por e-mail entre ${company.name} e o Utilizador.

2.3 Se alguma disposição destes Termos e Condições for declarada nula ou anulada, as disposições restantes permanecerão em pleno vigor e efeito. ${company.name} estabelecerá uma nova disposição para substituir a disposição nula/anulada, tendo em conta, na medida do possível, o propósito da disposição nula/anulada.`,
  },

  services: {
    heading: '3. SERVIÇOS',
    body: `3.1 Através do Site, oferecemos uma plataforma online onde Anunciantes e Visitantes podem entrar em contacto para a prestação de serviços eróticos e sexuais. Os nossos Serviços consistem em:
• Para Anunciantes: fornecer (i) espaço publicitário no Site para oferecer serviços eróticos e sexuais, e (ii) ferramentas de comunicação (por exemplo, funções de mensagens) para se conectar com Visitantes.
• Para Visitantes: fornecer uma plataforma publicitária com a possibilidade de contactar Anunciantes sobre os serviços eróticos e sexuais que oferecem.
O Site só pode ser utilizado para serviços eróticos e sexuais legais.

3.2 Temos um papel meramente facilitador e não podemos ser responsabilizados pelas ações ou omissões dos Utilizadores. Não estamos expressamente envolvidos no serviço erótico que um Anunciante oferece e/ou presta a um Visitante e permanecemos à margem de qualquer contacto entre Utilizadores e/ou quaisquer acordos que possam surgir entre um Anunciante e um Visitante através do uso do Site. Não aceitamos expressamente qualquer responsabilidade por quaisquer danos sofridos por um Visitante e/ou Anunciante como resultado do contacto entre o Visitante e o Anunciante e/ou as atividades (eróticas) entre o Visitante e o Anunciante.

3.3 Não garantimos que o Site ou os Serviços funcionem sem erros e atendam às tuas expectativas. Em particular, não garantimos que: (i) as informações no Site (incluindo informações publicadas pelos Utilizadores) sejam precisas, completas, adequadas ou atuais, não infrinjam os direitos (de propriedade) de terceiros ou sejam de outra forma ilegais; (ii) o Site funcione ininterruptamente, esteja livre de vírus, trojans e outros erros e/ou defeitos, e que quaisquer defeitos sejam corrigidos; (iii) terceiros não utilizem o Site e/ou os Serviços de forma ilegal.

3.4 O conteúdo do Site relacionado com Anúncios, avaliações e quaisquer respostas provém dos Utilizadores. Estes Utilizadores são responsáveis pela exatidão e integridade do conteúdo que publicam. Não assumimos qualquer responsabilidade pelo conteúdo do material publicado pelos Utilizadores.`,
  },

  conditions: {
    heading: '4. CONDIÇÕES DE USO DO SITE E DOS SERVIÇOS',
    body: `4.1 Os Visitantes devem ter pelo menos 18 anos de idade. Se o Anunciante for uma pessoa singular, deve ter pelo menos 21 anos de idade. Se o Anunciante for uma pessoa coletiva com vários trabalhadores sexuais, os trabalhadores sexuais para os quais o Anunciante publica o Serviço e/ou Anúncio devem ter pelo menos 21 anos de idade. Temos o direito de verificar a idade e, em caso de dúvida, solicitar provas adicionais (por exemplo, uma cópia de um documento de identificação). A cópia do teu documento de identificação é processada de acordo com a Política de Privacidade. Se tivermos dúvidas sobre a tua idade, também temos o direito de recusar e/ou terminar o acesso ao Site e aos Serviços.

4.2 Para utilizar determinados Serviços, deves criar uma Conta e fornecer certos dados (pessoais) (incluindo, no mínimo, um endereço de e-mail e, em alguns casos, nome, morada e número de telefone). Para a Conta, receberás uma palavra-passe. A Conta e a palavra-passe são estritamente pessoais; não podes permitir que terceiros as utilizem. Temos o direito de modificar a palavra-passe se necessário no interesse do funcionamento do Serviço. És responsável por qualquer uso que seja feito da tua Conta e indemnizas-nos contra quaisquer reclamações de terceiros relativas a danos ou de outra forma, de qualquer forma decorrentes do uso feito do Serviço através da tua Conta.

4.3 Apenas pode ser criada uma Conta por Utilizador. Não é permitido partilhar Contas ou registar várias Contas, a menos que tenhamos dado consentimento prévio expresso por escrito (ou por e-mail).

4.4 Garantes que todos os dados (pessoais) que forneces no contexto do Serviço (incluindo, entre outros, nome, morada, número de telefone, data de nascimento, documento de identificação e endereço de e-mail) são completos, precisos e atuais, e que utilizas o Site e o Serviço exclusivamente para ti mesmo ou para a tua própria organização (no caso de um Anunciante com vários trabalhadores sexuais). Também garantes que cumprirás todas as leis e regulamentos aplicáveis relativos à prestação de serviços eróticos/sexuais.

4.5 Ao publicar Anúncios, dados (pessoais), avaliações ou outro conteúdo no Site e/ou dentro do Serviço, concedes expressamente a ${company.name} permissão para publicar estes dados (pessoais), Anúncios, avaliações e/ou outro conteúdo no Site. Garantes que estás autorizado a conceder tal permissão. Reconheces que o posicionamento dos Anúncios e outras informações no Site depende de vários fatores, incluindo, entre outros, a taxa paga, e que não podem ser derivados direitos disso.

4.6 És responsável pelo conteúdo dos Anúncios, dados (pessoais), avaliações e outro conteúdo que publicas no Site. Garantes que o conteúdo é preciso, atual e fiável, e não viola as leis e regulamentos aplicáveis, e não é ilegal. Também garantes que com estes dados não maltratas outros Utilizadores, não violas a sua privacidade e não prejudicarás os interesses e o bom nome de ${company.name}.

4.7 O seguinte conteúdo não pode ser publicado em Anúncios, avaliações, respostas a avaliações ou em qualquer outro local do Site ou dentro do Serviço:
a) conteúdo que viole qualquer lei ou regulamento ou estes Termos e Condições;
b) conteúdo que se refira ou esteja relacionado com qualquer forma de prostituição ilegal, incluindo, entre outras, prostituição forçada, chantagem, ameaças de violência ou prostituição involuntária, bem como prostituição infantil, pornografia infantil e qualquer outra conduta, serviço ou produto ilegal/criminoso, ou serviços ou produtos que possam de alguma forma causar danos a terceiros;
c) conteúdo que infrinja direitos de propriedade intelectual ou direitos de privacidade de terceiros ou viole outros direitos de ${company.name} ou terceiros;
d) conteúdo com trabalhadores sexuais com menos de 21 anos de idade;
e) conteúdo que, na nossa opinião, seja contrário à decência pública ou ao bom gosto, violento, ameaçador, blasfemo, difamatório ou calunioso, ou incite à violência ou ao ódio contra outro ou outros;
f) conteúdo com programas de computador (incluindo auto-refreshers/mouse clickers, etc.), ficheiros e/ou outro material que contenha características destrutivas e imprevisíveis, como ficheiros manipulados, ficheiros "ocultos" (por exemplo, imagens integradas em ficheiros de áudio), worms, cavalos de Troia ou bots para deslocamento ou outras atividades que interrompam ou possam interromper a integridade ou o funcionamento do Site ou da comunicação online em geral;
g) conteúdo que de alguma forma mencione ou se refira a outro site concorrente ou semelhante ao Site.
Temos o direito, a todo momento e a nosso exclusivo critério, de modificar, encurtar ou remover o conteúdo do Utilizador do Site, sem que isso conduza de forma alguma a qualquer direito do Utilizador a compensação. Fá-lo-emos, por exemplo, se o conteúdo violar o Artigo 4.

4.8 Quaisquer dados (pessoais) obtidos através do Site só podem ser utilizados para o fim para o qual o Utilizador os recebeu, nomeadamente responder a um Anúncio ou a uma mensagem recebida através do Site. Não é permitido recolher e processar estes dados para qualquer outro fim, incluindo — mas não limitado a — qualquer forma de comunicação não solicitada (spam). Se agires em violação deste Artigo 4.8, incorrerás, sem mais aviso ou notificação de incumprimento e sem necessidade de intervenção judicial, numa multa imediatamente exigível de EUR 500 (quinhentos euros) por evento ou por dia em que os dados sejam utilizados, sem prejuízo do direito de ${company.name} de tomar outras medidas disponíveis contra ti e/ou reclamar indemnizações.`,
  },

  zeroTolerance: {
    heading: '5. POLÍTICA DE TOLERÂNCIA ZERO CONTRA ABUSOS',
    body: `5.1 Se houver suspeita de que estás a agir em violação do Artigo 4.7, podemos terminar imediatamente o acordo e o uso do Site e dos Serviços sem que isso conduza de forma alguma a qualquer direito a compensação. Reservamo-nos também o direito, a nosso exclusivo critério, de informar a polícia, as autoridades judiciais e outros organismos e organizações relevantes e de apresentar uma denúncia. Cooperaremos, a nosso exclusivo critério, com pedidos legalmente válidos das autoridades governamentais/judiciais para fornecer dados no contexto da investigação dos abusos referidos no Artigo 4.7.

5.2 No contexto da nossa política de tolerância zero relativamente a abusos na indústria do sexo, também apelamos aos Visitantes para que denunciem os abusos a nós e às autoridades competentes.

5.3 Embora proibamos o uso dos nossos Serviços por Anunciantes com menos de 21 anos e realizemos verificações de idade, infelizmente não podemos garantir que um Anunciante tenha sempre 21 anos ou mais. Se contactares um Anunciante, pedimos-te que também verifiques a idade do Anunciante por ti mesmo. Se duvidares se o Anunciante tem mais de 21 anos, ou constatares que o Anunciante é menor de idade, deves abster-te imediatamente de qualquer contacto com esse Anunciante e informar-nos imediatamente a nós e/ou à polícia e autoridades judiciais sobre a tua dúvida ou constatação. Podes fazê-lo anonimamente, se desejares, através dos canais de denúncia apropriados.

5.4 Se suspeitares ou tiveres motivos razoáveis para acreditar que um Anunciante está a oferecer os seus serviços (eróticos) sob coação, chantagem, ameaça de violência ou de forma involuntária, deves abster-te imediatamente de qualquer contacto com o Anunciante e informar-nos imediatamente a nós e/ou à polícia e autoridades judiciais. Podes fazê-lo anonimamente, se desejares, através dos canais de denúncia apropriados.

5.5 Se considerares que determinadas informações no Site são ilegais, também podes comunicar-nos. Processaremos a comunicação, desde que cumpra todos os requisitos por nós estabelecidos. Se a comunicação mostrar que o material contestado é indubitavelmente ilegal, removê-lo-emos.

5.6 As comunicações podem ser feitas através do e-mail: ${company.email}.`,
  },

  privacy: {
    heading: '6. TRATAMENTO DE DADOS PESSOAIS',
    body: `${company.name} como Responsável pelo Tratamento

6.1 Através do Site e dos Serviços (incluindo a Conta), tratamos os teus dados pessoais (especiais) com o teu consentimento explícito, incluindo dados sobre comportamento sexual ou orientação sexual. Garantimos que o tratamento destes dados pessoais cumpre o Regulamento Geral de Proteção de Dados (RGPD) e as leis de implementação aplicáveis. A Política de Privacidade publicada no Site aplica-se ao tratamento destes dados pessoais (especiais) por nós como responsável pelo tratamento. Aconselhamos-te a ler atentamente esta Política de Privacidade e a guardá-la. Os teus direitos relativamente ao tratamento dos teus dados pessoais também estão aí descritos.

${company.name} como Subcontratante

6.2 Se tratarmos dados pessoais de trabalhadores sexuais afiliados a um Anunciante em nome do Anunciante, tratamos os dados pessoais em nome do Anunciante e atuamos como subcontratante, sendo o Anunciante o responsável pelo tratamento dos dados pessoais destes trabalhadores sexuais, na aceção do RGPD. Neste caso, aplicam-se os Artigos 6.3 a 6.12.

6.3 Tratamos dados pessoais apenas se necessário para o cumprimento das nossas obrigações nos termos do acordo com o Anunciante. Outros tratamentos só serão realizados após receção de instruções escritas do Anunciante, de uma ordem de um tribunal, autoridade de investigação ou outra autoridade, ou se existir uma obrigação legal. Informaremos o Anunciante com antecedência, a menos que a disposição legal pertinente não o permita. Não conservaremos os dados pessoais por mais tempo do que o necessário para o cumprimento das nossas obrigações nos termos do acordo e eliminá-los-emos depois.

6.4 O Anunciante garante que o trabalhador sexual deu consentimento explícito e legalmente válido para tratar os seus dados pessoais (especiais), incluindo dados sobre comportamento sexual ou orientação sexual, num Anúncio ou de outra forma dentro do Serviço. O Anunciante também garante que não prejudica a privacidade do trabalhador sexual ou de outros terceiros e não atua em violação do RGPD ou de outras leis e regulamentos aplicáveis.

6.5 O Anunciante indemniza ${company.name} e mantém ${company.name} isento de todas as reclamações, ações, demandas de terceiros (incluindo trabalhadores sexuais e Visitantes) e de quaisquer multas e sanções da Autoridade de Proteção de Dados ou de outra autoridade de supervisão resultantes de uma violação das leis e regulamentos, em particular o RGPD, ou de outro incumprimento imputável por parte do Anunciante no cumprimento das obrigações nos termos destes Termos e Condições.

6.6 Implementaremos medidas técnicas e organizativas apropriadas para proteger os dados pessoais contra perda ou qualquer forma de tratamento ilegal. Estas medidas garantem, tendo em conta o estado da técnica e os custos de implementação, um nível de segurança apropriado, dados os riscos que o tratamento e a natureza dos dados a proteger implicam. As medidas também se destinam a prevenir a recolha desnecessária e o tratamento posterior de dados pessoais.

6.7 A pedido escrito do Anunciante, (i) forneceremos ao Anunciante informações sobre o tratamento dos dados pessoais, incluindo as medidas de segurança que tomámos, e/ou (ii) concederemos a um auditor acreditado contratado pelo Anunciante acesso aos nossos sistemas para que se possa verificar se atuamos de acordo com a obrigação de segurança estabelecida no Artigo 6.6. Tal investigação terá sempre lugar durante o horário normal de expediente. Os custos da investigação são suportados pelo Anunciante.

6.8 Esforçar-nos-emos por fornecer cooperação razoável na realização dos controlos referidos no Artigo 6.7. Além disso, forneceremos toda a cooperação razoável ao Anunciante no cumprimento da sua obrigação de responder a pedidos dos titulares dos dados relativamente ao exercício dos direitos estabelecidos no RGPD.

6.9 O Anunciante dá-nos permissão para contratar subcontratantes para o tratamento de dados pessoais; estes estão listados na Política de Privacidade. Se desejarmos adicionar ou alterar subcontratantes, informaremos o Anunciante com antecedência e permitiremos que se oponha à alteração/adição. Celebraremos um acordo com estes subcontratantes que incorpore todas as obrigações relevantes deste artigo e do RGPD.

6.10 Informaremos o Anunciante o mais rapidamente possível, mas em qualquer caso no prazo máximo de 48 horas após descobrirmos uma violação ou uma tentativa séria da mesma, das violações das medidas de segurança tomadas por nós ou por um subcontratante por nós contratado, se for razoável presumir que esta violação conduz a um risco significativo de perda ou tratamento ilegal de dados pessoais com consequências adversas para estes dados pessoais e para a privacidade do titular dos dados. Esta notificação contém informações relevantes sobre (i) a natureza da violação, (ii) as consequências identificadas e presumidas da violação para o tratamento dos dados pessoais, e (iii) as medidas que serão tomadas para pôr fim ou prevenir a violação e limitar as consequências negativas da mesma.

6.11 Manteremos confidencialidade relativamente a todos os dados pessoais que tratemos no contexto do acordo em nome do Anunciante. Não disponibilizaremos dados pessoais a terceiros (que não sejam subcontratantes), a menos que exista uma ordem de um tribunal, autoridade de investigação ou outra autoridade, ou sejamos obrigados a fazê-lo nos termos das leis e regulamentos pertinentes ou de uma decisão judicial.

6.12 Não trataremos nem mandaremos tratar dados pessoais por nós próprios ou por subcontratantes em países fora do Espaço Económico Europeu ("EEE") sem um nível adequado de proteção, a menos que tenhamos obtido o consentimento prévio do Anunciante.`,
  },

  intellectual: {
    heading: '7. DIREITOS DE PROPRIEDADE INTELECTUAL',
    body: `7.1 Todos os direitos de propriedade intelectual relacionados com o Site pertencem exclusivamente a ${company.name} e/ou aos seus licenciantes.

7.2 Na medida em que os direitos de propriedade intelectual recaiam sobre o conteúdo que o Utilizador publica no Site (por exemplo, conteúdo de um Anúncio), estes direitos de propriedade intelectual permanecem com o Utilizador. O Utilizador concede a ${company.name} um direito gratuito, irrevogável, não exclusivo, transferível, sublicenciável e ilimitado de usar o conteúdo no e para o benefício do Site, até que o conteúdo seja removido do Site pelo Utilizador. Este uso inclui, entre outros, modificar, encurtar, reproduzir e tornar público o conteúdo no Site ou noutros meios (publicitários) para a promoção do Site.

7.3 O Utilizador garante que o conteúdo que publica no Site, incluindo Anúncios, não infringe quaisquer direitos (de propriedade intelectual) de terceiros. O Utilizador indemniza totalmente ${company.name} contra todas as possíveis reclamações de terceiros que de alguma forma decorram e/ou estejam relacionadas com o conteúdo que publicou no Site, incluindo qualquer reclamação baseada na alegação de que o conteúdo relevante infringe algum direito (de propriedade intelectual) de terceiros.

7.4 Não podes, sem o nosso consentimento por escrito, disponibilizar o Site ou qualquer conteúdo do mesmo a terceiros de qualquer forma, nem reproduzi-lo, distribuí-lo, transmiti-lo ou processá-lo em qualquer outro material. Isto também significa que não podes, sem o consentimento prévio por escrito de ${company.name}, solicitar e/ou reutilizar uma parte substancial do conteúdo de (uma) base(s) de dados e/ou solicitar e/ou reutilizar repetida e sistematicamente partes não substanciais do conteúdo de uma(s) base(s) de dados na aceção da Lei das Bases de Dados.`,
  },

  liability: {
    heading: '8. RESPONSABILIDADE E INDEMNIZAÇÃO',
    body: `8.1 ${company.name} não é responsável por quaisquer danos sofridos pelo Utilizador como resultado do uso do Site ou dos Serviços ou da impossibilidade de usar o Site e os Serviços, incluindo (de forma não exaustiva) danos causados por malware, vírus e/ou a inexatidão e incompletude das informações no Site, a menos que tais danos sejam resultado de dolo ou negligência grave por parte de ${company.name} ou do seu pessoal.

8.2 A responsabilidade total de ${company.name} está sempre limitada à compensação por danos diretos até um máximo de EUR 25 por evento, sendo que uma série de eventos é considerada como um único evento. Por dano direto neste contexto entende-se exclusivamente: (i) os custos que razoavelmente tiveste de incorrer para remediar ou resolver o incumprimento de ${company.name} para que a prestação de ${company.name} cumpra o acordo; (ii) custos razoáveis para prevenir ou limitar danos; e (iii) custos razoáveis para determinar a causa e a extensão dos mesmos.

8.3 Fica excluída qualquer responsabilidade de ${company.name} por danos indiretos, incluindo, entre outros, danos consequenciais, lucros cessantes e perda de receitas.

8.4 Indemnizas e manténs ${company.name} (incluindo os seus diretores e funcionários) isento de todas as responsabilidades, perdas, despesas, custas legais, custos profissionais e outros de qualquer natureza, como resultado ou decorrentes de: (a) qualquer violação por ti destes Termos e Condições; (b) o conteúdo que publicaste no Site; (c) a tua violação dos direitos de outros Utilizadores ou a tua conduta ilegal para com outros Utilizadores.`,
  },

  paidAds: {
    heading: '9. ANÚNCIOS PAGOS E SUBSCRIÇÕES',
    body: `9.1 Os Anunciantes têm a opção de publicar Anúncios em posições específicas no Site mediante o pagamento de uma taxa, dando ao Anúncio maior visibilidade. A partir do momento em que o Anúncio é publicado na posição acordada no Site, o Anunciante deve a taxa acordada. Todos os preços indicados no Site são em euros e incluem IVA quando aplicável.

9.2 ${company.name} oferece os seguintes planos de subscrição para Anunciantes:
• Basic (Grátis): Anúncio padrão com visibilidade básica nas páginas de cidade/país.
• Featured (€29/mês): Posicionamento premium no topo dos resultados de pesquisa e páginas de cidade, elegibilidade para o selo "Verificado" e funcionalidades de perfil alargadas.
• Agency (€99/mês): Gestão de anúncios em volume para agências com vários performers, suporte prioritário e gestão de conta dedicada.

9.3 A taxa devida pode ser paga através do serviço de pagamento oferecido no Site. Se o pagamento não for efetuado ou não for efetuado atempadamente, ou for revertido, temos o direito de remover o Anúncio publicado e ainda assim cobrar o montante devido. Também temos o direito de cobrar juros comerciais legais.

9.4 ${company.name} oferece aos Anunciantes a opção de comprar pacotes de crédito. Estes pacotes de crédito podem ser usados para pagar as taxas referidas no Artigo 9.1. Podes ver o montante do pacote de crédito na tua Conta. O pacote de crédito não pode ser trocado por dinheiro e não é de outra forma reembolsável junto de ${company.name}. O pacote de crédito caduca automaticamente se o acordo terminar e/ou a tua Conta for cancelada.`,
  },

  reviews: {
    heading: '10. USO DE AVALIAÇÕES',
    body: `10.1 Apenas se o Anunciante tiver optado por isso, um Visitante pode publicar uma avaliação no Anúncio do Anunciante. O Visitante deve ter sessão iniciada para o fazer.

10.2 As avaliações são verificadas por um moderador e, após aprovação, publicadas com o Anúncio correspondente. O Anunciante recebe uma notificação e tem a opção de responder uma vez. Esta resposta também é verificada pelo moderador e, após aprovação, publicada. O moderador tem o direito, a todo momento, de rejeitar uma avaliação ou resposta. A rejeição pode ocorrer, por exemplo, se a avaliação ou resposta violar o Artigo 10.3.

10.3 És responsável pelo conteúdo da tua avaliação e/ou resposta à avaliação e garantes que:
a) a avaliação e/ou resposta não viola a privacidade de terceiros (incluindo o Anunciante, o trabalhador sexual em causa ou o Visitante) e não contém dados pessoais ou outras descrições que possam ser rastreadas até uma pessoa;
b) o conteúdo da avaliação não é falso, enganoso, fraudulento, não constitui uma ameaça, não promove ou incentiva atividades ilegais, ou não é de outra forma ilegal e/ou contrário à lei;
c) com a avaliação ou resposta, não maltratas outros, incluindo o Anunciante, o trabalhador sexual ou o Visitante, por exemplo, publicando textos discriminatórios, ofensivos, desnecessariamente dolorosos ou insultuosos;
d) a avaliação é baseada na tua própria experiência com o Anunciante ou trabalhador sexual;
e) a avaliação e/ou resposta não prejudica menores de idade;
f) a avaliação e/ou resposta não contém publicidade e não promove de outra forma a venda de outros produtos ou serviços, a menos que expressamente acordado que isso é permitido;
g) a avaliação e/ou resposta não contém vírus, ficheiros corrompidos ou outro software ou programas que possam interromper ou danificar o funcionamento do Site ou de outros computadores; e
h) não prejudicarás os interesses e o bom nome do Site e de ${company.name}.

10.4 O Visitante tem conhecimento e aceita que o seu Nome de Utilizador (Nickname) será publicado com a avaliação.

10.5 Se considerares que uma avaliação ou resposta viola os Termos e Condições ou a Política de Privacidade, podes comunicar a tua reclamação por e-mail para ${company.email}. O e-mail deve incluir fundamentação adicional, justificação e provas. ${company.name} processará a reclamação e, se aplicável, reencaminhá-la-á para o Visitante ou Anunciante em causa para defesa. A reclamação será tratada o mais rapidamente possível. Durante o tratamento da reclamação, a avaliação ou resposta pode ser (temporariamente) removida. Sem prejuízo do anterior, ${company.name} tem o direito, a todo momento, de remover a tua avaliação por motivos próprios, por exemplo, na sequência de uma reclamação.

10.6 Se o acordo com um Visitante terminar, as suas avaliações também são automaticamente removidas. Se o acordo com um Anunciante terminar, as avaliações relativas a esse Anunciante e as suas respostas às avaliações são automaticamente removidas.

10.7 Se o Anunciante remover o seu Anúncio ou retirar a permissão para permitir avaliações no Anúncio, mas mantiver a sua Conta, as avaliações relativas a esse Anúncio ou Anunciante e as respostas a essas avaliações deixarão de ser exibidas no Site. No entanto, essas avaliações e respostas são conservadas na plataforma de ${company.name} para que possam ser exibidas novamente assim que o Anunciante voltar a publicar o Anúncio ou optar por permitir avaliações novamente.`,
  },

  duration: {
    heading: '11. DURAÇÃO DO ACORDO',
    body: `11.1 Cada acordo entre o Utilizador e ${company.name} é celebrado por um período indeterminado. O Utilizador pode terminar o acordo a qualquer momento, eliminando a Conta e cessando o uso.

11.2 ${company.name} terminará o acordo com efeito imediato e eliminará a tua Conta, sem obrigação de pagar compensação, se não tiveres iniciado sessão na tua Conta por mais de seis meses e também não iniciares sessão dentro do prazo adicional especificado no lembrete por nós enviado.

11.3 Além do Artigo 11.2, ${company.name} reserva-se o direito de terminar o acordo com efeito imediato e excluir-te de qualquer uso (posterior) dos Serviços, bloqueando e/ou eliminando a tua Conta, entre outras coisas, sem obrigação de pagar compensação ou reembolsar montantes já cobrados, se:
– agires de alguma forma em violação destes Termos e Condições;
– infringires direitos (de propriedade intelectual) de terceiros;
– agires em violação das leis e regulamentos aplicáveis.

11.4 Além do anterior, ${company.name} tem o direito, a todo momento, de terminar o acordo, por qualquer motivo, com um período de aviso prévio de um (1) mês.

11.5 Cada parte tem o direito de resolver o acordo sem intervenção judicial e sem aviso de incumprimento, total ou parcialmente, com efeito imediato, se a outra parte tiver requerido uma suspensão de pagamentos ou esta lhe tiver sido concedida, e/ou tiver sido declarada em falência ou tiver sido apresentado um pedido de falência contra ela.`,
  },

  disputes: {
    heading: '12. LITÍGIOS E RECLAMAÇÕES',
    body: `12.1 Estes Termos e Condições são regidos pela legislação neerlandesa.

12.2 Os litígios decorrentes ou relacionados com estes Termos e Condições ou com os acordos aos quais estes Termos e Condições tenham sido declarados aplicáveis, total ou parcialmente, serão resolvidos exclusivamente pelo tribunal competente de Haia (Den Haag), Países Baixos.

12.3 Se fores consumidor, também podes apresentar a tua reclamação na Plataforma de Resolução de Litígios em Linha da UE ("Plataforma ODR"). A Plataforma ODR é um website interativo que pode ser consultado online gratuitamente. A Plataforma ODR destina-se a ser uma forma simples para os consumidores chegarem a um acordo amigável (online) em caso de litígios com comerciantes locais e internacionais, incluindo marketplaces. A Plataforma ODR pode ser acedida através da seguinte ligação: http://ec.europa.eu/consumers/odr. Naturalmente, aconselhamos-te a apresentar primeiro qualquer reclamação a nós, enviando um e-mail para ${company.email}.`,
  },
};

/* ══════════════════════════════════════════════
   REACT COMPONENT
   ══════════════════════════════════════════════ */
const contents = { en, es, pt };

const sectionOrder = [
  'definitions',
  'general',
  'services',
  'conditions',
  'zeroTolerance',
  'privacy',
  'intellectual',
  'liability',
  'paidAds',
  'reviews',
  'duration',
  'disputes',
];

export default function Terms() {
  const lang = getLang();
  const t = contents[lang] || contents.en;
  const bt = isBT();
  const brand = bt ? 'BuscaTrans' : 'ShemaleWiki';

  const sections = sectionOrder.map((key) => t[key]).filter(Boolean);

  const backLabels = { en: '← Back to home', es: '← Volver al inicio', pt: '← Voltar ao início' };
  const lastUpdateLabels = { en: 'Last updated:', es: 'Última actualización:', pt: 'Última atualização:' };

  return (
    <>
      <SEO
        title={`${t.title} | ${brand}`}
        description={t.title}
        lang={lang}
      />
      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.5rem',
          marginBottom: '0.3rem',
        }}>{t.title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.2rem', fontSize: '0.85rem' }}>
          {brand} · {company.name} · {company.country}
        </p>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.8rem' }}>
          {lastUpdateLabels[lang]} {t.lastUpdate}
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
