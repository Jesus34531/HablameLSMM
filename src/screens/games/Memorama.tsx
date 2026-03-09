import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, Platform, StatusBar, Modal } from 'react-native';
import { CheckCircle, RotateCcw, Trophy, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const LEVEL_CONFIG = {
  1: { pairs: 3, columns: 2 },
  2: { pairs: 6, columns: 3 },
  3: { pairs: 10, columns: 4 },
  4: { pairs: 13, columns: 4 },
  5: { pairs: 16, columns: 4 },
};

const ALL_PAIRS = [
  { id: 1, name: 'Caracol', img: require('../../../assets/Animales_Memorama/Caracol.png'), sena: require('../../../assets/Animales_Memorama/Caracol_seña.png') },
  { id: 2, name: 'Cisne', img: require('../../../assets/Animales_Memorama/Cisne.png'), sena: require('../../../assets/Animales_Memorama/Cisne_seña.png') },
  { id: 3, name: 'Cochino', img: require('../../../assets/Animales_Memorama/Cerdo.png'), sena: require('../../../assets/Animales_Memorama/Cerdo_seña.png') },
  { id: 4, name: 'Tortuga', img: require('../../../assets/Animales_Memorama/Tortuga.png'), sena: require('../../../assets/Animales_Memorama/Tortuga_seña.png') },
  { id: 5, name: 'Jirafa', img: require('../../../assets/Animales_Memorama/Jirafa.png'), sena: require('../../../assets/Animales_Memorama/Jirafa_seña.png') },
  { id: 6, name: 'Perro', img: require('../../../assets/Animales_Memorama/Perro.png'), sena: require('../../../assets/Animales_Memorama/Perro_seña.png') },
  { id: 7, name: 'Pez', img: require('../../../assets/Animales_Memorama/Pez.png'), sena: require('../../../assets/Animales_Memorama/Pez_seña.png') },
  { id: 8, name: 'Tiburon', img: require('../../../assets/Animales_Memorama/Tiburon.png'), sena: require('../../../assets/Animales_Memorama/Tiburon_seña.png') },
  { id: 9, name: 'Vaca', img: require('../../../assets/Animales_Memorama/Vaca.png'), sena: require('../../../assets/Animales_Memorama/Vaca_seña.png') },
  { id: 10, name: 'Rana', img: require('../../../assets/Animales_Memorama/Rana.png'), sena: require('../../../assets/Animales_Memorama/Rana_seña.png') },
  { id: 11, name: 'Pollo', img: require('../../../assets/Animales_Memorama/Pollo.png'), sena: require('../../../assets/Animales_Memorama/Pollo_seña.png') },
  { id: 12, name: 'Mariposa', img: require('../../../assets/Animales_Memorama/Mariposa.png'), sena: require('../../../assets/Animales_Memorama/Mariposa_seña.png') },
  { id: 13, name: 'Leon', img: require('../../../assets/Animales_Memorama/Leon.png'), sena: require('../../../assets/Animales_Memorama/Leon_seña.png') },
  { id: 14, name: 'Gato', img: require('../../../assets/Animales_Memorama/Gato.png'), sena: require('../../../assets/Animales_Memorama/Gato_seña.png') },
  { id: 15, name: 'Elefante', img: require('../../../assets/Animales_Memorama/Elefante.png'), sena: require('../../../assets/Animales_Memorama/Elefante_seña.png') },
  { id: 16, name: 'Almeja', img: require('../../../assets/Animales_Memorama/Almeja.png'), sena: require('../../../assets/Animales_Memorama/Almeja_seña.png') },
];

interface Card {
  instanceId: string;
  content: any;
  pairId: number;
  type: 'animal' | 'seña';
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Memorama() {
  const navigation = useNavigation();
  const [level, setLevel] = useState<number | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [showWinModal, setShowWinModal] = useState(false);

  const setupGame = (selectedLevel: number) => {
    const config = LEVEL_CONFIG[selectedLevel as keyof typeof LEVEL_CONFIG];
    const selectedAnimals = ALL_PAIRS.slice(0, config.pairs);
    
    let deck: Card[] = [];
    selectedAnimals.forEach(animal => {
      deck.push({ instanceId: `img-${animal.id}`, content: animal.img, pairId: animal.id, type: 'animal' });
      deck.push({ instanceId: `sena-${animal.id}`, content: animal.sena, pairId: animal.id, type: 'seña' });
    });

    setCards(deck.sort(() => Math.random() - 0.5));
    setMatched([]);
    setFlipped([]);
    setLevel(selectedLevel);
    setShowWinModal(false);
  };

  const handleCardPress = (instanceId: string, pairId: number) => {
    if (flipped.length === 2 || flipped.includes(instanceId) || matched.includes(pairId)) return;

    const newFlipped = [...flipped, instanceId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const firstCard = cards.find(c => c.instanceId === newFlipped[0]);
      const secondCard = cards.find(c => c.instanceId === instanceId);

      if (firstCard?.pairId === secondCard?.pairId) {
        const newMatched = [...matched, pairId];
        setMatched(newMatched);
        setFlipped([]);
        
        // Verificar si ganó
        if (newMatched.length === LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG].pairs) {
          setTimeout(() => setShowWinModal(true), 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 800); // Un poco más rápido que antes
      }
    }
  };

  if (!level) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Salir</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Trophy color="#f59e0b" size={60} style={{ marginBottom: 10 }} />
          <Text style={styles.title}>Memorama Animales</Text>
          <Text style={styles.subtitle}>Selecciona un nivel para comenzar</Text>
          <View style={styles.levelGrid}>
            {[1, 2, 3, 4, 5].map((lvl) => (
              <TouchableOpacity key={lvl} style={styles.levelButton} onPress={() => setupGame(lvl)}>
                <Text style={styles.levelButtonText}>Nivel {lvl}</Text>
                <Text style={styles.levelSubtext}>{LEVEL_CONFIG[lvl as keyof typeof LEVEL_CONFIG].pairs} Parejas</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }

  const currentConfig = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];
  const cardSize = (SCREEN_WIDTH - 60) / currentConfig.columns;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => setLevel(null)} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.levelIndicator}>Nivel {level}</Text>
        <TouchableOpacity onPress={() => setupGame(level)} style={styles.backButton}>
          <RotateCcw color="white" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.gameContent}>
        <View style={styles.grid}>
          {cards.map((card) => {
            const isFlipped = flipped.includes(card.instanceId) || matched.includes(card.pairId);
            const isMatched = matched.includes(card.pairId);
            const cardBackStyle = card.type === 'animal' ? styles.cardBackRed : styles.cardBackBlue;

            return (
              <TouchableOpacity
                key={card.instanceId}
                onPress={() => handleCardPress(card.instanceId, card.pairId)}
                activeOpacity={0.8}
                style={[
                  styles.card,
                  { width: cardSize, height: cardSize },
                  isFlipped ? styles.cardFlipped : cardBackStyle,
                  isMatched && styles.cardMatched
                ]}
              >
                {isFlipped ? (
                  <View style={styles.cardContent}>
                    <Image 
                        source={card.content} 
                        style={styles.cardImage} 
                        resizeMode="contain"
                        fadeDuration={0} // Elimina el lag de aparición de imagen
                    />
                  </View>
                ) : (
                  <Text style={styles.cardTypeText}>
                    {card.type === 'animal' ? 'Animal' : 'Seña'}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* VENTANA FLOTANTE (MODAL) DE VICTORIA */}
      <Modal
        visible={showWinModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
               <Trophy color="#f59e0b" size={80} />
            </View>
            <Text style={styles.modalTitle}>¡Excelente Trabajo!</Text>
            <Text style={styles.modalSubtitle}>Has completado todas las parejas del Nivel {level}.</Text>
            
            <TouchableOpacity 
              style={styles.modalNextButton} 
              onPress={() => setLevel(null)}
            >
              <Text style={styles.modalNextButtonText}>Elegir otro Nivel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalRetryButton} 
              onPress={() => setupGame(level)}
            >
              <RotateCcw color="#3b82f6" size={20} />
              <Text style={styles.modalRetryText}>Repetir Nivel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  centerContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, marginTop: 20 },
  levelIndicator: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { color: '#94a3b8', fontSize: 14, marginBottom: 30 },
  levelGrid: { width: '100%', gap: 12 },
  levelButton: { 
    backgroundColor: '#1e293b', 
    padding: 18, 
    borderRadius: 15, 
    borderWidth: 1, 
    borderColor: '#334155',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  backText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  backButton: {
    marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 40,
    padding: 10, backgroundColor: '#3b82f6', borderRadius: 8 
  },
  levelButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  levelSubtext: { color: '#22d3ee', fontSize: 14, fontWeight: '600' },
  gameContent: { padding: 10, paddingBottom: 60 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  
  // ESTILOS DE CARTAS
  card: { borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  cardBackRed: { backgroundColor: '#7f1d1d', borderColor: '#ef4444' },
  cardBackBlue: { backgroundColor: '#1e3a8a', borderColor: '#3b82f6' },
  cardFlipped: { backgroundColor: 'white', borderColor: '#ffffff' },
  cardMatched: { backgroundColor: '#dcfce7', borderColor: '#22c55e', opacity: 0.6 },
  
  cardTypeText: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: 'bold', 
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  cardContent: { width: '100%', height: '100%', padding: 5, justifyContent: 'center', alignItems: 'center' },
  cardImage: { width: '90%', height: '90%' },

  // ESTILOS DEL MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#1e293b',
    width: '100%',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  modalIconContainer: {
    marginBottom: 20,
    backgroundColor: '#334155',
    padding: 20,
    borderRadius: 100
  },
  modalTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalSubtitle: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30
  },
  modalNextButton: {
    backgroundColor: '#4ade80',
    width: '100%',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15
  },
  modalNextButtonText: {
    color: '#064e3b',
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalRetryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10
  },
  modalRetryText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600'
  },
  header: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
  },
});