import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// IMPORTANTE: Usamos lucide-react-native, no lucide-react
import { Edit2, Trophy, Target, CheckCircle, XCircle, Mail, Calendar, Zap } from 'lucide-react-native';

import type { UserProfile } from '../../App'; 

interface PerfilProps {
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const avatarOptions = [
  '👦', '👧', '🧒', '👶', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '🧚‍♂️', '🧚‍♀️', '🤖', '👽'
];

export default function Perfil({ userProfile, updateUserProfile }: PerfilProps) {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [tempNickname, setTempNickname] = useState(userProfile.nickname);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleSaveNickname = () => {
    updateUserProfile({ nickname: tempNickname });
    setIsEditingNickname(false);
  };

  const handleSelectAvatar = (index: number) => {
    updateUserProfile({ profileImage: index });
    setShowAvatarPicker(false);
  };

  const totalQuestions = userProfile.stats.totalCorrectAnswers + userProfile.stats.totalWrongAnswers;
  const accuracy = totalQuestions > 0 
    ? Math.round((userProfile.stats.totalCorrectAnswers / totalQuestions) * 100)
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* --- TARJETA DE PERFIL --- */}
      <LinearGradient
        colors={['#1e3a8a', '#0ea5e9']}
        style={styles.profileCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity 
            onPress={() => setShowAvatarPicker(!showAvatarPicker)}
            activeOpacity={0.8}
            style={styles.avatarButton}
          >
            <LinearGradient
              colors={['#3b82f6', '#06b6d4']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarEmoji}>
                {avatarOptions[userProfile.profileImage] || '👤'}
              </Text>
            </LinearGradient>
            <View style={styles.editIconBadge}>
              <Edit2 size={12} color="#3b82f6" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Selector de Avatar (Desplegable) */}
        {showAvatarPicker && (
          <View style={styles.avatarPicker}>
            {avatarOptions.map((avatar, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectAvatar(index)}
                style={[
                  styles.avatarOption,
                  userProfile.profileImage === index && styles.avatarOptionSelected
                ]}
              >
                <Text style={styles.avatarOptionText}>{avatar}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Nickname */}
        <View style={styles.nicknameContainer}>
          {isEditingNickname ? (
            <View style={styles.editNicknameRow}>
              <TextInput
                value={tempNickname}
                onChangeText={setTempNickname}
                style={styles.input}
                maxLength={15}
                placeholderTextColor="#94a3b8"
              />
              <TouchableOpacity onPress={handleSaveNickname} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nicknameRow}>
              <Text style={styles.nicknameText}>{userProfile.nickname}</Text>
              <TouchableOpacity onPress={() => setIsEditingNickname(true)}>
                <Edit2 size={18} color="#67e8f9" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* --- ESTADÍSTICAS --- */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Trophy size={24} color="#facc15" />
          <Text style={styles.sectionTitle}>Estadísticas</Text>
        </View>

        <View style={styles.statsGrid}>
          {/* Nivel Actual */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Nivel Actual</Text>
            <Text style={[styles.statValue, { color: '#22d3ee' }]}>
              {userProfile.stats.currentLevel}
            </Text>
          </View>

          {/* Niveles Completados */}
          <View style={styles.statCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.statLabel}>Completados</Text>
              <Text style={[styles.statValue, { color: '#22d3ee', fontSize: 16 }]}>
                {userProfile.stats.levelsCompleted.length}/5
              </Text>
            </View>
            <View style={styles.levelDots}>
              {[1, 2, 3, 4, 5].map(level => (
                <View 
                  key={level} 
                  style={[
                    styles.levelDot, 
                    userProfile.stats.levelsCompleted.includes(level) ? styles.levelDotActive : styles.levelDotInactive
                  ]} 
                />
              ))}
            </View>
          </View>

          {/* Correctas */}
          <View style={[styles.statCard, styles.borderGreen]}>
            <View style={styles.rowStart}>
              <CheckCircle size={18} color="#4ade80" />
              <Text style={[styles.statLabel, { marginLeft: 6 }]}>Correctas</Text>
            </View>
            <Text style={[styles.statValue, { color: '#4ade80' }]}>
              {userProfile.stats.totalCorrectAnswers}
            </Text>
          </View>

          {/* Incorrectas */}
          <View style={[styles.statCard, styles.borderRed]}>
            <View style={styles.rowStart}>
              <XCircle size={18} color="#f87171" />
              <Text style={[styles.statLabel, { marginLeft: 6 }]}>Incorrectas</Text>
            </View>
            <Text style={[styles.statValue, { color: '#f87171' }]}>
              {userProfile.stats.totalWrongAnswers}
            </Text>
          </View>

          {/* Precisión */}
          <View style={[styles.statCard, styles.fullWidth]}>
            <View style={styles.rowBetween}>
              <View style={styles.rowStart}>
                <Target size={18} color="#c084fc" />
                <Text style={[styles.statLabel, { marginLeft: 6 }]}>Precisión</Text>
              </View>
              <Text style={[styles.statValue, { color: '#c084fc' }]}>{accuracy}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={['#a855f7', '#6366f1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${accuracy}%` }]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* --- INFORMACIÓN ADICIONAL --- */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Información</Text>
        <View style={styles.infoList}>
          <View style={styles.infoRow}>
            <Mail size={16} color="#94a3b8" />
            <Text style={styles.infoText}>estudiante@hablame.com</Text>
          </View>
          <View style={styles.infoRow}>
            <Calendar size={16} color="#94a3b8" />
            <Text style={styles.infoText}>Miembro desde: Ene 2026</Text>
          </View>
          <View style={styles.infoRow}>
            <Zap size={16} color="#eab308" />
            <Text style={styles.infoText}>Racha actual: {userProfile.stats.streakDays} días</Text>
          </View>
        </View>
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
    paddingBottom: 40,
  },
  profileCard: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarButton: {
    position: 'relative',
  },
  avatarGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff30',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 6,
    elevation: 4,
  },
  avatarPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#334155',
    padding: 10,
    borderRadius: 16,
    marginBottom: 16,
    gap: 8,
  },
  avatarOption: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#475569',
  },
  avatarOptionSelected: {
    backgroundColor: '#3b82f6',
    transform: [{ scale: 1.1 }],
  },
  avatarOptionText: {
    fontSize: 24,
  },
  nicknameContainer: {
    alignItems: 'center',
    minHeight: 40,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nicknameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  editNicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    backgroundColor: '#334155',
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#38bdf8',
    minWidth: 150,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#33415550',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#475569',
  },
  fullWidth: {
    minWidth: '100%',
  },
  borderGreen: {
    borderColor: 'rgba(74, 222, 128, 0.3)',
    backgroundColor: 'rgba(74, 222, 128, 0.05)',
  },
  borderRed: {
    borderColor: 'rgba(248, 113, 113, 0.3)',
    backgroundColor: 'rgba(248, 113, 113, 0.05)',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  levelDots: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  levelDot: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  levelDotActive: {
    backgroundColor: '#4ade80',
  },
  levelDotInactive: {
    backgroundColor: '#475569',
  },
  infoList: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
});