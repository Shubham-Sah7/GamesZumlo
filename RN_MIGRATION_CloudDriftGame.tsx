// src/games/cloudDrift/CloudDriftGame.tsx
// EXACT 1:1 migration from Next.js Cloud Drift
// Requires @shopify/react-native-skia
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, GestureResponderEvent} from 'react-native';
import {Canvas, Circle, Group, Text as SkiaText, useFont} from '@shopify/react-native-skia';
import {COLORS} from '../../constants/colors';

const {width: W, height: H} = Dimensions.get('window');

const NEGATIVE_THOUGHTS = ['Stress', 'Anxiety', 'Fear', 'Self Doubt', 'Overthinking'];
const POSITIVE_WORDS = ['Peace', 'Hope', 'Calm', 'Strength', 'Joy'];

type Cloud = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  negative: string;
  positive: string;
  drift: number;
  bob: number;
  bobSpeed: number;
  cleared: boolean;
  dissolving: boolean;
  dissolveProgress: number;
  particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
  }>;
  revealAlpha: number;
};

export default function CloudDriftGame() {
  const [phase, setPhase] = useState<'active' | 'complete'>('active');
  const [messageAlpha, setMessageAlpha] = useState(0);
  const [messageTimer, setMessageTimer] = useState(0);
  const [clouds, setClouds] = useState<Cloud[]>([]);
  
  const cloudsRef = useRef<Cloud[]>([]);
  const timeRef = useRef(0);
  const touchingRef = useRef<{cloudId: number; startX: number; startY: number} | null>(null);
  const rafRef = useRef<number>(0);

  // Initialize clouds
  useEffect(() => {
    const shuffledNegative = [...NEGATIVE_THOUGHTS].sort(() => Math.random() - 0.5);
    const shuffledPositive = [...POSITIVE_WORDS].sort(() => Math.random() - 0.5);
    
    const initialClouds = Array.from({length: 5}, (_, i) => ({
      id: i,
      x: 40 + Math.random() * (W - 180),
      y: 100 + i * 140 + Math.random() * 40,
      width: 120 + Math.random() * 60,
      height: 60 + Math.random() * 30,
      negative: shuffledNegative[i],
      positive: shuffledPositive[i],
      drift: Math.random() * Math.PI * 2,
      bob: 0,
      bobSpeed: 0.015 + Math.random() * 0.01,
      cleared: false,
      dissolving: false,
      dissolveProgress: 0,
      particles: [],
      revealAlpha: 0,
    }));
    
    cloudsRef.current = initialClouds;
    setClouds(initialClouds);

    // Animation loop
    const animate = () => {
      updateGame();
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function updateGame() {
    timeRef.current++;
    const time = timeRef.current;

    if (phase === 'active') {
      cloudsRef.current.forEach(cloud => {
        if (cloud.cleared) {
          if (cloud.revealAlpha < 1) {
            cloud.revealAlpha = Math.min(1, cloud.revealAlpha + 0.02);
          }
          return;
        }

        if (cloud.dissolving) {
          cloud.dissolveProgress += 0.015;
          
          cloud.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy -= 0.02;
            p.alpha = Math.max(0, p.alpha - 0.012);
          });

          if (cloud.dissolveProgress >= 1 && cloud.particles.every(p => p.alpha <= 0)) {
            cloud.cleared = true;
            cloud.dissolving = false;
          }
          return;
        }

        cloud.drift += 0.003;
        cloud.bob = Math.sin(time * cloud.bobSpeed) * 6;
      });

      // Check if all cleared
      if (cloudsRef.current.every(c => c.cleared)) {
        setPhase('complete');
        setMessageTimer(0);
        setMessageAlpha(0);
      }

      setClouds([...cloudsRef.current]);
    } else if (phase === 'complete') {
      setMessageTimer(prev => prev + 1);
      
      if (messageAlpha < 1 && messageTimer < 60) {
        setMessageAlpha(prev => Math.min(1, prev + 0.017));
      }
      
      if (messageTimer > 240) {
        setMessageAlpha(prev => Math.max(0, prev - 0.017));
        
        if (messageAlpha <= 0) {
          // Restart
          resetGame();
        }
      }
    }
  }

  function resetGame() {
    setPhase('active');
    const shuffledNegative = [...NEGATIVE_THOUGHTS].sort(() => Math.random() - 0.5);
    const shuffledPositive = [...POSITIVE_WORDS].sort(() => Math.random() - 0.5);
    
    const newClouds = Array.from({length: 5}, (_, i) => ({
      id: i,
      x: 40 + Math.random() * (W - 180),
      y: 100 + i * 140 + Math.random() * 40,
      width: 120 + Math.random() * 60,
      height: 60 + Math.random() * 30,
      negative: shuffledNegative[i],
      positive: shuffledPositive[i],
      drift: Math.random() * Math.PI * 2,
      bob: 0,
      bobSpeed: 0.015 + Math.random() * 0.01,
      cleared: false,
      dissolving: false,
      dissolveProgress: 0,
      particles: [],
      revealAlpha: 0,
    }));
    
    cloudsRef.current = newClouds;
    setClouds(newClouds);
  }

  function handleTouchStart(event: GestureResponderEvent) {
    if (phase !== 'active') return;
    const {locationX, locationY} = event.nativeEvent;
    const cloud = findCloudAt(locationX, locationY);
    
    if (cloud) {
      touchingRef.current = {
        cloudId: cloud.id,
        startX: locationX,
        startY: locationY,
      };
    }
  }

  function handleTouchEnd(event: GestureResponderEvent) {
    if (!touchingRef.current || phase !== 'active') return;
    
    const {locationX, locationY} = event.nativeEvent;
    const touch = touchingRef.current;
    const dx = locationX - touch.startX;
    const dy = locationY - touch.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 30) {
      const cloud = cloudsRef.current.find(c => c.id === touch.cloudId);
      if (cloud && !cloud.cleared && !cloud.dissolving) {
        cloud.dissolving = true;
        cloud.dissolveProgress = 0;
        
        const cx = cloud.x + Math.cos(cloud.drift) * 15;
        const cy = cloud.y + cloud.bob;
        const particleCount = 40;
        
        cloud.particles = Array.from({length: particleCount}, () => ({
          x: cx + cloud.width / 2 + (Math.random() - 0.5) * cloud.width * 0.6,
          y: cy + cloud.height / 2 + (Math.random() - 0.5) * cloud.height * 0.6,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 0.5,
          size: 2 + Math.random() * 3,
          alpha: 0.6 + Math.random() * 0.4,
        }));
      }
    }
    
    touchingRef.current = null;
  }

  function findCloudAt(x: number, y: number): Cloud | null {
    for (let i = cloudsRef.current.length - 1; i >= 0; i--) {
      const cloud = cloudsRef.current[i];
      if (cloud.cleared || cloud.dissolving) continue;
      
      const cx = cloud.x + Math.cos(cloud.drift) * 15;
      const cy = cloud.y + cloud.bob;
      
      if (x >= cx && x <= cx + cloud.width && y >= cy && y <= cy + cloud.height) {
        return cloud;
      }
    }
    return null;
  }

  return (
    <View style={styles.container} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <Canvas style={styles.canvas}>
        {/* Background */}
        <Group>
          {clouds.map(cloud => {
            const cx = cloud.x + Math.cos(cloud.drift) * 15;
            const cy = cloud.y + cloud.bob;
            
            if (cloud.cleared) {
              return null;
            }
            
            if (cloud.dissolving) {
              return (
                <Group key={cloud.id}>
                  {cloud.particles.map((p, i) => (
                    <Circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={p.size}
                      color={COLORS.sageMist}
                      opacity={p.alpha}
                    />
                  ))}
                </Group>
              );
            }
            
            // Draw cloud puffs
            const puffs = [
              {x: cx + cloud.width * 0.2, y: cy + cloud.height * 0.5, r: cloud.height * 0.45},
              {x: cx + cloud.width * 0.4, y: cy + cloud.height * 0.3, r: cloud.height * 0.5},
              {x: cx + cloud.width * 0.6, y: cy + cloud.height * 0.25, r: cloud.height * 0.55},
              {x: cx + cloud.width * 0.8, y: cy + cloud.height * 0.4, r: cloud.height * 0.45},
            ];
            
            return (
              <Group key={cloud.id}>
                {/* Shadow */}
                <Circle
                  cx={cx + cloud.width / 2}
                  cy={cy + cloud.height + 15}
                  r={cloud.width * 0.4}
                  color={COLORS.deepOcean}
                  opacity={0.08}
                />
                
                {/* Cloud puffs */}
                {puffs.map((puff, i) => (
                  <Circle key={i} cx={puff.x} cy={puff.y} r={puff.r} color="#FFFFFF" />
                ))}
              </Group>
            );
          })}
        </Group>
      </Canvas>

      {/* Text overlays (rendered outside Canvas for better quality) */}
      {clouds.map(cloud => {
        const cx = cloud.x + Math.cos(cloud.drift) * 15;
        const cy = cloud.y + cloud.bob;
        
        if (cloud.cleared) {
          return (
            <Text
              key={cloud.id}
              style={[
                styles.positiveText,
                {
                  left: cx + cloud.width / 2,
                  top: cy + cloud.height / 2,
                  opacity: cloud.revealAlpha,
                },
              ]}>
              {cloud.positive}
            </Text>
          );
        }
        
        if (!cloud.dissolving) {
          return (
            <Text
              key={cloud.id}
              style={[
                styles.negativeText,
                {
                  left: cx + cloud.width / 2,
                  top: cy + cloud.height / 2,
                },
              ]}>
              {cloud.negative}
            </Text>
          );
        }
        
        return null;
      })}

      {/* Completion message */}
      {phase === 'complete' && (
        <View style={[styles.messageContainer, {opacity: messageAlpha}]}>
          <Text style={styles.messageText}>Your mind deserves space.</Text>
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
  canvas: {
    flex: 1,
  },
  negativeText: {
    position: 'absolute',
    fontSize: 16,
    color: COLORS.deepOcean,
    opacity: 0.75,
    transform: [{translateX: -50}, {translateY: -10}],
    textAlign: 'center',
  },
  positiveText: {
    position: 'absolute',
    fontSize: 22,
    color: COLORS.calmTeal,
    transform: [{translateX: -60}, {translateY: -12}],
    textAlign: 'center',
    fontWeight: '400',
  },
  messageContainer: {
    position: 'absolute',
    top: H / 2,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 26,
    color: COLORS.deepOcean,
    textAlign: 'center',
  },
});
