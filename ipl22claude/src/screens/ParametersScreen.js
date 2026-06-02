import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { calculateParameters, getEfficacyInfo } from '../utils/parametersCalculator';
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
  warningDim: '#ff6b3522',
  danger: '#F44336',
  dangerDim: '#F4433622',
  inputBg: '#1a2035',
  green: '#4CAF50',
  yellow: '#FFC107',
};

function ParamRow({ label, value, unit, highlight }) {
  return (
    <View style={[styles.paramRow, highlight && styles.paramRowHighlight]}>
      <Text style={styles.paramLabel}>{label}</Text>
      <View style={styles.paramValueBox}>
        <Text style={[styles.paramValue, highlight && { color: COLORS.accent }]}>{value}</Text>
        {unit ? <Text style={styles.paramUnit}> {unit}</Text> : null}
      </View>
    </View>
  );
}

function SummaryChip({ label, value, color }) {
  return (
    <View style={[styles.summaryChip, { borderColor: color || COLORS.cardBorder }]}>
      <Text style={styles.summaryChipLabel}>{label}</Text>
      <Text style={[styles.summaryChipValue, { color: color || COLORS.text }]}>{value}</Text>
    </View>
  );
}

export default function ParametersScreen({ diagnosis, onBack }) {
  const { fitzpatrick, hairColor, hairDensity, age, area } = diagnosis;
  const result = calculateParameters(diagnosis);
  const efficacy = getEfficacyInfo(result?.efficacy);

  const fitzInfo = FITZPATRICK[fitzpatrick];
  const hairColorInfo = HAIR_COLORS.find(h => h.id === hairColor);
  const hairDensityInfo = HAIR_DENSITY.find(h => h.id === hairDensity);
  const areaInfo = TREATMENT_AREAS.find(a => a.id === area);

  const isContraindicated = result?.efficacy === 'no_recomendado';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Nuevo diagnóstico</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parámetros IPL M22</Text>
      </View>

      {/* Resumen diagnóstico */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Diagnóstico del paciente</Text>
        <View style={styles.summaryGrid}>
          <SummaryChip label="Edad" value={`${age} años`} />
          <SummaryChip
            label="Fototipo"
            value={fitzInfo?.label}
            color={fitzInfo?.color}
          />
          <SummaryChip label="Vello" value={hairColorInfo?.label} color={hairColorInfo?.color} />
          <SummaryChip label="Densidad" value={hairDensityInfo?.label} />
          <SummaryChip label="Zona" value={areaInfo?.label} color={COLORS.accent} />
        </View>
      </View>

      {/* Eficacia esperada */}
      <View style={[styles.card, { borderColor: efficacy.color + '66' }]}>
        <Text style={styles.sectionTitle}>Eficacia esperada del tratamiento</Text>
        <View style={styles.efficacyRow}>
          <Text style={[styles.efficacyIcon]}>{efficacy.icon}</Text>
          <Text style={[styles.efficacyLabel, { color: efficacy.color }]}>{efficacy.label}</Text>
        </View>
      </View>

      {/* CONTRAINDICADO */}
      {isContraindicated ? (
        <View style={[styles.card, styles.dangerCard]}>
          <Text style={styles.dangerTitle}>⛔ TRATAMIENTO NO RECOMENDADO</Text>
          <Text style={styles.dangerText}>{result?.warning}</Text>
        </View>
      ) : (
        <>
          {/* Parámetros de máquina */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Parámetros para ingresar en la máquina</Text>

            <ParamRow
              label="Fluencia"
              value={`${result.fluence[0]} – ${result.fluence[1]}`}
              unit="J/cm²"
              highlight
            />
            <ParamRow
              label="Duración de pulso"
              value={result.pulseWidth}
              unit="ms"
            />
            <ParamRow
              label="Número de pulsos"
              value={result.pulses}
              unit={result.pulses > 1 ? 'pulsos' : 'pulso'}
            />
            <ParamRow
              label="Delay entre pulsos"
              value={result.delay ? result.delay : 'N/A'}
              unit={result.delay ? 'ms' : '(pulso único)'}
            />
            <ParamRow
              label="Filtro recomendado"
              value={result.filter}
              highlight
            />
          </View>

          {/* Instrucciones de uso */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Protocolo de aplicación</Text>
            <View style={styles.protocolList}>
              <ProtocolStep n="1" text="Limpiar y secar la zona. No aplicar sobre piel bronceada, con heridas o irritación." />
              <ProtocolStep n="2" text={`Aplicar gel de contacto frío en toda la zona de tratamiento.`} />
              <ProtocolStep n="3" text={`Ingresar los parámetros en la máquina. Comenzar siempre por el valor MÍNIMO de fluencia (${result.fluence[0]} J/cm²).`} />
              <ProtocolStep n="4" text="Realizar 1-2 disparos de prueba en zona pequeña. Esperar 5 min y evaluar respuesta de la piel." />
              <ProtocolStep n="5" text={`Si la respuesta es normal (eritema leve, sin quemadura), continuar con la fluencia elegida dentro del rango ${result.fluence[0]}–${result.fluence[1]} J/cm².`} />
              <ProtocolStep n="6" text="Aplicar crema calmante post-tratamiento. Protector solar mínimo SPF 50 obligatorio." />
            </View>
          </View>

          {/* Nota por zona */}
          {result.areaNotes && (
            <View style={[styles.card, styles.noteCard]}>
              <Text style={styles.noteTitle}>📍 Nota para esta zona</Text>
              <Text style={styles.noteText}>{result.areaNotes}</Text>
            </View>
          )}

          {/* Advertencias */}
          {result.warning && (
            <View style={[styles.card, styles.warningCard]}>
              <Text style={styles.warningTitle}>⚠️ Advertencia</Text>
              <Text style={styles.warningText}>{result.warning}</Text>
            </View>
          )}
        </>
      )}

      {/* Intervalo entre sesiones */}
      {!isContraindicated && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Intervalos recomendados</Text>
          <View style={styles.intervalGrid}>
            <IntervalChip zone="Cara" weeks="4–5 sem." />
            <IntervalChip zone="Axila / Bikini" weeks="4–6 sem." />
            <IntervalChip zone="Piernas / Brazos" weeks="6–8 sem." />
            <IntervalChip zone="Espalda / Pecho" weeks="6–8 sem." />
          </View>
          <Text style={styles.intervalNote}>
            Sesiones totales estimadas: 6–10 sesiones (varía según respuesta individual y fototipo).
          </Text>
        </View>
      )}

      {/* Botón volver */}
      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
        <Text style={styles.backButtonText}>← Nuevo diagnóstico</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Esta calculadora es una guía de referencia clínica. Los parámetros deben ajustarse según la experiencia del profesional y la respuesta individual del paciente.
      </Text>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function ProtocolStep({ n, text }) {
  return (
    <View style={styles.protocolStep}>
      <View style={styles.protocolBadge}>
        <Text style={styles.protocolBadgeText}>{n}</Text>
      </View>
      <Text style={styles.protocolText}>{text}</Text>
    </View>
  );
}

function IntervalChip({ zone, weeks }) {
  return (
    <View style={styles.intervalChip}>
      <Text style={styles.intervalZone}>{zone}</Text>
      <Text style={styles.intervalWeeks}>{weeks}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingTop: 52,
    paddingBottom: 16,
  },
  backBtn: {
    marginBottom: 8,
  },
  backBtnText: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
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
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  summaryChip: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    minWidth: 80,
  },
  summaryChipLabel: {
    fontSize: 10,
    color: COLORS.subtext,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryChipValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '700',
    marginTop: 2,
  },
  efficacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  efficacyIcon: {
    fontSize: 20,
    letterSpacing: -2,
  },
  efficacyLabel: {
    fontSize: 22,
    fontWeight: '800',
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  paramRowHighlight: {
    backgroundColor: COLORS.accentDim,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: -8,
    borderBottomWidth: 0,
    marginBottom: 2,
  },
  paramLabel: {
    fontSize: 14,
    color: COLORS.subtext,
    fontWeight: '500',
    flex: 1,
  },
  paramValueBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  paramValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  paramUnit: {
    fontSize: 12,
    color: COLORS.subtext,
    fontWeight: '500',
  },
  protocolList: {
    gap: 10,
  },
  protocolStep: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  protocolBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.accentDim,
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  protocolBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accent,
  },
  protocolText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
    flex: 1,
  },
  noteCard: {
    borderColor: '#4a90d966',
    backgroundColor: '#0d1e35',
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4a90d9',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
  warningCard: {
    borderColor: COLORS.warning + '66',
    backgroundColor: COLORS.warningDim,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.warning,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
  dangerCard: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerDim,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.danger,
    marginBottom: 12,
    textAlign: 'center',
  },
  dangerText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    textAlign: 'center',
  },
  intervalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  intervalChip: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    padding: 10,
    minWidth: '44%',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  intervalZone: {
    fontSize: 11,
    color: COLORS.subtext,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  intervalWeeks: {
    fontSize: 15,
    color: COLORS.accent,
    fontWeight: '700',
    marginTop: 2,
  },
  intervalNote: {
    fontSize: 12,
    color: COLORS.subtext,
    lineHeight: 18,
  },
  backButton: {
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accent,
  },
  disclaimer: {
    fontSize: 10,
    color: COLORS.subtext,
    textAlign: 'center',
    lineHeight: 15,
    paddingHorizontal: 8,
  },
});
