// Translations for Vivas Nos Queremos — ES (default) + EN
export type Lang = 'es' | 'en';

const es = {
  // App
  appName: 'Vivas Nos Queremos',
  appSubtitle: 'Seguridad y autonomía',
  
  // Home
  panicButton: 'BOTÓN DE EMERGENCIA',
  panicHint: 'Mantené presionado o tocá para activar',
  panicTitle: '🆘 EMERGENCIA',
  panicMessage: '¿Activar protocolo de emergencia?\n\nSe enviará tu ubicación a tus contactos de confianza.',
  panicCancel: 'Cancelar',
  panicActivate: 'ACTIVAR EMERGENCIA',
  
  // Menu buttons
  profile: 'Mi Perfil',
  photos: 'Fotos',
  telegram: 'Telegram',
  travelPlan: 'Travel Plan',
  substances: 'Info Sustancias',
  emergency: 'EMERGENCIA',
  checkIn: 'Check-In',
  blacklist: 'Blacklist',
  botAI: 'Bot IA',
  aiCompanion: 'Acompañante Virtual',
  aiHint: 'Hablá conmigo • Confidencial',
  
  // Chat
  chatTitle: 'Acompañante IA',
  chatPlaceholder: 'Escribí lo que sientas...',
  chatTyping: 'Vivas está escribiendo...',
  chatDisclaimer: '⚠️ No es terapia profesional • Confidencial • Sin datos',
  chatGreeting: '¡Hola! Soy **Vivas**, tu acompañante virtual. 💜\n\nPodemos hablar de lo que necesites:\n• Cómo te sentís hoy\n• Situaciones difíciles\n• Consumo y reducción de daños\n• Seguridad en encuentros\n• O simplemente desahogarte\n\nLo que hablemos queda entre nosotras. ¿Cómo estás?',
  chatNoConnection: '⚠️ Sin conexión con Vivas IA',
  
  // Profile
  profileTitle: 'Mi Perfil',
  profileName: 'Nombre',
  profileAge: 'Edad',
  profileLocation: 'Ubicación',
  profileBio: 'Bio',
  profileSave: 'Guardar',
  profileAvailable: 'Disponible',
  
  // Check-in
  checkinTitle: 'Check-In',
  checkinAddress: 'Dirección',
  checkinDuration: 'Duración estimada (min)',
  checkinClient: 'Nombre del cliente',
  checkinStart: 'Iniciar Check-In',
  checkinActive: 'Check-In activo',
  checkinEnd: 'Finalizar Check-In',
  
  // Emergency
  emergencyTitle: '🆘 Emergencia',
  emergencySending: 'Enviando alerta...',
  emergencySent: 'Alerta enviada a tus contactos',
  emergencyCancel: 'Cancelar emergencia',
  
  // Blacklist
  blacklistTitle: 'Blacklist',
  blacklistName: 'Nombre del cliente',
  blacklistPhone: 'Teléfono',
  blacklistReason: 'Motivo',
  blacklistAdd: 'Agregar a Blacklist',
  blacklistEmpty: 'No hay clientes en tu blacklist',
  
  // Substances
  substancesTitle: '💊 Info Sustancias',
  
  // Language
  language: 'Idioma',
  switchToEn: 'Switch to English',
  switchToEs: 'Cambiar a Español',
};

const en: typeof es = {
  appName: 'Vivas Nos Queremos',
  appSubtitle: 'Safety & Autonomy',
  
  panicButton: 'EMERGENCY BUTTON',
  panicHint: 'Hold or tap to activate',
  panicTitle: '🆘 EMERGENCY',
  panicMessage: 'Activate emergency protocol?\n\nYour location will be sent to your trusted contacts.',
  panicCancel: 'Cancel',
  panicActivate: 'ACTIVATE EMERGENCY',
  
  profile: 'My Profile',
  photos: 'Photos',
  telegram: 'Telegram',
  travelPlan: 'Travel Plan',
  substances: 'Substance Info',
  emergency: 'EMERGENCY',
  checkIn: 'Check-In',
  blacklist: 'Blacklist',
  botAI: 'AI Bot',
  aiCompanion: 'Virtual Companion',
  aiHint: 'Talk to me • Confidential',
  
  chatTitle: 'AI Companion',
  chatPlaceholder: 'Write what you\'re feeling...',
  chatTyping: 'Vivas is typing...',
  chatDisclaimer: '⚠️ Not professional therapy • Confidential • No data stored',
  chatGreeting: 'Hi! I\'m **Vivas**, your virtual companion. 💜\n\nWe can talk about whatever you need:\n• How you\'re feeling today\n• Difficult situations\n• Substance use and harm reduction\n• Safety during sessions\n• Or just vent\n\nWhat we talk about stays between us. How are you?',
  chatNoConnection: '⚠️ No connection to Vivas AI',
  
  profileTitle: 'My Profile',
  profileName: 'Name',
  profileAge: 'Age',
  profileLocation: 'Location',
  profileBio: 'Bio',
  profileSave: 'Save',
  profileAvailable: 'Available',
  
  checkinTitle: 'Check-In',
  checkinAddress: 'Address',
  checkinDuration: 'Estimated duration (min)',
  checkinClient: 'Client name',
  checkinStart: 'Start Check-In',
  checkinActive: 'Check-In active',
  checkinEnd: 'End Check-In',
  
  emergencyTitle: '🆘 Emergency',
  emergencySending: 'Sending alert...',
  emergencySent: 'Alert sent to your contacts',
  emergencyCancel: 'Cancel emergency',
  
  blacklistTitle: 'Blacklist',
  blacklistName: 'Client name',
  blacklistPhone: 'Phone',
  blacklistReason: 'Reason',
  blacklistAdd: 'Add to Blacklist',
  blacklistEmpty: 'No clients in your blacklist',
  
  substancesTitle: '💊 Substance Info',
  
  language: 'Language',
  switchToEn: 'Switch to English',
  switchToEs: 'Cambiar a Español',
};

export const translations: Record<Lang, typeof es> = { es, en };

// Helper to get nested key type-safely
export function t(lang: Lang, key: keyof typeof es): string {
  return translations[lang][key] || translations.es[key] || key;
}
