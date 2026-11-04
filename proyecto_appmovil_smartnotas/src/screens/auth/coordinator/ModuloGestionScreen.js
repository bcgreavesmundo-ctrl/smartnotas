import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ModuloGestionScreen({ route, navigation }) {
  const { moduloTitulo } = route.params || { moduloTitulo: 'Módulo' };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
          <Text style={styles.backText}>{moduloTitulo}</Text>
        </TouchableOpacity>
        <Text style={styles.emptyStateText}>Módulo de {moduloTitulo} en construcción.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F3F8' },
  content: { padding: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backText: { fontSize: 18, fontWeight: '800', color: '#333333', marginLeft: 8 },
  emptyStateText: { textAlign: 'center', color: '#666666', marginTop: 40, fontSize: 14, fontStyle: 'italic' },
});