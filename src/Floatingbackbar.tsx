import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 🔲 Slot para tu ícono PNG de "volver"
// Cuando tengas tu asset, reemplaza null por: require('../../assets/iconos/back.png')
const iconoVolver = require('../assets/iconos/volver.png');

interface FloatingBackBarProps {
  label?: string; // texto opcional que aparece junto al botón (por defecto "Volver")
}

export default function FloatingBackBar({ label = 'Volver' }: FloatingBackBarProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.bar}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.75}
          onPress={() => navigation.goBack()}
        >
          {/* Ícono PNG si está disponible, sino flecha de texto */}
          {iconoVolver ? (
            <Image
              source={iconoVolver}
              style={styles.icon}
              resizeMode="contain"
            />
          ) : (
            // 🔲 Placeholder — reemplaza iconoVolver con tu PNG para quitar esto
            <Text style={styles.arrow}>←</Text>
          )}
          <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 25 : 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  bar: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(34, 211, 238, 0.35)',
    paddingVertical: 10,
    paddingHorizontal: 28,
    elevation: 10,
    shadowColor: '#22d3ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: '#22d3ee',
  },
  arrow: {
    color: '#22d3ee',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  label: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});