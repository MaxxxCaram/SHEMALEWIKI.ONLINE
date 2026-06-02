import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Platform, KeyboardAvoidingView,
} from 'react-native';
import { FITZPATRICK, HAIR_COLORS, HAIR_DENSITY, TREATMENT_AREAS } from '../data/parameters';

const COLORS = {
  bg: '#0a0e1a',
  card: '#141929',
  cardBorder: '#1e2840',
  accent: '#00d4aa',
  accentDim: '#00d4aa22',
  text: '#f0f4ff',
  subtext: '#8892a4',
  warning: '#ff6b35',
  inputBg: '#1a2035',
};

function SectionTitle({ children }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function OptionPill({ item, selected, onPress, bgColor, textColor, small }) {
  return (
    <TouchableOpacity
      onPress={() => onPress(item.id)}
      style={[
        styles.pill,
        small && styles.pillSmall,
        { backgroundColor: bgColor || COLORS.card, borderColor: selected ? COLORS.accent : COLORS.cardBorder },
        selected && { borderWidth: 2 },
      ]}
      activeOpacity={0.75}
    >
      <Text style={[styles.pillText, { color: textColor || COLORS.text }, small && styles.pillTextSmall]}>
        {item.label}
      </Text>
      {item.desc && !small && (
        <Text style={styles.pillDesc}>{item.desc}</Text>
      )}
    </TouchableOpacity>
  );
}

export default function DiagnosisScreen({ onSubmit }) {
  const [age, setAge] = useState('');
  const [fitzpatrick, setFitzpatrick] = useState(null);
  const [hairColor, setHairColor] = useState(null);
  const [hairDensity, setHairDensity] = useState(null);
  const [area, setArea] = useState(null);

  const canSubmit = age && fitzpatrick && hairColor && hairDensity && area;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoText}>IPL M22</Text>
          <Text style={styles.headerTitle}>Calculadora de parámetros</Text>
          <Text style={styles.headerSub}>Depilación por luz pulsada intensa</Text>
        </View>

        {/* Edad */}
        <View style={styles.card}>
          <SectionTitle>Edad del paciente</SectionTitle>
          <TextInput
            style={styles.input}
            placeholder="Ej: 28"
            placeholderTextColor={COLORS.subtext}
            keyboardType="number-pad"
            maxLength={3}
            value={age}
            onChangeText={setAge}
          />
        </View>

        {/* Fototipo Fitzpatrick */}
        <View style={styles.card}>
          <SectionTitle>Fototipo de piel (Fitzpatrick)</SectionTitle>
          <Text style={styles.hint}>Selecciona el tipo de piel del paciente</Text>
          {Object.entries(FITZPATRICK).map(([key, val]) => (
            <OptionPill
              key={key}
              item={{ id: parseInt(key), label: val.label, desc: val.desc }}
              selected={fitzpatrick === parseInt(key)}
              onPress={setFitzpatrick}
              bgColor={val.color}
              textColor={val.textColor}
            />
          ))}
        </View>

        {/* Color del vello */}
        <View style={styles.card}>
          <SectionTitle>Color del vello</SectionTitle>
          <View style={styles.colorGrid}>
            {HAIR_COLORS.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setHairColor(item.id)}
                style={[
                  styles.colorChip,
                  { backgroundColor: item.color },
                  hairColor === item.id && styles.colorChipSelected,
                ]}
                activeOpacity={0.8}
              >
                <Text style={[styles.colorChipText, { color: item.textColor }]} numberOfLines={2}>
                  {item.label}
                </Text>
                {hairColor === item.id && (
                  <Text style={[styles.checkmark, { color: item.textColor }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Densidad del vello */}
        <View style={styles.card}>
          <SectionTitle>Densidad del vello</SectionTitle>
          {HAIR_DENSITY.map((item) => (
            <OptionPill
              key={item.id}
              item={item}
              selected={hairDensity === item.id}
              onPress={setHairDensity}
            />
          ))}
        </View>

        {/* Zona de tratamiento */}
        <View style={styles.card}>
          <SectionTitle>Zona de tratamiento</SectionTitle>
          <View style={styles.areaGrid}>
            {TREATMENT_AREAS.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setArea(item.id)}
                style={[
                  styles.areaChip,
                  area === item.id && styles.areaChipSelected,
                ]}
                activeOpacity={0.8}
              >
                <Text style={[styles.areaChipText, area === item.id && styles.areaChipTextSelected]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botón calcular */}
        <TouchableOpacity
          style={[styles.calcButton, !canSubmit && styles.calcButtonDisabled]}
          onPress={() => canSubmit && onSubmit({ fitzpatrick, hairColor, hairDensity, age, area })}
          activeOpacity={canSubmit ? 0.8 : 1}
        >
          <Text style={styles.calcButtonText}>
            {canSubmit ? 'CALCULAR PARÁMETROS →' : 'Completa todos los campos'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          ⚠️ Esta calculadora es una guía de referencia. El profesional debe evaluar cada caso individualmente y adaptar los parámetros según la respuesta del paciente. Siempre realizar patch test ante la duda.
        </Text>

        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.bg,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 28,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 4,
    color: COLORS.accent,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  headerSub: {
    fontSize: 13,
    color: COLORS.subtext,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  hint: {
    fontSize: 12,
    color: COLORS.subtext,
    marginBottom: 10,
    marginTop: -6,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    padding: 14,
    fontSize: 20,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    textAlign: 'center',
    letterSpacing: 2,
  },
  pill: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  pillSmall: {
    padding: 8,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pillTextSmall: {
    fontSize: 12,
  },
  pillDesc: {
    fontSize: 11,
    marginTop: 2,
    opacity: 0.75,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorChip: {
    width: '30%',
    minHeight: 64,
    borderRadius: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorChipSelected: {
    borderColor: COLORS.accent,
    borderWidth: 2.5,
  },
  colorChipText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  areaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  areaChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  areaChipSelected: {
    backgroundColor: COLORS.accentDim,
    borderColor: COLORS.accent,
  },
  areaChipText: {
    fontSize: 13,
    color: COLORS.subtext,
    fontWeight: '500',
  },
  areaChipTextSelected: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  calcButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  calcButtonDisabled: {
    backgroundColor: COLORS.cardBorder,
  },
  calcButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0a0e1a',
    letterSpacing: 0.5,
  },
  disclaimer: {
    fontSize: 11,
    color: COLORS.subtext,
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 8,
  },
});
