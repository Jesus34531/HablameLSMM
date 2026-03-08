import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Type, Palette, Squirrel,BookOpen } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Vocabulario() {
  const navigation = useNavigation<NavigationProp>();

  const categorias = [
    {
      id: 'letras',
      icon: Type,
      colors: ['#3b82f6', '#2563eb'] as [string, string],
      descripcion: 'Escanea las tarjetas del abecedario para ver las señas de cada letra en 3D',
    },
    {
      id: 'colores',
      icon: Palette,
      colors: ['#06b6d4', '#0891b2'] as [string, string],
      descripcion: 'Apunta tu cámara a las tarjetas de colores para aprender sus señas',
    },
    {
      id: 'animales',
      icon: Squirrel,
      colors: ['#0ea5e9', '#0284c7'] as [string, string],
      descripcion: 'Descubre cómo se representan los animales en lenguaje de señas',
    },
  ];

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
        {categorias.map((item) => {
          const Icon = item.icon;
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardContent}>
                <LinearGradient
                  colors={item.colors}
                  style={styles.iconBox}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon color="white" size={32} />
                </LinearGradient>

                <View style={styles.infoColumn}>
                  <View>
                    <Text style={styles.cardTitle}>{item.id.toUpperCase()}</Text>
                    <Text style={styles.cardDescription}>{item.descripcion}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('SelectorSeñas', { mode: item.id })}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={item.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>Ver Señas →</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  contentContainer: { padding: 16, paddingBottom: 40 },
  headerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
  listContainer: { gap: 16 },
  card: {
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    elevation: 4,
  },
  cardContent: { flexDirection: 'row', gap: 16 },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  infoColumn: { flex: 1, justifyContent: 'space-between' },
  cardTitle: { color: 'white', fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
  cardDescription: { color: '#cbd5e1', fontSize: 13, marginBottom: 12, lineHeight: 18 },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 14 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 14 },
});