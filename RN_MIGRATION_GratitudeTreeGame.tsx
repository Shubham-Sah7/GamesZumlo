/**
 * React Native Migration: Gratitude Tree
 * 
 * 1:1 feature parity with Next.js implementation
 * Source: /components/gratitude-tree/
 * 
 * SETUP:
 * npm install react-native-svg @react-native-async-storage/async-storage
 * 
 * USAGE:
 * import { GratitudeTreeGame } from './games/gratitudeTree/GratitudeTreeGame'
 * <Stack.Screen name="GratitudeTree" component={GratitudeTreeGame} />
 */

import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg'
import AsyncStorage from '@react-native-async-storage/async-storage'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Entry {
  text: string
  date: string
}

type State = 'welcome' | 'experience' | 'complete'
type Phase = 'input' | 'growing' | 'done'
type Stage = 1 | 2 | 3 | 4 | 5

// ── Colors ────────────────────────────────────────────────────────────────────
const C = {
  bg: '#F0FFF0',
  trunk: '#8B6343',
  branch: '#A67C52',
  leafDark: '#3B8B7E',
  leafMid: '#57A99A',
  leafLight: '#7EC5BE',
  flower: '#F59A4A',
  flowerCtr: '#FFF0D8',
  ground: '#B8CBBE',
  text: '#083F56',
  lavender: '#76648B',
  muted: '#7A9E96',
}

const STAGE_LABELS: Record<number, string> = {
  1: 'Tiny Sapling',
  2: 'Small Tree',
  3: 'Growing Tree',
  4: 'Healthy Tree',
  5: 'Blooming Tree',
}

// ── Storage helpers ───────────────────────────────────────────────────────────
async function load(): Promise<Entry[]> {
  try {
    const data = await AsyncStorage.getItem('gratitude-entries')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

async function save(entries: Entry[], text: string): Promise<Entry[]> {
  const updated = [...entries, { text, date: new Date().toISOString() }]
  await AsyncStorage.setItem('gratitude-entries', JSON.stringify(updated))
  return updated
}

function calcStreak(entries: Entry[]): number {
  if (!entries.length) return 0
  const dates = [...new Set(entries.map((e) => e.date.slice(0, 10)))].sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10)
  if (dates[0] !== today && dates[0] !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    if (prev.getTime() - curr.getTime() === 864e5) streak++
    else break
  }
  return streak
}

function stage(count: number): Stage {
  if (count < 3) return 1
  if (count < 8) return 2
  if (count < 16) return 3
  if (count < 30) return 4
  return 5
}

// ── Tree SVG ──────────────────────────────────────────────────────────────────
function TreeSVG({ s, pulse }: { s: Stage; pulse: boolean }) {
  const vis = (min: number) => s >= min
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (pulse) {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.07, duration: 210, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.97, duration: 245, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 245, useNativeDriver: true }),
      ]).start()
    }
  }, [pulse])

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <Svg width={200} height={230} viewBox="0 0 200 230">
        {/* Ground */}
        <Ellipse cx="100" cy="222" rx="36" ry="7" fill={C.ground} opacity="0.45" />

        {/* Stage 1: thin sapling stem */}
        <G opacity={vis(1) ? 1 : 0}>
          <Path d="M100 222 Q99 210 100 196" stroke={C.trunk} strokeWidth="3" strokeLinecap="round" />
        </G>

        {/* Stage 1: two tiny leaves on the sapling */}
        <G opacity={vis(1) && !vis(2) ? 1 : 0}>
          <Ellipse
            cx="91"
            cy="193"
            rx="7"
            ry="10"
            fill={C.leafMid}
            opacity="0.9"
            rotation="-28"
            origin="91, 193"
          />
          <Ellipse
            cx="109"
            cy="193"
            rx="7"
            ry="10"
            fill={C.leafMid}
            opacity="0.9"
            rotation="28"
            origin="109, 193"
          />
        </G>

        {/* Stage 2+: proper trunk */}
        <G opacity={vis(2) ? 1 : 0}>
          <Path d="M93 222 C92 205 91 188 94 172 L106 172 C109 188 108 205 107 222 Z" fill={C.trunk} />
          <Path
            d="M98 222 C97 210 96 195 97 175"
            stroke="#7A4F2A"
            strokeWidth="0.8"
            opacity="0.35"
            strokeLinecap="round"
          />
        </G>

        {/* Stage 2: main round canopy */}
        <G opacity={vis(2) ? 1 : 0}>
          <Circle cx="100" cy="158" r="30" fill={C.leafMid} opacity="0.88" />
          <Circle cx="84" cy="166" r="20" fill={C.leafLight} opacity="0.80" />
          <Circle cx="116" cy="166" r="20" fill={C.leafLight} opacity="0.80" />
          <Circle cx="100" cy="142" r="20" fill={C.leafDark} opacity="0.72" />
        </G>

        {/* Stage 3: side branches + wider canopy */}
        <G opacity={vis(3) ? 1 : 0}>
          <Path d="M96 180 C88 172 76 167 68 163" stroke={C.branch} strokeWidth="4.5" strokeLinecap="round" />
          <Path d="M104 180 C112 172 124 167 132 163" stroke={C.branch} strokeWidth="4.5" strokeLinecap="round" />
          <Circle cx="68" cy="158" r="18" fill={C.leafMid} opacity="0.80" />
          <Circle cx="132" cy="158" r="18" fill={C.leafMid} opacity="0.80" />
          <Circle cx="82" cy="148" r="18" fill={C.leafLight} opacity="0.75" />
          <Circle cx="118" cy="148" r="18" fill={C.leafLight} opacity="0.75" />
          <Circle cx="100" cy="134" r="18" fill={C.leafDark} opacity="0.70" />
        </G>

        {/* Stage 4: extra volume all round */}
        <G opacity={vis(4) ? 1 : 0}>
          <Circle cx="55" cy="163" r="16" fill={C.leafLight} opacity="0.70" />
          <Circle cx="145" cy="163" r="16" fill={C.leafLight} opacity="0.70" />
          <Circle cx="70" cy="144" r="15" fill={C.leafMid} opacity="0.72" />
          <Circle cx="130" cy="144" r="15" fill={C.leafMid} opacity="0.72" />
          <Circle cx="88" cy="130" r="16" fill={C.leafDark} opacity="0.68" />
          <Circle cx="112" cy="130" r="16" fill={C.leafDark} opacity="0.68" />
          <Circle cx="100" cy="120" r="16" fill="#2F7A70" opacity="0.65" />
        </G>

        {/* Stage 5: flowers */}
        {([
          [78, 148],
          [122, 148],
          [62, 156],
          [138, 156],
          [100, 126],
          [88, 136],
          [112, 136],
        ] as const).map(([cx, cy], i) => (
          <G key={i} opacity={vis(5) ? 1 : 0}>
            <Circle cx={cx} cy={cy} r="6" fill={C.flower} />
            <Circle cx={cx} cy={cy} r="2.8" fill={C.flowerCtr} />
          </G>
        ))}

        {/* Stage 5: sparkle stars */}
        {([
          [52, 148],
          [148, 148],
          [45, 162],
          [155, 162],
        ] as const).map(([x, y], i) => (
          <G key={i} opacity={vis(5) ? 1 : 0}>
            <Path
              d={`M${x},${y - 5}L${x},${y + 5}M${x - 5},${y}L${x + 5},${y}`}
              stroke={C.flower}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <Path
              d={`M${x - 3.5},${y - 3.5}L${x + 3.5},${y + 3.5}M${x + 3.5},${y - 3.5}L${x - 3.5},${y + 3.5}`}
              stroke={C.flower}
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.6"
            />
          </G>
        ))}
      </Svg>
    </Animated.View>
  )
}

// ── Welcome Screen ────────────────────────────────────────────────────────────
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top', 'bottom']}>
      <View style={styles.welcomeContent}>
        <Text style={styles.title}>Gratitude Tree</Text>
        <Text style={styles.subtitle}>Take a moment to appreciate something good in your day.</Text>
        <TouchableOpacity style={styles.button} onPress={onStart} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Plant Gratitude</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

// ── Experience Screen ─────────────────────────────────────────────────────────
function ExperienceScreen({ onComplete }: { onComplete: () => void }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState<Phase>('input')
  const [pulse, setPulse] = useState(false)
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    load().then(setEntries)
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  const currentStage = stage(entries.length)
  const streak = calcStreak(entries)
  const isFirst = entries.length === 0
  const canSubmit = input.trim().length > 0

  const handleGrow = async () => {
    if (!canSubmit) return
    Keyboard.dismiss()
    setPhase('growing')
    setPulse(true)
    setTimeout(() => setPulse(false), 700)
    setTimeout(async () => {
      const updated = await save(entries, input.trim())
      setEntries(updated)
      setPhase('done')
      setTimeout(onComplete, 1600)
    }, 900)
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top', 'bottom']}>
      <View style={styles.experienceContainer}>
        {/* Stage label + streak */}
        <View style={styles.header}>
          <Text style={styles.stageLabel}>{STAGE_LABELS[currentStage]}</Text>
          {streak > 1 && <Text style={styles.streak}>🔥 {streak} day streak</Text>}
        </View>

        {/* Tree */}
        <View style={styles.treeContainer}>
          <TreeSVG s={currentStage} pulse={pulse} />
        </View>

        {/* Empty state */}
        {isFirst && phase === 'input' && (
          <Text style={styles.emptyState}>Every big tree starts with a single seed.</Text>
        )}

        {/* Post-grow confirmation */}
        {phase === 'done' && <Text style={styles.doneMessage}>✨ Your tree is growing</Text>}

        {/* Input area */}
        {phase === 'input' && (
          <>
            <Text style={styles.prompt}>What are you grateful for today?</Text>
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                value={input}
                onChangeText={(text) => setInput(text.slice(0, 60))}
                onSubmitEditing={handleGrow}
                placeholder="My family, a warm meal..."
                placeholderTextColor={C.muted}
                style={styles.input}
                maxLength={60}
                returnKeyType="done"
                blurOnSubmit={false}
              />
            </View>
            <Text style={styles.charCount}>{input.length}/60</Text>
            <TouchableOpacity
              style={[styles.growButton, !canSubmit && styles.growButtonDisabled]}
              onPress={handleGrow}
              disabled={!canSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.growButtonText}>Grow Tree 🌱</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Growing state */}
        {phase === 'growing' && (
          <View style={styles.growingState}>
            <Text style={styles.growingText}>Growing your tree...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

// ── Completion Screen ─────────────────────────────────────────────────────────
function CompletionScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top', 'bottom']}>
      <View style={styles.completionContent}>
        <Text style={styles.completionTitle}>Heyy...</Text>
        <Text style={styles.completionMessage}>your gratitude helped something grow</Text>
        <TouchableOpacity style={styles.button} onPress={onContinue} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function GratitudeTreeGame({ navigation }: any) {
  const [state, setState] = useState<State>('welcome')

  return (
    <View style={{ flex: 1 }}>
      {state === 'welcome' && <WelcomeScreen onStart={() => setState('experience')} />}
      {state === 'experience' && <ExperienceScreen onComplete={() => setState('complete')} />}
      {state === 'complete' && <CompletionScreen onContinue={() => navigation.goBack()} />}
    </View>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: C.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: C.muted,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  button: {
    backgroundColor: C.lavender,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 999,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  experienceContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stageLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  streak: {
    fontSize: 11,
    fontWeight: '500',
    color: C.lavender,
  },
  treeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 0,
  },
  emptyState: {
    textAlign: 'center',
    fontSize: 12,
    color: C.muted,
    marginBottom: 12,
  },
  doneMessage: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: C.leafMid,
    marginBottom: 12,
  },
  prompt: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    color: C.text,
    marginBottom: 16,
  },
  inputContainer: {
    borderBottomWidth: 1.5,
    borderBottomColor: C.lavender,
    paddingBottom: 8,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: 'transparent',
    fontSize: 15,
    color: C.text,
    textAlign: 'center',
    paddingVertical: Platform.OS === 'ios' ? 4 : 0,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 11,
    color: C.muted,
    opacity: 0.6,
    marginBottom: 20,
  },
  growButton: {
    backgroundColor: C.lavender,
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  growButtonDisabled: {
    backgroundColor: '#D0C8D8',
  },
  growButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  growingState: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  growingText: {
    fontSize: 15,
    fontWeight: '500',
    color: C.leafMid,
  },
  completionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: C.text,
    marginBottom: 8,
  },
  completionMessage: {
    fontSize: 16,
    color: C.muted,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
})
