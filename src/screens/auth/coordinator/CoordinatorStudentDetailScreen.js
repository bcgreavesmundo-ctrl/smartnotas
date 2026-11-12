import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/theme';
import { obtenerNotasEstudianteBD } from '../../../database/database';

export default function CoordinatorStudentDetailScreen({ route, navigation }) {
  // Recibe el objeto sin importar si viene como 'student' o 'estudiante'
  const student = route.params?.student || route.params?.estudiante || {};

  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (student?.id) {
      cargarHistorialAcademico();
    } else {
      setCargando(false);
    }
  }, [student]);

  const cargarHistorialAcademico = async () => {
    setCargando(true);
    try {
      const data = await obtenerNotasEstudianteBD(student.id);
      setMaterias(data || []);
    } catch (e) {
      console.error('Error al cargar historial del estudiante:', e);
    } finally {
      setCargando(false);
    }
  };

  // Cálculo del promedio general en escala 0.0 - 5.0
  const notasValidas = materias
    .map((m) => {
      if (m.definitiva !== null && m.definitiva !== undefined) return Number(m.definitiva);
      const n1 = Number(m.nota1 || 0);
      const n2 = Number(m.nota2 || 0);
      const n3 = Number(m.nota3 || 0);
      return n1 * 0.3 + n2 * 0.3 + n3 * 0.4;
    })
    .filter((n) => !isNaN(n));

  const promedioGeneral =
    notasValidas.length > 0
      ? (notasValidas.reduce((acc, val) => acc + val, 0) / notasValidas.length).toFixed(1)
      : '0.0';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ENCABEZADO AZUL SUPERIOR */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Detalle del Estudiante</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* TARJETA PERFIL DEL ESTUDIANTE */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.studentName}>
            {student?.nombre || 'Estudiante Sin Nombre'}
          </Text>
          <Text style={styles.studentEmail}>
            {student?.email || 'correo@univ.edu'}
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              Rol: {student?.rol || 'Estudiante'}
            </Text>
          </View>
        </View>

        {/* TARJETAS DE MÉTRICAS */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>PROMEDIO GENERAL</Text>
            <Text
              style={[
                styles.metricValue,
                { color: parseFloat(promedioGeneral) >= 3.0 ? '#2E7D32' : '#D32F2F' },
              ]}
            >
              {promedioGeneral}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>MATERIAS INSCRITAS</Text>
            <Text style={[styles.metricValue, { color: '#333333' }]}>
              {materias.length}
            </Text>
          </View>
        </View>

        {/* HISTORIAL DE MATERIAS */}
        <Text style={styles.sectionTitle}>Historial de Materias</Text>

        {cargando ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
        ) : materias.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={48} color="#7A869A" />
            <Text style={styles.emptyText}>
              No hay materias registradas para este estudiante.
            </Text>
          </View>
        ) : (
          materias.map((item, index) => {
            const nombreMateria =
              item.asignaturas?.nombre || item.asignatura || 'Asignatura sin nombre';
            const notaFinal =
              item.definitiva !== null && item.definitiva !== undefined
                ? Number(item.definitiva).toFixed(1)
                : (
                    Number(item.nota1 || 0) * 0.3 +
                    Number(item.nota2 || 0) * 0.3 +
                    Number(item.nota3 || 0) * 0.4
                  ).toFixed(1);

            return (
              <View key={item.id || index.toString()} style={styles.subjectCard}>
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectName}>{nombreMateria}</Text>
                  <Text style={styles.subjectGrades}>
                    C1: {item.nota1 ?? 0}  •  C2: {item.nota2 ?? 0}  •  C3: {item.nota3 ?? 0}
                  </Text>
                </View>
                <View style={styles.gradeBox}>
                  <Text style={styles.gradeValue}>{notaFinal}</Text>
                  <Text style={styles.gradeLabel}>FINAL</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F3F8' },
  topBar: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  backButton: { padding: 4 },
  topBarTitle: { fontSize: 18, fontWeight: '800', color: COLORS.white },
  scrollContent: { padding: 20, paddingBottom: 40 },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E8EEF9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  studentName: { fontSize: 20, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  studentEmail: { fontSize: 14, color: '#64748B', marginTop: 4, marginBottom: 12 },
  roleBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
  },
  roleBadgeText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  metricsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 8 },
  metricValue: { fontSize: 26, fontWeight: '800' },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B', marginBottom: 14 },
  emptyContainer: { alignItems: 'center', marginTop: 28, paddingHorizontal: 20 },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subjectInfo: { flex: 1, paddingRight: 10 },
  subjectName: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  subjectGrades: { fontSize: 12, color: '#64748B', marginTop: 4 },
  gradeBox: {
    backgroundColor: '#F0F3F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gradeValue: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  gradeLabel: { fontSize: 9, fontWeight: '700', color: '#64748B' },
});