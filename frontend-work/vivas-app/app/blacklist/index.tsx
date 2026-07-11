import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, Alert, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BlacklistEntry {
  id: string;
  name: string;
  phone: string;
  reason: string;
  dangerLevel: 'bajo' | 'medio' | 'alto';
  reportedAt: string;
  reportedBy: string;
}

const DANGER_COLORS = { bajo: '#059669', medio: '#EA580C', alto: '#DC2626' };

export default function BlacklistScreen() {
  const [entries, setEntries] = useState<BlacklistEntry[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ name: '', phone: '', reason: '', dangerLevel: 'medio' as 'bajo' | 'medio' | 'alto' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('blacklist');
      if (data) setEntries(JSON.parse(data));
    } catch {}
  };

  const saveData = async (newEntries: BlacklistEntry[]) => {
    await AsyncStorage.setItem('blacklist', JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const addEntry = async () => {
    if (!newEntry.name.trim()) {
      Alert.alert('⚠️', 'El nombre es obligatorio.');
      return;
    }
    const entry: BlacklistEntry = {
      id: Date.now().toString(),
      ...newEntry,
      reportedAt: new Date().toISOString(),
      reportedBy: 'yo',
    };
    await saveData([entry, ...entries]);
    setNewEntry({ name: '', phone: '', reason: '', dangerLevel: 'medio' });
    setShowForm(false);
  };

  const deleteEntry = (id: string) => {
    Alert.alert('🗑️', '¿Eliminar de la blacklist?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        await saveData(entries.filter(e => e.id !== id));
      }},
    ]);
  };

  const filtered = search
    ? entries.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.phone.includes(search)
      )
    : entries;

  const renderItem = ({ item }: { item: BlacklistEntry }) => (
    <TouchableOpacity style={styles.card} onPress={() => deleteEntry(item.id)} onLongPress={() => deleteEntry(item.id)}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardName}>{item.name}</Text>
        <View style={StyleSheet.flatten([styles.dangerBadge, { backgroundColor: DANGER_COLORS[item.dangerLevel] + '22' }])}>
          <Text style={StyleSheet.flatten([styles.dangerText, { color: DANGER_COLORS[item.dangerLevel] }])}>
            {item.dangerLevel.toUpperCase()}
          </Text>
        </View>
      </View>
      {item.phone ? <Text style={styles.cardPhone}>📞 {item.phone}</Text> : null}
      {item.reason ? <Text style={styles.cardReason}>{item.reason}</Text> : null}
      <Text style={styles.cardDate}>Reportado: {new Date(item.reportedAt).toLocaleDateString('es-AR')}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.warning}>⚠️ Datos locales • No se comparten sin tu permiso</Text>

      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar por nombre o teléfono..."
        placeholderTextColor="#52525B"
      />

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay clientes en tu blacklist.{'\n'}¡Ojalá nunca necesites agregar uno! 💜</Text>
        }
      />

      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Nuevo reporte</Text>
          <TextInput style={styles.input} value={newEntry.name} onChangeText={t => setNewEntry({ ...newEntry, name: t })} placeholder="Nombre / alias del cliente" placeholderTextColor="#52525B" />
          <TextInput style={styles.input} value={newEntry.phone} onChangeText={t => setNewEntry({ ...newEntry, phone: t })} placeholder="Teléfono (opcional)" placeholderTextColor="#52525B" keyboardType="phone-pad" />
          <TextInput style={StyleSheet.flatten([styles.input, styles.textArea])} value={newEntry.reason} onChangeText={t => setNewEntry({ ...newEntry, reason: t })} placeholder="Motivo: ¿qué pasó?" placeholderTextColor="#52525B" multiline numberOfLines={3} />
          <View style={styles.dangerRow}>
            {(['bajo', 'medio', 'alto'] as const).map(level => (
              <TouchableOpacity
                key={level}
                style={StyleSheet.flatten([styles.dangerOption, newEntry.dangerLevel === level && { backgroundColor: DANGER_COLORS[level] + '33', borderColor: DANGER_COLORS[level] }])}
                onPress={() => setNewEntry({ ...newEntry, dangerLevel: level })}
              >
                <Text style={StyleSheet.flatten([styles.dangerOptionText, { color: DANGER_COLORS[level] }])}>{level.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.formButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={addEntry}>
              <Text style={styles.saveText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={StyleSheet.flatten([styles.addButton, showForm && { backgroundColor: '#27272A' }])}
        onPress={() => setShowForm(!showForm)}
      >
        <Text style={styles.addText}>{showForm ? '✕ Cerrar' : '🚫 Agregar cliente'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', padding: 20 },
  warning: { color: '#71717A', fontSize: 11, textAlign: 'center', marginBottom: 12 },
  searchInput: { backgroundColor: '#18181B', borderWidth: 1, borderColor: '#27272A', borderRadius: 12, padding: 14, color: '#FFFFFF', fontSize: 15, marginBottom: 12 },
  list: { paddingBottom: 100 },
  card: { backgroundColor: '#18181B', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#27272A' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', flex: 1 },
  dangerBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  dangerText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  cardPhone: { color: '#A1A1AA', fontSize: 13, marginTop: 2 },
  cardReason: { color: '#71717A', fontSize: 13, marginTop: 4, fontStyle: 'italic' },
  cardDate: { color: '#52525B', fontSize: 11, marginTop: 6 },
  empty: { color: '#52525B', textAlign: 'center', marginTop: 60, fontSize: 14, lineHeight: 22 },
  form: { backgroundColor: '#18181B', borderRadius: 16, padding: 20, marginTop: 12, borderWidth: 1, borderColor: '#DC262644' },
  formTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: '#0A0A0A', borderWidth: 1, borderColor: '#27272A', borderRadius: 10, padding: 12, color: '#FFFFFF', fontSize: 14, marginBottom: 10 },
  textArea: { minHeight: 70, textAlignVertical: 'top' },
  dangerRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  dangerOption: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#27272A', alignItems: 'center' },
  dangerOptionText: { fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  formButtons: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#27272A', alignItems: 'center' },
  cancelText: { color: '#71717A', fontSize: 14, fontWeight: '600' },
  saveBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#DC2626', alignItems: 'center' },
  saveText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  addButton: { position: 'absolute', bottom: 24, left: 20, right: 20, backgroundColor: '#DC2626', borderRadius: 14, padding: 16, alignItems: 'center' },
  addText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
