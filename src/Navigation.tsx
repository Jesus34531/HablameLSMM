import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home as HomeIcon, BookOpen, Gamepad2, GraduationCap } from 'lucide-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, View, StyleSheet } from 'react-native';

import Welcome from './screens/Welcome';
import Home from './screens/Home';
import Vocabulario from './screens/Vocabulario';
import Juegos from './screens/Juegos';
import Memorama from './screens/games/Memorama';
import Adivina from './screens/games/Adivina';
import Aprendizaje from './screens/Aprendizaje';
import CameraScreen from './screens/Camera';
import SelectorSeñas from './screens/SelectorSeñas';
import TribiaDias from './screens/games/TribiaDias';
import type { UserProfile } from '../App';

export type RootStackParamList = {
  Welcome: undefined;
  MainTabs: undefined;
  GameTribiaDias: undefined;
  GameMemorama: { level?: number };
  GameAdivina: { level?: number };
  Camera: { mode: string; seña: string };
  SelectorSeñas: { mode: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

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
          height: 70,
          borderRadius: 20,
          elevation: 10,
          paddingBottom: 5,
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconCircle : undefined}>
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
            <View style={focused ? styles.activeIconCircle : undefined}>
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
            <View style={focused ? styles.activeIconCircle : undefined}>
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
            <View style={focused ? styles.activeIconCircle : undefined}>
              <Gamepad2 color={color} size={focused ? 28 : 24} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ── WelcomeScreen separado como componente nombrado ──
// Recibe navigation directamente como prop del Stack
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
        {/* ✅ component= en lugar de children como función */}
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
        <Stack.Screen name="GameTribiaDias" component={TribiaDias} />
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
});