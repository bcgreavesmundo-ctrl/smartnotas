import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { initDatabase } from './src/database/database';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/theme';

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Inicializa las tablas y datos semilla de SQLite
        await initDatabase();
      } catch (e) {
        console.warn('Error durante la inicialización de la base de datos:', e);
      } finally {
        setDbReady(true);
      }
    }
    prepare();
  }, []);

  // Pantalla de carga mientras se establece la conexión con SQLite
  if (!dbReady) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando SmartNotas...</Text>
      </View>
    );
  }

  // Carga del sistema de navegación modular
  return <AppNavigator />;
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textGray,
  },
});