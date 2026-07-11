import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Alert, Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';

interface CheckInSession {
  id: string;
  address: string;
  clientName: string;
  startTime: string;
  estimatedDuration: number; // minutes
  location: { lat: number; lng: number } | null;
  status: 'active' | 'completed' | 'expired';
}

export default function CheckInScreen() {
  const [session, setSession] = useState<CheckInSession | null>(null);
  const [address, setAddress] = useState('');
  const [clientName, setClientName] = useState('');
  const [duration, setDuration] = useState('60');
  const [timer, setTimer] = useState(0);
  const [expired, setExpired] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // History
  const [history, setHistory] = useState<CheckInSession[]>([]);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    return { lat: loc.coords.latitude, lng: loc.coords.longitude };
  };

  const startCheckIn = async () => {
    if (!address.trim()) {
      Alert.alert('⚠️', 'Ingresá la dirección del encuentro.');
      return;
    }

    const loc = await getLocation();
    const newSession: CheckInSession = {
      id: Date.now().toString(),
      address: address.trim(),
      clientName: clientName.trim() || 'No especificado',
      startTime: new Date().toISOString(),
      estimatedDuration: parseInt(duration) || 60,
      location: loc,
      status: 'active',
    };

    setSession(newSession);
    setTimer(0);
    setExpired(false);

    // Start timer
    const totalSeconds = newSession.estimatedDuration * 60;
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        const next = prev + 1;
        if (next >= totalSeconds) {
          clearInterval(timerRef.current!);
          setExpired(true);
          Alert.alert(
            '⏰ Tiempo cumplido',
            `Pasaron ${newSession.estimatedDuration} minutos desde tu check-in.\n\n¿Está todo bien? Si no respondés en 5 minutos, se alertará a tus contactos.`,
            [
              { text: 'Estoy bien ✅', onPress: () => completeCheckIn(newSession.id) },
              { text: 'Necesito ayuda 🆘', style: 'destructive', onPress: () => router.push('/emergency') },
            ]
          );
          return next;
        }
        return next;
      });
    }, 1000);

    Alert.alert('✅ Check-In registrado', `📍 ${address}\n⏰ Alerta en ${duration} min\n👤 Cliente: ${newSession.clientName}\n\nSi no hacés check-out, avisaremos a tus contactos.`);
  };

  const completeCheckIn = (sessionId: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (session) {
      const completed = { ...session, status: 'completed' as const };
      setHistory([completed, ...history.slice(0, 19)]);
    }
    setSession(null);
    setTimer(0);
    setAddress('');
    setClientName('');
    Alert.alert('🏠 Check-Out', 'Registro completado. ¡Nos alegramos de que estés bien! 💜');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (session) {
    const total = session.estimatedDuration * 60;
    const progress = timer / total;
    const remaining = total - timer;

    return (
      <View style={styles.container}>
        <View style={StyleSheet.flatten([styles.activeCard, expired && styles.expiredCard])}>
          <Text style={styles.activeIcon}>{expired ? '⚠️' : '📍'}</Text>
          <Text style={styles.activeTitle}>{expired ? '¡TIEMPO CUMPLIDO!' : 'Check-In Activo'}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dirección</Text>
            <Text style={styles.infoValue}>{session.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cliente</Text>
            <Text style={styles.infoValue}>{session.clientName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Duración</Text>
            <Text style={styles.infoValue}>{session.estimatedDuration} min</Text>
          </View>

          <View style={styles.timerSection}>
            <Text style={styles.timerLabel}>Transcurrido</Text>
            <Text style={StyleSheet.flatten([styles.timerValue, expired && styles.timerExpired])}>
              {formatTime(timer)}
            </Text>
            <View style={styles.progressBar}>
              <View style={StyleSheet.flatten([styles.progressFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: expired ? '#EF4444' : '#7C3AED' }])} />
            </View>
            <Text style={styles.remainingText}>
              {expired ? '¡ALERTA!' : `Restan ${formatTime(remaining)}`}
            </Text>
          </View>

          <TouchableOpacity
            style={StyleSheet.flatten([styles.checkoutButton, expired && styles.emergencyButton])}
            onPress={() => completeCheckIn(session.id)}
          >
            <Text style={styles.checkoutText}>
              {expired ? '🆘 PEDIR AYUDA' : '✅ Check-Out — Estoy bien'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Nuevo Check-In</Text>
      <Text style={styles.description}>
        Registrá tu ubicación antes de entrar a un domicilio u hotel.
        Si no hacés check-out a tiempo, avisaremos a tus contactos.
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Dirección del encuentro</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Calle, número, departamento, hotel..." placeholderTextColor="#52525B" />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Nombre/alias del cliente (opcional)</Text>
        <TextInput style={styles.input} value={clientName} onChangeText={setClientName} placeholder="Juan, Hotel XYZ..." placeholderTextColor="#52525B" />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Duración estimada (minutos)</Text>
        <TextInput style={styles.input} value={duration} onChangeText={setDuration} placeholder="60" placeholderTextColor="#52525B" keyboardType="numeric" />
      </View>

      <TouchableOpacity style={styles.startButton} onPress={startCheckIn}>
        <Text style={styles.startText}>📍 Iniciar Check-In</Text>
      </TouchableOpacity>

      {history.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>📜 Historial reciente</Text>
          {history.map(h => (
            <View key={h.id} style={styles.historyItem}>
              <Text style={styles.historyAddress}>{h.address}</Text>
              <Text style={styles.historyDate}>{new Date(h.startTime).toLocaleString('es-AR')}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', padding: 20 },
  sectionTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  description: { color: '#71717A', fontSize: 13, lineHeight: 20, marginBottom: 24 },
  field: { marginBottom: 16 },
  label: { color: '#A1A1AA', fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: '#18181B', borderWidth: 1, borderColor: '#27272A', borderRadius: 12, padding: 14, color: '#FFFFFF', fontSize: 16 },
  startButton: { backgroundColor: '#EA580C', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 8 },
  startText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  activeCard: { backgroundColor: '#18181B', borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 2, borderColor: '#7C3AED' },
  expiredCard: { borderColor: '#EF4444', backgroundColor: '#DC262611' },
  activeIcon: { fontSize: 40, marginBottom: 8 },
  activeTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#27272A' },
  infoLabel: { color: '#71717A', fontSize: 13 },
  infoValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  timerSection: { width: '100%', alignItems: 'center', marginTop: 20, marginBottom: 16 },
  timerLabel: { color: '#71717A', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  timerValue: { color: '#7C3AED', fontSize: 48, fontWeight: '900', fontVariant: ['tabular-nums'] },
  timerExpired: { color: '#EF4444' },
  progressBar: { width: '100%', height: 6, backgroundColor: '#27272A', borderRadius: 3, marginTop: 12 },
  progressFill: { height: '100%', borderRadius: 3 },
  remainingText: { color: '#A1A1AA', fontSize: 12, marginTop: 6 },
  checkoutButton: { backgroundColor: '#059669', borderRadius: 14, padding: 18, width: '100%', alignItems: 'center', marginTop: 20 },
  emergencyButton: { backgroundColor: '#DC2626' },
  checkoutText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  historySection: { marginTop: 32, borderTopWidth: 1, borderColor: '#27272A', paddingTop: 20 },
  historyTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  historyItem: { paddingVertical: 10, borderBottomWidth: 1, borderColor: '#18181B' },
  historyAddress: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  historyDate: { color: '#71717A', fontSize: 12, marginTop: 2 },
});
