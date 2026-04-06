import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../Navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ============================================================
// MISMA CONFIGURACIÓN QUE Camera.tsx
// Cuando agregues animales o colores, actualiza aquí también
// ============================================================
const CATEGORIAS: Record<string, { label: string; señas: string[]; colors: [string, string] }> = {
  vocales: {
    label: 'Vocales',
    señas: ['A', 'E', 'I', 'O', 'U'],
    colors: ['#3b82f6', '#2563eb'],
  },
  // colores: {
  //   label: 'Colores',
  //   señas: ['ROJO', 'AZUL', 'VERDE'],
  //   colors: ['#06b6d4', '#0891b2'],
  // },
  // animales: {
  //   label: 'Animales',
  //   señas: ['PERRO', 'GATO', 'PAJARO'],
  //   colors: ['#0ea5e9', '#0284c7'],
  // },
};

export default function SelectorSeñas() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { mode } = route.params;

  const categoria = CATEGORIAS[mode];

  if (!categoria) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Categoría no encontrada</Text>
      </View>
    );
  }

  const abrirCamara = (seña: string) => {
    navigation.navigate('Camera', { mode, seña });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Salir</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoria.label}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.instruccion}>
          Selecciona una seña para activar la cámara y escanear su tarjeta
        </Text>

        <View style={styles.grid}>
          {categoria.señas.map((seña) => (
            <TouchableOpacity
              key={seña}
              onPress={() => abrirCamara(seña)}
              activeOpacity={0.8}
              style={styles.cardWrapper}
            >
              <LinearGradient
                colors={categoria.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <Text style={styles.señaTexto}>{seña}</Text>
                <Text style={styles.señaSubtexto}>Toca para escanear</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
  },
  backButton: { padding: 10, backgroundColor: '#3b82f6', borderRadius: 8 },
  backText: { color: 'white', fontWeight: 'bold' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 80 },
  content: { padding: 20, paddingBottom: 40 },
  instruccion: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  cardWrapper: {
    width: '45%',
  },
  card: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    elevation: 4,
  },
  señaTexto: { color: 'white', fontSize: 48, fontWeight: 'bold' },
  señaSubtexto: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 8 },
  errorText: { color: 'white', fontSize: 16, textAlign: 'center', marginTop: 40 },
});