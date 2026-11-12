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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/theme';
import { obtenerNotasEstudianteBD } from '../../../database/database';

export default function StudentHomeScreen({ route, navigation }) {
  const user = route.params?.user || { nombre: 'Carlos', email: 'carlos.garcia@est.univ.edu', carrera: 'Ingeniería Mecánica', semestre: '6to Semestre' };
  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todas');

  const filters = ['Todas', 'Aprobadas', 'En Riesgo'];

  useEffect(() => {
    cargarNotas();
  }, []);

  const cargarNotas = async () => {
    setCargando(true);
    try {
      const data = await obtenerNotasEstudianteBD(user.id);
      setMaterias(data);
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
  const notasDefinitivas = materias.filter(m => m.definitiva !== null && m.definitiva !== undefined).map(m => m.definitiva);
  const promedio = notasDefinitivas.length > 0 
    ? (notasDefinitivas.reduce((a, b) => a + b, 0) / notasDefinitivas.length).toFixed(1)
    : '0.0';

  const aprobadasCount = materias.filter(m => (m.definitiva ?? 0) >= 3.0).length;
  const riesgoCount = materias.filter(m => (m.definitiva ?? 0) < 3.0 && m.definitiva !== null).length;

  const filteredSubjects = materias.filter(sub => {
    const matchesSearch = (sub.asignatura || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'Todas' || 
      (activeFilter === 'Aprobadas' && (sub.definitiva ?? 0) >= 3.0) ||
      (activeFilter === 'En Riesgo' && (sub.definitiva ?? 0) < 3.0);
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ENCABEZADO: saludo y botón de salida en la misma fila */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Hola, {user.nombre.split(' ')[0]} 👋</Text>
            <Text style={styles.headerSubtitle}>{user.carrera || 'Ingeniería Mecánica'} • {user.semestre || '6to Semestre'}</Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLORS.primary,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 10,
              marginLeft: 10,
            }}
          >
            <Ionicons name="log-out-outline" size={18} color={COLORS.white} />
            <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: '700', marginLeft: 5 }}>
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>

        {/* TARJETA PROMEDIO CIRCULAR */}
        <View style={styles.averageCard}>
          <View style={styles.averageCircle}>
            <Text style={styles.averageNumber}>{promedio}</Text>
          </View>
          <View style={styles.averageInfo}>
            <Text style={styles.averageTitle}>Promedio General</Text>
            <Text style={styles.averageSubtitle}>Escala de calificación sobre 5</Text>
            <View style={styles.badgeSuccess}>
              <Ionicons name="checkmark-circle-outline" size={14} color={COLORS.textPrimary} style={{ marginRight: 4 }} />
              <Text style={styles.badgeSuccessText}>
                {parseFloat(promedio) >= 3.0 ? 'Rendimiento excelente global' : 'Atención al rendimiento'}
              </Text>
            </View>
          </View>
        </View>

        {/* MÉTRICAS / ESTADÍSTICAS */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
            <Text style={styles.statNumber}>{materias.length}</Text>
            <Text style={styles.statLabel}>Materias</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' }]}>
            <Text style={styles.statNumber}>{aprobadasCount}</Text>
            <Text style={styles.statLabel}>Aprobadas</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFF9C4', borderColor: '#FFD54F' }]}>
            <Text style={styles.statNumber}>{riesgoCount}</Text>
            <Text style={styles.statLabel}>En riesgo</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Mis Materias</Text>

        {/* BUSCADOR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar materia..."
            placeholderTextColor={COLORS.textSecondary}
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

        {/* LISTA DE MATERIAS */}
        {cargando ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : filteredSubjects.length === 0 ? (
          <Text style={styles.emptyStateText}>No se encontraron materias.</Text>
        ) : (
          filteredSubjects.map((item, index) => (
            <TouchableOpacity
              key={item.asignatura_id || index.toString()}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('StudentSubjectDetail', { materia: item })}
            >
              <View style={styles.subjectCard}>
                <View style={styles.subjectIcon}>
                  <Ionicons name="book-outline" size={22} color={COLORS.primary} />
                </View>
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectName}>{item.asignatura}</Text>
                  <Text style={styles.subjectTeacher}>{item.profesor || 'Profesor Titular'}</Text>
                </View>
                <View style={styles.gradeContainer}>
                  <Text style={styles.grade}>
                    {item.definitiva !== null && item.definitiva !== undefined ? item.definitiva.toFixed(1) : '--'}
                  </Text>
                  <Text style={styles.gradeLabel}>NOTA</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F3F8' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#333333' },
  headerSubtitle: { fontSize: 13, color: '#666666', marginTop: 2 },
  headerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  averageCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  averageCircle: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: COLORS.primary, backgroundColor: '#F0F3F8', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  averageNumber: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  averageInfo: { flex: 1 },
  averageTitle: { fontSize: 15, fontWeight: '800', color: '#333333' },
  averageSubtitle: { fontSize: 12, color: '#666666', marginTop: 2 },
  badgeSuccess: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 6, borderWidth: 1, borderColor: '#A5D6A7' },
  badgeSuccessText: { fontSize: 11, color: '#333333', fontWeight: '700' },
  statsRow: { flexDirection: 'row', marginBottom: 16, gap: 10 },
  statCard: { flex: 1, minHeight: 78, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1, paddingVertical: 10 },
  statNumber: { fontSize: 20, fontWeight: '800', color: '#333333' },
  statLabel: { fontSize: 11, color: '#666666', marginTop: 2, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#333333', marginTop: 8, marginBottom: 12 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 46, fontSize: 14, color: '#333333' },
  filtersWrapper: { marginBottom: 20, flexDirection: 'row' },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
  filterPillActive: { backgroundColor: '#00BCD4', borderColor: '#00BCD4' },
  filterPillText: { fontSize: 13, color: '#666666', fontWeight: '700' },
  filterPillTextActive: { color: '#FFFFFF' },
  emptyStateText: { textAlign: 'center', color: '#666666', marginTop: 20, fontSize: 14, fontStyle: 'italic' },
  subjectCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  subjectIcon: { width: 46, height: 46, borderRadius: 13, backgroundColor: '#F0F3F8', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  subjectInfo: { flex: 1 },
  subjectName: { fontSize: 15, fontWeight: '800', color: '#333333' },
  subjectTeacher: { fontSize: 12, color: '#666666', marginTop: 3 },
  gradeContainer: { alignItems: 'center', backgroundColor: '#F0F3F8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  grade: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  gradeLabel: { fontSize: 10, fontWeight: '700', color: '#666666' },
});