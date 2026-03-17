import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home as HomeIcon, BookOpen, Gamepad2, User, GraduationCap } from 'lucide-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, View, StyleSheet } from 'react-native'; // Importamos Platform

// ... (tus otros imports se mantienen igual)
import Home from './screens/Home';
import Vocabulario from './screens/Vocabulario';
import Juegos from './screens/Juegos';
import Perfil from './screens/Perfil';
import Memorama from './screens/games/Memorama';
import Adivina from './screens/games/Adivina';
import Aprendizaje from './screens/Aprendizaje';
import CameraScreen from './screens/Camera';
import SelectorSeñas from './screens/SelectorSeñas';
import TribiaDias from './screens/games/TribiaDias';
import type { UserProfile } from '../App';

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
        tabBarActiveTintColor: '#22d3ee',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarShowLabel: true, // Aseguramos que se vea el texto
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 5,
        },
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopWidth: 0,
          position: 'absolute', // Hace que el menú "flote"
          bottom: Platform.OS === 'android' ? 15 : 30, // Eleva el menú para evitar los botones de Android
          left: 15,
          right: 15,
          height: 70, // Más alto para que los iconos respiren
          borderRadius: 20,
          elevation: 10, // Sombra en Android
          shadowColor: '#000', // Sombra en iOS
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          paddingBottom: 5, // Espacio interno inferior
          paddingTop: 10, // Espacio interno superior
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconCircle : null}>
              <HomeIcon color={color} size={focused ? 28 : 24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Vocabulario"
        component={Vocabulario}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconCircle : null}>
              <BookOpen color={color} size={focused ? 28 : 24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Aprender"
        component={Aprendizaje}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconCircle : null}>
              <GraduationCap color={color} size={focused ? 28 : 24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Juegos"
        component={Juegos}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconCircle : null}>
              <Gamepad2 color={color} size={focused ? 28 : 24} />
            </View>
          ),
        }}
      />
      {/* <Tab.Screen
        name="Perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconCircle : null}>
              <User color={color} size={focused ? 28 : 24} />
            </View>
          ),
        }}
      >
        {() => (
          <Perfil
            userProfile={userProfile}
            updateUserProfile={updateUserProfile}
          />
        )}
      </Tab.Screen> */}
    </Tab.Navigator>
  );
}

// Estilos extra para resaltar la sección activa
const styles = StyleSheet.create({
  activeIconCircle: {
    backgroundColor: 'rgba(34, 211, 238, 0.1)', // Un círculo suave azul alrededor del icono activo
    padding: 8,
    borderRadius: 15,
    marginBottom: 2,
  }
});

export default function Navigation({ userProfile, updateUserProfile }: NavigationProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{ headerShown: false }}
      >
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