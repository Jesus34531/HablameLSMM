import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home as HomeIcon, BookOpen, Gamepad2, User, GraduationCap } from 'lucide-react-native';
import { NavigationContainer } from '@react-navigation/native';

import Home from './screens/Home';
import Vocabulario from './screens/Vocabulario';
import Juegos from './screens/Juegos';
import Perfil from './screens/Perfil';
import Memorama from './screens/games/Memorama';
import Adivina from './screens/games/Adivina';
import Aprendizaje from './screens/Aprendizaje';
import CameraScreen from './screens/Camera';
import SelectorSeñas from './screens/SelectorSeñas';


import type { UserProfile } from '../App';
import TribiaDias from './screens/games/TribiaDias';

export type RootStackParamList = {
  GameTribiaDias: undefined;
  GameMemorama: { level?: number };
  GameAdivina: { level?: number };
  MainTabs: undefined;
  Camera: { mode: string; seña: string };
  SelectorSeñas: { mode: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

interface NavigationProps {
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

function MainTabs({ userProfile, updateUserProfile }: NavigationProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopColor: '#334155',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#22d3ee',
        tabBarInactiveTintColor: '#94a3b8',
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={Home}
        options={{ tabBarIcon: ({ color }) => <HomeIcon color={color} size={24} /> }}
      />
      <Tab.Screen
        name="Vocabulario"
        component={Vocabulario}
        options={{ tabBarIcon: ({ color }) => <BookOpen color={color} size={24} /> }}
      />
      <Tab.Screen
        name="Aprender"
        component={Aprendizaje}
        options={{ tabBarIcon: ({ color }) => <GraduationCap color={color} size={24} /> }}
      />
      <Tab.Screen
        name="Juegos"
        component={Juegos}
        options={{ tabBarIcon: ({ color }) => <Gamepad2 color={color} size={24} /> }}
      />
      <Tab.Screen
        name="Perfil"
        options={{
          title: 'Mi Perfil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      >
        {() => (
          <Perfil
            userProfile={userProfile}
            updateUserProfile={updateUserProfile}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function Navigation({ userProfile, updateUserProfile }: NavigationProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        // ✅ Entramos directo a MainTabs, saltando el Login
        initialRouteName="MainTabs"
        screenOptions={{ headerShown: false }}
      >
        {/* MainTabs es ahora la pantalla inicial */}
        <Stack.Screen name="MainTabs">
          {() => (
            <MainTabs
              userProfile={userProfile}
              updateUserProfile={updateUserProfile}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="SelectorSeñas"
          component={SelectorSeñas}
          options={{ presentation: 'card' }}
        />

        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ presentation: 'fullScreenModal' }}
        />

        <Stack.Screen name="GameTribiaDias" component={TribiaDias} />
        <Stack.Screen name="GameMemorama" component={Memorama} />
        <Stack.Screen name="GameAdivina" component={Adivina} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}