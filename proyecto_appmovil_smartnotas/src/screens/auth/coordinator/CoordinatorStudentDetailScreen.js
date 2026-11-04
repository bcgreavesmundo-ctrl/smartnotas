import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ Importaciones subiendo 3 niveles desde src/screens/auth/coordinator/
import { COLORS } from '../../../constants/theme';
import { obtenerMateriasEstudianteBD } from '../../../database/database';

export default function CoordinatorStudentDetailScreen({ route, navigation }) {
  // Recibir los datos del estudiante pasados por parámetros de navegación
  const { estudiante } = route.params || {};

  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (estudiante?.id) {
      cargarDetalleEstudiante();
    } else {
      setLoading(false);
    }
  }, [estudiante]);

  const cargarDetalleEstudiante = async () => {
    try {
      setLoading(true);
      // Cargar materias e historial académico del estudiante desde SQLite
      const data = await obtenerMateriasEstudianteBD(estudiante.id);
      setMaterias(data || []);
    } catch (error) {
      console.error('Error al cargar detalle del estudiante:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cálculo de promedio general del estudiante
  const calcularPromedio = () => {
    if (!materias || materias.length === 0) return '0.0';
    const suma = materias.reduce((acc, item) => acc + (parseFloat(item.nota) || 0), 0);
    return (suma / materias.length).toFixed(1);
  };

  const promedio = calcularPromedio();

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Estudiante</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tarjeta de Información Personal */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.studentName}>
            {estudiante?.nombre || 'Estudiante Sin Nombre'}
          </Text>
          <Text style={styles.studentEmail}>
            {estudiante?.correo || 'correo@univ.edu'}
          </Text>

          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Rol: Estudiante</Text>
            </View>
          </View>
        </View>

        {/* Métrica de Promedio General */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>PROMEDIO GENERAL</Text>
            <Text style={[
              styles.statValue, 
              { color: parseFloat(promedio) >= 3.0 ? '#10B981' : '#EF4444' }
            ]}>
              {promedio}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>MATERIAS INSCRITAS</Text>
            <Text style={styles.statValue}>{materias.length}</Text>
          </View>
        </View>

        {/* Sección de Materias y Calificaciones */}
        <Text style={styles.sectionTitle}>Historial de Materias</Text>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : materias.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={48} color={COLORS.textGray} />
            <Text style={styles.emptyText}>No hay materias registradas para este estudiante.</Text>
          </View>
        ) : (
          materias.map((item, index) => (
            <View key={item.id || index.toString()} style={styles.materiaCard}>
              <View style={styles.materiaInfo}>
                <Text style={styles.materiaNombre}>{item.nombre || item.materia}</Text>
                <Text style={styles.materiaProfesor}>
                  Profesor: {item.profesor || 'No asignado'}
                </Text>
              </View>
              <View style={[
                styles.notaBadge, 
                { backgroundColor: (item.nota || 0) >= 3.0 ? '#D1FAE5' : '#FEE2E2' }
              ]}>
                <Text style={[
                  styles.notaText, 
                  { color: (item.nota || 0) >= 3.0 ? '#065F46' : '#991B1B' }
                ]}>
                  {item.nota ? parseFloat(item.nota).toFixed(1) : 'S/N'}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: COLORS.primary, 
    paddingHorizontal: 16, 
    paddingVertical: 14 
  },
  backButton: { 
    padding: 4 
  },
  headerTitle: { 
    color: COLORS.white, 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  scrollContent: { 
    padding: 20 
  },
  profileCard: { 
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    padding: 20, 
    alignItems: 'center', 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  avatarCircle: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: '#EEF2FF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  studentName: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: COLORS.textDark 
  },
  studentEmail: { 
    fontSize: 14, 
    color: COLORS.textGray, 
    marginTop: 2 
  },
  badgeContainer: { 
    marginTop: 10 
  },
  badge: { 
    backgroundColor: '#E0E7FF', 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  badgeText: { 
    color: COLORS.primary, 
    fontSize: 12, 
    fontWeight: '600' 
  },
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  statCard: { 
    flex: 0.48, 
    backgroundColor: COLORS.white, 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  statLabel: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: COLORS.textGray, 
    marginBottom: 6 
  },
  statValue: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: COLORS.textDark 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.textDark, 
    marginBottom: 12 
  },
  materiaCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: COLORS.white, 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  materiaInfo: { 
    flex: 1 
  },
  materiaNombre: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: COLORS.textDark 
  },
  materiaProfesor: { 
    fontSize: 13, 
    color: COLORS.textGray, 
    marginTop: 2 
  },
  notaBadge: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 8 
  },
  notaText: { 
    fontSize: 15, 
    fontWeight: 'bold' 
  },
  emptyContainer: { 
    alignItems: 'center', 
    paddingVertical: 30 
  },
  emptyText: { 
    color: COLORS.textGray, 
    marginTop: 8, 
    fontSize: 14 
  },
});