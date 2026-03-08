import React, { Suspense, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF, useAnimations } from '@react-three/drei/native';

// --- COMPONENTE DE LA MANO 3D ---
function ManoLSM({ letraActual }: { letraActual: string }) {
  // Asegúrate de poner tu archivo Prueba_Vocales.glb en la carpeta assets de la raíz
  const modelo = require('../../assets/Vocales_LSM_4.glb'); // Ajusta la ruta a tus assets
  const { scene, animations } = useGLTF(modelo) as any;
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    // Detenemos todas las animaciones previas
    Object.values(actions).forEach(action => action?.stop());
    
    // Reproducimos la animación de la letra seleccionada
    const nombreAnimacion = `LSM_${letraActual}`;
    if (actions[nombreAnimacion]) {
      actions[nombreAnimacion].play();
    }
  }, [letraActual, actions]);

  return <primitive object={scene} scale={1.5} position={[0, -2, 0]} rotation={[0, -Math.PI / 2, 0]}/>;
}

// --- PANTALLA PRINCIPAL DE APRENDIZAJE ---
export default function Aprendizaje() {
  const [letra, setLetra] = useState('A'); // Empezamos con la A (o la E si no rehiciste la A)

  const vocales = ['E', 'I', 'O', 'U'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Práctica 3D: Vocales</Text>
      </View>

      {/* Contenedor del Modelo 3D */}
      <View style={styles.canvasContainer}>
        <Canvas>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 10]} intensity={2} />
          <directionalLight position={[-10, 10, -10]} intensity={1} />
          <Suspense fallback={null}>
            <ManoLSM letraActual={letra} />
          </Suspense>
        </Canvas>
      </View>

      {/* Botones de Control */}
      <View style={styles.controls}>
        {vocales.map((v) => (
          <TouchableOpacity 
            key={v} 
            style={[styles.button, letra === v && styles.buttonActive]}
            onPress={() => setLetra(v)}
          >
            <Text style={styles.buttonText}>{v}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { paddingTop: 60, paddingBottom: 20, alignItems: 'center' },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  canvasContainer: { flex: 1, backgroundColor: '#1e293b', margin: 16, borderRadius: 20, overflow: 'hidden' },
  controls: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 40, gap: 10 },
  button: { backgroundColor: '#334155', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  buttonActive: { backgroundColor: '#22d3ee' },
  buttonText: { color: 'white', fontSize: 20, fontWeight: 'bold' }
});