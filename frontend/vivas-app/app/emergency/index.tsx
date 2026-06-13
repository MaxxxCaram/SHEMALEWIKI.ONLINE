import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, Vibration, Platform, Animated,
} from 'react-native';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import { router } from 'expo-router';

const EMERGENCY_CONTACTS = [
  { name: 'Línea 144 - Violencia de Género', number: '144' },
  { name: 'Policía', number: '911' },
  { name: 'Contacto de confianza', number: '' },
];

export default function EmergencyScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [activated, setActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (activated) {
      Vibration.vibrate([500, 200, 500, 200, 500]);
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [activated]);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('⚠️', 'Necesitamos acceso a ubicación para emergencias.');
      return null;
    }
    return await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  };

  const activateEmergency = async () => {
    setActivated(true);
    const loc = await getLocation();
    setLocation(loc);

    // Countdown before sending
    let count = 5;
    setCountdown(count);
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(timer);
        sendEmergencyAlert(loc);
      }
    }, 1000);
  };

  const sendEmergencyAlert = async (loc: Location.LocationObject | null) => {
    const msg = loc
      ? `🆘 EMERGENCIA — Vivas Nos Queremos\nNecesito ayuda.\n📍 Ubicación: https://maps.google.com/?q=${loc.coords.latitude},${loc.coords.longitude}\n⏰ ${new Date().toLocaleString('es-AR')}`
      : '🆘 EMERGENCIA — Vivas Nos Queremos\nNecesito ayuda.';

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      // Send to emergency contacts (excluding empty numbers)
      const recipients = EMERGENCY_CONTACTS.filter(c => c.number).map(c => c.number);
      if (recipients.length > 0) {
        await SMS.sendSMSAsync(recipients, msg);
      }
    }

    Alert.alert('✅ ALERTA ENVIADA', 'Tus contactos de emergencia fueron notificados con tu ubicación.\n\nSi estás en peligro inminente, llamá al 911.', [
      { text: 'Volver', onPress: () => router.back() },
      { text: 'Llamar 911', style: 'destructive', onPress: () => {
        // Linking.openURL('tel:911')
      }},
    ]);
  };

  const cancelEmergency = () => {
    Vibration.cancel();
    setActivated(false);
    setCountdown(5);
  };

  return (
    <View style={styles.container}>
      {!activated ? (
        <View style={styles.activateContainer}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningTitle}>Botón de Emergencia</Text>
          <Text style={styles.warningText}>
            Al activar, se enviará tu ubicación en tiempo real a tus contactos de confianza.
            Usalo solo en situaciones de peligro real.
          </Text>
          <TouchableOpacity style={styles.activateButton} onPress={activateEmergency} activeOpacity={0.7}>
            <Text style={styles.activateButtonText}>ACTIVAR EMERGENCIA</Text>
            <Text style={styles.activateHint}>Tocá y mantené presionado</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View style={StyleSheet.flatten([styles.activeContainer, { transform: [{ scale: pulseAnim }] }])}>
          <Text style={styles.alertIcon}>🆘</Text>
          <Text style={styles.alertTitle}>¡EMERGENCIA ACTIVADA!</Text>
          <Text style={styles.countdownText}>Enviando alerta en {countdown}s</Text>
          {location && (
            <Text style={styles.locationText}>
              📍 {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
            </Text>
          )}
          <TouchableOpacity style={styles.cancelButton} onPress={cancelEmergency}>
            <Text style={styles.cancelText}>Cancelar (falsa alarma)</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.contactsSection}>
        <Text style={styles.contactsTitle}>📋 Contactos de Emergencia</Text>
        {EMERGENCY_CONTACTS.map((c, i) => (
          <View key={i} style={styles.contactRow}>
            <Text style={styles.contactName}>{c.name}</Text>
            <Text style={styles.contactNumber}>{c.number || 'No configurado'}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.configButton}>
          <Text style={styles.configText}>⚙️ Configurar contactos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', padding: 20, paddingTop: 0 },
  activateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  warningIcon: { fontSize: 60, marginBottom: 16 },
  warningTitle: { color: '#EF4444', fontSize: 24, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  warningText: { color: '#A1A1AA', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  activateButton: { backgroundColor: '#DC2626', borderRadius: 20, paddingVertical: 24, paddingHorizontal: 40, alignItems: 'center', width: '100%' },
  activateButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  activateHint: { color: '#FCA5A5', fontSize: 12, marginTop: 6 },
  activeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#DC262622', borderRadius: 24, marginVertical: 20 },
  alertIcon: { fontSize: 60, marginBottom: 16 },
  alertTitle: { color: '#EF4444', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  countdownText: { color: '#FFFFFF', fontSize: 32, fontWeight: '900', marginBottom: 16 },
  locationText: { color: '#A1A1AA', fontSize: 14, backgroundColor: '#18181B', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  cancelButton: { marginTop: 20, padding: 12 },
  cancelText: { color: '#71717A', fontSize: 14, fontWeight: '600' },
  contactsSection: { paddingVertical: 20, borderTopWidth: 1, borderColor: '#27272A' },
  contactsTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#18181B' },
  contactName: { color: '#FFFFFF', fontSize: 14 },
  contactNumber: { color: '#71717A', fontSize: 14, fontWeight: '600' },
  configButton: { marginTop: 16, padding: 12, backgroundColor: '#18181B', borderRadius: 10, alignItems: 'center' },
  configText: { color: '#7C3AED', fontSize: 14, fontWeight: '600' },
});
