import React, { useRef, useState, useEffect } from 'react';
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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

const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Las Garras del Dragón',
    subtitle: 'Dedos',
    emoji: '🐉',
    dialog: '¡Hola, Héroe! Para hablar LSM, nuestros dedos deben ser tan ágiles como rayos. ¡Cierra fuerte y suelta como si lanzaras chispas mágicas! ¡Mira cómo lo hago yo!',
    duration: 30,
    type: 'video',
    accentColor: '#f97316',
    gradientColors: ['#7c2d12', '#431407'],
  },
  {
    id: 2,
    title: 'El Baile de las Mariposas',
    subtitle: 'Palmas y Muñecas',
    emoji: '🦋',
    dialog: '¡Eso es! Ahora imagina que tus manos son alas de mariposa. Vamos a mover las muñecas en círculos para que el vuelo sea suave. ¡Siente la energía fluir!',
    duration: 30,
    type: 'video',
    accentColor: '#a855f7',
    gradientColors: ['#4a044e', '#2e1065'],
  },
  {
    id: 3,
    title: 'El Piano Invisible',
    subtitle: 'Independencia Digital',
    emoji: '🎹',
    dialog: '¡Música maestro! Toca las notas invisibles en el aire. Mueve un dedo a la vez... ¡es más difícil de lo que parece, pero tú tienes el ritmo!',
    duration: 30,
    type: 'video',
    accentColor: '#06b6d4',
    gradientColors: ['#0c4a6e', '#082f49'],
  },
  {
    id: 4,
    title: 'El Escudo de Cristal',
    subtitle: 'Flexibilidad Total',
    emoji: '🛡️',
    dialog: '¡Último esfuerzo! Vamos a estirar nuestro escudo protector. Empuja suavemente tus dedos hacia atrás... ¡Siente cómo tus manos se vuelven súper flexibles y listas para la acción!',
    duration: 30,
    type: 'video',
    accentColor: '#22c55e',
    gradientColors: ['#14532d', '#052e16'],
  },
  {
    id: 5,
    title: 'Las Vocales del Poder',
    subtitle: 'Nivel Final',
    emoji: '✋',
    dialog: '¡Lo lograste, Héroe! Ahora pon en práctica lo aprendido. Tienes 10 segundos por cada vocal. ¡Demuestra que tus manos ya hablan LSM!',
    duration: 10,
    type: 'cards',
    accentColor: '#f59e0b',
    gradientColors: ['#78350f', '#451a03'],
  },
];

const VOCALES = [
  { letra: 'A', descripcion: 'Puño cerrado, pulgar al lado' },
  { letra: 'E', descripcion: 'Dedos doblados sobre la palma' },
  { letra: 'I', descripcion: 'Meñique extendido hacia arriba' },
  { letra: 'O', descripcion: 'Dedos juntos formando círculo' },
  { letra: 'U', descripcion: 'Índice y medio juntos, apuntando arriba' },
];

// ─────────────────────────────────────────────
//  IMÁGENES DE PERFIL PREDESTINADAS
//  👉 Reemplaza cada require con la ruta de tu imagen
// ─────────────────────────────────────────────
const AVATAR_OPTIONS = [
  { id: 1, source:   require('../../assets/avatars/avatar_1.png')  },
  { id: 2, source:   require('../../assets/avatars/avatar_2.png')  },
  { id: 3, source:   require('../../assets/avatars/avatar_3.png')  },
  { id: 4, source:   require('../../assets/avatars/avatar_4.png')  },
  { id: 5, source:   require('../../assets/avatars/avatar_5.png')  },
  { id: 6, source:   require('../../assets/avatars/avatar_6.png')  },
  { id: 7, source:   require('../../assets/avatars/avatar_7.png')  },
  { id: 8, source:   require('../../assets/avatars/avatar_8.png') },
  { id: 9, source:   require('../../assets/avatars/avatar_9.png')  },
  { id: 10, source:   require('../../assets/avatars/avatar_10.png')  },
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
                  // Placeholder mientras no hay imagen
                  <View style={avatarPickerStyles.avatarOptionPlaceholder}>
                    <Text style={avatarPickerStyles.avatarOptionNum}>{avatar.id}</Text>
                  </View>
                )}
                {currentAvatarId === avatar.id && (
                  <View style={avatarPickerStyles.checkOverlay}>
                    <CheckCircle size={20} color="#22c55e" />
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

        {/* Header — solo título y botón atrás */}
        <LinearGradient colors={['#0f172a', '#1a2540']} style={editStyles.header}>
          <TouchableOpacity onPress={onBack} style={editStyles.backBtn}>
            <ArrowLeft size={20} color="#60a5fa" />
          </TouchableOpacity>
          <Text style={editStyles.headerTitle}>Editar Perfil</Text>
        </LinearGradient>

        <ScrollView
          style={editStyles.body}
          contentContainerStyle={editStyles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar — toca para abrir selector */}
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
                  <User size={42} color="#60a5fa" />
                </View>
              )}
              {/* Overlay de cámara */}
              <View style={editStyles.cameraOverlay}>
                <Text style={editStyles.cameraOverlayText}>✎</Text>
              </View>
            </TouchableOpacity>
            <Text style={editStyles.avatarHint}>Toca tu foto para elegir un avatar</Text>
          </View>

          {/* Campos: solo Nombre y Edad */}
          <View style={editStyles.fieldsCard}>
            <View style={editStyles.fieldGroup}>
              <Text style={editStyles.fieldLabel}>Nombre</Text>
              <TextInput
                style={editStyles.input}
                value={form.name}
                onChangeText={t => setForm(f => ({ ...f, name: t }))}
                placeholder="Tu nombre completo"
                placeholderTextColor="#334155"
                selectionColor="#60a5fa"
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
                placeholderTextColor="#334155"
                selectionColor="#60a5fa"
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>

          {/* Stats decorativos 
          <View style={editStyles.statsRow}>
            {[
              { num: '0', label: 'Señas\naprendidas' },
              { num: '0', label: 'Días\nde racha' },
              { num: '0', label: 'Niveles\ncompletados' },
            ].map((s, i, arr) => (
              <React.Fragment key={i}>
                <View style={editStyles.statBox}>
                  <Text style={editStyles.statNum}>{s.num}</Text>
                  <Text style={editStyles.statLabel}>{s.label}</Text>
                </View>
                {i < arr.length - 1 && <View style={editStyles.statDivider} />}
              </React.Fragment>
            ))}
          </View>
          */}

          {/* Botón Guardar abajo de los campos */}
          <TouchableOpacity
            style={[editStyles.saveButton, saved && editStyles.saveButtonDone]}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            {saved ? (
              <>
                <CheckCircle size={18} color="#fff" />
                <Text style={editStyles.saveButtonText}>¡Guardado!</Text>
              </>
            ) : (
              <>
                <Save size={18} color="#fff" />
                <Text style={editStyles.saveButtonText}>Guardar cambios</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal selector de avatar */}
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
//  TARJETA VOCAL  (Nivel 5)
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

      {/* 👉 IMAGEN DE SEÑA — reemplaza el placeholder con tu imagen:
          <Image
            source={require('../../assets/senas/seña_' + vocal.letra + '.png')}
            style={vocalStyles.signImage}
            resizeMode="contain"
          />
      */}
      <View style={vocalStyles.imageSlot}>
        <Text style={vocalStyles.imagePlaceholder}>📷 Seña "{vocal.letra}"</Text>
        <Text style={vocalStyles.imagePlaceholderHint}>
          {/* 👉 Agrega aquí: require('../../assets/senas/seña_A.png') etc. */}
        </Text>
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
            <Text style={modalStyles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView
          style={modalStyles.body}
          contentContainerStyle={modalStyles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Mascota + diálogo */}
          <View style={modalStyles.dialogRow}>
            {/* 👉 IMAGEN MASCOTA — reemplaza con:
                <Image
                  source={require('../../assets/mascota/mascota_nivel_' + level.id + '.png')}
                  style={modalStyles.mascotImg}
                  resizeMode="contain"
                />
            */}
            <View style={[modalStyles.mascotPlaceholder, { borderColor: level.accentColor }]}>
              <Text style={modalStyles.mascotIcon}>🧑‍🦱</Text>
              <Text style={modalStyles.mascotLabel}>Mascota</Text>
            </View>
            <View style={[modalStyles.bubble, { borderColor: level.accentColor + '77' }]}>
              <Text style={modalStyles.bubbleText}>"{level.dialog}"</Text>
            </View>
          </View>

          {/* ── Video (niveles 1-4) ── */}
          {level.type === 'video' && !levelDone && (
            <View style={modalStyles.videoSection}>
              <View style={[modalStyles.videoBox, { borderColor: level.accentColor + '55' }]}>
                {!showVideo ? (
                  <TouchableOpacity
                    style={modalStyles.videoPlaceholder}
                    onPress={() => { setShowVideo(true); setTimerRunning(true); }}
                  >
                    <View style={[modalStyles.playCircle, { backgroundColor: level.accentColor }]}>
                      <Play size={34} color="#fff" />
                    </View>
                    <Text style={modalStyles.videoLabel}>Toca para comenzar</Text>
                    <Text style={modalStyles.videoDuration}>{level.duration}s de ejercicio</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={modalStyles.videoActive}>
                    {/* 👉 VIDEO NIVEL {level.id} — reemplaza con:
                        <Video
                          style={{ width: '100%', height: '100%' }}
                          source={{ uri: 'URL_VIDEO_NIVEL_' + level.id }}
                          // O local: source={require('../../assets/videos/nivel_' + level.id + '.mp4')}
                          useNativeControls
                          resizeMode="contain"
                          shouldPlay
                        />
                    */}
                    <Text style={modalStyles.videoActiveTxt}>
                      🎬 Video Nivel {level.id}{'\n'}
                      {/* 👉 Inserta aquí el componente Video */}
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
            <View style={[modalStyles.completedBox, { borderColor: level.accentColor }]}>
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
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Héroe',
    age: '',
    avatar: null,
  });

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
        onSave={p => setProfile(p)}
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

        {/* ── LOGO — se quitó el cuadro simulado, solo imagen real ── */}
        <View style={styles.logoRow}>
          {/* 👉 Tu logo ya está aquí */}
          <Image
            source={require('../../assets/Logo_Hablame_LSM.png')}
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
            colors={['rgba(96,165,250,0.16)', 'rgba(34,211,238,0.08)']}
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
                    <User size={28} color="#60a5fa" />
                  </View>
                )}
                <View style={styles.onlineDot} />
              </View>
              <View style={{ marginLeft: 14 }}>
                <Text style={styles.greeting}>¡Bienvenido de nuevo,</Text>
                <Text style={styles.profileName}>{profile.name}! 👋</Text>
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
              <ChevronRight size={18} color="#475569" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── VIDEO TUTORIAL ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Play size={18} color="#22d3ee" />
            <Text style={styles.sectionTitle}>Video Tutorial</Text>
          </View>
          <View style={styles.tutorialBox}>
            {/* 👉 VIDEO TUTORIAL — reemplaza con:
                <Video
                  style={{ width: '100%', height: '100%' }}
                  source={{ uri: 'URL_VIDEO_TUTORIAL' }}
                  // O local: source={require('../../assets/videos/tutorial.mp4')}
                  useNativeControls
                  resizeMode="contain"
                />
            */}
            <View style={styles.tutorialPlaceholder}>
              <View style={styles.tutorialPlayBtn}>
                <Play size={36} color="#fff" />
              </View>
              <Text style={styles.tutorialLabel}>Cómo usar la aplicación</Text>
              <Text style={styles.tutorialSub}>Toca para reproducir</Text>
            </View>
          </View>
        </View>

        {/* ── CAMINO DEL HÉROE ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Star size={18} color="#f59e0b" />
            <Text style={styles.sectionTitle}>El Camino del Héroe</Text>
          </View>
          <Text style={styles.sectionSub}>Misión Manos Ágiles · Ayuda a la mascota a avanzar de nivel</Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(completedLevels.length / 5) * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>
            {completedLevels.length === 5 ? '🏆 ¡Misión completada!' : `${completedLevels.length} de 5 niveles`}
          </Text>

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
                        ? ['rgba(34,197,94,0.18)', 'rgba(34,197,94,0.05)']
                        : unlocked
                        ? ['rgba(51,65,85,0.95)', 'rgba(15,23,42,0.95)']
                        : ['rgba(18,24,36,0.7)', 'rgba(10,14,24,0.7)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.levelCard,
                      completed && { borderColor: 'rgba(34,197,94,0.38)' },
                      unlocked && !completed && { borderColor: level.accentColor + '44' },
                      !unlocked && { borderColor: 'rgba(30,40,55,0.4)' },
                    ]}
                  >
                    <View style={[styles.levelBadge, {
                      backgroundColor: completed ? '#22c55e' : unlocked ? level.accentColor : '#1e293b'
                    }]}>
                      {completed
                        ? <CheckCircle size={15} color="#fff" />
                        : unlocked
                        ? <Text style={styles.levelBadgeNum}>{level.id}</Text>
                        : <Lock size={13} color="#475569" />
                      }
                    </View>
                    <Text style={[styles.levelEmoji, !unlocked && { opacity: 0.25 }]}>{level.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.levelName, !unlocked && styles.dimText]} numberOfLines={1}>
                        {level.title}
                      </Text>
                      <Text style={[styles.levelSub, !unlocked && styles.dimText]}>{level.subtitle}</Text>
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

          {completedLevels.length === 5 && (
            <LinearGradient
              colors={['rgba(245,158,11,0.18)', 'rgba(245,158,11,0.04)']}
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
//  ESTILOS HOME
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#070d1a' },
  content: { padding: 18, paddingTop: 56, gap: 20 },

  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  logoImg: { width: 58, height: 58, borderRadius: 15 },
  appName: { color: '#e2e8f0', fontSize: 19, fontWeight: '800', letterSpacing: 0.3 },
  appTagline: { color: '#3b4f6b', fontSize: 11, marginTop: 2, letterSpacing: 0.2 },

  profileCard: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(96,165,250,0.2)' },
  profileGradient: { padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profileLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarRing: { width: 60, height: 60, borderRadius: 30, borderWidth: 2.5, borderColor: '#60a5fa', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  avatarFallback: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(96,165,250,0.1)', justifyContent: 'center', alignItems: 'center' },
  avatarImg: { width: 52, height: 52, borderRadius: 26 },
  onlineDot: { position: 'absolute', bottom: 1, right: 1, width: 13, height: 13, borderRadius: 7, backgroundColor: '#22c55e', borderWidth: 2, borderColor: '#070d1a' },
  greeting: { color: '#475569', fontSize: 12 },
  profileName: { color: '#f1f5f9', fontSize: 18, fontWeight: '700', marginTop: 1 },
  profileAge: { color: '#64748b', fontSize: 12, marginTop: 1 },
  progressPill: { marginTop: 6, backgroundColor: 'rgba(96,165,250,0.14)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  progressPillTxt: { color: '#60a5fa', fontSize: 11, fontWeight: '600' },
  profileRight: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingLeft: 8 },
  editLabel: { color: '#475569', fontSize: 11, textAlign: 'right', lineHeight: 16 },

  section: { gap: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: '#f1f5f9', fontSize: 17, fontWeight: '700' },
  sectionSub: { color: '#334155', fontSize: 12, marginTop: -4 },

  tutorialBox: { width: '100%', height: 200, borderRadius: 16, overflow: 'hidden', backgroundColor: '#0b1526', borderWidth: 1.5, borderColor: 'rgba(34,211,238,0.25)' },
  tutorialPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  tutorialPlayBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#22d3ee', justifyContent: 'center', alignItems: 'center', shadowColor: '#22d3ee', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 18, elevation: 10 },
  tutorialLabel: { color: '#cbd5e1', fontSize: 14, fontWeight: '600' },
  tutorialSub: { color: '#334155', fontSize: 12 },

  progressTrack: { height: 5, backgroundColor: '#1e293b', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#f59e0b', borderRadius: 3 },
  progressLabel: { color: '#475569', fontSize: 11, textAlign: 'right', marginTop: 4 },

  levelsList: { gap: 10 },
  levelCard: { borderRadius: 16, borderWidth: 1, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  levelBadge: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  levelBadgeNum: { color: '#fff', fontSize: 13, fontWeight: '800' },
  levelEmoji: { fontSize: 26 },
  levelName: { color: '#f1f5f9', fontWeight: '700', fontSize: 14 },
  levelSub: { color: '#475569', fontSize: 11, marginTop: 2 },
  dimText: { color: '#1e293b' },
  levelPill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  levelPillTxt: { fontSize: 11, fontWeight: '600' },
  donePill: { backgroundColor: 'rgba(34,197,94,0.16)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  donePillTxt: { color: '#22c55e', fontSize: 11, fontWeight: '600' },

  allDoneBanner: { borderRadius: 16, padding: 20, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(245,158,11,0.28)', marginTop: 4 },
  allDoneTitle: { color: '#f59e0b', fontSize: 17, fontWeight: '800' },
  allDoneSub: { color: '#64748b', fontSize: 13, textAlign: 'center' },
});

// ─────────────────────────────────────────────
//  ESTILOS MODAL
// ─────────────────────────────────────────────
const modalStyles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 100, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.78)' },
  modal: { backgroundColor: '#0f172a', borderTopLeftRadius: 28, borderTopRightRadius: 28, height: SCREEN_HEIGHT * 0.88, borderWidth: 1, borderColor: 'rgba(96,165,250,0.15)', overflow: 'hidden' },
  handle: { width: 40, height: 4, backgroundColor: '#1e293b', borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 2 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16, gap: 12 },
  headerEmoji: { fontSize: 34 },
  levelNum: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  levelTitle: { color: '#fff', fontSize: 19, fontWeight: '800', marginTop: 1 },
  levelSub: { color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 2 },
  closeBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  body: { flex: 1 },
  bodyContent: { padding: 18, gap: 16 },
  dialogRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  mascotPlaceholder: { width: 78, height: 112, borderRadius: 14, borderWidth: 2, backgroundColor: 'rgba(255,255,255,0.03)', justifyContent: 'center', alignItems: 'center', gap: 4 },
  mascotIcon: { fontSize: 28 },
  mascotLabel: { color: '#334155', fontSize: 10 },
  mascotImg: { width: 78, height: 112, borderRadius: 14 },
  bubble: { flex: 1, backgroundColor: 'rgba(30,41,59,0.9)', borderRadius: 16, borderWidth: 1.5, padding: 14 },
  bubbleText: { color: '#94a3b8', fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
  videoSection: { gap: 10 },
  videoBox: { width: '100%', height: 246, borderRadius: 16, overflow: 'hidden', backgroundColor: '#080f1e', borderWidth: 1.5 },
  videoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  playCircle: { width: 74, height: 74, borderRadius: 37, justifyContent: 'center', alignItems: 'center' },
  videoLabel: { color: '#cbd5e1', fontSize: 14, fontWeight: '600' },
  videoDuration: { color: '#334155', fontSize: 12 },
  videoActive: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#060d1a' },
  videoActiveTxt: { color: '#1e293b', textAlign: 'center', fontSize: 13, lineHeight: 22 },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timerTrack: { flex: 1, height: 6, backgroundColor: '#1e293b', borderRadius: 3, overflow: 'hidden' },
  timerFill: { height: '100%', borderRadius: 3 },
  timerText: { fontSize: 13, fontWeight: '700', minWidth: 32, textAlign: 'right' },
  vocalesWrap: { gap: 10 },
  vocalesProgress: { color: '#475569', fontSize: 13, textAlign: 'center' },
  completedBox: { borderRadius: 22, borderWidth: 1.5, padding: 28, alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.02)' },
  completedStar: { fontSize: 42 },
  completedTitle: { fontSize: 22, fontWeight: '800' },
  completedSub: { color: '#64748b', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  completedBtns: { flexDirection: 'row', gap: 10, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' },
  repeatBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 20, borderWidth: 1.5, backgroundColor: 'rgba(255,255,255,0.03)' },
  repeatBtnText: { fontWeight: '700', fontSize: 14 },
  continueBtn: { paddingHorizontal: 22, paddingVertical: 12, borderRadius: 20 },
  continueBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

// ─────────────────────────────────────────────
//  ESTILOS EDITAR PERFIL
// ─────────────────────────────────────────────
const editStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#070d1a' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(96,165,250,0.1)', gap: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(96,165,250,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, color: '#f1f5f9', fontSize: 17, fontWeight: '700' },
  body: { flex: 1 },
  bodyContent: { padding: 22, gap: 22 },

  avatarSection: { alignItems: 'center', gap: 10 },
  avatarWrap: { position: 'relative' },
  avatarFallback: { width: 104, height: 104, borderRadius: 52, backgroundColor: 'rgba(96,165,250,0.1)', borderWidth: 2.5, borderColor: '#60a5fa', justifyContent: 'center', alignItems: 'center' },
  avatarImg: { width: 104, height: 104, borderRadius: 52 },
  cameraOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 34, backgroundColor: 'rgba(0,0,0,0.55)', borderBottomLeftRadius: 52, borderBottomRightRadius: 52, justifyContent: 'center', alignItems: 'center' },
  cameraOverlayText: { color: '#fff', fontSize: 16 },
  avatarHint: { color: '#334155', fontSize: 12 },

  fieldsCard: { backgroundColor: 'rgba(15,23,42,0.9)', borderRadius: 20, padding: 18, gap: 14, borderWidth: 1, borderColor: 'rgba(96,165,250,0.1)' },
  fieldGroup: { gap: 6 },
  fieldLabel: { color: '#475569', fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(7,13,26,0.8)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(96,165,250,0.18)', color: '#f1f5f9', fontSize: 15, paddingHorizontal: 14, paddingVertical: 12 },
  divider: { height: 1, backgroundColor: 'rgba(96,165,250,0.08)' },

  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(15,23,42,0.7)', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: 'rgba(96,165,250,0.08)', alignItems: 'center', justifyContent: 'space-around' },
  statBox: { alignItems: 'center', gap: 4, flex: 1 },
  statNum: { color: '#60a5fa', fontSize: 26, fontWeight: '800' },
  statLabel: { color: '#334155', fontSize: 10, textAlign: 'center', lineHeight: 14 },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(96,165,250,0.1)' },

  // Botón guardar abajo
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#3b82f6', borderRadius: 16, paddingVertical: 16, shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  saveButtonDone: { backgroundColor: '#22c55e', shadowColor: '#22c55e' },
  saveButtonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});

// ─────────────────────────────────────────────
//  ESTILOS AVATAR PICKER
// ─────────────────────────────────────────────
const avatarPickerStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  sheet: { backgroundColor: '#0f172a', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, borderWidth: 1, borderColor: 'rgba(96,165,250,0.15)' },
  handle: { width: 40, height: 4, backgroundColor: '#1e293b', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { color: '#f1f5f9', fontSize: 18, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#475569', fontSize: 13, textAlign: 'center', marginTop: 4, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 20 },
  avatarOption: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: 'rgba(96,165,250,0.2)', overflow: 'hidden', position: 'relative' },
  avatarOptionSelected: { borderColor: '#22c55e', borderWidth: 3 },
  avatarOptionImg: { width: '100%', height: '100%' },
  avatarOptionPlaceholder: { width: '100%', height: '100%', backgroundColor: 'rgba(96,165,250,0.08)', justifyContent: 'center', alignItems: 'center' },
  avatarOptionNum: { color: '#60a5fa', fontSize: 20, fontWeight: '800' },
  checkOverlay: { position: 'absolute', bottom: 2, right: 2, backgroundColor: '#070d1a', borderRadius: 12 },
  closeBtn: { backgroundColor: 'rgba(96,165,250,0.1)', borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(96,165,250,0.2)' },
  closeBtnText: { color: '#60a5fa', fontWeight: '700', fontSize: 15 },
});

// ─────────────────────────────────────────────
//  ESTILOS TARJETA VOCAL
// ─────────────────────────────────────────────
const vocalStyles = StyleSheet.create({
  card: { backgroundColor: 'rgba(15,23,42,0.95)', borderRadius: 20, borderWidth: 1.5, borderColor: 'rgba(245,158,11,0.32)', padding: 20, alignItems: 'center', gap: 12 },
  letterRing: { width: 68, height: 68, borderRadius: 34, backgroundColor: 'rgba(245,158,11,0.15)', borderWidth: 2, borderColor: '#f59e0b', justifyContent: 'center', alignItems: 'center' },
  letter: { color: '#f59e0b', fontSize: 34, fontWeight: '900' },
  imageSlot: { width: '100%', height: 160, borderRadius: 14, backgroundColor: 'rgba(20,30,50,0.8)', borderWidth: 1, borderColor: '#1e293b', justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed' },
  imagePlaceholder: { color: '#334155', fontSize: 13 },
  imagePlaceholderHint: { color: '#1e293b', fontSize: 10 },
  signImage: { width: '100%', height: '100%', borderRadius: 14 },
  description: { color: '#64748b', fontSize: 13, textAlign: 'center' },
  timerTrack: { width: '100%', height: 6, backgroundColor: '#1e293b', borderRadius: 3, overflow: 'hidden' },
  timerFill: { height: '100%', backgroundColor: '#f59e0b', borderRadius: 3 },
  timerText: { color: '#f59e0b', fontSize: 13, fontWeight: '700' },
  nextBtn: { backgroundColor: 'rgba(245,158,11,0.15)', borderRadius: 20, paddingHorizontal: 24, paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(245,158,11,0.35)' },
  nextBtnText: { color: '#f59e0b', fontWeight: '700', fontSize: 14 },
});