/**
 * RompecabezasDias.tsx
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  PanResponder,
  Animated,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FloatingBackBar from '../../Floatingbackbar';

// ─── Dimensiones ──────────────────────────────────────────────────────────────
const { width: SW } = Dimensions.get('window');
const GRID       = 3;
const BOARD_PAD  = 20;
const BOARD_SIZE = SW - BOARD_PAD * 2;
const CELL       = Math.floor((BOARD_SIZE - (GRID - 1) * 4) / GRID);
const TRAY_CELL  = 72;

// ─── Niveles ──────────────────────────────────────────────────────────────────
type Nivel = {
  id: string;
  nombre: string;
  color: string;
  textoDark: boolean;
  img: ImageSourcePropType;
};

const NIVELES: Nivel[] = [
  { id: 'amarillo',   nombre: 'Amarillo',   color: '#FBBF24', textoDark: true,  img: require('../../../assets/rompecabeza/amarillo.png')   },
  { id: 'gris',       nombre: 'Gris',       color: '#9CA3AF', textoDark: true,  img: require('../../../assets/rompecabeza/gris.png')       },
  { id: 'cafe',       nombre: 'Café',        color: '#B45309', textoDark: false, img: require('../../../assets/rompecabeza/cafe.png')       },
  { id: 'blanco',     nombre: 'Blanco',     color: '#E2E8F0', textoDark: true,  img: require('../../../assets/rompecabeza/blanco.png')     },
  { id: 'azul',       nombre: 'Azul',       color: '#3B82F6', textoDark: false, img: require('../../../assets/rompecabeza/azul.png')       },
  { id: 'verde',      nombre: 'Verde',      color: '#22C55E', textoDark: true,  img: require('../../../assets/rompecabeza/verde.png')      },
  { id: 'rojo',       nombre: 'Rojo',       color: '#EF4444', textoDark: false, img: require('../../../assets/rompecabeza/rojo.png')       },
  { id: 'anaranjado', nombre: 'Anaranjado', color: '#F97316', textoDark: false, img: require('../../../assets/rompecabeza/anaranjado.png') },
  { id: 'negro',      nombre: 'Negro',      color: '#374151', textoDark: false, img: require('../../../assets/rompecabeza/negro.png')      },
  { id: 'rosa',       nombre: 'Rosa',       color: '#EC4899', textoDark: false, img: require('../../../assets/rompecabeza/rosa.png')       },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
const SK = (id: string) => `puzzle_best_${id}`;

type BoardState = (number | null)[];
type Fase = 'grid' | 'detalle' | 'jugando' | 'fin';

// ─── Componente principal ─────────────────────────────────────────────────────
export default function RompecabezasColores() {
  const navigation = useNavigation();

  const [fase,      setFase]      = useState<Fase>('grid');
  const [nivel,     setNivel]     = useState<Nivel | null>(null);
  const [board,     setBoard]     = useState<BoardState>(Array(GRID * GRID).fill(null));
  const [tray,      setTray]      = useState<number[]>([]);
  const [elapsed,   setElapsed]   = useState(0);
  const [bestTimes, setBestTimes] = useState<Record<string, number>>({});
  const [movs,      setMovs]      = useState(0);
  const [newRecord, setNewRecord] = useState(false);

  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const boardRef   = useRef<View>(null);
  const boardLayout = useRef({ x: 0, y: 0, width: BOARD_SIZE, height: BOARD_SIZE });

  const [draggingPiece, setDraggingPiece] = useState<{
    piezaIdx: number;
    x: number;
    y: number;
  } | null>(null);

  const boardRef2 = useRef<BoardState>(board);
  useEffect(() => { boardRef2.current = board; }, [board]);
  const trayRef = useRef<number[]>(tray);
  useEffect(() => { trayRef.current = tray; }, [tray]);

  useEffect(() => {
    (async () => {
      const result: Record<string, number> = {};
      for (const n of NIVELES) {
        try {
          const val = await AsyncStorage.getItem(SK(n.id));
          if (val !== null) result[n.id] = parseInt(val, 10);
        } catch {}
      }
      setBestTimes(result);
    })();
  }, []);

  const saveBest = useCallback(async (id: string, time: number) => {
    try {
      await AsyncStorage.setItem(SK(id), String(time));
      setBestTimes(prev => ({ ...prev, [id]: time }));
    } catch {}
  }, []);

  const iniciar = useCallback((n: Nivel) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const piezas = shuffle(Array.from({ length: GRID * GRID }, (_, i) => i));
    const emptyBoard = Array(GRID * GRID).fill(null);
    setBoard(emptyBoard);
    boardRef2.current = emptyBoard;
    setTray(piezas);
    trayRef.current = piezas;
    elapsedRef.current = 0;
    setElapsed(0);
    setMovs(0);
    setNewRecord(false);
    setDraggingPiece(null);
    setNivel(n);
    setFase('jugando');
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(e => e + 1);
    }, 1000);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const checkWin = useCallback((newBoard: BoardState, n: Nivel) => {
    if (!newBoard.every((v, i) => v === i)) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const t = elapsedRef.current;
    const prev = bestTimes[n.id];
    if (prev === undefined || t < prev) {
      saveBest(n.id, t);
      setNewRecord(true);
    }
    setTimeout(() => setFase('fin'), 400);
  }, [bestTimes, saveBest]);

  const handleDrop = useCallback((piezaIdx: number, celdaIdx: number, currentNivel: Nivel) => {
    setBoard(prev => {
      const next = [...prev];
      const existente = next[celdaIdx];

      const origenEnTablero = next.findIndex(v => v === piezaIdx);
      if (origenEnTablero !== -1) {
        next[origenEnTablero] = null;
      }

      if (existente !== null && existente !== piezaIdx) {
        setTray(t => {
          const sinLaDrag = t.filter(p => p !== piezaIdx);
          return [...sinLaDrag, existente];
        });
      } else {
        setTray(t => t.filter(p => p !== piezaIdx));
      }

      next[celdaIdx] = piezaIdx;
      setMovs(m => m + 1);
      checkWin(next, currentNivel);
      return next;
    });
  }, [checkWin]);

  const quitarPieza = useCallback((celdaIdx: number) => {
    setBoard(prev => {
      const pieza = prev[celdaIdx];
      if (pieza === null) return prev;
      const next = [...prev];
      next[celdaIdx] = null;
      setTray(t => [...t, pieza]);
      return next;
    });
  }, []);

  const irAGrid = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDraggingPiece(null);
    setFase('grid');
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // PANTALLA: GRID DE SELECCIÓN
  // ─────────────────────────────────────────────────────────────────────────
  if (fase === 'grid') {
    return (
      <View style={s.container}>
        <LinearGradient colors={['#0f172a', '#1e293b', '#0f172a']} style={StyleSheet.absoluteFill} />
        <Text style={s.screenTitle}>Elige un nivel</Text>
        <Text style={s.screenSub}>Toca cualquier color para jugar</Text>
        <ScrollView contentContainerStyle={s.gridMenu} showsVerticalScrollIndicator={false}>
          {NIVELES.map(n => {
            const best = bestTimes[n.id];
            return (
              <TouchableOpacity
                key={n.id}
                style={[s.nivelCard, { borderColor: n.color }]}
                activeOpacity={0.8}
                onPress={() => { setNivel(n); setFase('detalle'); }}
              >
                <View style={[s.nivelCardImg, { backgroundColor: n.color + '22' }]}>
                  <Image source={n.img} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
                <View style={[s.nivelCardBadge, { backgroundColor: n.color }]}>
                  <Text style={[s.nivelCardBadgeText, { color: n.textoDark ? '#0f172a' : 'white' }]}>
                    {n.nombre}
                  </Text>
                </View>
                {best !== undefined
                  ? <Text style={s.nivelCardBest}>🏆 {fmt(best)}</Text>
                  : <Text style={s.nivelCardNoBest}>Sin récord</Text>
                }
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {/* Aquí NO le pasamos onPress, por lo que usará navigation.goBack() para salir del juego completo */}
        <FloatingBackBar label="Salir del Juego" />
      </View>
    );
  }

  const n = nivel!;

  // ─────────────────────────────────────────────────────────────────────────
  // PANTALLA: DETALLE
  // ─────────────────────────────────────────────────────────────────────────
  if (fase === 'detalle') {
    const best = bestTimes[n.id];
    return (
      <View style={s.container}>
        <LinearGradient colors={['#0f172a', '#1e293b', '#0f172a']} style={StyleSheet.absoluteFill} />
        <View style={[s.colorBadge, { backgroundColor: n.color + '33', borderColor: n.color, marginTop: Platform.OS === 'ios' ? 60 : 44 }]}>
          <Text style={[s.colorBadgeText, { color: n.color }]}>{n.nombre}</Text>
        </View>
        <Text style={s.menuSubtitle}>Rompecabezas 3×3 · 9 piezas</Text>
        <View style={s.menuImgWrapper}>
          <Image source={n.img} style={s.menuImg} resizeMode="contain" />
        </View>
        {best !== undefined
          ? <Text style={s.bestTimeText}>Tu récord: <Text style={{ color: '#f59e0b' }}>{fmt(best)}</Text></Text>
          : <Text style={s.bestTimeText}>Sin récord — ¡sé el primero!</Text>
        }
        <TouchableOpacity style={[s.btnPlay, { backgroundColor: n.color }]} onPress={() => iniciar(n)}>
          <Text style={[s.btnPlayText, { color: n.textoDark ? '#0f172a' : 'white' }]}>Jugar →</Text>
        </TouchableOpacity>
        
        {/* Aquí SI le pasamos onPress para que vuelva a la selección de color internamente */}
        <FloatingBackBar label="Elegir otro nivel" onPress={() => setFase('grid')} />
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PANTALLA: FIN
  // ─────────────────────────────────────────────────────────────────────────
  if (fase === 'fin') {
    const best = bestTimes[n.id];
    return (
      <View style={s.container}>
        <LinearGradient colors={['#0f172a', '#1e293b', '#0f172a']} style={StyleSheet.absoluteFill} />
        <View style={s.center}>
          <Text style={{ fontSize: 64 }}>🎉</Text>
          <Text style={s.finTitle}>¡{n.nombre} completado!</Text>
          {newRecord && (
            <View style={s.recordBadge}><Text style={s.recordText}>🏆 ¡Nuevo récord!</Text></View>
          )}
          <View style={s.statsRow}>
            <View style={s.statBox}>
              <Text style={s.statVal}>{fmt(elapsed)}</Text>
              <Text style={s.statLbl}>tu tiempo</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statVal}>{best !== undefined ? fmt(best) : '—'}</Text>
              <Text style={s.statLbl}>récord</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statVal}>{movs}</Text>
              <Text style={s.statLbl}>movs</Text>
            </View>
          </View>
          <TouchableOpacity style={[s.btnPlay, { backgroundColor: n.color, marginTop: 28 }]} onPress={() => iniciar(n)}>
            <Text style={[s.btnPlayText, { color: n.textoDark ? '#0f172a' : 'white' }]}>Intentar de nuevo</Text>
          </TouchableOpacity>
        </View>

        {/* Floating back bar para volver al menú */}
        <FloatingBackBar label="Elegir otro nivel" onPress={irAGrid} />
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PANTALLA: JUGANDO
  // ─────────────────────────────────────────────────────────────────────────
  const correctas = board.filter((v, i) => v === i).length;
  const best      = bestTimes[n.id];

  return (
    <View style={[s.container, { overflow: 'visible' }]}>
      <LinearGradient colors={['#0f172a', '#1e293b', '#0f172a']} style={StyleSheet.absoluteFill} />

      <View style={s.header}>
        <View style={s.thumbWrapper}>
          <Image source={n.img} style={s.thumb} resizeMode="contain" />
          <Text style={s.thumbLabel}>ejemplo</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={[s.colorBadgeSmall, { backgroundColor: n.color + '33', borderColor: n.color }]}>
            <Text style={[s.colorBadgeSmallText, { color: n.color }]}>{n.nombre}</Text>
          </View>
          <Text style={s.timerBig}>{fmt(elapsed)}</Text>
          {best !== undefined && <Text style={s.bestTimeSm}>récord {fmt(best)}</Text>}
        </View>
        <View style={s.pieceProgress}>
          <Text style={s.pieceProgressNum}>{correctas}</Text>
          <Text style={s.pieceProgressDen}>/{GRID * GRID}</Text>
          <Text style={s.pieceProgressLbl}>piezas</Text>
        </View>
      </View>

      <View
        ref={boardRef}
        style={s.board}
        onLayout={() => {
          boardRef.current?.measure((_x, _y, w, h, px, py) => {
            boardLayout.current = { x: px, y: py, width: w, height: h };
          });
        }}
      >
        {board.map((pieza, celdaIdx) => (
          <CeldaDropZone
            key={celdaIdx}
            celdaIdx={celdaIdx}
            pieza={pieza}
            nivelImg={n.img}
            onQuitar={quitarPieza}
            esCorrecta={pieza === celdaIdx}
          />
        ))}
      </View>

      <View style={s.trayContainer}>
        <Text style={s.trayArrowText}>‹</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.trayScroll}>
          {tray.map(piezaIdx => (
            <DraggablePiece
              key={piezaIdx}
              piezaIdx={piezaIdx}
              nivelImg={n.img}
              boardLayout={boardLayout}
              currentNivel={n}
              onDrop={handleDrop}
              onDragging={setDraggingPiece}
            />
          ))}
          {tray.length === 0 && (
            <View style={{ justifyContent: 'center', paddingHorizontal: 20 }}>
              <Text style={{ color: '#4ade80', fontSize: 13 }}>✓ Todas las piezas colocadas</Text>
            </View>
          )}
        </ScrollView>
        <Text style={s.trayArrowText}>›</Text>
      </View>

      <Text style={s.instruccion}>
        Arrastra piezas al tablero · Toca una pieza colocada para devolverla
      </Text>

      {draggingPiece && (
        <FloatingDragPiece
          piezaIdx={draggingPiece.piezaIdx}
          nivelImg={n.img}
          x={draggingPiece.x}
          y={draggingPiece.y}
        />
      )}

      {/* Floating back bar remplazando al botón anterior para mantener el mismo diseño del backbar */}
      <FloatingBackBar label="Abandonar nivel" onPress={irAGrid} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTES AUXILIARES
// (FloatingDragPiece, CeldaDropZone, DraggablePiece y los estilos se mantienen
// exactamente igual que en tu código original para no afectar las animaciones y la UI)
// ─────────────────────────────────────────────────────────────────────────────

function FloatingDragPiece({ piezaIdx, nivelImg, x, y }: { piezaIdx: number; nivelImg: ImageSourcePropType; x: number; y: number; }) {
  const SIZE  = TRAY_CELL + 10;
  const inner = SIZE - 8;
  const row   = Math.floor(piezaIdx / GRID);
  const col   = piezaIdx % GRID;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute', left: x - SIZE / 2, top:  y - SIZE / 2, width:  SIZE, height: SIZE,
        borderRadius: 12, borderWidth: 2, borderColor: '#22d3ee', backgroundColor: '#0f172a',
        overflow: 'hidden', zIndex: 9999, elevation: 20, opacity: 0.95,
      }}
    >
      <View style={{ width: inner, height: inner, overflow: 'hidden', margin: 4, borderRadius: 8 }}>
        <Image
          source={nivelImg}
          style={{ width:  inner * GRID, height: inner * GRID, transform: [{ translateX: -col * inner }, { translateY: -row * inner }] }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

function CeldaDropZone({ celdaIdx, pieza, nivelImg, onQuitar, esCorrecta }: { celdaIdx: number; pieza: number | null; nivelImg: ImageSourcePropType; onQuitar: (i: number) => void; esCorrecta: boolean; }) {
  const row   = pieza !== null ? Math.floor(pieza / GRID) : 0;
  const col   = pieza !== null ? pieza % GRID : 0;
  const inner = CELL - 6;

  return (
    <TouchableOpacity
      activeOpacity={pieza !== null ? 0.75 : 1}
      onPress={() => pieza !== null && onQuitar(celdaIdx)}
      style={[s.celda, pieza === null && s.celdaVacia, esCorrecta && s.celdaCorrecta]}
    >
      {pieza !== null ? (
        <View style={{ width: inner, height: inner, overflow: 'hidden', borderRadius: 4 }}>
          <Image
            source={nivelImg}
            style={{ width:  inner * GRID, height: inner * GRID, transform: [{ translateX: -col * inner }, { translateY: -row * inner }] }}
            resizeMode="cover"
          />
        </View>
      ) : (
        <Text style={s.celdaVaciaText}>{celdaIdx + 1}</Text>
      )}
      {esCorrecta && pieza !== null && (
        <View style={s.checkBadge}>
          <Text style={{ color: '#4ade80', fontSize: 9, fontWeight: 'bold' }}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function DraggablePiece({ piezaIdx, nivelImg, boardLayout, currentNivel, onDrop, onDragging }: { piezaIdx: number; nivelImg: ImageSourcePropType; boardLayout: React.MutableRefObject<{ x: number; y: number; width: number; height: number }>; currentNivel: Nivel; onDrop: (pieza: number, celda: number, nivel: Nivel) => void; onDragging: (info: { piezaIdx: number; x: number; y: number } | null) => void; }) {
  const pan   = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const inner = TRAY_CELL - 8;
  const row   = Math.floor(piezaIdx / GRID);
  const col   = piezaIdx % GRID;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,

      onPanResponderGrant: (evt) => {
        pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
        pan.setValue({ x: 0, y: 0 });
        Animated.parallel([
          Animated.spring(scale,   { toValue: 1.25, useNativeDriver: false }),
          Animated.timing(opacity, { toValue: 0,    duration: 80, useNativeDriver: false }),
        ]).start();
        onDragging({ piezaIdx, x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY });
      },

      onPanResponderMove: (evt, gestureState) => {
        pan.x.setValue(gestureState.dx);
        pan.y.setValue(gestureState.dy);
        onDragging({ piezaIdx, x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY });
      },

      onPanResponderRelease: (evt) => {
        pan.flattenOffset();
        Animated.parallel([
          Animated.spring(pan,     { toValue: { x: 0, y: 0 }, useNativeDriver: false }),
          Animated.spring(scale,   { toValue: 1,               useNativeDriver: false }),
          Animated.timing(opacity, { toValue: 1, duration: 80, useNativeDriver: false }),
        ]).start();
        onDragging(null);

        const { pageX, pageY } = evt.nativeEvent;
        const bl = boardLayout.current;
        if (pageX >= bl.x && pageX <= bl.x + bl.width && pageY >= bl.y && pageY <= bl.y + bl.height) {
          const cellW  = bl.width  / GRID;
          const cellH  = bl.height / GRID;
          const celCol = Math.min(GRID - 1, Math.floor((pageX - bl.x) / cellW));
          const celRow = Math.min(GRID - 1, Math.floor((pageY - bl.y) / cellH));
          onDrop(piezaIdx, celRow * GRID + celCol, currentNivel);
        }
      },

      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(pan,     { toValue: { x: 0, y: 0 }, useNativeDriver: false }),
          Animated.spring(scale,   { toValue: 1,               useNativeDriver: false }),
          Animated.timing(opacity, { toValue: 1, duration: 80, useNativeDriver: false }),
        ]).start();
        onDragging(null);
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[ s.trayPiece, { opacity, transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale }] } ]}
    >
      <View style={{ width: inner, height: inner, overflow: 'hidden', borderRadius: 6 }}>
        <Image
          source={nivelImg}
          style={{ width:  inner * GRID, height: inner * GRID, transform: [{ translateX: -col * inner }, { translateY: -row * inner }] }}
          resizeMode="cover"
        />
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },

  screenTitle: { color: 'white', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginTop: Platform.OS === 'ios' ? 60 : 44, marginBottom: 4 },
  screenSub:   { color: '#64748b', fontSize: 14, textAlign: 'center', marginBottom: 20 },

  gridMenu:   { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14, paddingHorizontal: 16, paddingBottom: 120 },
  nivelCard:        { width: (SW - 60) / 2, borderRadius: 16, borderWidth: 2, backgroundColor: '#1e293b', overflow: 'hidden' },
  nivelCardImg:     { width: '100%', height: 110 },
  nivelCardBadge:   { paddingVertical: 6, alignItems: 'center' },
  nivelCardBadgeText:{ fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  nivelCardBest:    { color: '#f59e0b', fontSize: 11, textAlign: 'center', paddingBottom: 8 },
  nivelCardNoBest:  { color: '#475569', fontSize: 11, textAlign: 'center', paddingBottom: 8 },

  colorBadge:         { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 24, paddingVertical: 8, alignSelf: 'center' },
  colorBadgeText:     { fontSize: 22, fontWeight: 'bold', letterSpacing: 2 },
  colorBadgeSmall:    { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 3, marginBottom: 4 },
  colorBadgeSmallText: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },

  menuSubtitle:   { color: '#64748b', fontSize: 14, marginTop: 6, marginBottom: 20, textAlign: 'center' },
  menuImgWrapper: { width: SW * 0.6, height: SW * 0.6, borderRadius: 18, overflow: 'hidden', borderWidth: 2, borderColor: '#334155', marginBottom: 20, alignSelf: 'center' },
  menuImg:        { width: '100%', height: '100%' },
  bestTimeText:   { color: '#94a3b8', fontSize: 14, marginBottom: 20, textAlign: 'center' },
  btnPlay:        { paddingVertical: 15, paddingHorizontal: 48, borderRadius: 16, alignItems: 'center', alignSelf: 'center' },
  btnPlayText:    { fontWeight: 'bold', fontSize: 17 },

  header:              { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 48 : 28, paddingBottom: 8, gap: 8 },
  thumbWrapper:        { alignItems: 'center' },
  thumb:               { width: 68, height: 68, borderRadius: 10, borderWidth: 1.5, borderColor: '#334155' },
  thumbLabel:          { color: '#475569', fontSize: 9, marginTop: 2 },
  timerBig:            { color: 'white', fontSize: 28, fontWeight: 'bold', letterSpacing: 1 },
  bestTimeSm:          { color: '#64748b', fontSize: 11, marginTop: 2 },
  pieceProgress:       { alignItems: 'center' },
  pieceProgressNum:    { color: '#4ade80', fontSize: 24, fontWeight: 'bold' },
  pieceProgressDen:    { color: '#475569', fontSize: 14 },
  pieceProgressLbl:    { color: '#475569', fontSize: 10 },

  board: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, alignSelf: 'center', width: BOARD_SIZE, marginBottom: 10 },
  celda: { width: CELL, height: CELL, borderRadius: 8, borderWidth: 2, borderColor: '#334155', backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center' },
  celdaVacia:     { borderStyle: 'dashed', borderColor: '#475569', backgroundColor: '#0f172a' },
  celdaVaciaText: { color: '#334155', fontSize: 13 },
  celdaCorrecta:  { borderColor: '#4ade80', borderWidth: 2.5 },
  checkBadge:     { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 8, padding: 2 },

  trayContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 18, marginHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#334155', marginBottom: 6, minHeight: TRAY_CELL + 20, overflow: 'visible' },
  trayArrowText: { color: '#475569', fontSize: 26, lineHeight: 30, paddingHorizontal: 8 },
  trayScroll:    { flexDirection: 'row', gap: 8, paddingHorizontal: 4, alignItems: 'center' },
  trayPiece: { width: TRAY_CELL, height: TRAY_CELL, borderRadius: 10, borderWidth: 1.5, borderColor: '#475569', backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 6, zIndex: 10 },

  instruccion: { color: '#475569', fontSize: 11, textAlign: 'center', paddingHorizontal: 20, marginBottom: 8 },

  finTitle:    { color: 'white', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginTop: 12, marginBottom: 8 },
  recordBadge: { backgroundColor: '#451a03', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 24, borderWidth: 1, borderColor: '#b45309' },
  recordText:  { color: '#f59e0b', fontWeight: 'bold', fontSize: 14 },
  statsRow:    { flexDirection: 'row', gap: 20, marginBottom: 8 },
  statBox:     { backgroundColor: '#1e293b', borderRadius: 12, padding: 12, minWidth: 80, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  statVal:     { color: 'white', fontSize: 22, fontWeight: 'bold' },
  statLbl:     { color: '#64748b', fontSize: 12, marginTop: 4 },
});