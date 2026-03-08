import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Interfaces (Copiadas de tu código original)
export interface UserProfile {
  nickname: string;
  profileImage: number;
  stats: {
    currentLevel: number;
    lives: number;
    lastLifeLost: number | null;
    levelsCompleted: number[];
    totalCorrectAnswers: number;
    totalWrongAnswers: number;
  };
}

interface UserContextType {
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  // Agregamos funciones para vidas si las necesitas manipular directamente
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // 2. Estado Inicial (Copiado de tu código)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    nickname: 'Estudiante',
    profileImage: 0,
    stats: {
      currentLevel: 1,
      lives: 3,
      lastLifeLost: null,
      levelsCompleted: [],
      totalCorrectAnswers: 0,
      totalWrongAnswers: 0
    }
  });

  // 3. Lógica del Cronómetro (Recuperar vidas)
  useEffect(() => {
    const interval = setInterval(() => {
      setUserProfile(prev => {
        if (prev.stats.lives < 3 && prev.stats.lastLifeLost) {
          const timePassed = Date.now() - prev.stats.lastLifeLost;
          // 3 minutos * 60 segundos * 1000 ms
          const livesToRecover = Math.floor(timePassed / (3 * 60 * 1000));
          
          if (livesToRecover > 0) {
            const newLives = Math.min(3, prev.stats.lives + livesToRecover);
            return {
              ...prev,
              stats: {
                ...prev.stats,
                lives: newLives,
                lastLifeLost: newLives === 3 ? null : Date.now()
              }
            };
          }
        }
        return prev;
      });
    }, 60000); // Revisar cada minuto

    return () => clearInterval(interval);
  }, []);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ userProfile, updateUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar esto fácil en cualquier pantalla
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser debe usarse dentro de un UserProvider');
  return context;
};