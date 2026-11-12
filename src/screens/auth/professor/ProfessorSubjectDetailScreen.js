import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  obtenerEstudiantesPorAsignaturaBD,
  guardarOActualizarNotaBD,
} from '../../../database/database';

export default function ProfessorSubjectDetailScreen({ route, navigation }) {
  const { asignatura } = route.params || {};
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    if (asignatura?.id) cargarEstudiantes();
  }, [asignatura]);

  const cargarEstudiantes = async () => {
    setCargando(true);
    try {
      const data = await obtenerEstudiantesPorAsignaturaBD(asignatura.id);
      setEstudiantes(data || []);

      let initialGrades = {};
      if (Array.isArray(data)) {
        data.forEach((est) => {
          initialGrades[est.estudiante_id] = est.nota2 ? est.nota2.toString() : '0';
        });
      }
      setGrades(initialGrades);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudieron cargar los estudiantes.');
    } finally {
      setCargando(false);
    }
  };

  const handleGuardarCalificaciones = async () => {
    try {
      for (const est of estudiantes) {
        const nota2Ingresada = grades[est.estudiante_id] || '0';
        
        // Llamada compatible con Supabase
        await guardarOActualizarNotaBD({
          estudiante_id: est.estudiante_id,
          asignatura_id: asignatura.id,
          nota1: est.nota1 || 0,
          nota2: parseFloat(nota2Ingresada) || 0,
          nota3: est.nota3 || 0
        });
      }
      Alert.alert('Éxito', 'Calificaciones guardadas en Supabase');
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudieron guardar las notas.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* BOTÓN REGRESAR */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
          <Text style={styles.backText}>{asignatura?.nombre || 'Detalles'}</Text>
        </TouchableOpacity>

        {/* BADGE DE EVALUACIÓN */}
        <View style={styles.evaluationHeaderBadge}>
          <Ionicons name="document-text-outline" size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
          <Text style={styles.evaluationTitle}>Parcial 2 • Ponderación: 30%</Text>
        </View>

        {cargando ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : estudiantes.length === 0 ? (
          <Text style={styles.emptyText}>No hay estudiantes registrados en esta asignatura.</Text>
        ) : (
          estudiantes.map((student) => (
            <View key={student.estudiante_id} style={styles.studentGradeRow}>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.nombre || 'Estudiante'}</Text>
                <Text style={styles.mutedText}>{student.documento || student.email || ''}</Text>
              </View>
              <TextInput
                style={styles.gradeInput}
                value={grades[student.estudiante_id]}
                onChangeText={(val) =>
                  setGrades({ ...grades, [student.estudiante_id]: val.replace(/[^0-9.]/g, '') })
                }
                keyboardType="decimal-pad"
                placeholder="0-5"
                placeholderTextColor="#666666"
                maxLength={5}
              />
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleGuardarCalificaciones}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Guardar Calificaciones</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F3F8' },
  content: { padding: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { fontSize: 18, fontWeight: '800', color: '#333333', marginLeft: 8 },
  evaluationHeaderBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  evaluationTitle: { fontSize: 14, fontWeight: '700', color: '#333333' },
  studentGradeRow: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E2E8F0' },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 14, fontWeight: '700', color: '#333333', marginBottom: 3 },
  mutedText: { fontSize: 12, color: '#666666' },
  gradeInput: { width: 68, height: 44, borderRadius: 10, backgroundColor: '#F0F3F8', borderWidth: 1.5, borderColor: '#E2E8F0', textAlign: 'center', fontSize: 16, fontWeight: '800', color: '#333333', marginLeft: 12 },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  emptyText: { textAlign: 'center', color: '#666666', marginTop: 20 },
});