import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Navigation from './src/Navigation';

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
  const [userProfile, setUserProfile] = useState<UserProfile>({
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

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <>
      <Navigation
        userProfile={userProfile}
        updateUserProfile={updateUserProfile}
      />
      <StatusBar style="light" />
    </>
  );
}