import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Lightbulb } from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av';

export default function Home() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [showVideo, setShowVideo] = useState(false);

  const consejos = [
    "Practica todos los días para mejorar tu memoria visual",
    "Las señas se hacen frente a ti, de manera clara y visible",
    "La expresión facial es muy importante en el lenguaje de señas",
    "Aprende primero las señas básicas antes de las complejas"
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >

      {/* --- SECCIÓN MASCOTA / LOGO --- */}
      <LinearGradient
        colors={['#60a5fa', '#22d3ee']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mascotContainer}
      >
        <View style={styles.mascotInner}>
          {/*
            ✅ FIX: Se reemplazó la etiqueta HTML <a> por un componente <Image> de React Native.
            La ruta require() busca el archivo desde la ubicación de ESTE archivo.
            Si Home.tsx está en app/ o app/(tabs)/, la ruta sería:
              - Si está en app/         → require('../../assets/Logo_Hablame_LSM.png')  (sube 2 niveles)
              - Si está en app/(tabs)/  → require('../../../assets/Logo_Hablame_LSM.png') (sube 3 niveles)
            Ajusta la cantidad de '../' según tu estructura de carpetas.
          */}
          <Image
            source={require('../../assets/Logo_Hablame_LSM.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>

      {/* --- SECCIÓN VIDEO TUTORIAL --- */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Play size={20} color="#22d3ee" />
          <Text style={styles.sectionTitle}>Video Tutorial</Text>
        </View>

        <View style={styles.videoBox}>
          {!showVideo ? (
            <TouchableOpacity
              style={styles.videoPlaceholder}
              onPress={() => setShowVideo(true)}
            >
              <Play size={48} color="#22d3ee" style={{ marginBottom: 8 }} />
              <Text style={styles.placeholderText}>Cómo usar la aplicación</Text>
              <Text style={styles.tapText}>(Toca para reproducir)</Text>
            </TouchableOpacity>
          ) : (
            // ⚠️ AVISO: expo-av Video funciona pero está deprecado en SDK 54.
            // Cuando estés listo, migralo a expo-video (ver comentario al final del archivo).
            <Video
              ref={videoRef}
              style={styles.videoPlayer}
              source={{
                uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
              }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              shouldPlay={true}
              onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
          )}
        </View>
      </View>

      {/* --- SECCIÓN CONSEJOS --- */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Lightbulb size={20} color="#facc15" />
          <Text style={styles.sectionTitle}>Consejos de Aprendizaje</Text>
        </View>

        <View style={styles.tipsList}>
          {consejos.map((consejo, index) => (
            <LinearGradient
              key={index}
              colors={['rgba(59, 130, 246, 0.2)', 'rgba(6, 182, 212, 0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.tipItem}
            >
              <Text style={styles.tipText}>{consejo}</Text>
            </LinearGradient>
          ))}
        </View>
      </View>

      <View style={{ height: 20 }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    padding: 16,
    gap: 24,
  },
  mascotContainer: {
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  mascotInner: {
    width: '100%',
    height: 192,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  logoImage: {
    width: '80%',
    height: '80%',
  },
  sectionContainer: {
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  videoBox: {
    width: '100%',
    height: 192,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#475569',
    overflow: 'hidden',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  tapText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  tipText: {
    color: 'white',
    fontSize: 14,
  }
});

/*
=======================================================
  MIGRACIÓN FUTURA: expo-av → expo-video (SDK 54+)
=======================================================
  Cuando quieras eliminar el warning de deprecación, instala expo-video:
    npx expo install expo-video

  Y reemplaza el componente <Video> con:

  import { VideoView, useVideoPlayer } from 'expo-video';

  // Dentro del componente:
  const player = useVideoPlayer(
    'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    p => { p.loop = true; p.play(); }
  );

  // En el JSX:
  <VideoView
    style={styles.videoPlayer}
    player={player}
    allowsFullscreen
    allowsPictureInPicture
  />
=======================================================
*/