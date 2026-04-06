import React, { useRef, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Play,
  User,
  ChevronRight,
  Star,
  Lock,
  CheckCircle,
  ArrowLeft,
  Save,
  RotateCcw,
} from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────
//  TEMA INFANTIL — fuente Nunito, pasteles vivos
// ─────────────────────────────────────────────
const theme = {
  colors: {
    // Fondos
    background:    '#FFF8F0',   // crema cálido
    surface:       '#FFFFFF',
    surfaceAlt:    '#F0F7FF',   // azul muy suave

    // Texto (alto contraste)
    textPrimary:   '#2D2D2D',
    textSecondary: '#555555',
    textMuted:     '#888888',

    // Acentos por nivel (pasteles vivos)
    level1:        '#FF7043',   // coral
    level2:        '#AB47BC',   // violeta
    level3:        '#00ACC1',   // turquesa
    level4:        '#43A047',   // verde
    level5:        '#FFA726',   // ámbar

    // Gradientes por nivel (pastel suave)
    level1Gradient: ['#FFCCBC', '#FFAB91'] as [string, string],
    level2Gradient: ['#E1BEE7', '#CE93D8'] as [string, string],
    level3Gradient: ['#B2EBF2', '#80DEEA'] as [string, string],
    level4Gradient: ['#C8E6C9', '#A5D6A7'] as [string, string],
    level5Gradient: ['#FFE0B2', '#FFCC80'] as [string, string],

    border:        'rgba(0,0,0,0.10)',
    borderLight:   'rgba(0,0,0,0.06)',
    success:       '#43A047',
    white:         '#FFFFFF',
    overlay:       'rgba(0,0,0,0.45)',
  },
  fonts: {
    regular:    'Nunito_400Regular',
    semiBold:   'Nunito_600SemiBold',
    bold:       'Nunito_700Bold',
    extraBold:  'Nunito_800ExtraBold',
  },
  sizes: {
    xs: 13, sm: 15, base: 17, lg: 20, xl: 24, xxl: 30,
  },
  radius: {
    sm: 10, md: 16, lg: 22, pill: 50,
  },
  space: {
    xs: 6, sm: 10, md: 16, lg: 22, xl: 32,
  },
};

// ─────────────────────────────────────────────
//  TIPOS
// ─────────────────────────────────────────────
type Level = {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  dialog: string;
  duration: number;
  type: 'video' | 'cards';
  accentColor: string;
  gradientColors: [string, string];
};

type UserProfile = {
  name: string;
  age: string;
  avatar: null | any;
};

// ─────────────────────────────────────────────
//  DATOS
// ─────────────────────────────────────────────
const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Las Garras del Dragón',
    subtitle: 'Dedos',
    emoji: '🐉',
    dialog: '¡Hola, Héroe! Para hablar LSM, nuestros dedos deben ser tan ágiles como rayos. ¡Cierra fuerte y suelta como si lanzaras chispas mágicas! ¡Mira cómo lo hago yo!',
    duration: 30,
    type: 'video',
    accentColor: theme.colors.level1,
    gradientColors: theme.colors.level1Gradient,
  },
  {
    id: 2,
    title: 'El Baile de las Mariposas',
    subtitle: 'Palmas y Muñecas',
    emoji: '🦋',
    dialog: '¡Eso es! Ahora imagina que tus manos son alas de mariposa. Vamos a mover las muñecas en círculos para que el vuelo sea suave. ¡Siente la energía fluir!',
    duration: 30,
    type: 'video',
    accentColor: theme.colors.level2,
    gradientColors: theme.colors.level2Gradient,
  },
  {
    id: 3,
    title: 'El Piano Invisible',
    subtitle: 'Independencia Digital',
    emoji: '🎹',
    dialog: '¡Música maestro! Toca las notas invisibles en el aire. Mueve un dedo a la vez... ¡es más difícil de lo que parece, pero tú tienes el ritmo!',
    duration: 30,
    type: 'video',
    accentColor: theme.colors.level3,
    gradientColors: theme.colors.level3Gradient,
  },
  {
    id: 4,
    title: 'El Escudo de Cristal',
    subtitle: 'Flexibilidad Total',
    emoji: '🛡️',
    dialog: '¡Último esfuerzo! Vamos a estirar nuestro escudo protector. Empuja suavemente tus dedos hacia atrás... ¡Siente cómo tus manos se vuelven súper flexibles y listas para la acción!',
    duration: 30,
    type: 'video',
    accentColor: theme.colors.level4,
    gradientColors: theme.colors.level4Gradient,
  },
  {
    id: 5,
    title: 'Las Vocales del Poder',
    subtitle: 'Nivel Final',
    emoji: '✋',
    dialog: '¡Lo lograste, Héroe! Ahora pon en práctica lo aprendido. Tienes 10 segundos por cada vocal. ¡Demuestra que tus manos ya hablan LSM!',
    duration: 10,
    type: 'cards',
    accentColor: theme.colors.level5,
    gradientColors: theme.colors.level5Gradient,
  },
];

const VOCALES = [
  { letra: 'A', descripcion: 'Puño cerrado, pulgar al lado' },
  { letra: 'E', descripcion: 'Dedos doblados sobre la palma' },
  { letra: 'I', descripcion: 'Meñique extendido hacia arriba' },
  { letra: 'O', descripcion: 'Dedos juntos formando círculo' },
  { letra: 'U', descripcion: 'Índice y medio juntos, apuntando arriba' },
];

const AVATAR_OPTIONS = [
  { id: 1, source: require('../../assets/avatars/avatar_1.png') },
  { id: 2, source: require('../../assets/avatars/avatar_2.png') },
  { id: 3, source: require('../../assets/avatars/avatar_3.png') },
  { id: 4, source: require('../../assets/avatars/avatar_4.png') },
  { id: 5, source: require('../../assets/avatars/avatar_5.png') },
  { id: 6, source: require('../../assets/avatars/avatar_6.png') },
  { id: 7, source: require('../../assets/avatars/avatar_7.png') },
  { id: 8, source: require('../../assets/avatars/avatar_8.png') },
  { id: 9, source: require('../../assets/avatars/avatar_9.png') },
  { id: 10, source: require('../../assets/avatars/avatar_10.png') },
];

// ─────────────────────────────────────────────
//  MODAL: SELECTOR DE AVATAR
// ─────────────────────────────────────────────
function AvatarPickerModal({
  visible,
  currentAvatarId,
  onSelect,
  onClose,
}: {
  visible: boolean;
  currentAvatarId: number | null;
  onSelect: (id: number, source: any) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={avatarPickerStyles.overlay}>
        <TouchableOpacity style={avatarPickerStyles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={avatarPickerStyles.sheet}>
          <View style={avatarPickerStyles.handle} />
          <Text style={avatarPickerStyles.title}>Elige tu avatar</Text>
          <Text style={avatarPickerStyles.subtitle}>Selecciona una imagen para tu perfil</Text>

          <View style={avatarPickerStyles.grid}>
            {AVATAR_OPTIONS.map(avatar => (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  avatarPickerStyles.avatarOption,
                  currentAvatarId === avatar.id && avatarPickerStyles.avatarOptionSelected,
                ]}
                onPress={() => onSelect(avatar.id, avatar.source)}
              >
                {avatar.source ? (
                  <Image source={avatar.source} style={avatarPickerStyles.avatarOptionImg} />
                ) : (
                  <View style={avatarPickerStyles.avatarOptionPlaceholder}>
                    <Text style={avatarPickerStyles.avatarOptionNum}>{avatar.id}</Text>
                  </View>
                )}
                {currentAvatarId === avatar.id && (
                  <View style={avatarPickerStyles.checkOverlay}>
                    <CheckCircle size={20} color={theme.colors.success} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={avatarPickerStyles.closeBtn} onPress={onClose}>
            <Text style={avatarPickerStyles.closeBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─────────────────────────────────────────────
//  PANTALLA: EDITAR PERFIL
// ─────────────────────────────────────────────
function EditProfileScreen({
  profile,
  onSave,
  onBack,
}: {
  profile: UserProfile;
  onSave: (p: UserProfile) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState<UserProfile>({ ...profile });
  const [saved, setSaved] = useState(false);
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null);
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSave = () => {
    Keyboard.dismiss();
    onSave(form);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onBack();
    }, 1200);
  };

  const handleAvatarSelect = (id: number, source: any) => {
    setSelectedAvatarId(id);
    setForm(f => ({ ...f, avatar: source }));
    setAvatarPickerVisible(false);
  };

  return (
    <Animated.View style={[editStyles.screen, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <View style={editStyles.header}>
          <TouchableOpacity onPress={onBack} style={editStyles.backBtn}>
            <ArrowLeft size={20} color={theme.colors.level3} />
          </TouchableOpacity>
          <Text style={editStyles.headerTitle}>Editar Perfil</Text>
        </View>

        <ScrollView
          style={editStyles.body}
          contentContainerStyle={editStyles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar */}
          <View style={editStyles.avatarSection}>
            <TouchableOpacity
              style={editStyles.avatarWrap}
              onPress={() => setAvatarPickerVisible(true)}
              activeOpacity={0.8}
            >
              {form.avatar ? (
                <Image source={form.avatar} style={editStyles.avatarImg} />
              ) : (
                <View style={editStyles.avatarFallback}>
                  <User size={42} color={theme.colors.level3} />
                </View>
              )}
              <View style={editStyles.cameraOverlay}>
                <Text style={editStyles.cameraOverlayText}>✎</Text>
              </View>
            </TouchableOpacity>
            <Text style={editStyles.avatarHint}>Toca tu foto para elegir un avatar</Text>
          </View>

          {/* Campos */}
          <View style={editStyles.fieldsCard}>
            <View style={editStyles.fieldGroup}>
              <Text style={editStyles.fieldLabel}>Nombre</Text>
              <TextInput
                style={editStyles.input}
                value={form.name}
                onChangeText={t => setForm(f => ({ ...f, name: t }))}
                placeholder="Tu nombre completo"
                placeholderTextColor={theme.colors.textMuted}
                selectionColor={theme.colors.level3}
              />
            </View>

            <View style={editStyles.divider} />

            <View style={editStyles.fieldGroup}>
              <Text style={editStyles.fieldLabel}>Edad</Text>
              <TextInput
                style={editStyles.input}
                value={form.age}
                onChangeText={t => setForm(f => ({ ...f, age: t }))}
                placeholder="Tu edad"
                placeholderTextColor={theme.colors.textMuted}
                selectionColor={theme.colors.level3}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>

          {/* Botón Guardar */}
          <TouchableOpacity
            style={[editStyles.saveButton, saved && editStyles.saveButtonDone]}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            {saved ? (
              <>
                <CheckCircle size={18} color={theme.colors.white} />
                <Text style={editStyles.saveButtonText}>¡Guardado!</Text>
              </>
            ) : (
              <>
                <Save size={18} color={theme.colors.white} />
                <Text style={editStyles.saveButtonText}>Guardar cambios</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <AvatarPickerModal
        visible={avatarPickerVisible}
        currentAvatarId={selectedAvatarId}
        onSelect={handleAvatarSelect}
        onClose={() => setAvatarPickerVisible(false)}
      />
    </Animated.View>
  );
}

// ─────────────────────────────────────────────
//  TARJETA VOCAL (Nivel 5)
// ─────────────────────────────────────────────
function VocalCard({ vocal, onComplete }: { vocal: typeof VOCALES[0]; onComplete: () => void }) {
  const [seconds, setSeconds] = useState(10);
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progress, { toValue: 0, duration: 10000, easing: Easing.linear, useNativeDriver: false }).start();
    const id = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) { clearInterval(id); setTimeout(onComplete, 400); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={vocalStyles.card}>
      <View style={vocalStyles.letterRing}>
        <Text style={vocalStyles.letter}>{vocal.letra}</Text>
      </View>

      <View style={vocalStyles.imageSlot}>
        <Text style={vocalStyles.imagePlaceholder}>📷 Seña "{vocal.letra}"</Text>
      </View>

      <Text style={vocalStyles.description}>{vocal.descripcion}</Text>
      <View style={vocalStyles.timerTrack}>
        <Animated.View style={[vocalStyles.timerFill, { width: barWidth }]} />
      </View>
      <Text style={vocalStyles.timerText}>{seconds}s</Text>
      <TouchableOpacity style={vocalStyles.nextBtn} onPress={onComplete}>
        <Text style={vocalStyles.nextBtnText}>Siguiente →</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────
//  MODAL DE NIVEL
// ─────────────────────────────────────────────
function LevelModal({ level, onClose, onComplete }: { level: Level; onClose: () => void; onComplete: () => void }) {
  const [showVideo, setShowVideo] = useState(false);
  const [timer, setTimer] = useState(level.duration);
  const [timerRunning, setTimerRunning] = useState(false);
  const [vocalIndex, setVocalIndex] = useState(0);
  const [levelDone, setLevelDone] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    if (timer <= 0) { setTimerRunning(false); setLevelDone(true); return; }
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning, timer]);

  const handleVocalNext = () => {
    if (vocalIndex < VOCALES.length - 1) setVocalIndex(i => i + 1);
    else setLevelDone(true);
  };

  const handleRepeat = () => {
    setShowVideo(false);
    setTimer(level.duration);
    setTimerRunning(false);
    setVocalIndex(0);
    setLevelDone(false);
  };

  const handleClose = () => {
    Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true }).start(onClose);
  };

  return (
    <View style={modalStyles.overlay}>
      <TouchableOpacity style={modalStyles.backdrop} activeOpacity={1} onPress={handleClose} />
      <Animated.View style={[modalStyles.modal, { transform: [{ translateY: slideAnim }] }]}>

        <View style={modalStyles.handle} />

        {/* Header del modal con gradiente pastel */}
        <LinearGradient
          colors={level.gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={modalStyles.header}
        >
          <Text style={modalStyles.headerEmoji}>{level.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={modalStyles.levelNum}>NIVEL {level.id}</Text>
            <Text style={modalStyles.levelTitle}>{level.title}</Text>
            <Text style={modalStyles.levelSub}>{level.subtitle}</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={modalStyles.closeBtn}>
            <Text style={[modalStyles.closeBtnText, { color: level.accentColor }]}>✕</Text>
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView
          style={modalStyles.body}
          contentContainerStyle={modalStyles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Mascota + diálogo */}
          <View style={modalStyles.dialogRow}>
            <Image
              source={require('../../assets/mascota/perro_mascota.png')}
              style={modalStyles.mascotImg}
              resizeMode="contain"
            />
            <View style={[modalStyles.bubble, { borderColor: level.accentColor + '66' }]}>
              <Text style={modalStyles.bubbleText}>"{level.dialog}"</Text>
            </View>
          </View>

          {/* ── Video (niveles 1–4) ── */}
          {level.type === 'video' && !levelDone && (
            <View style={modalStyles.videoSection}>
              <View style={[modalStyles.videoBox, { borderColor: level.accentColor + '55' }]}>
                {!showVideo ? (
                  <TouchableOpacity
                    style={modalStyles.videoPlaceholder}
                    onPress={() => { setShowVideo(true); setTimerRunning(true); }}
                  >
                    <View style={[modalStyles.playCircle, { backgroundColor: level.accentColor }]}>
                      <Play size={34} color={theme.colors.white} />
                    </View>
                    <Text style={modalStyles.videoLabel}>Toca para comenzar</Text>
                    <Text style={modalStyles.videoDuration}>{level.duration}s de ejercicio</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={modalStyles.videoActive}>
                    <Text style={modalStyles.videoActiveTxt}>
                      🎬 Video Nivel {level.id}
                    </Text>
                  </View>
                )}
              </View>
              {showVideo && (
                <View style={modalStyles.timerRow}>
                  <View style={modalStyles.timerTrack}>
                    <View style={[modalStyles.timerFill, { backgroundColor: level.accentColor, width: `${(timer / level.duration) * 100}%` }]} />
                  </View>
                  <Text style={[modalStyles.timerText, { color: level.accentColor }]}>{timer}s</Text>
                </View>
              )}
            </View>
          )}

          {/* ── Vocales (nivel 5) ── */}
          {level.type === 'cards' && !levelDone && (
            <View style={modalStyles.vocalesWrap}>
              <Text style={modalStyles.vocalesProgress}>Vocal {vocalIndex + 1} de {VOCALES.length}</Text>
              <VocalCard key={vocalIndex} vocal={VOCALES[vocalIndex]} onComplete={handleVocalNext} />
            </View>
          )}

          {/* ── Completado ── */}
          {levelDone && (
            <View style={[modalStyles.completedBox, { borderColor: level.accentColor + '88' }]}>
              <Text style={modalStyles.completedStar}>⭐</Text>
              <Text style={[modalStyles.completedTitle, { color: level.accentColor }]}>¡Nivel {level.id} Completado!</Text>
              <Text style={modalStyles.completedSub}>¡Eres un verdadero héroe del LSM! Tus manos ya saben hablar.</Text>
              <View style={modalStyles.completedBtns}>
                <TouchableOpacity style={[modalStyles.repeatBtn, { borderColor: level.accentColor }]} onPress={handleRepeat}>
                  <RotateCcw size={15} color={level.accentColor} />
                  <Text style={[modalStyles.repeatBtnText, { color: level.accentColor }]}>Repetir nivel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[modalStyles.continueBtn, { backgroundColor: level.accentColor }]}
                  onPress={() => { onComplete(); handleClose(); }}
                >
                  <Text style={modalStyles.continueBtnText}>Continuar →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ height: 36 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────
//  COMPONENTE PRINCIPAL: HOME
// ─────────────────────────────────────────────
export default function Home() {
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({ name: '', age: '', avatar: null });

  // Cargar datos al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datosGuardados = await AsyncStorage.getItem('@perfil_usuario');
        if (datosGuardados !== null) {
          const usuario = JSON.parse(datosGuardados);
          let avatarSource = null;
          if (usuario.avatarId) {
            const found = AVATAR_OPTIONS.find(a => a.id === usuario.avatarId);
            if (found) avatarSource = found.source;
          }
          setProfile({ name: usuario.name || '', age: usuario.age || '', avatar: avatarSource });
        }
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };
    cargarDatos();
  }, []);

  const handleSaveProfile = async (nuevoPerfil: UserProfile) => {
    setProfile(nuevoPerfil);
    try {
      let avatarIdParaGuardar = null;
      if (nuevoPerfil.avatar) {
        const found = AVATAR_OPTIONS.find(a => a.source === nuevoPerfil.avatar);
        if (found) avatarIdParaGuardar = found.id;
      }
      await AsyncStorage.setItem('@perfil_usuario', JSON.stringify({
        name: nuevoPerfil.name,
        age: nuevoPerfil.age,
        avatarId: avatarIdParaGuardar,
      }));
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
    }
  };

  const handleOpenLevel = (level: Level) => {
    if (level.id !== 1 && !completedLevels.includes(level.id - 1)) return;
    setActiveLevel(level);
  };

  const handleLevelComplete = () => {
    if (!activeLevel) return;
    setCompletedLevels(prev => prev.includes(activeLevel.id) ? prev : [...prev, activeLevel.id]);
    setActiveLevel(null);
  };

  const isUnlocked = (id: number) => id === 1 || completedLevels.includes(id - 1);
  const isCompleted = (id: number) => completedLevels.includes(id);

  if (showEditProfile) {
    return (
      <EditProfileScreen
        profile={profile}
        onSave={handleSaveProfile}
        onBack={() => setShowEditProfile(false)}
      />
    );
  }

  return (
    <>
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── LOGO ── */}
        <View style={styles.logoRow}>
          <Image
            source={require('../../assets/logo_senapp_2.png')}
            style={styles.logoImg}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.appName}>SeñApp</Text>
            <Text style={styles.appTagline}>Lenguaje de Señas Mexicano</Text>
          </View>
        </View>

        {/* ── PERFIL ── */}
        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={0.82}
          onPress={() => setShowEditProfile(true)}
        >
          <LinearGradient
            colors={['#E3F2FD', '#F3E5F5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <View style={styles.profileLeft}>
              <View style={styles.avatarRing}>
                {profile.avatar ? (
                  <Image source={profile.avatar} style={styles.avatarImg} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <User size={28} color={theme.colors.level3} />
                  </View>
                )}
                <View style={styles.onlineDot} />
              </View>
              <View style={{ marginLeft: theme.space.md }}>
                <Text style={styles.greeting}>¡Bienvenido de nuevo,</Text>
                <Text style={styles.profileName}>{profile.name || 'Héroe'}</Text>
                {profile.age ? (
                  <Text style={styles.profileAge}>{profile.age} años</Text>
                ) : null}
                <View style={styles.progressPill}>
                  <Text style={styles.progressPillTxt}>{completedLevels.length}/5 niveles completados</Text>
                </View>
              </View>
            </View>
            <View style={styles.profileRight}>
              <Text style={styles.editLabel}>Editar{'\n'}perfil</Text>
              <ChevronRight size={18} color={theme.colors.textMuted} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── VIDEO TUTORIAL ── */}
        <View style={styles.section}>
          <View style={styles.tutorialCard}>
            <View style={styles.tutorialHeader}>
              <View style={styles.tutorialIconWrap}>
                <Play size={14} color={theme.colors.level3} />
              </View>
              <Text style={styles.tutorialHeaderTitle}>Video Tutorial</Text>
            </View>
            <Video
              style={{ width: '100%', height: 220 }}
              source={require('../../assets/videos/introduccion_1.mp4')}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
            />
          </View>
        </View>

        {/* ── CAMINO DEL HÉROE ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Star size={18} color={theme.colors.level5} />
            <Text style={styles.sectionTitle}>El Camino del Héroe</Text>
          </View>
          <Text style={styles.sectionSub}>Misión Manos Ágiles · ¡Ayuda a la mascota a avanzar!</Text>

          {/* Barra de progreso */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(completedLevels.length / 5) * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>
            {completedLevels.length === 5 ? '🏆 ¡Misión completada!' : `${completedLevels.length} de 5 niveles`}
          </Text>

          {/* Lista de niveles */}
          <View style={styles.levelsList}>
            {LEVELS.map(level => {
              const unlocked = isUnlocked(level.id);
              const completed = isCompleted(level.id);

              return (
                <TouchableOpacity
                  key={level.id}
                  activeOpacity={unlocked ? 0.78 : 1}
                  onPress={() => handleOpenLevel(level)}
                >
                  <LinearGradient
                    colors={
                      completed
                        ? ['#E8F5E9', '#F1F8E9']
                        : unlocked
                        ? [theme.colors.surface, theme.colors.surfaceAlt]
                        : ['#F5F5F5', '#EEEEEE']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.levelCard,
                      completed && { borderColor: theme.colors.success + '55' },
                      unlocked && !completed && { borderColor: level.accentColor + '55' },
                      !unlocked && { borderColor: theme.colors.border },
                    ]}
                  >
                    {/* Badge de estado */}
                    <View style={[styles.levelBadge, {
                      backgroundColor: completed
                        ? theme.colors.success
                        : unlocked
                        ? level.accentColor
                        : '#BDBDBD',
                    }]}>
                      {completed
                        ? <CheckCircle size={15} color={theme.colors.white} />
                        : unlocked
                        ? <Text style={styles.levelBadgeNum}>{level.id}</Text>
                        : <Lock size={13} color={theme.colors.white} />
                      }
                    </View>

                    <Text style={[styles.levelEmoji, !unlocked && { opacity: 0.4 }]}>{level.emoji}</Text>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.levelName, !unlocked && styles.dimText]} numberOfLines={1}>
                        {level.title}
                      </Text>
                      <Text style={[styles.levelSub, !unlocked && styles.dimSubText]}>{level.subtitle}</Text>
                    </View>

                    {unlocked && !completed && (
                      <View style={[styles.levelPill, { backgroundColor: level.accentColor + '22' }]}>
                        <Text style={[styles.levelPillTxt, { color: level.accentColor }]}>
                          {level.type === 'video' ? `⏱ ${level.duration}s` : '🃏 Vocales'}
                        </Text>
                      </View>
                    )}
                    {completed && (
                      <View style={styles.donePill}>
                        <Text style={styles.donePillTxt}>✓ Hecho</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Banner final */}
          {completedLevels.length === 5 && (
            <LinearGradient
              colors={['#FFF8E1', '#FFF3E0']}
              style={styles.allDoneBanner}
            >
              <Text style={styles.allDoneTitle}>🏆 ¡Misión Completada, Héroe!</Text>
              <Text style={styles.allDoneSub}>Tus manos ya hablan LSM. ¡Sigue tu camino!</Text>
            </LinearGradient>
          )}
        </View>

        <View style={{ height: 44 }} />
      </ScrollView>

      {activeLevel && (
        <LevelModal
          level={activeLevel}
          onClose={() => setActiveLevel(null)}
          onComplete={handleLevelComplete}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────
//  ESTILOS HOME — fondo claro, Nunito, pasteles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.space.lg,
    paddingTop: 56,
    gap: theme.space.lg,
  },

  // Logo
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
  },
  logoImg: {
    width: 58,
    height: 58,
    borderRadius: 15,
  },
  appName: {
    color: theme.colors.textPrimary,
    fontSize: theme.sizes.xl,
    fontFamily: theme.fonts.extraBold,
    letterSpacing: 0.3,
  },
  appTagline: {
    color: theme.colors.textMuted,
    fontSize: theme.sizes.xs,
    fontFamily: theme.fonts.regular,
    marginTop: 2,
  },

  // Perfil
  profileCard: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  profileGradient: {
    padding: theme.space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: theme.colors.level3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  greeting: {
    color: theme.colors.textSecondary,
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
  },
  profileName: {
    color: theme.colors.textPrimary,
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.extraBold,
    marginTop: 1,
  },
  profileAge: {
    color: theme.colors.textMuted,
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
    marginTop: 1,
  },
  progressPill: {
    marginTop: 6,
    backgroundColor: '#E0F2F1',
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  progressPillTxt: {
    color: theme.colors.level3,
    fontSize: theme.sizes.xs,
    fontFamily: theme.fonts.bold,
  },
  profileRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingLeft: 8,
  },
  editLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.sizes.xs,
    fontFamily: theme.fonts.regular,
    textAlign: 'right',
    lineHeight: 16,
  },

  // Secciones
  section: {
    gap: theme.space.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.extraBold,
  },
  sectionSub: {
    color: theme.colors.textMuted,
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
    marginTop: -4,
  },

  // Tutorial card
  tutorialCard: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: theme.colors.level3 + '44',
    backgroundColor: theme.colors.surface,
  },
  tutorialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#E0F7FA',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.level3 + '33',
  },
  tutorialIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: theme.colors.level3 + '33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorialHeaderTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.sizes.base,
    fontFamily: theme.fonts.bold,
  },

  // Progreso general
  progressTrack: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.level5,
    borderRadius: 4,
  },
  progressLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.semiBold,
    textAlign: 'right',
    marginTop: 4,
  },

  // Tarjetas de nivel
  levelsList: {
    gap: theme.space.sm,
  },
  levelCard: {
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    // Sombra suave para dar profundidad
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  levelBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBadgeNum: {
    color: theme.colors.white,
    fontSize: theme.sizes.base,
    fontFamily: theme.fonts.extraBold,
  },
  levelEmoji: {
    fontSize: 28,
  },
  levelName: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.bold,
    fontSize: theme.sizes.base,
  },
  levelSub: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.regular,
    fontSize: theme.sizes.sm,
    marginTop: 2,
  },
  dimText: {
    color: '#BDBDBD',
    fontFamily: theme.fonts.bold,
  },
  dimSubText: {
    color: '#BDBDBD',
    fontFamily: theme.fonts.regular,
  },
  levelPill: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  levelPillTxt: {
    fontSize: theme.sizes.xs,
    fontFamily: theme.fonts.bold,
  },
  donePill: {
    backgroundColor: '#E8F5E9',
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  donePillTxt: {
    color: theme.colors.success,
    fontSize: theme.sizes.xs,
    fontFamily: theme.fonts.bold,
  },

  // Banner de misión completada
  allDoneBanner: {
    borderRadius: theme.radius.md,
    padding: 20,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.level5 + '55',
    marginTop: 4,
  },
  allDoneTitle: {
    color: '#E65100',
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.extraBold,
  },
  allDoneSub: {
    color: theme.colors.textSecondary,
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
  },
});

// ─────────────────────────────────────────────
//  ESTILOS MODAL
// ─────────────────────────────────────────────
const modalStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
  },
  modal: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: SCREEN_HEIGHT * 0.88,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
  },
  headerEmoji: {
    fontSize: 34,
  },
  levelNum: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontFamily: theme.fonts.extraBold,
    letterSpacing: 2,
  },
  levelTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.extraBold,
    marginTop: 1,
  },
  levelSub: {
    color: theme.colors.textSecondary,
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
  body: { flex: 1 },
  bodyContent: {
    padding: 18,
    gap: 16,
  },
  dialogRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  mascotImg: {
    width: 78,
    height: 112,
    borderRadius: 14,
  },
  bubble: {
    flex: 1,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
  },
  bubbleText: {
    color: theme.colors.textSecondary,
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  videoSection: { gap: 10 },
  videoBox: {
    width: '100%',
    height: 246,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  playCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoLabel: {
    color: theme.colors.textPrimary,
    fontSize: theme.sizes.base,
    fontFamily: theme.fonts.bold,
  },
  videoDuration: {
    color: theme.colors.textMuted,
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
  },
  videoActive: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  videoActiveTxt: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontSize: theme.sizes.base,
    fontFamily: theme.fonts.regular,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timerTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    borderRadius: 4,
  },
  timerText: {
    fontSize: theme.sizes.base,
    fontFamily: theme.fonts.extraBold,
    minWidth: 32,
    textAlign: 'right',
  },
  vocalesWrap: { gap: 10 },
  vocalesProgress: {
    color: theme.colors.textMuted,
    fontSize: theme.sizes.base,
    fontFamily: theme.fonts.semiBold,
    textAlign: 'center',
  },
  completedBox: {
    borderRadius: 22,
    borderWidth: 2,
    padding: 28,
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.surface,
  },
  completedStar: { fontSize: 42 },
  completedTitle: {
    fontSize: theme.sizes.xl,
    fontFamily: theme.fonts.extraBold,
  },
  completedSub: {
    color: theme.colors.textSecondary,
    fontSize: theme.sizes.base,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    lineHeight: 22,
  },
  completedBtns: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  repeatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: theme.radius.pill,
    borderWidth: 1.5,
    backgroundColor: theme.colors.surface,
  },
  repeatBtnText: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.sizes.base,
  },
  continueBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: theme.radius.pill,
  },
  continueBtnText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
    fontSize: theme.sizes.base,
  },
});

// ─────────────────────────────────────────────
//  ESTILOS EDITAR PERFIL
// ─────────────────────────────────────────────
const editStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 12,
    backgroundColor: theme.colors.surface,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.extraBold,
  },
  body: { flex: 1 },
  bodyContent: {
    padding: 22,
    gap: 22,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    gap: 10,
  },
  avatarWrap: { position: 'relative' },
  avatarFallback: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#E0F7FA',
    borderWidth: 3,
    borderColor: theme.colors.level3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImg: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: theme.colors.level3,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 34,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderBottomLeftRadius: 52,
    borderBottomRightRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraOverlayText: {
    color: theme.colors.white,
    fontSize: 16,
  },
  avatarHint: {
    color: theme.colors.textMuted,
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
  },

  // Campos
  fieldsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldGroup: { gap: 6 },
  fieldLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.sizes.xs,
    fontFamily: theme.fonts.extraBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    color: theme.colors.textPrimary,
    fontSize: theme.sizes.base,
    fontFamily: theme.fonts.regular,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
  },

  // Botón guardar
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: theme.colors.level3,
    borderRadius: theme.radius.pill,
    paddingVertical: 16,
    shadowColor: theme.colors.level3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  saveButtonDone: {
    backgroundColor: theme.colors.success,
    shadowColor: theme.colors.success,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.extraBold,
    fontSize: theme.sizes.lg,
  },
});

// ─────────────────────────────────────────────
//  ESTILOS AVATAR PICKER
// ─────────────────────────────────────────────
const avatarPickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.extraBold,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.sizes.base,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarOption: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  avatarOptionSelected: {
    borderColor: theme.colors.success,
    borderWidth: 3,
  },
  avatarOptionImg: {
    width: '100%',
    height: '100%',
  },
  avatarOptionPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOptionNum: {
    color: theme.colors.level3,
    fontSize: 20,
    fontFamily: theme.fonts.extraBold,
  },
  checkOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
  },
  closeBtn: {
    backgroundColor: '#E0F7FA',
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.level3 + '44',
  },
  closeBtnText: {
    color: theme.colors.level3,
    fontFamily: theme.fonts.bold,
    fontSize: theme.sizes.base,
  },
});

// ─────────────────────────────────────────────
//  ESTILOS TARJETA VOCAL
// ─────────────────────────────────────────────
const vocalStyles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.level5 + '55',
    padding: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  letterRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF3E0',
    borderWidth: 2.5,
    borderColor: theme.colors.level5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    color: theme.colors.level5,
    fontSize: 36,
    fontFamily: theme.fonts.extraBold,
  },
  imageSlot: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  imagePlaceholder: {
    color: theme.colors.textMuted,
    fontSize: theme.sizes.base,
    fontFamily: theme.fonts.regular,
  },
  signImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.sizes.base,
    fontFamily: theme.fonts.semiBold,
    textAlign: 'center',
  },
  timerTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    backgroundColor: theme.colors.level5,
    borderRadius: 4,
  },
  timerText: {
    color: theme.colors.level5,
    fontSize: theme.sizes.base,
    fontFamily: theme.fonts.extraBold,
  },
  nextBtn: {
    backgroundColor: '#FFF3E0',
    borderRadius: theme.radius.pill,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.level5 + '55',
  },
  nextBtnText: {
    color: theme.colors.level5,
    fontFamily: theme.fonts.extraBold,
    fontSize: theme.sizes.base,
  },
});