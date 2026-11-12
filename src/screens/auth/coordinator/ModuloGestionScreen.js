import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
  ActivityIndicator, Modal, TextInput, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/theme';
import {
  obtenerProfesoresBD, registrarProfesorBD,
  obtenerAsignaturasBD, crearAsignaturaBD,
  eliminarRegistroBD
} from '../../../database/database';

export default function ModuloGestionScreen({ route, navigation }) {
  const { moduloTitulo } = route.params || { moduloTitulo: 'Profesores' };
  const esProfesores = moduloTitulo === 'Profesores';

  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Campos para Profesor
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [documento, setDocumento] = useState('');

  // Campos para Asignatura
  const [codigo, setCodigo] = useState('');
  const [creditos, setCreditos] = useState('');

  useEffect(() => {
    cargarDatos();
  }, [moduloTitulo]);

  const cargarDatos = async () => {
    setCargando(true);
    const data = esProfesores ? await obtenerProfesoresBD() : await obtenerAsignaturasBD();
    setLista(data);
    setCargando(false);
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    try {
      if (esProfesores) {
        if (!email.trim()) return Alert.alert('Error', 'El correo es obligatorio');
        await registrarProfesorBD({ nombre, email, documento });
      } else {
        if (!codigo.trim()) return Alert.alert('Error', 'El código es obligatorio');
        await crearAsignaturaBD({ nombre, codigo, creditos });
      }
      
      Alert.alert('Éxito', `${esProfesores ? 'Profesor' : 'Asignatura'} guardado(a) correctamente`);
      limpiarFormulario();
      setModalVisible(false);
      cargarDatos();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const handleEliminar = (id) => {
    Alert.alert('Confirmar', '¿Deseas eliminar este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await eliminarRegistroBD(esProfesores ? 'usuarios' : 'asignaturas', id);
            cargarDatos();
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        }
      }
    ]);
  };

  const limpiarFormulario = () => {
    setNombre(''); setEmail(''); setDocumento('');
    setCodigo(''); setCreditos('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.title}>{moduloTitulo}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Lista */}
      {cargando ? (
        <ActivityIndicator size="large" color={COLORS.primary || '#1D4ED8'} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={lista}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.nombre}</Text>
                <Text style={styles.cardSubtitle}>
                  {esProfesores ? item.email : `Código: ${item.codigo} • Créditos: ${item.creditos || 3}`}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleEliminar(item.id)}>
                <Ionicons name="trash-outline" size={22} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No hay {moduloTitulo.toLowerCase()} registrados.</Text>
          }
        />
      )}

      {/* Modal Formulario */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar {esProfesores ? 'Profesor' : 'Asignatura'}</Text>
            
            <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />

            {esProfesores ? (
              <>
                <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" />
                <TextInput style={styles.input} placeholder="Documento" value={documento} onChangeText={setDocumento} keyboardType="numeric" />
              </>
            ) : (
              <>
                <TextInput style={styles.input} placeholder="Código (ej. MAT-101)" value={codigo} onChangeText={setCodigo} />
                <TextInput style={styles.input} placeholder="Número de Créditos" value={creditos} onChangeText={setCreditos} keyboardType="numeric" />
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#475569' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleGuardar}>
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  addButton: { backgroundColor: '#1D4ED8', padding: 8, borderRadius: 8 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  cardSubtitle: { fontSize: 14, color: '#64748B', marginTop: 2 },
  empty: { textAlign: 'center', color: '#94A3B8', marginTop: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#0F172A' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 12, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 12 },
  btn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  btnCancel: { backgroundColor: '#E2E8F0' },
  btnSave: { backgroundColor: '#1D4ED8' }
});