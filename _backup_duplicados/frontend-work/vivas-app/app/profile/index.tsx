import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  TouchableOpacity, Alert, Image, Switch, Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState('');
  const [available, setAvailable] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const saveProfile = () => {
    Alert.alert('✅', 'Perfil guardado correctamente.');
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>📸 Fotos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoStrip}>
        {photos.map((uri, i) => (
          <Image key={i} source={{ uri }} style={styles.photo} />
        ))}
        <TouchableOpacity style={styles.addPhoto} onPress={pickImage}>
          <Text style={styles.addPhotoIcon}>+</Text>
          <Text style={styles.addPhotoText}>Agregar</Text>
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.sectionTitle}>📋 Información básica</Text>
      <View style={styles.field}>
        <Text style={styles.label}>Nombre artístico</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Tu nombre" placeholderTextColor="#52525B" />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Biografía</Text>
        <TextInput style={StyleSheet.flatten([styles.input, styles.textArea])} value={bio} onChangeText={setBio} placeholder="Describite..." placeholderTextColor="#52525B" multiline numberOfLines={4} />
      </View>
      <View style={styles.row}>
        <View style={StyleSheet.flatten([styles.field, { flex: 1 }])}>
          <Text style={styles.label}>Edad</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} placeholder="25" placeholderTextColor="#52525B" keyboardType="numeric" />
        </View>
        <View style={StyleSheet.flatten([styles.field, { flex: 2, marginLeft: 12 }])}>
          <Text style={styles.label}>Ubicación</Text>
          <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Ciudad, País" placeholderTextColor="#52525B" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>📞 Contacto</Text>
      <View style={styles.field}>
        <Text style={styles.label}>WhatsApp / Teléfono</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+54 9 11..." placeholderTextColor="#52525B" keyboardType="phone-pad" />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Usuario de Telegram</Text>
        <TextInput style={styles.input} value={telegram} onChangeText={setTelegram} placeholder="@tunombre" placeholderTextColor="#52525B" autoCapitalize="none" />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Disponible ahora</Text>
        <Switch value={available} onValueChange={setAvailable} trackColor={{ false: '#27272A', true: '#7C3AED' }} thumbColor="#FFFFFF" />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveText}>💾 Guardar Perfil</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { padding: 20, paddingTop: Platform.OS === 'ios' ? 0 : 8 },
  sectionTitle: { color: '#7C3AED', fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, marginTop: 24, marginBottom: 12 },
  photoStrip: { flexDirection: 'row', marginBottom: 8 },
  photo: { width: 100, height: 130, borderRadius: 12, marginRight: 10, backgroundColor: '#27272A' },
  addPhoto: { width: 100, height: 130, borderRadius: 12, borderWidth: 2, borderColor: '#7C3AED', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  addPhotoIcon: { color: '#7C3AED', fontSize: 32, fontWeight: '300' },
  addPhotoText: { color: '#7C3AED', fontSize: 11, marginTop: 4 },
  field: { marginBottom: 16 },
  label: { color: '#A1A1AA', fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: '#18181B', borderWidth: 1, borderColor: '#27272A', borderRadius: 12, padding: 14, color: '#FFFFFF', fontSize: 16 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, backgroundColor: '#18181B', padding: 14, borderRadius: 12 },
  saveButton: { backgroundColor: '#7C3AED', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 12 },
  saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
