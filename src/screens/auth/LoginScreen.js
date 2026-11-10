/* import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

// ✅ CORRECTO: Subir 2 niveles desde src/screens/auth/
import { COLORS } from '../../constants/theme';
import { validarLoginBD } from '../../database/database';

export default function LoginScreen({ navigation }) {
  const [rol, setRol] = useState('Estudiante');
  const [email, setEmail] = useState('carlos.garcia@est.univ.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atención', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const usuario = await validarLoginBD(email, password, rol);
      setLoading(false);

      if (usuario) {
        if (rol === 'Estudiante') navigation.replace('StudentTabs', { user: usuario });
        else if (rol === 'Profesor') navigation.replace('ProfessorTabs', { user: usuario });
        else if (rol === 'Coordinador') navigation.replace('CoordinatorTabs', { user: usuario });
      } else {
        Alert.alert('Error de acceso', `No se encontró un ${rol} con las credenciales ingresadas en SQLite.`);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al validar el acceso.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={48} color={COLORS.white} />
          </View>
          <Text style={styles.appName}>SmartNotas</Text>
          <Text style={styles.appTagline}>Plataforma Integral Universitaria</Text>
        </View>

        <Text style={styles.title}>¡Bienvenido/a!</Text>
        <Text style={styles.subtitle}>Ingresa a tu plataforma académica institucional</Text>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Correo institucional</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@univ.edu"
            placeholderTextColor={COLORS.textGray}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textGray}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ marginTop: 16, alignItems: 'center' }} 
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 13 }}>
            ¿No tienes cuenta? Regístrate aquí
          </Text>
        </TouchableOpacity>

        <View style={styles.roleSection}>
          <Text style={styles.roleLabel}>SELECCIONA TU ROL</Text>
          <View style={styles.roleContainer}>
            {['Estudiante', 'Profesor', 'Coordinador'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.roleButton, rol === item && styles.roleButtonActive]}
                onPress={() => {
                  setRol(item);
                  if (item === 'Estudiante') setEmail('carlos.garcia@est.univ.edu');
                  else if (item === 'Profesor') setEmail('maria.rodriguez@prof.univ.edu');
                  else if (item === 'Coordinador') setEmail('roberto.gomez@coord.univ.edu');
                }}
              >
                <Text style={[styles.roleButtonText, rol === item && styles.roleButtonTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 24 },
  logoContainer: { alignItems: 'center', marginTop: 20, marginBottom: 20 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  appName: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary },
  appTagline: { fontSize: 14, color: COLORS.textGray },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.textDark },
  subtitle: { fontSize: 14, color: COLORS.textGray, marginBottom: 20 },
  formGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: 6 },
  textInput: { backgroundColor: COLORS.white, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: COLORS.textDark, borderWidth: 1, borderColor: '#E5E7EB' },
  loginButton: { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  roleSection: { marginTop: 30, alignItems: 'center' },
  roleLabel: { fontSize: 12, fontWeight: 'bold', color: COLORS.textGray, letterSpacing: 1, marginBottom: 12 },
  roleContainer: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 20, padding: 4 },
  roleButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16 },
  roleButtonActive: { backgroundColor: COLORS.primary },
  roleButtonText: { fontSize: 13, fontWeight: '600', color: COLORS.textGray },
  roleButtonTextActive: { color: COLORS.white },
}); */

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
import { Ionicons } from '@expo/vector-icons';

// ✅ Subir 2 niveles desde src/screens/auth/
import { COLORS } from '../../constants/theme';
import { obtenerUsuarioPorEmailBD } from '../../database/database';

export default function LoginScreen({ navigation }) {
  const [rol, setRol] = useState('Estudiante');
  const [email, setEmail] = useState('carlos.garcia@est.univ.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atención', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      // Consulta asíncrona a Supabase
      const usuario = await obtenerUsuarioPorEmailBD(email);

      if (!usuario) {
        Alert.alert('Error de acceso', 'El usuario no existe en la base de datos.');
        setLoading(false);
        return;
      }

      if (usuario.password !== password) {
        Alert.alert('Error de acceso', 'Contraseña incorrecta.');
        setLoading(false);
        return;
      }

      // Validar coincidencia de rol seleccionada en la UI
      if (usuario.rol.toLowerCase() !== rol.toLowerCase()) {
        Alert.alert(
          'Acceso Denegado',
          `Tu usuario no está registrado como ${rol}. Tu rol actual es ${usuario.rol}.`
        );
        setLoading(false);
        return;
      }

      setLoading(false);

      // Redirección modular según el rol ingresado
      if (rol === 'Estudiante') {
        navigation.replace('StudentTabs', { user: usuario });
      } else if (rol === 'Profesor') {
        navigation.replace('ProfessorTabs', { user: usuario });
      } else if (rol === 'Coordinador') {
        navigation.replace('CoordinatorTabs', { user: usuario });
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al validar el acceso.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={48} color={COLORS.white} />
          </View>
          <Text style={styles.appName}>SmartNotas</Text>
          <Text style={styles.appTagline}>Plataforma Integral Universitaria</Text>
        </View>

        <Text style={styles.title}>¡Bienvenido/a!</Text>
        <Text style={styles.subtitle}>Ingresa a tu plataforma académica institucional</Text>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Correo institucional</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@univ.edu"
            placeholderTextColor={COLORS.textGray}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textGray}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin} 
          disabled={loading} 
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ marginTop: 16, alignItems: 'center' }} 
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 13 }}>
            ¿No tienes cuenta? Regístrate aquí
          </Text>
        </TouchableOpacity>

        <View style={styles.roleSection}>
          <Text style={styles.roleLabel}>SELECCIONA TU ROL</Text>
          <View style={styles.roleContainer}>
            {['Estudiante', 'Profesor', 'Coordinador'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.roleButton, rol === item && styles.roleButtonActive]}
                onPress={() => {
                  setRol(item);
                  if (item === 'Estudiante') setEmail('mateo.bermudez@est.univ.edu');
                  else if (item === 'Profesor') setEmail('martha.benitez@prof.univ.edu');
                  else if (item === 'Coordinador') setEmail('roberto.gomez@coord.univ.edu');
                }}
              >
                <Text style={[styles.roleButtonText, rol === item && styles.roleButtonTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 24 },
  logoContainer: { alignItems: 'center', marginTop: 20, marginBottom: 20 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  appName: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary },
  appTagline: { fontSize: 14, color: COLORS.textGray },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.textDark },
  subtitle: { fontSize: 14, color: COLORS.textGray, marginBottom: 20 },
  formGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: 6 },
  textInput: { backgroundColor: COLORS.white, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: COLORS.textDark, borderWidth: 1, borderColor: '#E5E7EB' },
  loginButton: { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  roleSection: { marginTop: 30, alignItems: 'center' },
  roleLabel: { fontSize: 12, fontWeight: 'bold', color: COLORS.textGray, letterSpacing: 1, marginBottom: 12 },
  roleContainer: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 20, padding: 4 },
  roleButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16 },
  roleButtonActive: { backgroundColor: COLORS.primary },
  roleButtonText: { fontSize: 13, fontWeight: '600', color: COLORS.textGray },
  roleButtonTextActive: { color: COLORS.white },
});