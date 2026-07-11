import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Linking, Alert, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function TelegramScreen() {
  const [username, setUsername] = useState('');
  const [saved, setSaved] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('telegram_username').then(val => {
      if (val) {
        setUsername(val);
        setSaved(val);
      }
    });
  }, []);

  const saveUsername = async () => {
    const clean = username.replace('@', '').trim();
    if (!clean) {
      Alert.alert('⚠️', 'Ingresá tu usuario de Telegram.');
      return;
    }
    await AsyncStorage.setItem('telegram_username', clean);
    setSaved(clean);
    Alert.alert('✅', 'Usuario guardado. Tus clientes podrán contactarte directo.');
  };

  const openTelegram = () => {
    const user = saved || username.replace('@', '').trim();
    if (!user) {
      Alert.alert('⚠️', 'Primero guardá tu usuario de Telegram.');
      return;
    }
    const url = `https://t.me/${user}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('⚠️', 'No se pudo abrir Telegram. ¿Está instalado?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir en web', onPress: () => Linking.openURL(url) },
      ]);
    });
  };

  const copyLink = () => {
    const user = saved || username.replace('@', '').trim();
    if (!user) {
      Alert.alert('⚠️', 'Primero guardá tu usuario.');
      return;
    }
    // Use Clipboard API
    Alert.alert('📋', `Tu link: https://t.me/${user}\n\nCopialo y compartilo en tu anuncio.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>💬</Text>
        <Text style={styles.heroTitle}>Botón Telegram</Text>
        <Text style={styles.heroSub}>
          Tus clientes podrán contactarte directo desde tu anuncio con un solo toque.
        </Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Tu usuario de Telegram</Text>
        <View style={styles.inputRow}>
          <Text style={styles.atSign}>@</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="tuusuario"
            placeholderTextColor="#52525B"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveUsername}>
        <Text style={styles.saveText}>💾 Guardar usuario</Text>
      </TouchableOpacity>

      {saved ? (
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>✅ Vista previa del botón</Text>
          <TouchableOpacity style={styles.telegramButton} onPress={openTelegram}>
            <Text style={styles.tgIcon}>💬</Text>
            <View>
              <Text style={styles.tgLabel}>Contactar por Telegram</Text>
              <Text style={styles.tgUser}>@{saved}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.copyButton} onPress={copyLink}>
            <Text style={styles.copyText}>📋 Copiar link</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.info}>
        <Text style={styles.infoTitle}>ℹ️ ¿Cómo funciona?</Text>
        <Text style={styles.infoText}>
          1. Guardás tu @usuario de Telegram{'\n'}
          2. Se genera un botón en tu perfil público{'\n'}
          3. Tus clientes tocan el botón y te hablan directo{'\n'}
          4. Sin compartir tu número personal 🔒
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', padding: 20 },
  hero: { alignItems: 'center', marginBottom: 32, marginTop: 20 },
  heroIcon: { fontSize: 48, marginBottom: 12 },
  heroTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  heroSub: { color: '#71717A', fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 20, paddingHorizontal: 20 },
  field: { marginBottom: 16 },
  label: { color: '#A1A1AA', fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#18181B', borderRadius: 12, borderWidth: 1, borderColor: '#27272A' },
  atSign: { color: '#0891B2', fontSize: 18, fontWeight: '700', paddingLeft: 14 },
  input: { flex: 1, padding: 14, color: '#FFFFFF', fontSize: 16 },
  saveButton: { backgroundColor: '#0891B2', borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 24 },
  saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  preview: { backgroundColor: '#18181B', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#0891B244' },
  previewTitle: { color: '#0891B2', fontSize: 13, fontWeight: '700', marginBottom: 12 },
  telegramButton: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#0891B222', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#0891B2' },
  tgIcon: { fontSize: 28 },
  tgLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  tgUser: { color: '#0891B2', fontSize: 13, marginTop: 2 },
  copyButton: { marginTop: 14, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#27272A', alignItems: 'center' },
  copyText: { color: '#A1A1AA', fontSize: 14, fontWeight: '600' },
  info: { backgroundColor: '#18181B', borderRadius: 14, padding: 16, marginTop: 24, borderWidth: 1, borderColor: '#27272A' },
  infoTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  infoText: { color: '#71717A', fontSize: 13, lineHeight: 22 },
});
