import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DIAS_DATA = [
  { nombre: 'Lunes', img: require('../../../assets/Dias_LSM/lunes.png') },
  { nombre: 'Martes', img: require('../../../assets/Dias_LSM/martes.png') },
  { nombre: 'Miércoles', img: require('../../../assets/Dias_LSM/miercoles.png') },
  { nombre: 'Jueves', img: require('../../../assets/Dias_LSM/jueves.png') },
  { nombre: 'Viernes', img: require('../../../assets/Dias_LSM/viernes.png') },
  { nombre: 'Sábado', img: require('../../../assets/Dias_LSM/sabado.png') },
  { nombre: 'Domingo', img: require('../../../assets/Dias_LSM/domingo.png') },
];

export default function TriviaDias() {
  const navigation = useNavigation();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Generar opciones (la correcta + una aleatoria)
  const generateOptions = () => {
    const correct = DIAS_DATA[currentIdx];


    let wrong = DIAS_DATA[Math.floor(Math.random() * DIAS_DATA.length)];
    while (wrong.nombre === correct.nombre) {
      wrong = DIAS_DATA[Math.floor(Math.random() * DIAS_DATA.length)];
    }
    return [correct, wrong].sort(() => Math.random() - 0.5);
  };

  const [options, setOptions] = useState(generateOptions());

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedIdx(index);
    setShowResult(true);
    if (options[index].nombre === DIAS_DATA[currentIdx].nombre) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < DIAS_DATA.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setOptions([DIAS_DATA[nextIdx], DIAS_DATA[Math.floor(Math.random() * DIAS_DATA.length)]]
        .filter((v, i, a) => a.findIndex(t => t.nombre === v.nombre) === i) // Evitar duplicados si sale el mismo
        .sort(() => Math.random() - 0.5));
      setShowResult(false);
      setSelectedIdx(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.background} />
        <View style={styles.center}>
          <Text style={styles.finishTitle}>¡Trivia Terminada!</Text>
          <Text style={styles.scoreBig}>{score} / {DIAS_DATA.length}</Text>
          <TouchableOpacity style={styles.btnReset} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>Volver a Juegos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="white" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>Días en LSM</Text>
        <Text style={styles.scoreText}>{score} pts</Text>
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.questionLabel}>Selecciona la seña correcta para:</Text>
        <Text style={styles.dayName}>{DIAS_DATA[currentIdx].nombre}</Text>
      </View>

      <View style={styles.optionsRow}>
        {options.map((opt, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.optionCard,
              showResult && opt.nombre === DIAS_DATA[currentIdx].nombre && styles.correctCard,
              showResult && selectedIdx === index && opt.nombre !== DIAS_DATA[currentIdx].nombre && styles.wrongCard
            ]}
            onPress={() => handleAnswer(index)}
            disabled={showResult}
          >
            <Image source={opt.img} style={styles.signImg} resizeMode="contain" />
            {showResult && opt.nombre === DIAS_DATA[currentIdx].nombre && (
              <CheckCircle size={24} color="#4ade80" style={styles.iconPos} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {showResult && (
        <TouchableOpacity style={styles.btnNext} onPress={handleNext}>
          <Text style={styles.btnText}>Siguiente Día</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { position: 'absolute', inset: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, marginTop: 40 },
  title: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  scoreText: { color: '#22d3ee', fontSize: 18, fontWeight: 'bold' },
  questionBox: { alignItems: 'center', marginVertical: 30 },
  questionLabel: { color: '#94a3b8', fontSize: 16 },
  dayName: { color: '#f59e0b', fontSize: 40, fontWeight: 'black', textTransform: 'uppercase' },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 10 },
  optionCard: { 
    backgroundColor: '#1e293b', 
    width: width * 0.42, 
    height: width * 0.42, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155'
  },
  signImg: { width: '80%', height: '80%' },
  correctCard: { borderColor: '#4ade80', backgroundColor: '#064e3b' },
  wrongCard: { borderColor: '#ef4444', backgroundColor: '#451a1a' },
  iconPos: { position: 'absolute', top: 10, right: 10 },
  btnNext: { 
    backgroundColor: '#22d3ee', 
    margin: 40, 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center' 
  },
  btnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  finishTitle: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  scoreBig: { color: '#f59e0b', fontSize: 60, fontWeight: 'bold', marginVertical: 20 },
  btnReset: { backgroundColor: '#4ade80', padding: 15, borderRadius: 10 }
});