import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, View, StyleSheet, Image } from 'react-native';

import Welcome from './screens/Welcome';
import Home from './screens/Home';
import Aprender from './screens/Aprender';
import Juegos from './screens/Juegos';
import Memorama from './screens/games/Memorama';
import Adivina from './screens/games/Adivina';
import CameraScreen from './screens/Camera';
import SelectorSeñas from './screens/SelectorSeñas';
import AprendizajeSaludos from './screens/Saludos'; // ← pantalla de saludos AR
import type { UserProfile } from '../App';
import RompecabezasColores from './screens/games/RompecabezasColores';

export type RootStackParamList = {
  Welcome: undefined;
  MainTabs: undefined;
  // Ya eliminamos GameTribiaDias de aquí
  GameRompecabezasColores:{};
  GameMemorama: { level?: number };
  GameAdivina: { level?: number };
  Camera: { mode: string; seña: string };
  SelectorSeñas: { mode: string };
  AprendizajeSaludos: undefined; // ← nueva ruta para la pantalla AR de saludos
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// ── Slots para tus íconos PNG ──
const iconoInicio    = require('../assets/iconos/home.png'); // 🔲 PON TU PNG AQUÍ
const iconoVocab     = require('../assets/iconos/ra_2.png'); // 🔲 PON TU PNG AQUÍ
const iconoJuegos    = require('../assets/iconos/juego2.png'); // 🔲 PON TU PNG AQUÍ

function TabIcon({ source, color, focused }: { source: any; color: string; focused: boolean }) {
  return (
    <View style={focused ? styles.activeIconCircle : undefined}>
      {source ? (
        // Sin tintColor → el PNG se muestra con sus colores originales tal como fue descargado
        <Image
          source={source}
          style={styles.tabIcon}
          resizeMode="contain"
        />
      ) : (
        // Placeholder visible mientras no hay PNG
        <View style={[styles.tabIconPlaceholder, { borderColor: color }]} />
      )}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#22d3ee',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginBottom: 5 },
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopWidth: 0,
          position: 'absolute',
          bottom: Platform.OS === 'android' ? 15 : 30,
          left: 15,
          right: 15,
          height: 70,          // más alto para dar aire a íconos grandes
          borderRadius: 20,
          elevation: 10,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon source={iconoInicio} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Aprender"
        component={Aprender}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon source={iconoVocab} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Juegos"
        component={Juegos}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon source={iconoJuegos} color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function WelcomeScreen({ navigation }: any) {
  return <Welcome onLogin={() => navigation.replace('MainTabs')} />;
}

interface NavigationProps {
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

export default function Navigation({ userProfile, updateUserProfile }: NavigationProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
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
        <Stack.Screen
          name="AprendizajeSaludos"
          component={AprendizajeSaludos}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen name='GameRompecabezasColores' component={RompecabezasColores}/>
        <Stack.Screen name="GameMemorama" component={Memorama} />
        <Stack.Screen name="GameAdivina" component={Adivina} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  activeIconCircle: {
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    padding: 8,
    borderRadius: 15,
    marginBottom: 2,
  },
  tabIcon: {
    width: 38,   // más grande para que se vea con detalle
    height: 38,
  },
  // Placeholder cuadrado que se muestra hasta que pongas tu PNG
  tabIconPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1.5,
    opacity: 0.5,
  },
});