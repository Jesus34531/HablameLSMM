import React, { useEffect, useState, useRef,useMemo  } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, PermissionsAndroid, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroARImageMarker,
  ViroARTrackingTargets,
  Viro3DObject,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroNode,
} from '@reactvision/react-viro';

const MAPA_MODOS: Record<string, string> = {
  letras: 'vocales',
  animales: 'animales',
  colores: 'colores',
};

const MODELOS: Record<string, Record<string, any>> = {
  vocales: {
    Logo:{modelo:require('../../assets/vocales/Logo_Háblame_LSMM.glb'),tarjeta: require('../../assets/vocales/Logo_Háblame_LSMM.png')},
    A: { modelo: require('../../assets/vocales/LSM_Vocal_A.glb'), tarjeta: require('../../assets/vocales/LSM_Tarjeta_A.png') },
    E: { modelo: require('../../assets/vocales/LSM_Vocal_E.glb'), tarjeta: require('../../assets/vocales/LSM_Tarjeta_E.png') },
    I: { modelo: require('../../assets/vocales/LSM_Vocal_I.glb'), tarjeta: require('../../assets/vocales/LSM_Tarjeta_I.png') },
    O: { modelo: require('../../assets/vocales/LSM_Vocal_O.glb'), tarjeta: require('../../assets/vocales/LSM_Tarjeta_O.png') },
    U: { modelo: require('../../assets/vocales/LSM_Vocal_U.glb'), tarjeta: require('../../assets/vocales/LSM_Tarjeta_U.png') },
  },
};

Object.entries(MODELOS).forEach(([categoria, señas]) => {
  const targets: Record<string, any> = {};
  Object.entries(señas).forEach(([seña, assets]) => {
    targets[`target_${categoria}_${seña}`] = {
      source: assets.tarjeta,
      orientation: 'Up',
      physicalWidth: 0.1,
    };
  });
  ViroARTrackingTargets.createTargets(targets);
});

// Acumulador para los 3 ejes — nunca pierde clicks
const rotacionPendiente = { x: 0, y: 0, z: 0 };

const ARScene = ({ categoria, seña }: { categoria: string; seña: string }) => {
  const assets = MODELOS[categoria]?.[seña];
  const [rotacion, setRotacion] = useState<[number, number, number]>([90, 180, -90]);

  useEffect(() => {
    rotacionPendiente.x = 0;
    rotacionPendiente.y = 0;
    rotacionPendiente.z = 0;

    const intervalo = setInterval(() => {
      const dx = rotacionPendiente.x;
      const dy = rotacionPendiente.y;
      const dz = rotacionPendiente.z;
      if (dx !== 0 || dy !== 0 || dz !== 0) {
        rotacionPendiente.x = 0;
        rotacionPendiente.y = 0;
        rotacionPendiente.z = 0;
        setRotacion(prev => [prev[0] + dx, prev[1] + dy, prev[2] + dz]);
      }
    }, 50);

    return () => {
      clearInterval(intervalo);
      rotacionPendiente.x = 0;
      rotacionPendiente.y = 0;
      rotacionPendiente.z = 0;
    };
  }, []);

  if (!assets) return <ViroARScene />;

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={300} />
      <ViroDirectionalLight color="#ffffff" direction={[0, -1, -0.2]} />
      <ViroARImageMarker
        target={`target_${categoria}_${seña}`}
        onAnchorFound={() => console.log(`Tarjeta ${seña} detectada`)}
        onAnchorRemoved={() => console.log(`Tarjeta ${seña} perdida`)}
      >
        <ViroNode
          position={[0.02, -0.05, 0]}
          rotation={rotacion}
          onRotate={(rotateState: number, rotationFactor: number) => {
            if (rotateState === 2) {
              setRotacion(prev => [prev[0], prev[1] + rotationFactor * 180, prev[2]]);
            }
          }}
        >
          <Viro3DObject
            source={assets.modelo}
            type="GLB"
            scale={[0.03, 0.03, 0.03]}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            onLoadEnd={() => console.log(`Modelo ${seña} cargado`)}
            onError={(e: any) => {
              try {
                console.log(`Error:`, JSON.stringify(e));
              } catch (_) {
                console.log(`Error (no serializable):`, e?.message ?? String(e));
              }
            }}
          />
        </ViroNode>
      </ViroARImageMarker>
    </ViroARScene>
  );
};

export default function CameraScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { mode, seña } = route.params;
  const categoria = MAPA_MODOS[mode] ?? mode;
  const [hasPermission, setHasPermission] = useState(false);
  const intervaloBtnRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const iniciarRotacion = (eje: 'x' | 'y' | 'z', grados: number) => {
    rotacionPendiente[eje] += grados;
    intervaloBtnRef.current = setInterval(() => {
      rotacionPendiente[eje] += grados;
    }, 150);
  };

  const detenerRotacion = () => {
    if (intervaloBtnRef.current) {
      clearInterval(intervaloBtnRef.current);
      intervaloBtnRef.current = null;
    }
  };

  useEffect(() => { return () => detenerRotacion(); }, []);

  useEffect(() => {
    async function requestCameraPermission() {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Permiso de Cámara',
              message: 'Necesitamos usar tu cámara para la Realidad Aumentada.',
              buttonNeutral: 'Preguntar luego',
              buttonNegative: 'Cancelar',
              buttonPositive: 'Aceptar',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setHasPermission(true);
          } else {
            Alert.alert('Permiso denegado', 'No podemos abrir la cámara sin tu permiso.');
            navigation.goBack();
          }
        } catch (err) { console.warn(err); }
      } else {
        setHasPermission(true);
      }
    }
    requestCameraPermission();
  }, []);

    const SceneActual = useMemo(
  () => {
    const Scene = () => <ARScene categoria={categoria} seña={seña} />;
      Scene.displayName = 'SceneActual';
      return Scene;
    },
    [categoria, seña]
  );


  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Iniciando cámara...</Text>
        </View>
        <View style={styles.fallbackView}>
          <Text style={styles.fallbackText}>Acepta el permiso de cámara para continuar.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seña: {seña}</Text>
      </View>

      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{ scene: SceneActual }}
        style={styles.arView}
      />

      <View style={styles.controles}>
        <Text style={styles.instruccion}>Mantén presionado para girar la cámara</Text>

        {/* Horizontal (Y) — Azul */}
        <View style={styles.grupoFila}>
          <Text style={styles.etiqueta}>↔ Horizontal</Text>
          <View style={styles.fila}>
            <TouchableOpacity style={[styles.btn, styles.btnAzul]}
              onPressIn={() => iniciarRotacion('y', -45)} onPressOut={detenerRotacion}>
              <Text style={styles.btnTexto}>↺</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnAzul]}
              onPressIn={() => iniciarRotacion('y', 45)} onPressOut={detenerRotacion}>
              <Text style={styles.btnTexto}>↻</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Vertical (X) — Rojo */}
        <View style={styles.grupoFila}>
          <Text style={styles.etiqueta}>↕ Vertical</Text>
          <View style={styles.fila}>
            <TouchableOpacity style={[styles.btn, styles.btnRojo]}
              onPressIn={() => iniciarRotacion('x', -45)} onPressOut={detenerRotacion}>
              <Text style={styles.btnTexto}>↑</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnRojo]}
              onPressIn={() => iniciarRotacion('x', 45)} onPressOut={detenerRotacion}>
              <Text style={styles.btnTexto}>↓</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lateral (Z) — Verde */}
        <View style={styles.grupoFila}>
          <Text style={styles.etiqueta}>⟲ Lateral</Text>
          <View style={styles.fila}>
            <TouchableOpacity style={[styles.btn, styles.btnVerde]}
              onPressIn={() => iniciarRotacion('z', -45)} onPressOut={detenerRotacion}>
              <Text style={styles.btnTexto}>↰</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnVerde]}
              onPressIn={() => iniciarRotacion('z', 45)} onPressOut={detenerRotacion}>
              <Text style={styles.btnTexto}>↱</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)', zIndex: 10,
  },
  backButton: { padding: 10, backgroundColor: '#3b82f6', borderRadius: 8 },
  backText: { color: 'white', fontWeight: 'bold' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 20 },
  arView: { flex: 1 },
  controles: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 6,
  },
  instruccion: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    marginBottom: 4,
  },
  grupoFila: {
    alignItems: 'center',
    gap: 4,
  },
  etiqueta: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '600',
  },
  fila: {
    flexDirection: 'row',
    gap: 20,
  },
  btn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  btnAzul: { backgroundColor: 'rgba(59, 130, 246, 0.9)' },
  btnRojo: { backgroundColor: 'rgba(239, 68, 68, 0.9)' },
  btnVerde: { backgroundColor: 'rgba(34, 197, 94, 0.9)' },
  btnTexto: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  fallbackView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fallbackText: { color: 'white', fontSize: 16 },
});