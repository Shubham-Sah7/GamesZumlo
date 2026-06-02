// src/games/boxBreathing/BoxBreathingGame.tsx
// EXACT 1:1 migration from Next.js Box Breathing
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated as RNAnimated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Svg, {Path, Defs, Filter, FeGaussianBlur, FeMerge, FeMergeNode, LinearGradient, Stop} from 'react-native-svg';
import HoneydewMascot from '../../components/HoneydewMascot';
import {COLORS} from '../../constants/colors';

const {width, height} = Dimensions.get('window');

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2';
type Screen = 'welcome' | 'breathing' | 'complete';

const PHASES = [
  { phase: 'inhale' as Phase, duration: 4000, label: 'Breathe In',  seconds: 4 },
  { phase: 'hold1'  as Phase, duration: 2000, label: 'Hold',        seconds: 2 },
  { phase: 'exhale' as Phase, duration: 6000, label: 'Breathe Out', seconds: 6 },
  { phase: 'hold2'  as Phase, duration: 2000, label: 'Hold',        seconds: 2 },
];

const TOTAL_DURATION = 14000;

// Pill path geometry - ViewBox 200 × 560
// Pill: x 50-150 (width 100), radius 50
// Straight sections: y 100 → 460  (360 units each)
// Perimeter ≈ 2×360 + 2×(π×50) = 1034
// Starts bottom-left, travels UP left side → top cap → DOWN right side → bottom cap
const VB_W = 200;
const VB_H = 560;
const PILL_PATH = 'M 50,460 L 50,100 A 50 50 0 1 1 150,100 L 150,460 A 50 50 0 1 1 50,460 Z';
const FALLBACK_LENGTH = 1034;

// Per-phase accent colors (ambient background tint)
const PHASE_COLORS: Record<Phase, string> = {
  inhale: 'rgba(87, 169, 154, 0.18)',
  hold1:  'rgba(118, 100, 139, 0.14)',
  exhale: 'rgba(87, 169, 154, 0.08)',
  hold2:  'rgba(245, 154, 74, 0.08)',
};

// Helper to get point at length along SVG path (simplified for pill shape)
function getPointAtLength(length: number, totalLength: number) {
  // Pill geometry: bottom-left → up left side → top arc → down right side → bottom arc
  const leftStraight = 360;
  const topArc = Math.PI * 50;
  const rightStraight = 360;
  const bottomArc = Math.PI * 50;
  
  if (length <= leftStraight) {
    // Going up left side
    return { x: 50, y: 460 - length };
  } else if (length <= leftStraight + topArc) {
    // Top arc (counterclockwise from left to right)
    const arcProgress = (length - leftStraight) / topArc;
    const angle = Math.PI + arcProgress * Math.PI;
    return {
      x: 100 + Math.cos(angle) * 50,
      y: 100 + Math.sin(angle) * 50,
    };
  } else if (length <= leftStraight + topArc + rightStraight) {
    // Going down right side
    const rightProgress = length - leftStraight - topArc;
    return { x: 150, y: 100 + rightProgress };
  } else {
    // Bottom arc (counterclockwise from right to left)
    const arcProgress = (length - leftStraight - topArc - rightStraight) / bottomArc;
    const angle = arcProgress * Math.PI;
    return {
      x: 100 + Math.cos(angle) * 50,
      y: 460 + Math.sin(angle) * 50,
    };
  }
}

export default function BoxBreathingGame() {
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
          <HoneydewMascot size={140} />
        </View>

        <Text style={styles.welcomeTitle}>Breathing</Text>

        <Text style={styles.welcomeDescription}>
          Follow Zummi and breathe at its pace.
        </Text>

        <TouchableOpacity
          onPress={onStart}
          style={[styles.button, styles.breathingButton]}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Let's Begin</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Breathing Experience ──────────────────────────────────────────────────────
function BreathingExperience({onComplete}: {onComplete: () => void}) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [trailLength, setTrailLength] = useState(0);
  const [zummiPos, setZummiPos] = useState({ x: 50, y: 460 });
  
  const fadeAnim = useRef(new RNAnimated.Value(1)).current;
  const rafRef = useRef<number>(0);
  const startRef = useRef(0);
  const completedRef = useRef(false);
  const fadedRef = useRef(false);

  const pathLength = FALLBACK_LENGTH;

  useEffect(() => {
    startRef.current = Date.now();
    completedRef.current = false;
    fadedRef.current = false;
    setTrailLength(0);
    setPhaseIdx(0);
    setPhaseProgress(0);
    setZummiPos({ x: 50, y: 460 });
    fadeAnim.setValue(1);

    const animate = () => {
      if (completedRef.current) return;
      
      const elapsed = Date.now() - startRef.current;

      // Fade out in last second
      if (elapsed >= TOTAL_DURATION - 1000 && !fadedRef.current) {
        fadedRef.current = true;
        RNAnimated.timing(fadeAnim, {
          toValue: 0,
          duration: 1100,
          useNativeDriver: true,
        }).start();
      }

      if (elapsed >= TOTAL_DURATION) {
        completedRef.current = true;
        setTimeout(onComplete, 800);
        return;
      }

      // Determine current phase
      let accumulated = 0, idx = 0, phaseElapsed = 0;
      for (let i = 0; i < PHASES.length; i++) {
        if (elapsed < accumulated + PHASES[i].duration) {
          idx = i;
          phaseElapsed = elapsed - accumulated;
          break;
        }
        accumulated += PHASES[i].duration;
      }

      const t = Math.min(phaseElapsed / PHASES[idx].duration, 1);
      setPhaseIdx(idx);
      setPhaseProgress(t);

      // Calculate trail length and Zummi position
      const currentLength = (idx + t) * (pathLength / 4);
      setTrailLength(currentLength);

      const pt = getPointAtLength(currentLength, pathLength);
      setZummiPos(pt);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [onComplete, pathLength, fadeAnim]);

  const currentPhase = PHASES[phaseIdx];
  const countdown = Math.max(1, Math.ceil((1 - phaseProgress) * currentPhase.seconds));

  // Visual properties derived from breathing phase
  let glowPulse: number;
  let zummiScale: number;
  switch (currentPhase.phase) {
    case 'inhale':
      glowPulse  = 0.15 + phaseProgress * 0.85;
      zummiScale = 1.0  + phaseProgress * 0.22;
      break;
    case 'hold1':
      glowPulse  = 1.0;
      zummiScale = 1.22;
      break;
    case 'exhale':
      glowPulse  = 1.0  - phaseProgress * 0.85;
      zummiScale = 1.22 - phaseProgress * 0.22;
      break;
    default:
      glowPulse  = 0.15;
      zummiScale = 1.0;
  }

  // Zummi position (percentage within pill container)
  const pillContainerWidth = 130;
  const pillContainerHeight = Math.round(130 * (VB_H / VB_W)); // 364px

  return (
    <RNAnimated.View style={[styles.breathingScreen, {opacity: fadeAnim}]}>
      <SafeAreaView style={styles.breathingContent} edges={['top', 'bottom']}>
        {/* Dynamic background gradient following Zummi */}
        <View style={StyleSheet.absoluteFill}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: PHASE_COLORS[currentPhase.phase],
            }}
          />
        </View>

        {/* Phase label chip */}
        <View style={styles.phaseLabelContainer}>
          <View style={styles.phaseChip}>
            <Text style={styles.phaseLabel}>{currentPhase.label}</Text>
          </View>
        </View>

        {/* Spacer */}
        <View style={{flex: 1, minHeight: 16}} />

        {/* Pill path + Zummi */}
        <View
          style={{
            width: pillContainerWidth,
            height: pillContainerHeight,
            position: 'relative',
          }}>
          <Svg
            width={pillContainerWidth}
            height={pillContainerHeight}
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="bp-trail" x1="0%" y1="100%" x2="0%" y2="0%">
                <Stop offset="0%" stopColor="#5EEAD4" />
                <Stop offset="60%" stopColor="#57A99A" />
                <Stop offset="100%" stopColor="#818CF8" />
              </LinearGradient>
            </Defs>

            {/* Ghost guide track */}
            <Path
              d={PILL_PATH}
              fill="rgba(87,169,154,0.04)"
              stroke="rgba(87,169,154,0.18)"
              strokeWidth="3"
            />

            {/* Filled trail */}
            <Path
              d={PILL_PATH}
              fill="none"
              stroke="url(#bp-trail)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${trailLength} ${pathLength}`}
              opacity={0.75 + glowPulse * 0.25}
            />
          </Svg>

          {/* Zummi */}
          <View
            style={[
              styles.zummiContainer,
              {
                left: (zummiPos.x / VB_W) * pillContainerWidth - 31,
                top: (zummiPos.y / VB_H) * pillContainerHeight - 31,
                transform: [{scale: zummiScale}],
              },
            ]}>
            <HoneydewMascot size={62} />
          </View>
        </View>

        {/* Spacer */}
        <View style={{flex: 1, minHeight: 16}} />

        {/* Countdown */}
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>{countdown}</Text>

          {/* Phase progress pills */}
          <View style={styles.progressPills}>
            {PHASES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressPill,
                  {
                    width: i === phaseIdx ? 20 : 4,
                    backgroundColor:
                      i === phaseIdx
                        ? '#0D9488'
                        : 'rgba(13,148,136,0.2)',
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{height: 36}} />
      </SafeAreaView>
    </RNAnimated.View>
  );
}

// ── Completion Screen ─────────────────────────────────────────────────────────
function CompletionScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <RNAnimated.View style={[styles.completeContent, {opacity: fadeAnim}]}>
        <View style={styles.mascotContainer}>
          <HoneydewMascot size={140} />
        </View>

        <Text style={styles.completeTitle}>Heyy...</Text>

        <Text style={styles.completeDescription}>
          you found a moment of calm
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Home' as never)}
          style={[styles.button, styles.breathingButton]}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </RNAnimated.View>
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
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    color: '#083F56',
    letterSpacing: -0.56,
    lineHeight: 34,
    marginBottom: 16,
  },
  welcomeDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#083F56',
    opacity: 0.7,
    lineHeight: 25.6,
    maxWidth: 320,
    marginBottom: 48,
  },
  button: {
    width: '100%',
    maxWidth: 340,
    height: 58,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#57A99A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  breathingButton: {
    backgroundColor: '#57A99A',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.white,
  },
  breathingScreen: {
    flex: 1,
  },
  breathingContent: {
    flex: 1,
    alignItems: 'center',
  },
  phaseLabelContainer: {
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseChip: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  phaseLabel: {
    fontSize: 22,
    fontWeight: '600',
    color: '#083F56',
    letterSpacing: -0.22,
  },
  zummiContainer: {
    position: 'absolute',
    width: 62,
    height: 62,
  },
  countdownContainer: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  countdownText: {
    fontSize: 96,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: -6.72,
    lineHeight: 96,
  },
  progressPills: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  progressPill: {
    height: 4,
    borderRadius: 2,
  },
  completeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    color: '#083F56',
    letterSpacing: -0.64,
    lineHeight: 36,
    marginBottom: 12,
  },
  completeDescription: {
    fontSize: 18,
    textAlign: 'center',
    color: '#083F56',
    opacity: 0.7,
    lineHeight: 28.8,
    marginBottom: 48,
  },
});
