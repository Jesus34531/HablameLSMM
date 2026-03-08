import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, AlertCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// 1. Configuración de Niveles
const LEVEL_CONFIG: Record<number, number> = {
  1: 3, 2: 5, 3: 8, 4: 10, 5: 14, 6: 17, 7: 21 // 7 es el nivel Extra Difícil
};

// 2. Definición del Abecedario (27 letras)
const ALPHABET = [
  { id: 'A', img: require('../../../assets/Alfabeto_LSM/A.png') },
  { id: 'B', img: require('../../../assets/Alfabeto_LSM/B.png') },
  { id: 'C', img: require('../../../assets/Alfabeto_LSM/C.png') },
  { id: 'D', img: require('../../../assets/Alfabeto_LSM/D.png') },
  { id: 'E', img: require('../../../assets/Alfabeto_LSM/E.png') },
  { id: 'F', img: require('../../../assets/Alfabeto_LSM/F.png') },
  { id: 'G', img: require('../../../assets/Alfabeto_LSM/G.png') },
  { id: 'H', img: require('../../../assets/Alfabeto_LSM/H.png') },
  { id: 'I', img: require('../../../assets/Alfabeto_LSM/I.png') },
  { id: 'J', img: require('../../../assets/Alfabeto_LSM/J.png') },
  { id: 'K', img: require('../../../assets/Alfabeto_LSM/K.png') },
  { id: 'L', img: require('../../../assets/Alfabeto_LSM/L.png') },
  { id: 'M', img: require('../../../assets/Alfabeto_LSM/M.png') },
  { id: 'N', img: require('../../../assets/Alfabeto_LSM/N.png') },
  { id: 'Ñ', img: require('../../../assets/Alfabeto_LSM/E_ne.png') }, // Evitar la ñ en el nombre de archivo
  { id: 'O', img: require('../../../assets/Alfabeto_LSM/O.png') },
  { id: 'P', img: require('../../../assets/Alfabeto_LSM/P.png') },
  { id: 'Q', img: require('../../../assets/Alfabeto_LSM/Q.png') },
  { id: 'R', img: require('../../../assets/Alfabeto_LSM/R.png') },
  { id: 'S', img: require('../../../assets/Alfabeto_LSM/S.png') },
  { id: 'T', img: require('../../../assets/Alfabeto_LSM/T.png') },
  { id: 'U', img: require('../../../assets/Alfabeto_LSM/U.png') },
  { id: 'V', img: require('../../../assets/Alfabeto_LSM/V.png') },
  { id: 'W', img: require('../../../assets/Alfabeto_LSM/W.png') },
  { id: 'X', img: require('../../../assets/Alfabeto_LSM/X.png') },
  { id: 'Y', img: require('../../../assets/Alfabeto_LSM/Y.png') },
  { id: 'Z', img: require('../../../assets/Alfabeto_LSM/Z.png') },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Adivina() {
  const navigation = useNavigation();
  
  // Estados de Juego
  const [level, setLevel] = useState<number | null>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Iniciar nivel
  const startLevel = (selectedLevel: number) => {
    const numQuestions = LEVEL_CONFIG[selectedLevel];
    const shuffled = [...ALPHABET].sort(() => Math.random() - 0.5).slice(0, numQuestions);
    setQueue(shuffled);
    setLevel(selectedLevel);
    setScore(0);
    setIsGameOver(false);
    prepareQuestion(shuffled[0]);
  };

  // Preparar opciones aleatorias
  const prepareQuestion = (correctItem: any) => {
    if (!correctItem) return;
    
    // Obtener 2 distractores que no sean la correcta
    const distractors = ALPHABET
      .filter(item => item.id !== correctItem.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(item => item.id);
    
    const options = [...distractors, correctItem.id].sort(() => Math.random() - 0.5);
    setCurrentOptions(options);
    setTimeLeft(5);
    setShowFeedback(false);
    setSelectedId(null);
    startTimer();
  };

  // Lógica del Cronómetro
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeout = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedId('TIMEOUT'); // Marca especial para saber que no eligió nada
    setShowFeedback(true);
  };

  const handleAnswer = (id: string) => {
    if (showFeedback) return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    setSelectedId(id);
    setShowFeedback(true);
    
    if (id === queue[0].id) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    const wasCorrect = selectedId === queue[0].id;
    let newQueue = [...queue];

    if (wasCorrect) {
      newQueue.shift(); // Elimina si acertó
    } else {
      // Si falló o fue timeout, se va al final de la cola
      const failedItem = newQueue.shift();
      newQueue.push(failedItem);
    }

    if (newQueue.length === 0) {
      setIsGameOver(true);
    } else {
      setQueue(newQueue);
      prepareQuestion(newQueue[0]);
    }
  };

  // Renderizador de Selección de Nivel
  if (level === null) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.background} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonTop}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <View style={styles.menuContainer}>
          <Trophy color="#f59e0b" size={60} />
          <Text style={styles.menuTitle}>Adivina la Seña</Text>
          <Text style={styles.menuSubtitle}>Elige tu desafío de LSM</Text>
          <View style={styles.levelList}>
            {[1, 2, 3, 4, 5, 6, 7].map((lvl) => (
              <TouchableOpacity key={lvl} style={styles.levelCard} onPress={() => startLevel(lvl)}>
                <Text style={styles.levelCardText}>{lvl === 7 ? 'Nivel Extra' : `Nivel ${lvl}`}</Text>
                <Text style={styles.levelCardSub}>{LEVEL_CONFIG[lvl]} señas</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }

  // Pantalla de Fin de Juego
  if (isGameOver) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Trophy color="#4ade80" size={100} />
          <Text style={styles.winTitle}>¡Excelente trabajo!</Text>
          <Text style={styles.winText}>Completaste el Nivel {level}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={() => setLevel(null)}>
            <Text style={styles.restartButtonText}>Volver al menú</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentQuestion = queue[0];

  return (
    <View style={styles.container}>
      <View style={styles.gameHeader}>
        <TouchableOpacity onPress={() => setLevel(null)}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <View style={styles.timerContainer}>
          <Clock color={timeLeft <= 2 ? '#ef4444' : '#22d3ee'} size={20} />
          <Text style={[styles.timerText, timeLeft <= 2 && {color: '#ef4444'}]}>{timeLeft}s</Text>
        </View>
        <Text style={styles.scoreText}>{score} / {LEVEL_CONFIG[level]}</Text>
      </View>

      <View style={styles.cardContainer}>
        <LinearGradient colors={['#1e293b', '#334155']} style={styles.imageCard}>
          {currentQuestion && (
            <Image source={currentQuestion.img} style={styles.signImage} resizeMode="contain" />
          )}
        </LinearGradient>
      </View>

      <Text style={styles.instruction}>¿Qué letra es esta?</Text>

      <View style={styles.optionsContainer}>
        {currentOptions.map((optId) => {
          const isCorrect = optId === currentQuestion.id;
          const isSelected = selectedId === optId;
          
          let btnStyle: any = styles.optionBtn;
          if (showFeedback) {
            if (isCorrect) btnStyle = [styles.optionBtn, styles.correctBtn];
            else if (isSelected) btnStyle = [styles.optionBtn, styles.wrongBtn];
            else btnStyle = [styles.optionBtn, { opacity: 0.5 }];
          }

          return (
            <TouchableOpacity 
              key={optId} 
              style={btnStyle} 
              onPress={() => handleAnswer(optId)}
              disabled={showFeedback}
            >
              <Text style={styles.optionText}>{optId}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {showFeedback && (
        <View style={styles.feedbackArea}>
          <View style={styles.feedbackInfo}>
            {selectedId === currentQuestion.id ? (
              <><CheckCircle color="#4ade80" /> <Text style={styles.correctText}>¡Bien hecho!</Text></>
            ) : (
              <><XCircle color="#ef4444" /> <Text style={styles.wrongText}>Era la letra {currentQuestion.id}</Text></>
            )}
          </View>
          <TouchableOpacity style={styles.nextBtn} onPress={nextQuestion}>
            <Text style={styles.nextBtnText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  background: { position: 'absolute', inset: 0 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  backButtonTop: { marginTop: 50, marginLeft: 20 },
  menuContainer: { flex: 1, alignItems: 'center', padding: 20 },
  menuTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 10 },
  menuSubtitle: { color: '#94a3b8', fontSize: 16, marginBottom: 20 },
  levelList: { width: '100%', gap: 10 },
  levelCard: { 
    backgroundColor: '#1e293b', 
    padding: 15, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#334155'
  },
  levelCardText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  levelCardSub: { color: '#22d3ee' },
  gameHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 25, marginTop: 30, alignItems: 'center' },
  timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#1e293b', padding: 8, borderRadius: 20 },
  timerText: { color: '#22d3ee', fontWeight: 'bold', fontSize: 18, minWidth: 30 },
  scoreText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cardContainer: { alignItems: 'center', marginVertical: 20 },
  imageCard: { width: SCREEN_WIDTH * 0.8, height: SCREEN_WIDTH * 0.8, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 10 },
  signImage: { width: '80%', height: '80%' },
  instruction: { color: 'white', fontSize: 22, textAlign: 'center', fontWeight: 'bold', marginBottom: 20 },
  optionsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 15, paddingHorizontal: 20 },
  optionBtn: { backgroundColor: '#1e293b', width: 80, height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#334155' },
  optionText: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  correctBtn: { backgroundColor: '#064e3b', borderColor: '#4ade80' },
  wrongBtn: { backgroundColor: '#451a1a', borderColor: '#ef4444' },
  feedbackArea: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center', gap: 15 },
  feedbackInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  correctText: { color: '#4ade80', fontSize: 20, fontWeight: 'bold' },
  wrongText: { color: '#ef4444', fontSize: 20, fontWeight: 'bold' },
  nextBtn: { backgroundColor: '#22d3ee', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
  nextBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 16 },
  winTitle: { color: 'white', fontSize: 32, fontWeight: 'bold', marginTop: 20 },
  winText: { color: '#94a3b8', fontSize: 18, marginBottom: 30 },
  restartButton: { backgroundColor: '#4ade80', padding: 15, borderRadius: 15 },
  restartButtonText: { fontWeight: 'bold', color: '#064e3b' }
});