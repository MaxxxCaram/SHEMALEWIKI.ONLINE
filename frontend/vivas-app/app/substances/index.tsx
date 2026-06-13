import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StyleSheet as RN,
} from 'react-native';
import { SUBSTANCES, type Substance } from '../../src/data/substances';

// Colores por categoría
const CAT_COLORS: Record<string, string> = {
  'Estimulante': '#F59E0B',
  'Depresor': '#8B5CF6',
  'Depresor / Ansiolítico': '#8B5CF6',
  'Psicodélico / Entactógeno': '#EC4899',
  'Disociativo': '#06B6D4',
  'Entactógeno / Estimulante': '#EC4899',
  'Cannabinoide': '#10B981',
  'Vasodilatador': '#F97316',
  'Vasodilatador (Inhibidor PDE5)': '#3B82F6',
  'Opioide sintético': '#EF4444',
};

export default function SubstancesScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const renderDetail = (sub: Substance) => {
    const section = (label: string, content: string, warning = false) => (
      <View style={styles.detailSection} key={label}>
        <Text style={RN.flatten([styles.sectionLabel, warning && styles.warningLabel])}>
          {label}
        </Text>
        <Text style={RN.flatten([styles.sectionContent, warning && styles.warningContent])}>
          {content}
        </Text>
      </View>
    );

    return (
      <View style={styles.expandedContent}>
        {section('🔍 APARIENCIA', sub.appearance)}
        {section('💊 CÓMO SE USA', sub.administration)}
        {section('⏱️ INICIO DEL EFECTO', sub.onset)}
        {section('⏳ DURACIÓN', sub.duration)}
        {section('🧠 QUÉ SE SIENTE', sub.effects)}
        {section('⚠️ RIESGOS', sub.risks, true)}
        {section('☠️ INTERACCIONES PELIGROSAS', sub.interactions, true)}
        {section('🛡️ REDUCCIÓN DE DAÑOS', sub.harmReduction)}
      </View>
    );
  };

  // Agrupar por categoría
  const categories = SUBSTANCES.reduce((acc, sub) => {
    if (!acc[sub.category]) acc[sub.category] = [];
    acc[sub.category].push(sub);
    return acc;
  }, {} as Record<string, Substance[]>);

  return (
    <View style={styles.container}>
      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerIcon}>📋</Text>
        <View style={styles.disclaimerText}>
          <Text style={styles.disclaimerTitle}>Información de Reducción de Daños</Text>
          <Text style={styles.disclaimerBody}>
            Esta guía no promueve el consumo. Informa para cuidarte.{'\n'}
            Datos basados en evidencia científica y organizaciones de reducción de daños.
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(categories).map(([category, substances]) => (
          <View key={category} style={styles.categoryBlock}>
            <Text style={RN.flatten([styles.categoryTitle, { color: CAT_COLORS[category] || '#7C3AED' }])}>
              {category}
            </Text>
            {substances.map((sub) => {
              const isOpen = expanded === sub.id;
              return (
                <View key={sub.id} style={styles.card}>
                  <TouchableOpacity
                    style={styles.cardHeader}
                    onPress={() => toggle(sub.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cardEmoji}>{sub.emoji}</Text>
                    <View style={styles.cardTitleArea}>
                      <Text style={styles.cardTitle}>{sub.name}</Text>
                      <Text style={styles.cardAliases}>
                        {sub.aliases.slice(0, 4).join(', ')}
                        {sub.aliases.length > 4 ? '...' : ''}
                      </Text>
                    </View>
                    <Text style={RN.flatten([styles.expandIcon, isOpen && styles.expandOpen])}>
                      {isOpen ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>
                  {isOpen && renderDetail(sub)}
                </View>
              );
            })}
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  disclaimer: {
    flexDirection: 'row',
    backgroundColor: '#7C3AED15',
    borderWidth: 1,
    borderColor: '#7C3AED33',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  disclaimerIcon: {
    fontSize: 24,
  },
  disclaimerText: {
    flex: 1,
  },
  disclaimerTitle: {
    color: '#C4B5FD',
    fontWeight: '700',
    fontSize: 14,
  },
  disclaimerBody: {
    color: '#A1A1AA',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  categoryBlock: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 10,
    marginLeft: 2,
  },
  card: {
    backgroundColor: '#18181B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#27272A',
    marginBottom: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  cardEmoji: {
    fontSize: 28,
    width: 40,
    textAlign: 'center',
  },
  cardTitleArea: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cardAliases: {
    color: '#71717A',
    fontSize: 11,
    marginTop: 2,
  },
  expandIcon: {
    color: '#52525B',
    fontSize: 12,
    fontWeight: '900',
  },
  expandOpen: {
    color: '#A78BFA',
  },
  expandedContent: {
    paddingHorizontal: 14,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#27272A',
  },
  detailSection: {
    marginTop: 14,
  },
  sectionLabel: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  sectionContent: {
    color: '#D4D4D8',
    fontSize: 13,
    lineHeight: 19,
  },
  warningLabel: {
    color: '#FCA5A5',
  },
  warningContent: {
    color: '#FECACA',
  },
});
