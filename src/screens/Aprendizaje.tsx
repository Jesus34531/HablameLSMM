import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import {
  ViroARImageMarker,
  ViroARScene,
  ViroARSceneNavigator,
  ViroARTrackingTargets,
  ViroVideo,
} from '@reactvision/react-viro';

// --- 1. CONFIGURACIÓN DEL TARGET ---
ViroARTrackingTargets.createTargets({
  "familia_target": {
    source: require('../../assets/videos/imagen1.png'),
    orientation: "Up",
    physicalWidth: 0.1, 
  },
});

// --- 2. ESCENA DE REALIDAD AUMENTADA ---
const EscenaARSaludos = (props: any) => {
  // Extraemos el ID que pasamos desde el menú
  const { targetBuscado } = props.arSceneNavigator.viroAppProps;

  // Fix para el error de 'undefined': usamos el valor numérico directo (3 = Tracking Normal)
  const _onInitialized = (state: any) => {
    if (state === 3) { 
      console.log("RA Lista y rastreando el target:", targetBuscado);
    }
  };

  return (
    <ViroARScene onTrackingUpdated={_onInitialized}>
      {/* Solo se activará si detecta la tarjeta vinculada a 'targetBuscado' */}
      <ViroARImageMarker target={targetBuscado}>
        <ViroVideo
          source={require('../../assets/videos/video1.mp4')}
          loop={true}
          position={[0, 0, 0]}
          rotation={[-90, 0, 0]}
          scale={[0.1, 0.1, 0]}
        />
      </ViroARImageMarker>
    </ViroARScene>
  );
};

// --- 3. COMPONENTE PRINCIPAL (MENÚ) ---
export default function AprendizajeSaludos() {
  const [mostrarRA, setMostrarRA] = useState(false);
  const [targetActivo, setTargetActivo] = useState("");

  const listaSaludos = [
    "Hola", "Adios", "Buenos Dias", "Buenas Tardes", "Buenas Noches",
    "Como estas", "Gracias", "De nada", "Perdon", "Por favor",
    "Mucho gusto", "Bienvenido", "Si", "No", "Tal vez",
    "Amigo", "Familia", "Maestro", "Ayuda", "Te quiero"
  ];

  // Lógica para filtrar: Solo "Familia" funciona por ahora
  const iniciarEscaneo = (saludo: string) => {
    if (saludo === "Familia") {
      setTargetActivo("familia_target");
      setMostrarRA(true);
    } else {
      Alert.alert(
        "Seña no disponible",
        `La tarjeta para "${saludo}" aún no ha sido registrada.`
      );
    }
  };

  if (mostrarRA) {
    return (
      <View style={styles.fullScreen}>
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{ scene: EscenaARSaludos }}
          // Pasamos el target seleccionado a la escena AR
          viroAppProps={{ targetBuscado: targetActivo }}
          style={styles.fullScreen}
        />
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => setMostrarRA(false)}
        >
          <Text style={styles.closeButtonText}>✕ Salir de Cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Módulo de Saludos</Text>
        <Text style={styles.subtitle}>Selecciona "Familia" para escanear tu tarjeta</Text>
      </View>

      <ScrollView contentContainerStyle={styles.menuGrid}>
        {listaSaludos.map((saludo) => (
          <TouchableOpacity 
            key={saludo} 
            style={[
              styles.card, 
              saludo === "Familia" && styles.cardActive 
            ]} 
            onPress={() => iniciarEscaneo(saludo)}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>{saludo.charAt(0)}</Text>
            </View>
            <Text style={styles.cardText}>{saludo}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  fullScreen: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 20, alignItems: 'center' },
  title: { color: 'white', fontSize: 26, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 5 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 15 },
  card: { 
    backgroundColor: '#1e293b', 
    width: '48%', 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center', 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#334155'
  },
  cardActive: { 
    borderColor: '#22d3ee', 
    borderWidth: 2,
    backgroundColor: '#1e293b'
  },
  iconCircle: { 
    width: 45, 
    height: 45, 
    borderRadius: 25, 
    backgroundColor: '#334155', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  iconText: { color: '#22d3ee', fontWeight: 'bold', fontSize: 20 },
  cardText: { color: 'white', fontSize: 14, fontWeight: '600' },
  closeButton: { 
    position: 'absolute', 
    top: 50, 
    alignSelf: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    padding: 12, 
    borderRadius: 25 
  },
  closeButtonText: { color: 'white', fontWeight: 'bold' }
});