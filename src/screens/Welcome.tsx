import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface WelcomeProps {
  onLogin: () => void;
}

export default function Welcome({ onLogin }: WelcomeProps) {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const btnAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(180, [
      Animated.spring(logoAnim, { toValue: 1, friction: 7, useNativeDriver: true }),
      Animated.timing(textAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(btnAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#060c1e', '#0b1a45', '#0e2460']}
      locations={[0, 0.55, 1]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      {/* ── LOGO ── */}
      <Animated.View
        style={[
          styles.logoArea,
          {
            opacity: logoAnim,
            transform: [{
              scale: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }),
            }],
          },
        ]}
      >
        <Image
          source={require('../../assets/logo_senapp_2.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* ── TEXTOS ── */}
      <Animated.View style={[styles.textArea, { opacity: textAnim }]}>
        <Text style={styles.appName}>SeñApp</Text>
        <Text style={styles.tagline}>Lengua de Señas Mexicana</Text>
        <Text style={styles.desc}>
          ¿Listo para jugar y aprender{'\n'}señas de manera divertida?
        </Text>
      </Animated.View>

      {/* ── BOTÓN ── */}
      <Animated.View style={[styles.btnWrapper, { opacity: btnAnim }]}>
        <TouchableOpacity
          onPress={onLogin}
          activeOpacity={0.75}
          style={styles.btnTouchable}
        >
          <LinearGradient
            colors={['#22d3ee', '#0ea5e9', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>¡ENTRAR!</Text>
            
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blob1: {
    width: width * 0.9,
    height: width * 0.9,
    top: -width * 0.3,
    right: -width * 0.2,
    backgroundColor: 'rgba(34, 211, 238, 0.06)',
  },
  blob2: {
    width: width * 0.75,
    height: width * 0.75,
    bottom: -width * 0.15,
    left: -width * 0.2,
    backgroundColor: 'rgba(59, 130, 246, 0.07)',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 140,
    height: 140,
  },
  textArea: {
    alignItems: 'center',
    marginBottom: 44,
    gap: 10,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.4,
  },
  tagline: {
    fontSize: 13,
    color: '#38bdf8',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  desc: {
    marginTop: 8,
    fontSize: 17,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 26,
  },
  btnWrapper: {
    width: '100%',
    shadowColor: '#22d3ee',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
  },
  btnTouchable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  version: {
    position: 'absolute',
    bottom: 28,
    color: 'rgba(148,163,184,0.25)',
    fontSize: 11,
    letterSpacing: 2,
  },
});