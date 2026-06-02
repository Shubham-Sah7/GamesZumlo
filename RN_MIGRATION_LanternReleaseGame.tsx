// src/games/lanternRelease/LanternReleaseGame.tsx
// EXACT 1:1 migration from Next.js Lantern Release
// Requires @shopify/react-native-skia
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg, {Ellipse, Rect, Line, Path} from 'react-native-svg';
import {Canvas, Circle, Group} from '@shopify/react-native-skia';
import {COLORS} from '../../constants/colors';

const {width: W, height: H} = Dimensions.get('window');

const FINAL_MESSAGES = ['Let it go.', 'You can move forward.', 'Tomorrow is a new day.'];
const EXAMPLES = ['Stress', 'Anxiety', 'Self doubt', 'Fear', 'Overthinking'];

type Phase = 'input' | 'rising' | 'complete';

export default function LanternReleaseGame() {
  const [phase, setPhase] = useState<Phase>('input');
  const [thought, setThought] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  const animRef = useRef({
    lanternY: H / 2,
    lanternX: W / 2,
    sway: 0,
    glow: 0,
    textAlpha: 1,
    particles: [] as Array<{x: number; y: number; vx: number; vy: number; alpha: number}>,
    messageAlpha: 0,
    messageTimer: 0,
    finalMessage: '',
  });
  
  const [lanternState, setLanternState] = useState({
    y: H / 2,
    x: W / 2,
    size: 80,
    textAlpha: 1,
    particles: [] as Array<{x: number; y: number; vx: number; vy: number; alpha: number}>,
  });
  
  const [messageState, setMessageState] = useState({alpha: 0, text: ''});
  const rafRef = useRef<number>(0);

  const handleRelease = () => {
    if (!inputValue.trim()) return;
    setThought(inputValue.trim());
    setPhase('rising');
    
    animRef.current = {
      lanternY: H / 2,
      lanternX: W / 2,
      sway: 0,
      glow: 0,
      textAlpha: 1,
      particles: [],
      messageAlpha: 0,
      messageTimer: 0,
      finalMessage: FINAL_MESSAGES[Math.floor(Math.random() * FINAL_MESSAGES.length)],
    };
  };

  useEffect(() => {
    if (phase !== 'rising' && phase !== 'complete') return;

    let time = 0;
    const animate = () => {
      time++;
      const state = animRef.current;

      if (phase === 'rising') {
        state.lanternY -= 0.8;
        state.sway = Math.sin(time * 0.03) * 8;
        state.lanternX = W / 2 + state.sway;
        
        if (state.glow < 1) state.glow += 0.015;
        
        if (state.lanternY < H * 0.3) {
          state.textAlpha = Math.max(0, state.textAlpha - 0.008);
        }
        
        if (time % 8 === 0 && state.particles.length < 30) {
          state.particles.push({
            x: state.lanternX + (Math.random() - 0.5) * 40,
            y: state.lanternY + 30 + Math.random() * 20,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -0.3 - Math.random() * 0.5,
            alpha: 0.6 + Math.random() * 0.4,
          });
        }
        
        state.particles = state.particles
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: p.alpha - 0.008,
          }))
          .filter(p => p.alpha > 0);
        
        const progress = Math.max(0, 1 - (H / 2 - state.lanternY) / (H * 0.7));
        const size = 80 * progress;
        
        setLanternState({
          y: state.lanternY,
          x: state.lanternX,
          size,
          textAlpha: state.textAlpha,
          particles: [...state.particles],
        });
        
        if (state.lanternY < -size) {
          setPhase('complete');
          state.messageTimer = 0;
        }
      } else if (phase === 'complete') {
        state.messageTimer++;
        
        if (state.messageAlpha < 1 && state.messageTimer < 60) {
          state.messageAlpha += 0.017;
        }
        
        if (state.messageTimer > 240) {
          state.messageAlpha = Math.max(0, state.messageAlpha - 0.017);
          
          if (state.messageAlpha <= 0) {
            setPhase('input');
            setInputValue('');
            setThought('');
          }
        }
        
        setMessageState({alpha: state.messageAlpha, text: state.finalMessage});
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {phase === 'input' && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}>
          <View style={styles.inputContent}>
            {/* Floating lantern SVG */}
            <View style={styles.lanternContainer}>
              <Svg width={110} height={145} viewBox="0 0 110 145">
                <Ellipse cx="55" cy="138" rx="35" ry="7" fill={COLORS.deepOcean} opacity="0.08" />
                <Rect x="28" y="18" width="54" height="90" rx="7" fill={COLORS.warmSunset} stroke={COLORS.deepOcean} strokeWidth="1.8" />
                <Line x1="28" y1="36" x2="82" y2="36" stroke={COLORS.deepOcean} strokeWidth="1" opacity="0.3" />
                <Line x1="28" y1="54" x2="82" y2="54" stroke={COLORS.deepOcean} strokeWidth="1" opacity="0.3" />
                <Line x1="28" y1="72" x2="82" y2="72" stroke={COLORS.deepOcean} strokeWidth="1" opacity="0.3" />
                <Line x1="28" y1="90" x2="82" y2="90" stroke={COLORS.deepOcean} strokeWidth="1" opacity="0.3" />
                <Ellipse cx="55" cy="18" rx="29" ry="5" fill={COLORS.deepOcean} />
                <Ellipse cx="55" cy="108" rx="29" ry="5" fill={COLORS.deepOcean} />
                <Path d="M 46 18 Q 46 9, 55 9 Q 64 9, 64 18" stroke={COLORS.deepOcean} strokeWidth="2" fill="none" />
              </Svg>
            </View>

            <Text style={styles.question}>What would you like to let go of today?</Text>
            
            <Text style={styles.examples}>{EXAMPLES.join(' • ')}</Text>

            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleRelease}
              placeholder="Type here..."
              placeholderTextColor={`${COLORS.deepOcean}80`}
              style={styles.input}
              autoFocus
            />

            <TouchableOpacity
              onPress={handleRelease}
              disabled={!inputValue.trim()}
              style={[
                styles.button,
                {
                  backgroundColor: inputValue.trim() ? COLORS.lavenderFog : COLORS.sageMist,
                  opacity: inputValue.trim() ? 1 : 0.5,
                },
              ]}
              activeOpacity={0.8}>
              <Text style={styles.buttonText}>Release</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {(phase === 'rising' || phase === 'complete') && (
        <Canvas style={styles.canvas}>
          {/* Particles */}
          {lanternState.particles.map((p, i) => (
            <Circle key={i} cx={p.x} cy={p.y} r={2} color={COLORS.warmSunset} opacity={p.alpha} />
          ))}
        </Canvas>
      )}

      {phase === 'rising' && lanternState.size > 0 && (
        <View style={[styles.lanternWrapper, {left: lanternState.x - 40, top: lanternState.y - 48}]}>
          <Svg width={lanternState.size} height={lanternState.size * 1.2} viewBox="0 0 80 96">
            <Rect x="16" y="0" width="48" height="72" rx="6" fill={COLORS.warmSunset} stroke={COLORS.deepOcean} strokeWidth="1.8" />
            <Line x1="16" y1="18" x2="64" y2="18" stroke={COLORS.deepOcean} strokeWidth="1" opacity="0.3" />
            <Line x1="16" y1="36" x2="64" y2="36" stroke={COLORS.deepOcean} strokeWidth="1" opacity="0.3" />
            <Line x1="16" y1="54" x2="64" y2="54" stroke={COLORS.deepOcean} strokeWidth="1" opacity="0.3" />
            <Ellipse cx="40" cy="0" rx="26" ry="4" fill={COLORS.deepOcean} />
            <Ellipse cx="40" cy="72" rx="26" ry="4" fill={COLORS.deepOcean} />
          </Svg>
          
          {lanternState.textAlpha > 0 && lanternState.size > 30 && (
            <Text style={[styles.thoughtText, {opacity: lanternState.textAlpha, fontSize: lanternState.size * 0.18}]}>
              {thought}
            </Text>
          )}
        </View>
      )}

      {phase === 'complete' && (
        <View style={[styles.messageContainer, {opacity: messageState.alpha}]}>
          <Text style={styles.completeMessage}>{messageState.text}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  inputContainer: {
    flex: 1,
  },
  inputContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  lanternContainer: {
    marginBottom: 32,
  },
  question: {
    fontSize: 26,
    fontWeight: '500',
    textAlign: 'center',
    color: COLORS.lavenderFog,
    letterSpacing: -0.52,
    maxWidth: 320,
    marginBottom: 8,
    lineHeight: 34,
  },
  examples: {
    fontSize: 13,
    textAlign: 'center',
    color: COLORS.lavenderFog,
    opacity: 0.7,
    letterSpacing: 0.13,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    maxWidth: 340,
    height: 68,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.sageMist,
    paddingHorizontal: 24,
    fontSize: 16,
    color: COLORS.deepOcean,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 340,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.16,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  lanternWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thoughtText: {
    position: 'absolute',
    color: COLORS.deepOcean,
    textAlign: 'center',
    maxWidth: 60,
  },
  messageContainer: {
    position: 'absolute',
    top: H / 2,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  completeMessage: {
    fontSize: 28,
    color: COLORS.deepOcean,
    textAlign: 'center',
  },
});
