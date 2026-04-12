import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Definimos la estructura para tener un tipado correcto
interface GameType {
  id: string;
  title: string;
  description: string;
  icon: ImageSourcePropType;
  colors: readonly [string, string];
}

export default function Juegos() {
  const navigation = useNavigation<NavigationProp>();

  const games: GameType[] = [
    {
      id: 'GameRompecabezasDias',
      title: 'Rompecabezas Colores',
      description: 'Arma el rompecabezas del color que elijas',
      // REEMPLAZA CON EL NOMBRE REAL DE TU ARCHIVO
      icon: require('../../assets/iconos/rompecabeza.png'), 
      colors: ['#0ea5e9', '#0369a1'] as const,
    },
    {
      id: 'GameMemorama',
      title: 'Memorama Animales',
      description: 'Desafía tu mente con 5 niveles de dificultad progresiva.',
      // REEMPLAZA CON EL NOMBRE REAL DE TU ARCHIVO
      icon: require('../../assets/iconos/memorama.png'), 
      colors: ['#06b6d4', '#0e7490'] as const,
    },
    {
      id: 'GameAdivina',
      title: 'Adivina la Letra',
      description: 'Pon a prueba tu dominio del abecedario LSM',
      // REEMPLAZA CON EL NOMBRE REAL DE TU ARCHIVO
      icon: require('../../assets/iconos/adivinar.png'), 
      colors: ['#0369a1', '#a855f7'] as const,
    }
  ];

  const handlePlayGame = (screenName: string) => {
    // @ts-ignore
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.background} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Juegos</Text>
          <Text style={styles.subtitle}>Refuerza tu aprendizaje divirtiéndote</Text>
        </View>

        <View style={styles.gamesList}>
          {games.map((game) => {
            return (
              <TouchableOpacity
                key={game.id}
                activeOpacity={0.9}
                onPress={() => handlePlayGame(game.id)}
              >
                <LinearGradient
                  colors={game.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gameCard}
                >
                  <View style={styles.iconContainer}>
                    <Image 
                      source={game.icon} 
                      style={styles.iconImage}
                      resizeMode="contain" 
                    />
                  </View>
                  
                  <View style={styles.textContainer}>
                    <Text style={styles.gameTitle}>{game.title}</Text>
                    <Text style={styles.gameDescription}>{game.description}</Text>
                  </View>

                  <View style={styles.playButton}>
                    <Text style={styles.playText}>JUGAR</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#94a3b8' },
  gamesList: { gap: 20 },
  gameCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 15,
    marginRight: 15,
  },
  // ESTE ES EL COMPONENTE QUE DICTA EL TAMAÑO
  iconImage: {
    width: 60,  // <--- Aumenté de 32 a 48 para hacerlo más grande
    height: 60, // <--- Aumenté de 32 a 48 para hacerlo más grande
    // Se eliminó 'tintColor' para respetar los colores originales de la imagen
  },
  textContainer: { flex: 1 },
  gameTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  gameDescription: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  playButton: {
    backgroundColor: 'white',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 10,
  },
  playText: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' }
});