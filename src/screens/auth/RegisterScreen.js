import React, { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { registrarUsuarioBD } from '../../database/database';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [documento, setDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [carrera, setCarrera] = useState('');
  const [rol, setRol] = useState('Coordinador');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Atención', 'Por favor completa todos los campos requeridos.');
      return;
    }

    setLoading(true);
    try {
      if (typeof registrarUsuarioBD !== 'function') {
        throw new Error('La función registrarUsuarioBD no está disponible o no se importó correctamente.');
      }

      await registrarUsuarioBD({
        nombre,
        documento,
        email,
        password,
        rol,
        carrera,
        estado: 'Activo',
      });

      Alert.alert('¡Registro Exitoso!', 'Usuario creado en Supabase correctamente.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      Alert.alert('Error', error.message || 'No se pudo crear el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Registro de Usuario</Text>

        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej: Roberto Gómez"
        />

        <Text style={styles.label}>Documento de Identidad</Text>
        <TextInput
          style={styles.input}
          value={documento}
          onChangeText={setDocumento}
          keyboardType="numeric"
          placeholder="1000000001"
        />

        <Text style={styles.label}>Correo Institucional</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="roberto.gomez@coord.univ.edu"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />

        <Text style={styles.label}>Carrera / Área</Text>
        <TextInput
          style={styles.input}
          value={carrera}
          onChangeText={setCarrera}
          placeholder="Administración Académica"
        />

        <Text style={styles.label}>Rol</Text>
        <View style={styles.roleContainer}>
          {['Estudiante', 'Profesor', 'Coordinador'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.roleButton, rol === item && styles.roleButtonActive]}
              onPress={() => setRol(item)}
            >
              <Text style={[styles.roleText, rol === item && styles.roleTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Registrar Usuario</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={{ marginTop: 15, alignItems: 'center' }}
        >
          <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>
            Volver al inicio de sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textDark, marginTop: 10, marginBottom: 4 },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  roleContainer: { flexDirection: 'row', gap: 8, marginTop: 4, marginBottom: 10 },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
  },
  roleButtonActive: { backgroundColor: COLORS.primary },
  roleText: { fontSize: 12, fontWeight: 'bold', color: COLORS.textGray },
  roleTextActive: { color: COLORS.white },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 15 },
});