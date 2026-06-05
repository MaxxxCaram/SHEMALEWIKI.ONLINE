import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Platform, KeyboardAvoidingView,
} from 'react-native';
import {
  FITZPATRICK, HAIR_COLORS, HAIR_DENSITY,
  LESION_COLORS, VESSEL_SIZES, MELASMA_TYPES, ACNE_GRADES,
  TREATMENT_AREAS,
} from '../data/treatments';
import { TREATMENTS } from '../data/treatments';

const C = {
  bg: '#0a0e1a', card: '#141929', cardBorder: '#1e2840',
  accent: '#00d4aa', accentDim: '#00d4aa22',
  text: '#f0f4ff', subtext: '#8892a4', inputBg: '#1a2035',
};

function SectionTitle({ children, color }) {
  return <Text style={[styles.sectionTitle, color && { color }]}>{children}</Text>;
}

function Pill({ item, selected, onPress, bgColor, textColor }) {
  return (
    <TouchableOpacity onPress={() => onPress(item.id)}
      style={[styles.pill, { backgroundColor: bgColor || C.card, borderColor: selected ? C.accent : C.cardBorder },
        selected && { borderWidth: 2 }]}
      activeOpacity={0.75}>
      <Text style={[styles.pillText, { color: textColor || C.text }]}>{item.label}</Text>
      {item.desc && <Text style={[styles.pillDesc, { color: textColor ? textColor + 'bb' : C.subtext }]}>{item.desc}</Text>}
    </TouchableOpacity>
  );
}

function ColorGrid({ items, selected, onPress }) {
  return (
    <View style={styles.colorGrid}>
      {items.map(item => (
        <TouchableOpacity key={item.id} onPress={() => onPress(item.id)}
          style={[styles.colorChip, { backgroundColor: item.color },
            selected === item.id && styles.colorChipSelected]}
          activeOpacity={0.8}>
          <Text style={[styles.colorChipText, { color: item.textColor }]} numberOfLines={2}>{item.label}</Text>
          {selected === item.id && <Text style={[styles.checkmark, { color: item.textColor }]}>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function AreaGrid({ items, selected, onPress }) {
  return (
    <View style={styles.areaGrid}>
      {items.map(item => (
        <TouchableOpacity key={item.id} onPress={() => onPress(item.id)}
          style={[styles.areaChip, selected === item.id && styles.areaChipSelected]}
          activeOpacity={0.8}>
          <Text style={[styles.areaChipText, selected === item.id && styles.areaChipTextSelected]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function DiagnosisScreen({ treatment, onSubmit, onBack }) {
  const [age, setAge]               = useState('');
  const [fitzpatrick, setFitz]      = useState(null);
  const [area, setArea]             = useState(null);
  // depilacion
  const [hairColor, setHairColor]   = useState(null);
  const [hairDensity, setHairDensity] = useState(null);
  // manchas
  const [lesionColor, setLesionColor] = useState(null);
  // vascular
  const [vesselSize, setVesselSize] = useState(null);
  // melasma
  const [melasmaType, setMelasmaType] = useState(null);
  // acne
  const [acneGrade, setAcneGrade]   = useState(null);

  const treatmentInfo = TREATMENTS.find(t => t.id === treatment);
  const areas = TREATMENT_AREAS[treatment] || [];

  const canSubmit = (() => {
    if (!age || !fitzpatrick || !area) return false;
    if (treatment === 'depilacion' && (!hairColor || !hairDensity)) return false;
    if (treatment === 'manchas' && !lesionColor) return false;
    if (treatment === 'vascular' && !vesselSize) return false;
    if (treatment === 'melasma' && !melasmaType) return false;
    if (treatment === 'acne' && !acneGrade) return false;
    return true;
  })();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ treatment, age, fitzpatrick, area, hairColor, hairDensity, lesionColor, vesselSize, melasmaType, acneGrade });
  };

  const accentColor = treatmentInfo?.color || C.accent;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={[styles.backBtnText, { color: accentColor }]}>← Tratamientos</Text>
          </TouchableOpacity>
          <View style={[styles.treatBadge, { backgroundColor: accentColor + '22', borderColor: accentColor + '55' }]}>
            <Text style={[styles.treatIcon, { color: accentColor }]}>{treatmentInfo?.icon}</Text>
            <Text style={[styles.treatLabel, { color: accentColor }]}>{treatmentInfo?.label}</Text>
          </View>
          <Text style={styles.headerTitle}>Diagnóstico del paciente</Text>
        </View>

        {/* Edad */}
        <View style={styles.card}>
          <SectionTitle color={accentColor}>Edad del paciente</SectionTitle>
          <TextInput style={styles.input} placeholder="Ej: 32" placeholderTextColor={C.subtext}
            keyboardType="number-pad" maxLength={3} value={age} onChangeText={setAge} />
        </View>

        {/* Fitzpatrick */}
        <View style={styles.card}>
          <SectionTitle color={accentColor}>Fototipo de piel (Fitzpatrick)</SectionTitle>
          <Text style={styles.hint}>Selecciona el tipo de piel del paciente</Text>
          {Object.entries(FITZPATRICK).map(([key, val]) => (
            <Pill key={key}
              item={{ id: parseInt(key), label: val.label, desc: val.desc }}
              selected={fitzpatrick === parseInt(key)}
              onPress={setFitz}
              bgColor={val.color} textColor={val.textColor} />
          ))}
        </View>

        {/* Inputs específicos por tratamiento */}
        {treatment === 'depilacion' && <>
          <View style={styles.card}>
            <SectionTitle color={accentColor}>Color del vello</SectionTitle>
            <ColorGrid items={HAIR_COLORS} selected={hairColor} onPress={setHairColor} />
          </View>
          <View style={styles.card}>
            <SectionTitle color={accentColor}>Densidad del vello</SectionTitle>
            {HAIR_DENSITY.map(item => (
              <Pill key={item.id} item={item} selected={hairDensity === item.id} onPress={setHairDensity} />
            ))}
          </View>
        </>}

        {treatment === 'manchas' && (
          <View style={styles.card}>
            <SectionTitle color={accentColor}>Color / intensidad de la mancha</SectionTitle>
            {LESION_COLORS.map(item => (
              <Pill key={item.id} item={item} selected={lesionColor === item.id} onPress={setLesionColor} />
            ))}
          </View>
        )}

        {treatment === 'vascular' && (
          <View style={styles.card}>
            <SectionTitle color={accentColor}>Tamaño del vaso</SectionTitle>
            {VESSEL_SIZES.map(item => (
              <Pill key={item.id} item={item} selected={vesselSize === item.id} onPress={setVesselSize} />
            ))}
          </View>
        )}

        {treatment === 'melasma' && (
          <View style={styles.card}>
            <SectionTitle color={accentColor}>Tipo de melasma</SectionTitle>
            {MELASMA_TYPES.map(item => (
              <Pill key={item.id} item={item} selected={melasmaType === item.id} onPress={setMelasmaType} />
            ))}
          </View>
        )}

        {treatment === 'acne' && (
          <View style={styles.card}>
            <SectionTitle color={accentColor}>Grado del acné</SectionTitle>
            {ACNE_GRADES.map(item => (
              <Pill key={item.id} item={item} selected={acneGrade === item.id} onPress={setAcneGrade} />
            ))}
          </View>
        )}

        {/* Zona */}
        <View style={styles.card}>
          <SectionTitle color={accentColor}>Zona de tratamiento</SectionTitle>
          <AreaGrid items={areas} selected={area} onPress={setArea} accentColor={accentColor} />
        </View>

        {/* Botón */}
        <TouchableOpacity
          style={[styles.calcButton, { backgroundColor: canSubmit ? accentColor : C.cardBorder }]}
          onPress={handleSubmit} activeOpacity={canSubmit ? 0.8 : 1}>
          <Text style={styles.calcButtonText}>
            {canSubmit ? 'CALCULAR PARÁMETROS →' : 'Completa todos los campos'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          ⚠️ Esta calculadora es una guía de referencia. Siempre realizar patch test ante la duda.
        </Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: C.bg },
  header: { paddingTop: 52, paddingBottom: 16 },
  backBtn: { marginBottom: 12 },
  backBtnText: { fontSize: 13, fontWeight: '600' },
  treatBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    alignSelf: 'flex-start', marginBottom: 12,
  },
  treatIcon: { fontSize: 16 },
  treatLabel: { fontSize: 14, fontWeight: '700' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: C.text },
  card: {
    backgroundColor: C.card, borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: C.cardBorder,
  },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: C.accent,
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12,
  },
  hint: { fontSize: 12, color: C.subtext, marginBottom: 10, marginTop: -6 },
  input: {
    backgroundColor: C.inputBg, borderRadius: 10, padding: 14,
    fontSize: 20, color: C.text, borderWidth: 1, borderColor: C.cardBorder,
    textAlign: 'center', letterSpacing: 2,
  },
  pill: { borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1 },
  pillText: { fontSize: 14, fontWeight: '600' },
  pillDesc: { fontSize: 11, marginTop: 2 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  colorChip: {
    width: '30%', minHeight: 64, borderRadius: 10, padding: 8,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'transparent',
  },
  colorChipSelected: { borderColor: C.accent, borderWidth: 2.5 },
  colorChipText: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  checkmark: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  areaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  areaChip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.cardBorder,
  },
  areaChipSelected: { backgroundColor: C.accentDim, borderColor: C.accent },
  areaChipText: { fontSize: 13, color: C.subtext, fontWeight: '500' },
  areaChipTextSelected: { color: C.accent, fontWeight: '700' },
  calcButton: { borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 8, marginBottom: 16 },
  calcButtonText: { fontSize: 15, fontWeight: '800', color: '#0a0e1a', letterSpacing: 0.5 },
  disclaimer: { fontSize: 11, color: C.subtext, textAlign: 'center', lineHeight: 17, paddingHorizontal: 8 },
});
