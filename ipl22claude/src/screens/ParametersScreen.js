import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { calculateParameters, getEfficacyInfo } from '../utils/parametersCalculator';
import { FITZPATRICK, HAIR_COLORS, HAIR_DENSITY, LESION_COLORS, VESSEL_SIZES, MELASMA_TYPES, ACNE_GRADES, TREATMENT_AREAS } from '../data/treatments';
import { TREATMENTS } from '../data/treatments';

const C = {
  bg: '#0a0e1a', card: '#141929', cardBorder: '#1e2840',
  accent: '#00d4aa', accentDim: '#00d4aa22',
  text: '#f0f4ff', subtext: '#8892a4', inputBg: '#1a2035',
  warning: '#ff6b35', warningDim: '#ff6b3522',
  danger: '#F44336', dangerDim: '#F4433618',
};

function ParamRow({ label, value, unit, highlight, color }) {
  const ac = color || C.accent;
  return (
    <View style={[styles.paramRow, highlight && { ...styles.paramRowHL, backgroundColor: ac + '18' }]}>
      <Text style={styles.paramLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={[styles.paramValue, highlight && { color: ac }]}>{value}</Text>
        {unit ? <Text style={styles.paramUnit}> {unit}</Text> : null}
      </View>
    </View>
  );
}

function Chip({ label, value, color }) {
  return (
    <View style={[styles.chip, { borderColor: color || C.cardBorder }]}>
      <Text style={styles.chipLabel}>{label}</Text>
      <Text style={[styles.chipValue, { color: color || C.text }]}>{value}</Text>
    </View>
  );
}

function Step({ n, text, color }) {
  return (
    <View style={styles.step}>
      <View style={[styles.stepBadge, { backgroundColor: (color || C.accent) + '22', borderColor: color || C.accent }]}>
        <Text style={[styles.stepN, { color: color || C.accent }]}>{n}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

export default function ParametersScreen({ diagnosis, onBack }) {
  const result = calculateParameters(diagnosis);
  const { treatment, fitzpatrick, age, area,
          hairColor, hairDensity, lesionColor, vesselSize, melasmaType, acneGrade } = diagnosis;

  const treatmentInfo = TREATMENTS.find(t => t.id === treatment);
  const accentColor   = treatmentInfo?.color || C.accent;
  const efficacy      = getEfficacyInfo(result?.efficacy);
  const fitzInfo      = FITZPATRICK[fitzpatrick];
  const areas         = TREATMENT_AREAS[treatment] || [];
  const areaLabel     = areas.find(a => a.id === area)?.label || area;

  const isContra = result?.efficacy === 'no_recomendado';

  // Secondary label for treatment-specific input
  const extraLabel = (() => {
    if (treatment === 'depilacion') {
      const hc = HAIR_COLORS.find(h => h.id === hairColor)?.label;
      const hd = HAIR_DENSITY.find(h => h.id === hairDensity)?.label;
      return [hc, hd].filter(Boolean).join(' · ');
    }
    if (treatment === 'manchas') return LESION_COLORS.find(l => l.id === lesionColor)?.label;
    if (treatment === 'vascular') return VESSEL_SIZES.find(v => v.id === vesselSize)?.label;
    if (treatment === 'melasma') return MELASMA_TYPES.find(m => m.id === melasmaType)?.label;
    if (treatment === 'acne') return ACNE_GRADES.find(a => a.id === acneGrade)?.label;
    return null;
  })();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={[styles.backBtnText, { color: accentColor }]}>← Nuevo diagnóstico</Text>
        </TouchableOpacity>
        <View style={[styles.treatBadge, { backgroundColor: accentColor + '22', borderColor: accentColor + '55' }]}>
          <Text style={[styles.treatIcon, { color: accentColor }]}>{treatmentInfo?.icon}</Text>
          <Text style={[styles.treatLabel, { color: accentColor }]}>{treatmentInfo?.label}</Text>
        </View>
        <Text style={styles.headerTitle}>Parámetros IPL M22</Text>
      </View>

      {/* Resumen */}
      <View style={styles.card}>
        <Text style={[styles.sectionTitle, { color: accentColor }]}>Diagnóstico</Text>
        <View style={styles.chipGrid}>
          <Chip label="EDAD"     value={`${age} años`} />
          <Chip label="FOTOTIPO" value={fitzInfo?.label} color={fitzInfo?.color} />
          {extraLabel && <Chip label="DETALLE"  value={extraLabel} color={accentColor} />}
          <Chip label="ZONA"     value={areaLabel} color={accentColor} />
        </View>
      </View>

      {/* Eficacia */}
      <View style={[styles.card, { borderColor: efficacy.color + '55' }]}>
        <Text style={[styles.sectionTitle, { color: accentColor }]}>Eficacia esperada</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={styles.efficacyIcon}>{efficacy.icon}</Text>
          <Text style={[styles.efficacyLabel, { color: efficacy.color }]}>{efficacy.label}</Text>
        </View>
      </View>

      {isContra ? (
        <View style={[styles.card, styles.dangerCard]}>
          <Text style={styles.dangerTitle}>⛔ TRATAMIENTO NO RECOMENDADO</Text>
          <Text style={styles.dangerText}>{result?.warning}</Text>
        </View>
      ) : (<>

        {/* Parámetros */}
        <View style={styles.card}>
          <Text style={[styles.sectionTitle, { color: accentColor }]}>Parámetros para ingresar en la máquina</Text>
          <ParamRow label="Fluencia"          value={`${result.fluence[0]} – ${result.fluence[1]}`} unit="J/cm²"          highlight color={accentColor} />
          <ParamRow label="Duración de pulso" value={result.pulseWidth}                              unit="ms" />
          <ParamRow label="Número de pulsos"  value={result.pulses}                                  unit={result.pulses > 1 ? 'pulsos' : 'pulso'} />
          <ParamRow label="Delay entre pulsos" value={result.delay || 'N/A'}                         unit={result.delay ? 'ms' : '(pulso único)'} />
          <ParamRow label="Filtro recomendado" value={result.filter}                                  highlight color={accentColor} />
        </View>

        {/* Protocolo */}
        <View style={styles.card}>
          <Text style={[styles.sectionTitle, { color: accentColor }]}>Protocolo de aplicación</Text>
          <View style={{ gap: 10 }}>
            {result.protocol.map((step, i) => (
              <Step key={i} n={i + 1} text={step} color={accentColor} />
            ))}
          </View>
        </View>

        {/* Nota de zona */}
        {result.areaNotes && (
          <View style={[styles.card, { borderColor: '#4a90d966', backgroundColor: '#0d1e35' }]}>
            <Text style={[styles.noteTitle, { color: '#4a90d9' }]}>📍 Nota para esta zona</Text>
            <Text style={styles.noteText}>{result.areaNotes}</Text>
          </View>
        )}

        {/* Warning */}
        {result.warning && (
          <View style={[styles.card, { borderColor: C.warning + '66', backgroundColor: C.warningDim }]}>
            <Text style={[styles.noteTitle, { color: C.warning }]}>⚠️ Advertencia</Text>
            <Text style={styles.noteText}>{result.warning}</Text>
          </View>
        )}

        {/* Intervalos */}
        {result.intervals && (
          <View style={styles.card}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Intervalos recomendados</Text>
            <View style={styles.intervalGrid}>
              {result.intervals.face !== '—' && (
                <View style={styles.intervalChip}>
                  <Text style={styles.intervalZone}>Cara / Facial</Text>
                  <Text style={[styles.intervalVal, { color: accentColor }]}>{result.intervals.face}</Text>
                </View>
              )}
              {result.intervals.body !== '—' && (
                <View style={styles.intervalChip}>
                  <Text style={styles.intervalZone}>Cuerpo</Text>
                  <Text style={[styles.intervalVal, { color: accentColor }]}>{result.intervals.body}</Text>
                </View>
              )}
            </View>
            <Text style={styles.intervalNote}>{result.intervals.sessions}</Text>
          </View>
        )}
      </>)}

      <TouchableOpacity style={[styles.backButton, { borderColor: accentColor }]} onPress={onBack} activeOpacity={0.8}>
        <Text style={[styles.backButtonText, { color: accentColor }]}>← Nuevo diagnóstico</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Guía de referencia clínica. Ajustar parámetros según experiencia del profesional y respuesta del paciente.
      </Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: C.bg },
  header: { paddingTop: 52, paddingBottom: 16 },
  backBtn: { marginBottom: 10 },
  backBtnText: { fontSize: 13, fontWeight: '600' },
  treatBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    alignSelf: 'flex-start', marginBottom: 12,
  },
  treatIcon: { fontSize: 16 },
  treatLabel: { fontSize: 14, fontWeight: '700' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: C.text },
  card: {
    backgroundColor: C.card, borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: C.cardBorder,
  },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: 1.2, marginBottom: 14,
  },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: C.inputBg, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, minWidth: 80,
  },
  chipLabel: { fontSize: 10, color: C.subtext, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  chipValue: { fontSize: 13, color: C.text, fontWeight: '700', marginTop: 2 },
  efficacyIcon: { fontSize: 20, letterSpacing: -2 },
  efficacyLabel: { fontSize: 22, fontWeight: '800' },
  paramRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.cardBorder,
  },
  paramRowHL: { borderRadius: 8, paddingHorizontal: 8, marginHorizontal: -8, borderBottomWidth: 0, marginBottom: 2 },
  paramLabel: { fontSize: 14, color: C.subtext, fontWeight: '500', flex: 1 },
  paramValue: { fontSize: 22, fontWeight: '800', color: C.text },
  paramUnit: { fontSize: 12, color: C.subtext },
  step: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  stepBadge: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  stepN: { fontSize: 11, fontWeight: '800' },
  stepText: { fontSize: 13, color: C.text, lineHeight: 20, flex: 1 },
  noteTitle: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  noteText: { fontSize: 13, color: C.text, lineHeight: 20 },
  dangerCard: { borderColor: C.danger, backgroundColor: C.dangerDim },
  dangerTitle: { fontSize: 16, fontWeight: '800', color: C.danger, marginBottom: 12, textAlign: 'center' },
  dangerText: { fontSize: 14, color: C.text, lineHeight: 22, textAlign: 'center' },
  intervalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  intervalChip: {
    backgroundColor: C.inputBg, borderRadius: 10, padding: 10,
    minWidth: '44%', borderWidth: 1, borderColor: C.cardBorder,
  },
  intervalZone: { fontSize: 11, color: C.subtext, fontWeight: '600', textTransform: 'uppercase' },
  intervalVal: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  intervalNote: { fontSize: 12, color: C.subtext, lineHeight: 18 },
  backButton: { borderWidth: 1, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 16 },
  backButtonText: { fontSize: 14, fontWeight: '700' },
  disclaimer: { fontSize: 10, color: C.subtext, textAlign: 'center', lineHeight: 15, paddingHorizontal: 8 },
});
