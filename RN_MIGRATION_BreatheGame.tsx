// src/games/breathe/BreatheGame.tsx
// EXACT 1:1 migration from Next.js Breathe With Honeydew
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';
import HoneydewMascot from '../../components/HoneydewMascot';
import {COLORS} from '../../constants/colors';

const {width, height} = Dimensions.get('window');

// 4-2-6 breathing rhythm (single cycle ≈ 12 s)
const INHALE = 4000;
const HOLD = 2000;
const EXHALE = 6000;
const TOTAL = INHALE + HOLD + EXHALE;

type Phase = 'inhale' | 'hold' | 'exhale';
type Screen = 'welcome' | 'breathing' | 'complete';

// Cubic bezier helper
function bez(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

// Smooth ease-in-out
function ease(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function BreatheGame() {
  const [screen, setScreen] = useState<Screen>('welcome');

  return (
    <View style={styles.container}>
      {screen === 'welcome' && (
        <WelcomeScreen onStart={() => setScreen('breathing')} />
      )}
      {screen === 'breathing' && (
        <BreathingExperience onComplete={() => setScreen('complete')} />
      )}
      {screen === 'complete' && <CompletionScreen />}
    </View>
  );
}

// ── Welcome Screen ────────────────────────────────────────────────────────────
function WelcomeScreen({onStart}: {onStart: () => void}) {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.welcomeContent}>
        <View style={styles.mascotContainer}>
          <HoneydewMascot size={120} />
        </View>

        <Text style={styles.welcomeTitle}>Breathe With Honeydew</Text>

        <Text style={styles.welcomeDescription}>
          One calm breath to reset your mind. Follow Zummie through a gentle
          breathing cycle.
        </Text>

        <TouchableOpacity
          onPress={onStart}
          style={styles.button}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Let's Breathe</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Breathing Experience ──────────────────────────────────────────────────────
function BreathingExperience({onComplete}: {onComplete: () => void}) {
  const [phase, setPhase] = useState<Phase>('inhale');
  const [pos, setPos] = useState({x: 0, y: 80});
  const textOpacity = useRef(new Animated.Value(1)).current;
  const rafRef = useRef<number>(0);
  const startRef = useRef(Date.now());
  const doneRef = useRef(false);

  useEffect(() => {
    startRef.current = Date.now();
    doneRef.current = false;

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const progress = Math.min(1, elapsed / TOTAL);

      // ── Phase ─────────────────────────────────────────────────────────────
      const newPhase: Phase =
        elapsed < INHALE
          ? 'inhale'
          : elapsed < INHALE + HOLD
          ? 'hold'
          : 'exhale';
      if (phase !== newPhase) {
        setPhase(newPhase);
      }

      // ── Mascot position along a smooth arch ───────────────────────────────
      let x: number, y: number;

      if (elapsed <= INHALE) {
        const t = ease(elapsed / INHALE);
        x = bez(t, 0, 20, 40, 52);
        y = bez(t, 80, 80, 15, 15);
      } else if (elapsed <= INHALE + HOLD) {
        const t = (elapsed - INHALE) / HOLD;
        // Gentle float at the peak
        x = 52 + Math.sin(t * Math.PI) * 2;
        y = 15 + Math.sin(t * Math.PI * 2) * 2;
      } else {
        const t = ease((elapsed - INHALE - HOLD) / EXHALE);
        x = bez(t, 52, 65, 82, 100);
        y = bez(t, 15, 15, 80, 80);
        // Fade instruction text in last 1.5 s
        const remaining = TOTAL - elapsed;
        if (remaining < 1500) {
          Animated.timing(textOpacity, {
            toValue: Math.max(0, remaining / 1500),
            duration: 100,
            useNativeDriver: true,
          }).start();
        }
      }

      setPos({x, y});

      // ── Completion ─────────────────────────────────────────────────────────
      if (progress >= 1 && !doneRef.current) {
        doneRef.current = true;
        setTimeout(onComplete, 500);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [onComplete, phase, textOpacity]);

  const label =
    phase === 'inhale' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out';

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Phase instruction */}
      <Animated.View style={[styles.phaseLabel, {opacity: textOpacity}]}>
        <Text style={styles.phaseText}>{label}</Text>
      </Animated.View>

      {/* Arch guide + mascot */}
      <View style={styles.archContainer}>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={StyleSheet.absoluteFill}>
          {/* Arch path */}
          <Path
            d="M 0 80 C 20 80, 40 15, 52 15 C 65 15, 82 80, 100 80"
            fill="none"
            stroke={COLORS.sageMist}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.55"
          />
          {/* Subtle fill under arch */}
          <Path
            d="M 0 80 C 20 80, 40 15, 52 15 C 65 15, 82 80, 100 80 L 100 100 L 0 100 Z"
            fill={COLORS.sageMist}
            opacity="0.10"
          />
        </Svg>

        {/* Mascot travels along the arch */}
        <View
          style={[
            styles.mascotPosition,
            {
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            },
          ]}>
          <HoneydewMascot size={80} />
        </View>
      </View>
    </SafeAreaView>
  );
}

// ── Completion Screen ─────────────────────────────────────────────────────────
function CompletionScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <Animated.View style={[styles.completeContent, {opacity: fadeAnim}]}>
        <View style={styles.mascotContainer}>
          <HoneydewMascot size={120} />
        </View>

        <Text style={styles.completeTitle}>Heyy...</Text>

        <Text style={styles.completeDescription}>
          you took a moment for yourself
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Home' as never)}
          style={styles.button}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  welcomeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  mascotContainer: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.deepOcean,
    letterSpacing: -0.7,
    lineHeight: 40,
    marginBottom: 16,
  },
  welcomeDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.lavenderFog,
    opacity: 0.85,
    lineHeight: 21,
    maxWidth: 280,
    marginBottom: 64,
  },
  button: {
    width: '100%',
    maxWidth: 340,
    height: 58,
    backgroundColor: COLORS.lavenderFog,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.white,
  },
  phaseLabel: {
    position: 'absolute',
    top: '14%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  phaseText: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.deepOcean,
    letterSpacing: -0.6,
  },
  archContainer: {
    height: '55%',
    width: '100%',
    paddingHorizontal: 16,
    position: 'relative',
  },
  mascotPosition: {
    position: 'absolute',
    transform: [{translateX: -40}, {translateY: -40}],
  },
  completeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  completeTitle: {
    fontSize: 36,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.deepOcean,
    letterSpacing: -0.7,
    lineHeight: 40,
    marginBottom: 8,
  },
  completeDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.lavenderFog,
    opacity: 0.85,
    lineHeight: 20,
    marginBottom: 64,
  },
});
