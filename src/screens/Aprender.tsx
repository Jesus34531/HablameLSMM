import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const iconoVocales  = require('../../assets/iconos/vocales.png');
const iconoColores  = require('../../assets/iconos/colores.png');
const iconoAnimales = require('../../assets/iconos/animales.png');
const iconoDias     = require('../../assets/iconos/dias.png');
const iconoSaludos  = require('../../assets/iconos/saludos.png');

// Tipo para cada categoría.
// "destino" indica si va a SelectorSeñas (AR genérico) o a AprendizajeSaludos (AR de saludos).
type Categoria = {
  id: string;
  customIcon: ImageSourcePropType;
  colors: [string, string];
  titulo: string;
  descripcion: string;
  destino: 'SelectorSeñas' | 'AprendizajeSaludos';
};

export default function Vocabulario() {
  const navigation = useNavigation<NavigationProp>();

  const categorias: Categoria[] = [
    {
      id: 'vocales',
      customIcon: iconoVocales,
      colors: ['#0ea5e9', '#0369a1'],
      titulo: 'VOCALES',
      descripcion: 'Escanea las tarjetas del abecedario para ver las señas de cada vocal en 3D',
      destino: 'SelectorSeñas',
    },
    {
      id: 'colores',
      customIcon: iconoColores,
      colors: ['#06b6d4', '#0e7490'],
      titulo: 'COLORES',
      descripcion: 'Apunta tu cámara a las tarjetas de colores para aprender sus señas',
      destino: 'SelectorSeñas',
    },
    {
      id: 'animales',
      customIcon: iconoAnimales,
      colors: ['#a855f7', '#0284c7'],
      titulo: 'ANIMALES',
      descripcion: 'Descubre cómo se representan los animales en lenguaje de señas',
      destino: 'SelectorSeñas',
    },
    {
      id: 'diasSemana',
      customIcon: iconoDias,
      colors: ['#f59e0b', '#b45309'],
      titulo: 'DÍAS DE LA SEMANA',
      descripcion: 'Aprende cómo se dicen los días de la semana en lenguaje de señas',
      destino: 'SelectorSeñas',
    },
    {
      id: 'saludos',
      customIcon: iconoSaludos,
      colors: ['#10b981', '#065f46'],
      titulo: 'SALUDOS',
      descripcion: 'Practica los saludos más comunes en lenguaje de señas mexicana',
      destino: 'AprendizajeSaludos', // ← conecta con la pantalla AR de saludos
    },
  ];

  const handlePress = (item: Categoria) => {
    if (item.destino === 'AprendizajeSaludos') {
      navigation.navigate('AprendizajeSaludos');
    } else {
      navigation.navigate('SelectorSeñas', { mode: item.id });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <BookOpen color="#22d3ee" size={40} style={{ marginBottom: 10 }} />
        <Text style={styles.title}>Vocabulario</Text>
        <Text style={styles.subtitle}>Usa la realidad aumentada para aprender señas</Text>
      </View>

      <View style={styles.listContainer}>
        {categorias.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.75}
            onPress={() => handlePress(item)}
          >
            <LinearGradient
              colors={['rgba(51,65,85,0.6)', 'rgba(30,41,59,0.8)']}
              style={styles.card}
            >
              <View style={styles.cardContent}>

                <LinearGradient
                  colors={item.colors}
                  style={styles.iconBox}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Image
                    source={item.customIcon}
                    style={styles.customIcon}
                    resizeMode="contain"
                  />
                </LinearGradient>

                <View style={styles.infoColumn}>
                  <Text style={styles.cardTitle}>{item.titulo}</Text>
                  <Text style={styles.cardDescription}>{item.descripcion}</Text>

                  <View style={styles.tapHint}>
                    <LinearGradient
                      colors={item.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.tapBar}
                    />
                    <Text style={[styles.tapText, { color: item.colors[0] }]}>
                      Toca para ver señas →
                    </Text>
                  </View>
                </View>

              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
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
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
  },
  listContainer: {
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  iconBox: {
    width: 88,
    height: 88,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    flexShrink: 0,
  },
  customIcon: {
    width: 60,
    height: 60,
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  cardTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  cardDescription: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  tapBar: {
    width: 4,
    height: 14,
    borderRadius: 2,
  },
  tapText: {
    fontSize: 12,
    fontWeight: '600',
  },
});