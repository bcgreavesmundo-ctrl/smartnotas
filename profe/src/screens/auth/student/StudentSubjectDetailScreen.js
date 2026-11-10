import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/theme';

export default function StudentSubjectDetailScreen({ route, navigation }) {
  const { materia } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* BOTÓN REGRESAR Y TÍTULO */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
          <Text style={styles.backText}>{materia?.asignatura || 'Detalle Materia'}</Text>
        </TouchableOpacity>

        <Text style={styles.teacherText}>Profesor: {materia?.profesor || 'Dr. Carlos Mendoza'}</Text>

        <Text style={styles.sectionTitle}>Desglose de Calificaciones</Text>

        {/* TARJETA DE CORTES */}
        <View style={styles.breakdownCard}>
          <View style={styles.gradeRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="analytics-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.gradeInfo}>
              <Text style={styles.corteTitle}>CORTE 1 (30%)</Text>
              <Text style={styles.corteValue}>{materia?.nota1 ?? 'Pendiente'}</Text>
            </View>
          </View>

          <View style={styles.gradeRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="analytics-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.gradeInfo}>
              <Text style={styles.corteTitle}>CORTE 2 (30%)</Text>
              <Text style={styles.corteValue}>{materia?.nota2 ?? 'Pendiente'}</Text>
            </View>
          </View>

          <View style={[styles.gradeRow, { borderBottomWidth: 0 }]}>
            <View style={styles.iconCircle}>
              <Ionicons name="analytics-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.gradeInfo}>
              <Text style={styles.corteTitle}>CORTE 3 (40%)</Text>
              <Text style={styles.corteValue}>{materia?.nota3 ?? 'Pendiente'}</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F3F8' },
  scrollContent: { padding: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  backText: { fontSize: 20, fontWeight: '800', color: '#333333', marginLeft: 8 },
  teacherText: { fontSize: 13, color: '#666666', marginBottom: 24, marginLeft: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#333333', marginBottom: 14 },
  breakdownCard: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  gradeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  iconCircle: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F0F3F8', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  gradeInfo: { flex: 1 },
  corteTitle: { fontSize: 11, fontWeight: '700', color: '#666666', letterSpacing: 0.5 },
  corteValue: { fontSize: 15, fontWeight: '800', color: '#333333', marginTop: 2 },
});