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
import { obtenerTodosUsuariosBD } from '../../../database/database';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CoordinatorHomeScreen({ route, navigation }) {
  const user = route.params?.user || { nombre: 'Claudia Gómez' };
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filters = ['Todos', 'Activos', 'Retirados', 'Sancionados'];

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const data = await obtenerTodosUsuariosBD();
      setUsuarios(data);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Deseas salir de la aplicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: () => navigation.replace('Login') },
      ]
    );
  };

  const estudiantes = usuarios.filter((u) => u.rol === 'Estudiante');
  const profesoresCount = usuarios.filter((u) => u.rol === 'Profesor').length;

  const filteredStudents = estudiantes.filter((student) => {
    const matchesSearch =
      (student.nombre || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.documento || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.carrera || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'Todos' ||
      (activeFilter === 'Activos' && (student.estado === 'Activo' || student.estado === 'Activos')) ||
      (activeFilter === 'Retirados' && student.estado === 'Retirados') ||
      (activeFilter === 'Sancionados' && student.estado === 'Sancionados');

    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F3F8" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* ENCABEZADO: saludo e inicio de sesión en la misma fila */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Gestión Estudiantes</Text>
            <Text style={styles.headerSubtitle}>{user.nombre} 👋 • Coordinador</Text>
          </View>

          {/* Botón de salida: conserva la ruta Login existente */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
          >
            <Ionicons name="log-out-outline" size={17} color={COLORS.white} />
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
        
        {/* METRICAS SUPERIORES */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#E1F5FE', borderColor: '#81D4FA' }]}>
            <Text style={styles.statNumber}>{estudiantes.length}</Text>
            <Text style={styles.statLabel}>Estudiantes</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFF9C4', borderColor: '#FFD54F' }]}>
            <Text style={styles.statNumber}>{profesoresCount}</Text>
            <Text style={styles.statLabel}>Profesores</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' }]}>
            <Text style={styles.statNumber}>2026-2</Text>
            <Text style={styles.statLabel}>Período</Text>
          </View>
        </View>

        {/* MÓDULOS DE GESTIÓN */}
        <Text style={styles.sectionTitle}>Módulos de Gestión</Text>
        
        <TouchableOpacity
          style={styles.managementCard}
          onPress={() => navigation.navigate('ModuloGestion', { moduloTitulo: 'Profesores' })}
          activeOpacity={0.75}
        >
          <View style={styles.managementIcon}>
            <Ionicons name="school-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.managementInfo}>
            <Text style={styles.managementTitle}>Profesores</Text>
            <Text style={styles.managementDescription}>Gestionar docentes y asignaciones departamentales.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.managementCard}
          onPress={() => navigation.navigate('ModuloGestion', { moduloTitulo: 'Asignaturas' })}
          activeOpacity={0.75}
        >
          <View style={styles.managementIcon}>
            <Ionicons name="book-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.managementInfo}>
            <Text style={styles.managementTitle}>Asignaturas</Text>
            <Text style={styles.managementDescription}>Administrar materias, secciones y cursos.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666666" />
        </TouchableOpacity>

        {/* EXPEDIENTES Y BUSCADOR */}
        <Text style={styles.sectionTitle}>Expedientes de Estudiantes</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cédula, nombre o carrera..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* FILTROS PÍLDORAS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersWrapper}>
          {filters.map((filter) => (
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

        {/* LISTA DE ESTUDIANTES */}
        {cargando ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : filteredStudents.length === 0 ? (
          <Text style={styles.emptyStateText}>No se encontraron estudiantes.</Text>
        ) : (
          filteredStudents.map((student) => {
            const isActivo = student.estado === 'Activo' || student.estado === 'Activos';
            return (
              <TouchableOpacity
                key={student.id}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('CoordinatorStudentDetail', { student })}
              >
                <View style={styles.studentCard}>
                  <View style={styles.studentIcon}>
                    <Ionicons name="person-outline" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.nombre}</Text>
                    <Text style={styles.studentSub}>
                      {student.documento} • {student.carrera || 'Ingeniería'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: isActivo ? '#E8F5E9' : '#FFEBEE',
                        borderColor: isActivo ? '#A5D6A7' : '#D32F2F',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        { color: isActivo ? '#2E7D32' : '#D32F2F' },
                      ]}
                    >
                      {student.estado || 'Activo'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
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
  headerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 9, borderRadius: 10, marginLeft: 8 },
  logoutButtonText: { color: COLORS.white, fontSize: 11, fontWeight: '700', marginLeft: 5 },
  statsRow: { flexDirection: 'row', marginBottom: 16, gap: 10 },
  statCard: { flex: 1, minHeight: 78, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1, paddingVertical: 10 },
  statNumber: { fontSize: 20, fontWeight: '800', color: '#333333' },
  statLabel: { fontSize: 11, color: '#666666', marginTop: 3, fontWeight: '600' },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#333333', marginTop: 12, marginBottom: 12, letterSpacing: -0.2 },
  managementCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  managementIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#F0F3F8', justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  managementInfo: { flex: 1 },
  managementTitle: { fontSize: 15, fontWeight: '800', color: '#333333' },
  managementDescription: { fontSize: 12, color: '#666666', marginTop: 3, lineHeight: 16 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 46, fontSize: 15, color: '#333333' },
  filtersWrapper: { marginBottom: 20, flexDirection: 'row' },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
  filterPillActive: { backgroundColor: '#00BCD4', borderColor: '#00BCD4' },
  filterPillText: { fontSize: 13, color: '#666666', fontWeight: '700' },
  filterPillTextActive: { color: '#FFFFFF' },
  emptyStateText: { textAlign: 'center', color: '#666666', marginTop: 20, fontSize: 14, fontStyle: 'italic' },
  studentCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  studentIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F0F3F8', justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 15, fontWeight: '800', color: '#333333' },
  studentSub: { fontSize: 12, color: '#666666', marginTop: 3 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
});