import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageSourcePropType, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation';
import FloatingBackBar from '../Floatingbackbar'; // ← Asegúrate de que la ruta sea correcta

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// --- 1. DEFINIMOS LA ESTRUCTURA COMO EN SALUDOS ---
type SeñaItem = {
  id: string;
  etiqueta: string;
  activo: boolean;
  icono: ImageSourcePropType | null;
};

type CategoriaData = {
  label: string;
  items: SeñaItem[];
};

// --- 2. CONFIGURAMOS LAS CATEGORÍAS CON SUS ÍCONOS Y ESTADOS ---
const CATEGORIAS: Record<string, CategoriaData> = {
  vocales: {
    label: 'Vocales',
    items: [
      { id: 'A', etiqueta: 'Vocal A', activo: true, icono: require('../../assets/ic_vocales/a.png') }, // Reemplaza null con require('../../assets/iconos/letra_a.png')
      { id: 'E', etiqueta: 'Vocal E', activo: true, icono: require('../../assets/ic_vocales/e.png') },
      { id: 'I', etiqueta: 'Vocal I', activo: false, icono: require('../../assets/ic_vocales/i.png') }, // Ejemplo de inactivo
      { id: 'O', etiqueta: 'Vocal O', activo: false, icono: require('../../assets/ic_vocales/o.png') },
      { id: 'U', etiqueta: 'Vocal U', activo: false, icono: require('../../assets/ic_vocales/u.png') },
    ],
  },
  colores: {
    label: 'Colores',
    items: [
      { id: 'ROJO', etiqueta: 'Rojo', activo: true, icono: null },
      { id: 'AZUL', etiqueta: 'Azul', activo: true, icono: null },
      { id: 'VERDE', etiqueta: 'Verde', activo: false, icono: null },
    ],
  },
  animales: {
    label: 'Animales',
    items: [
      { id: 'PERRO', etiqueta: 'Perro', activo: true, icono: null },
      { id: 'GATO', etiqueta: 'Gato', activo: false, icono: null },
    ],
  },
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

  // --- 3. LÓGICA DE NAVEGACIÓN ---
  const abrirCamara = (item: SeñaItem) => {
    if (!item.activo) {
      Alert.alert('Próximamente', `La seña para "${item.etiqueta}" se agregará pronto.`);
      return;
    }
    // En lugar de abrir la cámara AR en este mismo archivo (como en Saludos), 
    // navegamos a CameraScreen enviándole el modo y la seña específica.
    navigation.navigate('Camera', { mode, seña: item.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{categoria.label}</Text>
        <Text style={styles.subtitle}>Selecciona una seña para escanear tu tarjeta</Text>
      </View>

      <ScrollView contentContainerStyle={styles.menuGrid} showsVerticalScrollIndicator={false}>
        {categoria.items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, item.activo && styles.cardActive]}
            activeOpacity={0.75}
            onPress={() => abrirCamara(item)}
          >
            <View style={[styles.iconCircle, item.activo && styles.iconCircleActive]}>
              {item.icono ? (
                <Image source={item.icono} style={styles.iconImage} resizeMode="contain" />
              ) : (
                <View style={styles.iconPlaceholder} />
              )}
            </View>

            <Text style={[styles.cardText, !item.activo && styles.cardTextInactive]}>
              {item.etiqueta}
            </Text>

            {!item.activo && <Text style={styles.pronto}>Próximamente</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* --- 4. BARRA FLOTANTE --- */}
      <FloatingBackBar label="Vocabulario" />
    </View>
  );
}

// --- 5. ESTILOS IDÉNTICOS A SALUDOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: { color: 'white', fontSize: 26, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 5, textAlign: 'center' },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 120, // Espacio para la FloatingBackBar
  },
  card: {
    backgroundColor: '#1e293b',
    width: '48%',
    paddingVertical: 28,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#334155',
    gap: 10,
  },
  cardActive: {
    borderColor: '#06b6d4',
    backgroundColor: '#0e7490',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  iconImage: {
    width: 58,
    height: 58,
  },
  iconPlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#94a3b8',
    opacity: 0.4,
  },
  cardText: { color: 'white', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  cardTextInactive: { color: '#94a3b8' },
  pronto: { color: '#475569', fontSize: 11, fontWeight: '500' },
  errorText: { color: 'white', fontSize: 16, textAlign: 'center', marginTop: 40 },
});