// src/games/rainDropCleanse/RainDropCleanseGame.tsx
// EXACT 1:1 migration from Next.js Rain Drop Cleanse V2
// NOTE: Requires @shopify/react-native-skia for canvas-like drawing
// Install: npm install @shopify/react-native-skia

import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  GestureResponderEvent,
  Vibration,
} from 'react-native';
import {
  Canvas,
  Circle,
  Group,
  vec,
  useValue,
  runTiming,
  Easing,
  Path,
  RadialGradient,
  LinearGradient,
  Rect,
  Text as SkiaText,
  useFont,
} from '@shopify/react-native-skia';
import {COLORS} from '../../constants/colors';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const W = SCREEN_WIDTH;
const H = SCREEN_HEIGHT;

type Droplet = {
  id: number;
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  alpha: number;
  beingPushed: boolean;
  pushVx: number;
  pushVy: number;
};

type FingerPoint = {
  x: number;
  y: number;
  alpha: number;
};

export default function RainDropCleanseGame() {
  const [phase, setPhase] = useState<'wiping' | 'completion'>('wiping');
  const [clearedPercent, setClearedPercent] = useState(0);
  const [droplets, setDroplets] = useState<Droplet[]>([]);
  
  const dropletsRef = useRef<Droplet[]>([]);
  const nextIdRef = useRef(0);
  const isWipingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const fingerTrailRef = useRef<FingerPoint[]>([]);
  const completionTimerRef = useRef(0);
  const sunlightAlphaRef = useRef(0);
  const messageAlphaRef = useRef(0);
  
  // Grid for tracking cleared areas
  const gridW = 20;
  const gridH = 40;
  const clearedGridRef = useRef(new Uint8Array(gridW * gridH));
  const clearedCountRef = useRef(0);
  
  const rafRef = useRef<number>(0);

  // Initialize droplets
  useEffect(() => {
    const DROPLET_COUNT = 80;
    const initialDroplets: Droplet[] = [];
    
    for (let i = 0; i < DROPLET_COUNT; i++) {
      initialDroplets.push(createDroplet());
    }
    
    dropletsRef.current = initialDroplets;
    setDroplets(initialDroplets);
    
    // Start animation loop
    const animate = () => {
      updateAndRender();
      rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  function createDroplet(): Droplet {
    return {
      id: nextIdRef.current++,
      x: Math.random() * W,
      y: Math.random() * H,
      r: 3 + Math.random() * 9,
      vy: 0.05 + Math.random() * 0.15,
      vx: (Math.random() - 0.5) * 0.1,
      alpha: 0.5 + Math.random() * 0.4,
      beingPushed: false,
      pushVx: 0,
      pushVy: 0,
    };
  }

  function updateAndRender() {
    if (phase === 'wiping') {
      // Update droplets
      dropletsRef.current.forEach(d => {
        // Apply push velocity
        if (d.beingPushed) {
          d.x += d.pushVx;
          d.y += d.pushVy;
          
          // Friction
          d.pushVx *= 0.92;
          d.pushVy *= 0.92;
          
          if (Math.abs(d.pushVx) < 0.1 && Math.abs(d.pushVy) < 0.1) {
            d.beingPushed = false;
          }
        }

        // Gravity
        d.y += d.vy;
        d.x += d.vx;

        // Bounce off edges
        if (d.x < d.r) {
          d.x = d.r;
          d.vx *= -0.5;
          d.pushVx *= -0.5;
        }
        if (d.x > W - d.r) {
          d.x = W - d.r;
          d.vx *= -0.5;
          d.pushVx *= -0.5;
        }
        if (d.y > H + d.r) {
          d.alpha = 0;
        }

        // Merge with nearby droplets
        dropletsRef.current.forEach(other => {
          if (other.id !== d.id && other.alpha > 0 && d.alpha > 0) {
            const dist = Math.hypot(d.x - other.x, d.y - other.y);
            const minDist = d.r + other.r;

            if (dist < minDist * 0.8) {
              if (d.r >= other.r) {
                d.r = Math.min(15, Math.sqrt(d.r * d.r + other.r * other.r * 0.5));
                d.vy = Math.max(d.vy, other.vy);
                other.alpha = 0;
              }
            }
          }
        });
      });

      // Remove dead droplets
      dropletsRef.current = dropletsRef.current.filter(d => d.alpha > 0);

      // Fade out finger trail
      fingerTrailRef.current = fingerTrailRef.current
        .map(p => ({ ...p, alpha: p.alpha * 0.95 }))
        .filter(p => p.alpha > 0.05);

    } else if (phase === 'completion') {
      completionTimerRef.current++;

      // Remaining droplets slide away
      dropletsRef.current.forEach(d => {
        d.vy += 0.05;
        d.y += d.vy;
        d.alpha = Math.max(0, d.alpha - 0.02);
      });
      dropletsRef.current = dropletsRef.current.filter(d => d.alpha > 0 && d.y < H + 20);

      // Sunlight appears
      sunlightAlphaRef.current = Math.min(1, sunlightAlphaRef.current + 0.008);

      // Message appears
      if (completionTimerRef.current > 60) {
        messageAlphaRef.current = Math.min(1, messageAlphaRef.current + 0.015);
      }

      // Restart after message shown
      if (completionTimerRef.current > 300) {
        resetGame();
      }
    }

    setDroplets([...dropletsRef.current]);
  }

  function resetGame() {
    setPhase('wiping');
    setClearedPercent(0);
    clearedGridRef.current.fill(0);
    clearedCountRef.current = 0;
    completionTimerRef.current = 0;
    sunlightAlphaRef.current = 0;
    messageAlphaRef.current = 0;
    
    const DROPLET_COUNT = 80;
    const newDroplets: Droplet[] = [];
    for (let i = 0; i < DROPLET_COUNT; i++) {
      newDroplets.push(createDroplet());
    }
    dropletsRef.current = newDroplets;
    setDroplets(newDroplets);
  }

  function handleTouchStart(event: GestureResponderEvent) {
    const {locationX, locationY} = event.nativeEvent;
    isWipingRef.current = true;
    lastXRef.current = locationX;
    lastYRef.current = locationY;
    fingerTrailRef.current = [];
  }

  function handleTouchMove(event: GestureResponderEvent) {
    if (!isWipingRef.current || phase !== 'wiping') return;

    const {locationX: x, locationY: y} = event.nativeEvent;

    // Add to finger trail
    fingerTrailRef.current.push({ x, y, alpha: 0.3 });
    if (fingerTrailRef.current.length > 15) {
      fingerTrailRef.current.shift();
    }

    // Calculate swipe direction and speed
    const dx = x - lastXRef.current;
    const dy = y - lastYRef.current;
    const speed = Math.hypot(dx, dy);

    // Mark cleared areas in grid
    const swipeRadius = 35;
    const steps = Math.max(1, Math.ceil(speed / 5));
    
    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 0 : i / steps;
      const px = lastXRef.current + (x - lastXRef.current) * t;
      const py = lastYRef.current + (y - lastYRef.current) * t;

      const gx1 = Math.max(0, Math.floor((px - swipeRadius) / W * gridW));
      const gx2 = Math.min(gridW - 1, Math.ceil((px + swipeRadius) / W * gridW));
      const gy1 = Math.max(0, Math.floor((py - swipeRadius) / H * gridH));
      const gy2 = Math.min(gridH - 1, Math.ceil((py + swipeRadius) / H * gridH));

      for (let gy = gy1; gy <= gy2; gy++) {
        for (let gx = gx1; gx <= gx2; gx++) {
          const idx = gy * gridW + gx;
          if (!clearedGridRef.current[idx]) {
            clearedGridRef.current[idx] = 1;
            clearedCountRef.current++;
          }
        }
      }
    }

    // Push droplets away
    dropletsRef.current.forEach(d => {
      const dist = Math.hypot(d.x - x, d.y - y);
      const pushRadius = 40;

      if (dist < pushRadius) {
        const angle = Math.atan2(d.y - y, d.x - x);
        const pushForce = (1 - dist / pushRadius) * 3;
        
        d.beingPushed = true;
        d.pushVx = Math.cos(angle) * pushForce * (1 + speed * 0.1);
        d.pushVy = Math.sin(angle) * pushForce * (1 + speed * 0.1);
      }
    });

    // Update progress
    const percent = Math.floor((clearedCountRef.current / (gridW * gridH)) * 100);
    setClearedPercent(percent);

    // Check completion
    if (percent >= 88 && phase === 'wiping') {
      setPhase('completion');
      isWipingRef.current = false;
      Vibration.vibrate([50, 30, 50]);
    }

    lastXRef.current = x;
    lastYRef.current = y;
  }

  function handleTouchEnd() {
    isWipingRef.current = false;
    fingerTrailRef.current = [];
  }

  return (
    <View style={styles.container}>
      <View
        style={styles.canvasContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}>
        
        <Canvas style={styles.canvas}>
          {/* Background */}
          <Rect x={0} y={0} width={W} height={H} color={COLORS.honeydew} />

          {/* Background shapes (revealed as cleared) */}
          <Group opacity={0.1 + (clearedCountRef.current / (gridW * gridH)) * 0.15}>
            <Circle cx={W * 0.25} cy={H * 0.35} r={90} color={COLORS.sageMist} />
            <Circle cx={W * 0.75} cy={H * 0.65} r={110} color={COLORS.sageMist} />
            <Circle cx={W * 0.5} cy={H * 0.8} r={80} color={COLORS.sageMist} />
          </Group>

          {/* Droplets */}
          {droplets.map(d => (
            <Group key={d.id} opacity={d.alpha}>
              <Circle
                cx={d.x}
                cy={d.y}
                r={d.r}
                color="rgba(87, 169, 154, 0.4)">
                <RadialGradient
                  c={vec(d.x - d.r * 0.3, d.y - d.r * 0.3)}
                  r={d.r}
                  colors={[
                    'rgba(255, 255, 255, 0.9)',
                    'rgba(87, 169, 154, 0.6)',
                    'rgba(87, 169, 154, 0.2)',
                  ]}
                />
              </Circle>
              {/* Highlight */}
              <Circle
                cx={d.x - d.r * 0.35}
                cy={d.y - d.r * 0.35}
                r={d.r * 0.35}
                color="rgba(255, 255, 255, 0.7)"
                opacity={0.8}
              />
            </Group>
          ))}

          {/* Completion phase effects */}
          {phase === 'completion' && (
            <>
              {/* Sunlight */}
              <Rect x={0} y={0} width={W} height={H} opacity={sunlightAlphaRef.current * 0.25}>
                <RadialGradient
                  c={vec(W / 2, H / 3)}
                  r={W * 0.8}
                  colors={[COLORS.warmSunset, 'rgba(245, 154, 74, 0)']}
                />
              </Rect>
            </>
          )}
        </Canvas>
      </View>

      {/* Progress indicator */}
      {phase === 'wiping' && clearedPercent > 0 && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{clearedPercent}% cleared</Text>
        </View>
      )}

      {/* Completion message */}
      {phase === 'completion' && messageAlphaRef.current > 0 && (
        <View style={[styles.messageContainer, {opacity: messageAlphaRef.current}]}>
          <Text style={styles.messageTitle}>Your mind feels a little</Text>
          <Text style={styles.messageTitle}>clearer now.</Text>
          <Text style={styles.messageSubtitle}>Thank you for taking a moment</Text>
          <Text style={styles.messageSubtitle}>for yourself.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  canvasContainer: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  progressContainer: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 11,
    color: COLORS.lavenderFog,
    opacity: 0.6,
  },
  messageContainer: {
    position: 'absolute',
    top: H / 2 - 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  messageTitle: {
    fontSize: 22,
    color: COLORS.deepOcean,
    textAlign: 'center',
    marginBottom: 4,
  },
  messageSubtitle: {
    fontSize: 16,
    color: COLORS.lavenderFog,
    textAlign: 'center',
    marginTop: 12,
  },
});
