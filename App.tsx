import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native'; // <--- Faltaba este import
import { StatusBar } from 'expo-status-bar';

// Importamos la navegación y el Login
import Navigation from './src/Navigation';
import Login from './src/screens/Login';

// --- DEFINICIÓN DE TIPOS (Importante para que no de error en otros archivos) ---
export interface UserStats {
  currentLevel: number;
  levelsCompleted: number[];
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  streakDays: number;
}

export interface UserProfile {
  nickname: string;
  profileImage: number; 
  stats: UserStats;
}

export default function App() {
  // 1. Estado para guardar el perfil del usuario
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // 2. Función para actualizar el perfil (se la pasamos a Navigation -> Perfil)
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, ...updates });
    }
  };

  // 3. Función para simular el Login
  const handleLogin = () => {
    // Creamos un usuario de prueba al entrar
    setUserProfile({
      nickname: 'Estudiante',
      profileImage: 0,
      stats: {
        currentLevel: 1,
        levelsCompleted: [],
        totalCorrectAnswers: 0,
        totalWrongAnswers: 0,
        streakDays: 1,
      },
    });
  };

  // --- RENDERIZADO ---

  // Si NO hay usuario, mostramos Login
  if (!userProfile) {
    return <Login onLogin={handleLogin} />;
  }

  // Si SÍ hay usuario, mostramos la App con Navegación
  return (
    <SafeAreaView style={styles.container}>
      <Navigation 
        userProfile={userProfile} 
        updateUserProfile={updateUserProfile} 
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Fondo oscuro para que coincida con la app
  },
});