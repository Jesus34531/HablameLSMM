import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import {
  ViroARImageMarker,
  ViroARScene,
  ViroARSceneNavigator,
  ViroARTrackingTargets,
  ViroVideo,
} from '@reactvision/react-viro';

// --- 1. CONFIGURACIÓN DE LOS TARGETS ---
ViroARTrackingTargets.createTargets({
  "Hola_target": {
    source: require('../../assets/videos/familia.png'),
    orientation: "Up",
    physicalWidth: 0.1, 
  },
  /* RUTAS PARA AGREGAR LOS DEMÁS VIDEOS EN EL FUTURO:
   "Como estas_target": { source: require('../../assets/videos/como_estas.png'), orientation: "Up", physicalWidth: 0.1 },
   "Buenos dias_target": { source: require('../../assets/videos/buenos_dias.png'), orientation: "Up", physicalWidth: 0.1 },
   ...y así sucesivamente.
  */
});

// --- 2. ESCENA DE REALIDAD AUMENTADA ---
const EscenaARSaludos = (props: any) => {
  const { targetBuscado, apagando } = props.arSceneNavigator.viroAppProps;

  const _onInitialized = (state: any) => {
    if (state === 3) { 
      console.log("RA Lista y rastreando el target:", targetBuscado);
    }
  };
  
  // Si se está apagando la cámara, dejamos de renderizar el video para evitar colapsos
  if (apagando) {
    return <ViroARScene />;
  }

  return (
    <ViroARScene onTrackingUpdated={_onInitialized}>
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

// --- 3. COMPONENTE PRINCIPAL (MENÚ) ---
export default function AprendizajeSaludos() {
  const [mostrarRA, setMostrarRA] = useState(false);
  const [targetActivo, setTargetActivo] = useState("");
  const [apagando, setApagando] = useState(false);

  // Las 10 palabras solicitadas
  const listaSaludos = [
    "Hola", "Como estas", "Buenos dias", "Buenas tardes", "Buena noches",
    "Bien", "Mal", "Gracias", "Nos vemos", "Que haces"
  ];

  const iniciarEscaneo = (saludo: string) => {
    if (saludo === "Hola") {
      setTargetActivo("Hola_target");
      setApagando(false);
      setMostrarRA(true);
    } else {
      Alert.alert(
        "Seña en desarrollo",
        `El video para "${saludo}" se agregará próximamente.`
      );
    }
  };

  // FIX DE USABILIDAD: Desmontaje seguro para evitar que la app se trabe/colapse
  const salirDeCamara = () => {
    setApagando(true); // Primero ocultamos el video de la memoria
    setTimeout(() => {
      setMostrarRA(false); // Luego desmontamos el navegador AR con seguridad
    }, 150);
  };

  if (mostrarRA) {
    return (
      <View style={styles.fullScreen}>
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{ scene: EscenaARSaludos as any }}
          viroAppProps={{ targetBuscado: targetActivo, apagando: apagando }}
          style={styles.fullScreen}
        />
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={salirDeCamara}
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
        <Text style={styles.subtitle}>Selecciona "Hola" para probar tu tarjeta</Text>
      </View>

      <ScrollView contentContainerStyle={styles.menuGrid}>
        {listaSaludos.map((saludo) => {
          const isActive = saludo === "Hola";
          return (
            <TouchableOpacity 
              key={saludo} 
              style={[
                styles.card, 
                isActive && styles.cardActive 
              ]} 
              onPress={() => iniciarEscaneo(saludo)}
            >
              <View style={[styles.iconCircle, isActive && styles.iconCircleActive]}>
                <Text style={[styles.iconText, isActive && styles.iconTextActive]}>
                  {saludo.charAt(0)}
                </Text>
              </View>
              <Text style={styles.cardText}>{saludo}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// --- 4. ESTILOS (Integrando tus colores '#06b6d4' y '#0e7490') ---
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
    borderWidth: 2,
    borderColor: '#334155'
  },
  cardActive: { 
    borderColor: '#06b6d4', // Tu color Cyan brillante para el borde activo
    backgroundColor: '#0e7490', // Tu color Cyan oscuro para el fondo activo
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5
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
  iconCircleActive: {
    backgroundColor: 'rgba(255,255,255,0.2)', // Contraste sutil
  },
  iconText: { color: '#94a3b8', fontWeight: 'bold', fontSize: 20 },
  iconTextActive: { color: '#ffffff' }, // Texto blanco cuando está activo
  cardText: { color: 'white', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  closeButton: { 
    position: 'absolute', 
    top: 50, 
    alignSelf: 'center', 
    backgroundColor: '#0e7490', // Botón de salir con tu color oscuro
    borderColor: '#06b6d4',     // Borde con tu color claro
    borderWidth: 1.5,
    paddingVertical: 12, 
    paddingHorizontal: 20,
    borderRadius: 25 
  },
  closeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});