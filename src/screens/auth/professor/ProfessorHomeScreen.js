import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/theme';
import { obtenerAsignaturasBD } from '../../../database/database';
// Cambiar la importación actual por:
import { obtenerAsignaturasProfesorBD } from '../../../database/database';
import { guardarOActualizarNotaBD } from '../../../database/database';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function ProfessorHomeScreen({ route, navigation }) {
  const user = route.params?.user || { id: 'u2', nombre: 'Dr. Carlos Mendoza' };
  const [asignaturas, setAsignaturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todas');

  const filters = ['Todas', 'Pendientes', 'Historial'];

  useEffect(() => {
    cargarAsignaturas();
  }, []);

  const cargarAsignaturas = async () => {
  setCargando(true);
  try {
    // Se envía el ID del usuario autenticado (user.id)
    const data = await obtenerAsignaturasProfesorBD(user.id);
    setAsignaturas(data);
  } catch (e) {
    console.error(e);
  } finally {
    setCargando(false);
  }
};

  // Solicita confirmación antes de cerrar la sesión del profesor.
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Deseas salir de la aplicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => navigation.replace('Login'),
        },
      ]
    );
  };

  // Dentro de tu componente, agrega una función para solicitar notas al hacer clic en el botón:
const handleRegistrarNota = (materia) => {
  Alert.prompt(
    `Calificar: ${materia.nombre}`,
    'Ingresa las 3 notas separadas por comas (ejemplo: 4.5, 3.8, 5.0):',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Guardar',
        onPress: async (texto) => {
          if (!texto) return;
          const notas = texto.split(',').map(n => parseFloat(n.trim()));
          try {
            await guardarOActualizarNotaBD({
              estudiante_id: 'COLOCA_EL_UUID_DEL_ESTUDIANTE', // o la selección de estudiante
              asignatura_id: materia.id,
              nota1: notas[0] || 0,
              nota2: notas[1] || 0,
              nota3: notas[2] || 0
            });
            Alert.alert('Éxito', 'Notas registradas en Supabase');
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        }
      }
    ]
  );
};

  const filteredSubjects = asignaturas.filter(sub => {
    const matchesSearch = (sub.nombre || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (sub.codigo || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F3F8" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ENCABEZADO */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Mis Asignaturas</Text>
            <Text style={styles.headerSubtitle}>{user.nombre || 'Profesor Titular'} 👋</Text>
          </View>

          {/* Botón de salida alineado con el encabezado */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
          >
            <Ionicons name="log-out-outline" size={18} color={COLORS.white} style={styles.logoutIcon} />
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        {/* BUSCADOR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar materia o sección..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* FILTROS PÍLDORAS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersWrapper}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterPillText, activeFilter === filter && styles.filterPillTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* TARJETAS DE MATERIAS */}
        {cargando ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : filteredSubjects.length === 0 ? (
          <Text style={styles.emptyStateText}>No se encontraron asignaturas asignadas.</Text>
        ) : (
          filteredSubjects.map(sub => (
            <View key={sub.id} style={styles.teacherCard}>
              <View style={styles.teacherIcon}>
                <Ionicons name="calculator-outline" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.teacherSubject}>{sub.nombre}</Text>
              <Text style={styles.mutedText}>Código: {sub.codigo} • {sub.creditos} Créditos</Text>
              <Text style={styles.mutedText}>Lunes y Miércoles • 08:00 - 10:00</Text>
              <Text style={styles.mutedText}>Estudiantes inscritos</Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('ProfessorSubjectDetail', { asignatura: sub })}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>Registrar Notas</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F3F8' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTextContainer: { flex: 1, paddingRight: 10 },
  headerTitle: { fontSize: 19, fontWeight: '800', color: '#333333', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13, color: '#666666', marginTop: 3, fontWeight: '500' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  logoutIcon: { marginRight: 5 },
  logoutButtonText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  headerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 46, fontSize: 15, color: '#333333' },
  filtersWrapper: { marginBottom: 20, flexDirection: 'row' },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
  filterPillActive: { backgroundColor: '#00BCD4', borderColor: '#00BCD4' },
  filterPillText: { fontSize: 13, color: '#666666', fontWeight: '700' },
  filterPillTextActive: { color: '#FFFFFF' },
  emptyStateText: { textAlign: 'center', color: '#666666', marginTop: 20, fontSize: 14, fontStyle: 'italic' },
  teacherCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  teacherIcon: { width: 52, height: 52, borderRadius: 15, backgroundColor: '#F0F3F8', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  teacherSubject: { fontSize: 18, fontWeight: '800', color: '#333333', marginBottom: 6 },
  mutedText: { fontSize: 12, color: '#666666', marginBottom: 3 },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 13, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
});
