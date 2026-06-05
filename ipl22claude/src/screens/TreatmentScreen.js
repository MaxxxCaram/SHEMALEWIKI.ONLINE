import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { TREATMENTS } from '../data/treatments';

const C = {
  bg: '#0a0e1a', card: '#141929', cardBorder: '#1e2840',
  accent: '#00d4aa', text: '#f0f4ff', subtext: '#8892a4',
};

export default function TreatmentScreen({ onSelect }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>

      <View style={styles.header}>
        <Text style={styles.logo}>IPL M22</Text>
        <Text style={styles.title}>Seleccionar tratamiento</Text>
        <Text style={styles.sub}>Calculadora de parámetros profesional</Text>
      </View>

      {TREATMENTS.map(t => (
        <TouchableOpacity key={t.id} style={styles.card}
          onPress={() => onSelect(t.id)} activeOpacity={0.75}>
          <View style={[styles.iconBox, { borderColor: t.color + '55', backgroundColor: t.color + '18' }]}>
            <Text style={[styles.icon, { color: t.color }]}>{t.icon}</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, { color: t.color }]}>{t.label}</Text>
            <Text style={styles.cardDesc}>{t.desc}</Text>
          </View>
          <Text style={[styles.arrow, { color: t.color }]}>›</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.disclaimer}>
        ⚠️ Guía de referencia clínica. El profesional debe adaptar los parámetros a cada paciente.
      </Text>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: C.bg },
  header: { alignItems: 'center', paddingVertical: 32, marginBottom: 8 },
  logo: { fontSize: 12, fontWeight: '700', letterSpacing: 4, color: C.accent, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: '800', color: C.text, textAlign: 'center' },
  sub: { fontSize: 13, color: C.subtext, marginTop: 4 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.card, borderRadius: 16, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: C.cardBorder,
  },
  iconBox: {
    width: 48, height: 48, borderRadius: 14, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  icon: { fontSize: 22 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardDesc: { fontSize: 12, color: C.subtext, marginTop: 2 },
  arrow: { fontSize: 26, fontWeight: '300' },
  disclaimer: {
    fontSize: 11, color: C.subtext, textAlign: 'center',
    lineHeight: 17, paddingHorizontal: 8, marginTop: 12,
  },
});
