import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {
  ViroARImageMarker,
  ViroARScene,
  ViroARSceneNavigator,
  ViroARTrackingTargets,
  ViroVideo,
} from '@reactvision/react-viro';
import FloatingBackBar from '../Floatingbackbar';

// --- 1. CONFIGURACIÓN DE LOS TARGETS AR ---
ViroARTrackingTargets.createTargets({
  "Hola_target": {
    source: require('../../assets/videos/familia.png'),
    orientation: "Up",
    physicalWidth: 0.1,
  },
  /* Agrega los demás targets cuando tengas sus imágenes y videos:
   "ComoEstas_target":    { source: require('../../assets/videos/como_estas.png'),    orientation: "Up", physicalWidth: 0.1 },
   "BuenosDias_target":   { source: require('../../assets/videos/buenos_dias.png'),   orientation: "Up", physicalWidth: 0.1 },
   "BuenasTardes_target": { source: require('../../assets/videos/buenas_tardes.png'), orientation: "Up", physicalWidth: 0.1 },
   "BuenasNoches_target": { source: require('../../assets/videos/buenas_noches.png'), orientation: "Up", physicalWidth: 0.1 },
   "Bien_target":         { source: require('../../assets/videos/bien.png'),          orientation: "Up", physicalWidth: 0.1 },
   "Mal_target":          { source: require('../../assets/videos/mal.png'),           orientation: "Up", physicalWidth: 0.1 },
   "Gracias_target":      { source: require('../../assets/videos/gracias.png'),       orientation: "Up", physicalWidth: 0.1 },
   "NosVemos_target":     { source: require('../../assets/videos/nos_vemos.png'),     orientation: "Up", physicalWidth: 0.1 },
   "QueHaces_target":     { source: require('../../assets/videos/que_haces.png'),     orientation: "Up", physicalWidth: 0.1 },
  */
});

// --- 2. ESCENA AR ---
const EscenaARSaludos = (props: any) => {
  const { targetBuscado, apagando } = props.arSceneNavigator.viroAppProps;

  if (apagando) return <ViroARScene />;

  return (
    <ViroARScene>
      <ViroARImageMarker target={targetBuscado}>
        {targetBuscado === "Hola_target" && (
          <ViroVideo
            source={require('../../assets/videos/hola.mp4')}
            loop={true}
            position={[0, 0, 0]}
            rotation={[-90, 0, 0]}
            scale={[0.1, 0.1, 0]}
          />
        )}
      </ViroARImageMarker>
    </ViroARScene>
  );
};

// --- 3. TIPO PARA CADA SALUDO ---
type Saludo = {
  id: string;           // clave interna
  etiqueta: string;     // texto que se muestra en la tarjeta
  target: string;       // nombre del ViroARTrackingTarget
  activo: boolean;      // false → muestra "Próximamente"
  icono: ImageSourcePropType | null; // 🔲 slot PNG por tarjeta
};

// --- 4. LISTA DE SALUDOS ---
// Para agregar el ícono de una tarjeta, cambia null por require('../../assets/iconos/nombre.png')
const listaSaludos: Saludo[] = [
  { id: 'hola',          etiqueta: 'Hola',           target: 'Hola_target',         activo: true,  icono: require('../../assets/iconos/hola.png') /* 🔲 TU PNG */ },
  { id: 'comoEstas',     etiqueta: 'Cómo estás',     target: 'ComoEstas_target',    activo: false, icono: require('../../assets/iconos/como_estas.png') /* 🔲 TU PNG */ },
  { id: 'buenosDias',    etiqueta: 'Buenos días',    target: 'BuenosDias_target',   activo: false, icono: require('../../assets/iconos/buen_dia.png') /* 🔲 TU PNG */ },
  { id: 'buenasTardes',  etiqueta: 'Buenas tardes',  target: 'BuenasTardes_target', activo: false, icono: require('../../assets/iconos/buena_tarde.png') /* 🔲 TU PNG */ },
  { id: 'buenasNoches',  etiqueta: 'Buenas noches',  target: 'BuenasNoches_target', activo: false, icono: require('../../assets/iconos/buena_noche.png') /* 🔲 TU PNG */ },
  { id: 'bien',          etiqueta: 'Bien',            target: 'Bien_target',         activo: false, icono: require('../../assets/iconos/bien.png') /* 🔲 TU PNG */ },
  { id: 'mal',           etiqueta: 'Mal',             target: 'Mal_target',          activo: false, icono: require('../../assets/iconos/mal.png') /* 🔲 TU PNG */ },
  { id: 'gracias',       etiqueta: 'Gracias',         target: 'Gracias_target',      activo: false, icono: require('../../assets/iconos/gracias.png') /* 🔲 TU PNG */ },
  { id: 'nosVemos',      etiqueta: 'Nos vemos',       target: 'NosVemos_target',     activo: false, icono: require('../../assets/iconos/adios.png') /* 🔲 TU PNG */ },
  { id: 'queHaces',      etiqueta: 'Qué haces',       target: 'QueHaces_target',     activo: false, icono: require('../../assets/iconos/que_haces.png') /* 🔲 TU PNG */ },
];

// --- 5. COMPONENTE PRINCIPAL ---
export default function AprendizajeSaludos() {
  const [mostrarRA, setMostrarRA] = useState(false);
  const [targetActivo, setTargetActivo] = useState('');
  const [apagando, setApagando] = useState(false);

  const iniciarEscaneo = (saludo: Saludo) => {
    if (!saludo.activo) {
      Alert.alert('Próximamente', `La seña para "${saludo.etiqueta}" se agregará pronto.`);
      return;
    }
    setTargetActivo(saludo.target);
    setApagando(false);
    setMostrarRA(true);
  };

  const salirDeCamara = () => {
    setApagando(true);
    setTimeout(() => setMostrarRA(false), 150);
  };

  // Vista de cámara AR
  if (mostrarRA) {
    return (
      <View style={styles.fullScreen}>
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{ scene: EscenaARSaludos as any }}
          viroAppProps={{ targetBuscado: targetActivo, apagando }}
          style={styles.fullScreen}
        />
        {/* FloatingBackBar reutilizable — sale de la cámara con animación segura */}
        <View style={styles.wrapper} pointerEvents="box-none">
          <View style={styles.bar}>
            <TouchableOpacity
              style={styles.barButton}
              activeOpacity={0.75}
              onPress={salirDeCamara}
            >
              <Text style={styles.arrow}>←</Text>
              <Text style={styles.barLabel}>Salir de cámara</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Vista del menú de saludos
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saludos</Text>
        <Text style={styles.subtitle}>Selecciona una seña para escanear tu tarjeta</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.menuGrid}
        showsVerticalScrollIndicator={false}
      >
        {listaSaludos.map((saludo) => (
          <TouchableOpacity
            key={saludo.id}
            style={[styles.card, saludo.activo && styles.cardActive]}
            activeOpacity={0.75}
            onPress={() => iniciarEscaneo(saludo)}
          >
            {/* Slot de ícono PNG por tarjeta */}
            <View style={[styles.iconCircle, saludo.activo && styles.iconCircleActive]}>
              {saludo.icono ? (
                <Image
                  source={saludo.icono}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              ) : (
                // 🔲 Placeholder — reemplaza icono: null con require() de tu PNG
                <View style={styles.iconPlaceholder} />
              )}
            </View>

            <Text style={[styles.cardText, !saludo.activo && styles.cardTextInactive]}>
              {saludo.etiqueta}
            </Text>

            {!saludo.activo && (
              <Text style={styles.pronto}>Próximamente</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Barra flotante de volver al menú anterior */}
      <FloatingBackBar label="Vocabulario" />
    </View>
  );
}

// --- 6. ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  fullScreen: { flex: 1 },

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
    paddingBottom: 120, // espacio para la FloatingBackBar
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
    width: 80,          // círculo más grande
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
    width: 58,          // imagen más grande, sin tintColor → colores originales
    height: 58,
  },
  // 🔲 Cuadrado vacío mientras no hay PNG
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

  // Barra flotante inline usada solo dentro de la vista AR (para salir de cámara)
  wrapper: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  bar: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(34, 211, 238, 0.35)',
    paddingVertical: 10,
    paddingHorizontal: 28,
    elevation: 10,
    shadowColor: '#22d3ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  barButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  arrow: { color: '#22d3ee', fontSize: 20, fontWeight: 'bold', lineHeight: 22 },
  barLabel: { color: '#e2e8f0', fontSize: 15, fontWeight: '600', letterSpacing: 0.3 },
});