import { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Alert, Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useI18n } from '../src/i18n/context';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = (width - 60) / 2;

export default function HomeScreen() {
  const [panicActive, setPanicActive] = useState(false);
  const { t, lang, setLang } = useI18n();

  const BUTTONS = [
    { label: t('profile'), icon: '👤', route: '/profile', color: '#7C3AED' },
    { label: t('photos'), icon: '📸', route: '/profile?tab=photos', color: '#2563EB' },
    { label: t('telegram'), icon: '💬', route: '/telegram', color: '#0891B2' },
    { label: t('travelPlan'), icon: '✈️', route: '/travel', color: '#7C3AED' },
    { label: t('substances'), icon: '💊', route: '/substances', color: '#10B981' },
    { label: t('emergency'), icon: '🆘', route: '/emergency', color: '#DC2626', urgent: true },
    { label: t('checkIn'), icon: '📍', route: '/checkin', color: '#EA580C' },
    { label: t('blacklist'), icon: '🚫', route: '/blacklist', color: '#4B5563' },
    { label: t('botAI'), icon: '🧠', route: '/chat', color: '#EC4899' },
  ];

  const handlePanic = useCallback(() => {
    Alert.alert(
      t('panicTitle'),
      t('panicMessage'),
      [
        { text: t('panicCancel'), style: 'cancel' },
        { text: t('panicActivate'), style: 'destructive', onPress: () => { setPanicActive(true); router.push('/emergency'); } },
      ]
    );
  }, [t]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('appName')}</Text>
        <Text style={styles.subtitle}>{t('appSubtitle')}</Text>
      </View>

      {/* Language toggle */}
      <TouchableOpacity
        style={styles.langToggle}
        onPress={() => setLang(lang === 'es' ? 'en' : 'es')}
      >
        <Text style={styles.langText}>
          {lang === 'es' ? '🇬🇧 EN' : '🇪🇸 ES'}
        </Text>
      </TouchableOpacity>

      {/* Panic Button */}
      <TouchableOpacity
        style={StyleSheet.flatten([styles.panicButton, panicActive && styles.panicActive])}
        onPress={handlePanic}
        activeOpacity={0.7}
      >
        <Text style={styles.panicIcon}>🆘</Text>
        <Text style={styles.panicText}>{t('panicButton')}</Text>
        <Text style={styles.panicHint}>{t('panicHint')}</Text>
      </TouchableOpacity>

      {/* Grid */}
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {BUTTONS.map((btn) => (
          <Link key={btn.route} href={btn.route as any} asChild>
            <TouchableOpacity
              style={StyleSheet.flatten([styles.button, { backgroundColor: btn.color + '22', borderColor: btn.color + '44' }])}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonIcon}>{btn.icon}</Text>
              <Text style={StyleSheet.flatten([styles.buttonLabel, btn.urgent && styles.urgentLabel])}>
                {btn.label}
              </Text>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Link href="/chat" asChild>
          <TouchableOpacity style={styles.aiButton}>
            <Text style={styles.aiIcon}>🧠</Text>
            <View style={styles.aiTextWrap}>
              <Text style={styles.aiLabel}>{t('aiCompanion')}</Text>
              <Text style={styles.aiHint}>{t('aiHint')}</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  header: { alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 },
  subtitle: { fontSize: 14, color: '#7C3AED', fontWeight: '600', marginTop: 4, textTransform: 'uppercase', letterSpacing: 3 },
  langToggle: { alignSelf: 'flex-end', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: '#27272A', marginBottom: 12 },
  langText: { color: '#A78BFA', fontSize: 12, fontWeight: '700' },
  panicButton: { backgroundColor: '#DC262622', borderWidth: 3, borderColor: '#DC2626', borderRadius: 20, paddingVertical: 24, alignItems: 'center', marginBottom: 16 },
  panicActive: { backgroundColor: '#DC262644', borderColor: '#EF4444' },
  panicIcon: { fontSize: 40, marginBottom: 8 },
  panicText: { color: '#EF4444', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  panicHint: { color: '#991B1B', fontSize: 11, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingBottom: 120 },
  button: { width: BUTTON_SIZE, height: BUTTON_SIZE, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', padding: 12 },
  buttonIcon: { fontSize: 32, marginBottom: 8 },
  buttonLabel: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  urgentLabel: { color: '#EF4444', letterSpacing: 1 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: Platform.OS === 'ios' ? 36 : 16 },
  aiButton: { backgroundColor: '#111111', borderWidth: 1, borderColor: '#EC4899', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiIcon: { fontSize: 28 },
  aiTextWrap: { flex: 1 },
  aiLabel: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  aiHint: { color: '#71717A', fontSize: 12, marginTop: 2 },
});
