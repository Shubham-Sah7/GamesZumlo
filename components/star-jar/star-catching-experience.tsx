'use client'

import { useEffect, useRef, useState } from 'react'

const W = 393
const H = 852

const COLORS = {
  honeydew: '#F0FFF0',
  sageMist: '#B8CBBE',
  calmTeal: '#57A99A',
  lavenderFog: '#76648B',
  warmSunset: '#F59A4A',
  deepOcean: '#083F56',
  starGold: '#FFC850',
  starWhite: '#FFF8E7',
}

const AFFIRMATIONS = [
  '✨ You made it through today',
  '✨ Small progress counts',
  '✨ Rest is productive too',
  '✨ One step at a time',
  '✨ You\'re doing better than you think',
  '✨ It\'s okay to move slowly',
  '✨ You showed up today',
  '✨ Be kind to yourself',
  '✨ Every day is a fresh start',
  '✨ You are enough',
]

const TOTAL_STARS = 10
const JAR_X = W / 2
const JAR_Y = H - 180

type Star = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotationSpeed: number
  glow: number
  glowSpeed: number
  state: 'floating' | 'collected' | 'flying' | 'sparkle' | 'entering'
  collectX?: number
  collectY?: number
  flyProgress?: number
  sparkleTimer?: number
  trailPoints?: Array<{ x: number; y: number; alpha: number }>
}

interface StarCatchingExperienceProps {
  onComplete: () => void
}

type Phase = 'collecting' | 'celebration' | 'complete'

export function StarCatchingExperience({ onComplete }: StarCatchingExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [collectedCount, setCollectedCount] = useState(0)
  const [currentAffirmation, setCurrentAffirmation] = useState('')
  const [affirmationAlpha, setAffirmationAlpha] = useState(0)
  const [phase, setPhase] = useState<Phase>('collecting')

  const starsRef = useRef<Star[]>([])
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    alpha: number
    size: number
    color?: string
  }>>([])
  const jarSparklesRef = useRef<Array<{
    x: number
    y: number
    alpha: number
    angle: number
    radius: number
    speed: number
  }>>([])
  const celebrationStarsRef = useRef<Array<{
    x: number
    y: number
    targetX: number
    targetY: number
    alpha: number
    progress: number
    size: number
  }>>([])
  const rafRef = useRef<number>(0)
  const timeRef = useRef(0)
  const affirmationTimerRef = useRef(0)
  const celebrationTimerRef = useRef(0)
  const jarGlowRef = useRef(0)

  useEffect(() => {
    // Initialize stars
    const stars: Star[] = []
    for (let i = 0; i < TOTAL_STARS; i++) {
      stars.push({
        id: i,
        x: 60 + Math.random() * (W - 120),
        y: 80 + Math.random() * (H - 300),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 12 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        glow: Math.random(),
        glowSpeed: 0.02 + Math.random() * 0.02,
        state: 'floating',
        trailPoints: [],
      })
    }
    starsRef.current = stars

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number

    const animate = () => {
      timeRef.current++
      const time = timeRef.current

      // Clear
      ctx.fillStyle = COLORS.honeydew
      ctx.fillRect(0, 0, W, H)

      // Draw soft night sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.5)
      skyGrad.addColorStop(0, 'rgba(184, 200, 190, 0.08)')
      skyGrad.addColorStop(1, 'rgba(240, 255, 240, 0)')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, W, H * 0.5)

      // Update and draw stars
      starsRef.current.forEach(star => {
        if (star.state === 'floating') {
          // Organic floating movement
          star.x += star.vx
          star.y += star.vy
          
          // Gentle direction changes
          if (Math.random() < 0.01) {
            star.vx += (Math.random() - 0.5) * 0.1
            star.vy += (Math.random() - 0.5) * 0.1
          }

          // Keep in bounds with soft edges
          if (star.x < 50) star.vx += 0.05
          if (star.x > W - 50) star.vx -= 0.05
          if (star.y < 80) star.vy += 0.05
          if (star.y > H - 250) star.vy -= 0.05

          // Limit speed
          const speed = Math.hypot(star.vx, star.vy)
          if (speed > 0.6) {
            star.vx *= 0.6 / speed
            star.vy *= 0.6 / speed
          }

          star.rotation += star.rotationSpeed
          star.glow = 0.4 + 0.6 * Math.abs(Math.sin(time * star.glowSpeed))

          drawStar(ctx, star, time)
        } 
        else if (star.state === 'sparkle') {
          // Brief sparkle before flying
          star.sparkleTimer = (star.sparkleTimer || 0) + 1
          
          // Scale up with ease-out
          const t = Math.min(1, star.sparkleTimer / 12)
          const easeOut = 1 - Math.pow(1 - t, 3)
          const scale = 1 + easeOut * 0.5
          
          star.glow = 1
          
          // Draw trail points that fade
          star.trailPoints?.forEach(point => {
            point.alpha -= 0.08
            if (point.alpha > 0) {
              ctx.save()
              ctx.globalAlpha = point.alpha
              const trailGrad = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 8)
              trailGrad.addColorStop(0, COLORS.starGold)
              trailGrad.addColorStop(1, 'rgba(255, 200, 80, 0)')
              ctx.fillStyle = trailGrad
              ctx.beginPath()
              ctx.arc(point.x, point.y, 8, 0, Math.PI * 2)
              ctx.fill()
              ctx.restore()
            }
          })
          star.trailPoints = star.trailPoints?.filter(p => p.alpha > 0)
          
          ctx.save()
          ctx.translate(star.x, star.y)
          ctx.scale(scale, scale)
          ctx.translate(-star.x, -star.y)
          drawStar(ctx, star, time)
          ctx.restore()
          
          if (star.sparkleTimer >= 12) {
            star.state = 'flying'
            star.sparkleTimer = 0
          }
        }
        else if (star.state === 'flying') {
          // Fly to jar with trail
          star.flyProgress = (star.flyProgress || 0) + 0.025 // Slower for more visible flight

          // Add trail point
          if (!star.trailPoints) star.trailPoints = []
          if (star.flyProgress < 0.95) {
            star.trailPoints.push({ x: star.x, y: star.y, alpha: 0.8 })
            if (star.trailPoints.length > 15) star.trailPoints.shift()
          }

          // Update trail
          star.trailPoints.forEach(point => {
            point.alpha -= 0.04
          })
          star.trailPoints = star.trailPoints.filter(p => p.alpha > 0)

          // Draw trail
          star.trailPoints.forEach((point, i) => {
            ctx.save()
            ctx.globalAlpha = point.alpha
            const size = 6 + (i / star.trailPoints!.length) * 8
            const trailGrad = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size)
            trailGrad.addColorStop(0, COLORS.starGold)
            trailGrad.addColorStop(0.6, 'rgba(255, 200, 80, 0.3)')
            trailGrad.addColorStop(1, 'rgba(255, 200, 80, 0)')
            ctx.fillStyle = trailGrad
            ctx.beginPath()
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          })

          if (star.flyProgress >= 1) {
            star.state = 'entering'
            star.flyProgress = 0
            
            // Create dramatic jar entry particles
            for (let i = 0; i < 25; i++) {
              const angle = (i / 25) * Math.PI * 2
              particlesRef.current.push({
                x: JAR_X,
                y: JAR_Y - 20,
                vx: Math.cos(angle) * (2 + Math.random() * 2),
                vy: Math.sin(angle) * (2 + Math.random() * 2) - 1,
                alpha: 0.9,
                size: 2 + Math.random() * 4,
                color: Math.random() > 0.5 ? COLORS.starGold : COLORS.warmSunset,
              })
            }
            
            // Jar reacts immediately - increase glow
            jarGlowRef.current = Math.min(1, jarGlowRef.current + 0.15)
          } else {
            // Smooth bezier curve to jar
            const t = star.flyProgress
            const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 // ease in-out cubic
            
            const controlY = Math.min(star.collectY!, JAR_Y - 100) - 80 // Higher arc
            
            star.x = star.collectX! + (JAR_X - star.collectX!) * eased
            star.y = star.collectY! + (controlY - star.collectY!) * Math.sin(eased * Math.PI) * 0.5 + (JAR_Y - 20 - star.collectY!) * eased
            
            star.rotation += 0.12
            star.glow = 1

            drawStar(ctx, star, time)
          }
        }
        else if (star.state === 'entering') {
          // Star enters jar with fade and scale down
          star.flyProgress = (star.flyProgress || 0) + 0.08
          
          if (star.flyProgress >= 1) {
            star.state = 'collected'
          } else {
            const t = star.flyProgress
            const fade = 1 - t
            const scale = 1 - t * 0.5
            
            ctx.save()
            ctx.globalAlpha = fade
            ctx.translate(JAR_X, JAR_Y)
            ctx.scale(scale, scale)
            ctx.translate(-JAR_X, -JAR_Y)
            star.x = JAR_X
            star.y = JAR_Y
            drawStar(ctx, star, time)
            ctx.restore()
          }
        }
      })

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.08 // gravity
        p.vx *= 0.98 // air resistance
        p.alpha -= 0.012

        if (p.alpha > 0) {
          ctx.save()
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = p.color || COLORS.starGold
          ctx.shadowColor = p.color || COLORS.starGold
          ctx.shadowBlur = 8
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
          return true
        }
        return false
      })

      // Update jar sparkles (for 8+ stars)
      if (collectedCount >= 8) {
        // Add new sparkles
        if (Math.random() < 0.15) {
          jarSparklesRef.current.push({
            x: JAR_X,
            y: JAR_Y,
            alpha: 0.8,
            angle: Math.random() * Math.PI * 2,
            radius: 50 + Math.random() * 30,
            speed: 0.5 + Math.random() * 0.5,
          })
        }
        
        jarSparklesRef.current = jarSparklesRef.current.filter(sparkle => {
          sparkle.angle += 0.02
          sparkle.radius += sparkle.speed
          sparkle.alpha -= 0.015
          
          if (sparkle.alpha > 0) {
            const x = sparkle.x + Math.cos(sparkle.angle) * sparkle.radius
            const y = sparkle.y + Math.sin(sparkle.angle) * sparkle.radius
            
            ctx.save()
            ctx.globalAlpha = sparkle.alpha
            ctx.fillStyle = COLORS.starGold
            ctx.shadowColor = COLORS.starGold
            ctx.shadowBlur = 6
            ctx.beginPath()
            ctx.arc(x, y, 2.5, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
            return true
          }
          return false
        })
      }

      // Draw jar
      drawJar(ctx, collectedCount, time)

      // Celebration phase
      if (phase === 'celebration') {
        celebrationTimerRef.current++
        
        // Initial burst (frame 1-30)
        if (celebrationTimerRef.current === 1) {
          // Create constellation/tree formation
          const centerX = JAR_X
          const centerY = JAR_Y - 200
          
          for (let i = 0; i < TOTAL_STARS; i++) {
            // Arrange in beautiful tree/constellation pattern
            const angle = (i / TOTAL_STARS) * Math.PI * 2
            const radius = 60 + (i % 3) * 25
            
            celebrationStarsRef.current.push({
              x: JAR_X,
              y: JAR_Y - 30,
              targetX: centerX + Math.cos(angle) * radius,
              targetY: centerY + Math.sin(angle) * radius - 20,
              alpha: 0,
              progress: 0,
              size: 10 + Math.random() * 4,
            })
          }
          
          // Burst particles
          for (let i = 0; i < 40; i++) {
            const angle = (i / 40) * Math.PI * 2
            particlesRef.current.push({
              x: JAR_X,
              y: JAR_Y - 30,
              vx: Math.cos(angle) * (3 + Math.random() * 3),
              vy: Math.sin(angle) * (3 + Math.random() * 3) - 2,
              alpha: 1,
              size: 2 + Math.random() * 3,
              color: Math.random() > 0.5 ? COLORS.starGold : COLORS.warmSunset,
            })
          }
        }
        
        // Animate celebration stars (frame 1-60)
        if (celebrationTimerRef.current <= 80) {
          celebrationStarsRef.current.forEach(star => {
            star.progress = Math.min(1, star.progress + 0.018)
            const eased = 1 - Math.pow(1 - star.progress, 3)
            
            star.x = star.x + (star.targetX - star.x) * 0.08
            star.y = star.y + (star.targetY - star.y) * 0.08
            star.alpha = Math.min(1, star.alpha + 0.03)
            
            ctx.save()
            ctx.globalAlpha = star.alpha
            ctx.translate(star.x, star.y)
            
            // Glow
            const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, star.size * 3)
            glowGrad.addColorStop(0, `rgba(255, 200, 80, 0.6)`)
            glowGrad.addColorStop(0.5, `rgba(255, 200, 80, 0.2)`)
            glowGrad.addColorStop(1, 'rgba(255, 200, 80, 0)')
            ctx.fillStyle = glowGrad
            ctx.beginPath()
            ctx.arc(0, 0, star.size * 3, 0, Math.PI * 2)
            ctx.fill()
            
            // Star
            ctx.fillStyle = COLORS.starWhite
            ctx.shadowColor = COLORS.starGold
            ctx.shadowBlur = 15
            ctx.beginPath()
            for (let i = 0; i < 5; i++) {
              const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
              const outerX = Math.cos(angle) * star.size
              const outerY = Math.sin(angle) * star.size
              const innerAngle = angle + Math.PI / 5
              const innerX = Math.cos(innerAngle) * (star.size * 0.4)
              const innerY = Math.sin(innerAngle) * (star.size * 0.4)
              if (i === 0) ctx.moveTo(outerX, outerY)
              else ctx.lineTo(outerX, outerY)
              ctx.lineTo(innerX, innerY)
            }
            ctx.closePath()
            ctx.fill()
            ctx.restore()
          })
          
          // Draw connection lines
          if (celebrationTimerRef.current > 40) {
            const lineAlpha = Math.min(0.2, (celebrationTimerRef.current - 40) / 40 * 0.2)
            ctx.save()
            ctx.globalAlpha = lineAlpha
            ctx.strokeStyle = COLORS.calmTeal
            ctx.lineWidth = 1.5
            celebrationStarsRef.current.forEach((star1, i) => {
              celebrationStarsRef.current.forEach((star2, j) => {
                if (i < j && Math.hypot(star1.x - star2.x, star1.y - star2.y) < 100) {
                  ctx.beginPath()
                  ctx.moveTo(star1.x, star1.y)
                  ctx.lineTo(star2.x, star2.y)
                  ctx.stroke()
                }
              })
            })
            ctx.restore()
          }
        }
        
        // Hold celebration (frame 60-160)
        if (celebrationTimerRef.current > 160) {
          // Fade out
          celebrationStarsRef.current.forEach(star => {
            star.alpha = Math.max(0, star.alpha - 0.02)
          })
          
          jarGlowRef.current = Math.max(0, jarGlowRef.current - 0.015)
        }
        
        // Transition to completion
        if (celebrationTimerRef.current > 200) {
          setPhase('complete')
          setTimeout(() => {
            onComplete()
          }, 500)
        }
      }

      // Draw affirmation card
      if (affirmationAlpha > 0 && phase === 'collecting') {
        affirmationTimerRef.current++
        if (affirmationTimerRef.current < 30) {
          setAffirmationAlpha(Math.min(1, affirmationAlpha + 0.08))
        } else if (affirmationTimerRef.current > 100) {
          setAffirmationAlpha(Math.max(0, affirmationAlpha - 0.04))
        }

        ctx.save()
        ctx.globalAlpha = affirmationAlpha
        
        // Card background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
        ctx.shadowBlur = 20
        ctx.shadowOffsetY = 4
        const cardWidth = W - 80
        const cardHeight = 60
        const cardX = 40
        const cardY = JAR_Y - 140
        ctx.beginPath()
        ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 12)
        ctx.fill()
        
        // Text
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0
        ctx.fillStyle = COLORS.deepOcean
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = '400 15px -apple-system, system-ui, sans-serif'
        ctx.fillText(currentAffirmation, W / 2, cardY + cardHeight / 2)
        ctx.restore()
      }

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    rafRef.current = raf

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [collectedCount, affirmationAlpha, currentAffirmation, phase, onComplete])

  useEffect(() => {
    if (collectedCount === TOTAL_STARS && phase === 'collecting') {
      // Start celebration sequence
      setTimeout(() => {
        setPhase('celebration')
      }, 800)
    }
  }, [collectedCount, phase])

  function drawStar(ctx: CanvasRenderingContext2D, star: Star, time: number) {
    ctx.save()
    ctx.translate(star.x, star.y)
    ctx.rotate(star.rotation)

    // Glow
    const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, star.size * 3)
    glowGrad.addColorStop(0, `rgba(255, 200, 80, ${star.glow * 0.4})`)
    glowGrad.addColorStop(0.5, `rgba(255, 200, 80, ${star.glow * 0.15})`)
    glowGrad.addColorStop(1, 'rgba(255, 200, 80, 0)')
    ctx.fillStyle = glowGrad
    ctx.beginPath()
    ctx.arc(0, 0, star.size * 3, 0, Math.PI * 2)
    ctx.fill()

    // Star shape (5-pointed)
    ctx.fillStyle = COLORS.starWhite
    ctx.shadowColor = COLORS.starGold
    ctx.shadowBlur = 12 * star.glow
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
      const outerX = Math.cos(angle) * star.size
      const outerY = Math.sin(angle) * star.size
      
      const innerAngle = angle + Math.PI / 5
      const innerX = Math.cos(innerAngle) * (star.size * 0.4)
      const innerY = Math.sin(innerAngle) * (star.size * 0.4)
      
      if (i === 0) {
        ctx.moveTo(outerX, outerY)
      } else {
        ctx.lineTo(outerX, outerY)
      }
      ctx.lineTo(innerX, innerY)
    }
    ctx.closePath()
    ctx.fill()

    // Center glow
    const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, star.size * 0.5)
    centerGrad.addColorStop(0, COLORS.starGold)
    centerGrad.addColorStop(1, 'rgba(255, 200, 80, 0)')
    ctx.fillStyle = centerGrad
    ctx.beginPath()
    ctx.arc(0, 0, star.size * 0.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  function drawJar(ctx: CanvasRenderingContext2D, collected: number, time: number) {
    const jarWidth = 100
    const jarHeight = 120
    const x = JAR_X
    const y = JAR_Y

    // Jar fill intensity with progressive stages
    const fillLevel = collected / TOTAL_STARS
    
    // Smooth glow increase
    jarGlowRef.current = jarGlowRef.current * 0.95 + fillLevel * 0.05
    const glowIntensity = jarGlowRef.current

    // Outer magical glow (grows with collection)
    if (fillLevel > 0) {
      ctx.save()
      
      // Pulsing effect
      const pulse = 1 + Math.sin(time * 0.03) * 0.1
      
      // Multiple glow layers
      ctx.globalAlpha = glowIntensity * 0.15 * pulse
      const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, jarWidth * 2.5)
      outerGlow.addColorStop(0, COLORS.starGold)
      outerGlow.addColorStop(0.4, COLORS.warmSunset)
      outerGlow.addColorStop(1, 'rgba(255, 200, 80, 0)')
      ctx.fillStyle = outerGlow
      ctx.beginPath()
      ctx.arc(x, y, jarWidth * 2.5, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.globalAlpha = glowIntensity * 0.25 * pulse
      const midGlow = ctx.createRadialGradient(x, y, 0, x, y, jarWidth * 1.8)
      midGlow.addColorStop(0, COLORS.starGold)
      midGlow.addColorStop(0.6, COLORS.warmSunset)
      midGlow.addColorStop(1, 'rgba(245, 154, 74, 0)')
      ctx.fillStyle = midGlow
      ctx.beginPath()
      ctx.arc(x, y, jarWidth * 1.8, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }

    // Jar glass body
    ctx.save()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.strokeStyle = COLORS.sageMist
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x - jarWidth / 2 + 10, y - jarHeight / 2)
    ctx.lineTo(x + jarWidth / 2 - 10, y - jarHeight / 2)
    ctx.arcTo(x + jarWidth / 2, y - jarHeight / 2, x + jarWidth / 2, y - jarHeight / 2 + 10, 10)
    ctx.lineTo(x + jarWidth / 2, y + jarHeight / 2 - 15)
    ctx.arcTo(x + jarWidth / 2, y + jarHeight / 2, x + jarWidth / 2 - 15, y + jarHeight / 2, 15)
    ctx.lineTo(x - jarWidth / 2 + 15, y + jarHeight / 2)
    ctx.arcTo(x - jarWidth / 2, y + jarHeight / 2, x - jarWidth / 2, y + jarHeight / 2 - 15, 15)
    ctx.lineTo(x - jarWidth / 2, y - jarHeight / 2 + 10)
    ctx.arcTo(x - jarWidth / 2, y - jarHeight / 2, x - jarWidth / 2 + 10, y - jarHeight / 2, 10)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.restore()

    // Jar lid
    ctx.save()
    ctx.fillStyle = COLORS.lavenderFog
    ctx.strokeStyle = COLORS.deepOcean
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.rect(x - jarWidth / 2 - 5, y - jarHeight / 2 - 15, jarWidth + 10, 12)
    ctx.fill()
    ctx.stroke()
    // Lid knob
    ctx.beginPath()
    ctx.arc(x, y - jarHeight / 2 - 9, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.restore()

    // Inner light fill - progressive stages
    if (fillLevel > 0) {
      ctx.save()
      
      // 0-3 stars: Very subtle glow
      if (collected <= 3) {
        ctx.globalAlpha = glowIntensity * 0.3
        const softGrad = ctx.createRadialGradient(x, y + 30, 0, x, y + 10, jarWidth * 0.35)
        softGrad.addColorStop(0, COLORS.starGold)
        softGrad.addColorStop(0.8, 'rgba(255, 200, 80, 0.2)')
        softGrad.addColorStop(1, 'rgba(255, 200, 80, 0)')
        ctx.fillStyle = softGrad
        ctx.beginPath()
        ctx.arc(x, y + 20, jarWidth * 0.35, 0, Math.PI * 2)
        ctx.fill()
      }
      // 3-5 stars: Soft golden light appears
      else if (collected <= 5) {
        ctx.globalAlpha = glowIntensity * 0.5
        const growingGrad = ctx.createRadialGradient(x, y + 20, 0, x, y, jarWidth * 0.45)
        growingGrad.addColorStop(0, COLORS.starGold)
        growingGrad.addColorStop(0.6, 'rgba(255, 200, 80, 0.4)')
        growingGrad.addColorStop(1, 'rgba(255, 200, 80, 0)')
        ctx.fillStyle = growingGrad
        ctx.beginPath()
        ctx.arc(x, y + 15, jarWidth * 0.45, 0, Math.PI * 2)
        ctx.fill()
      }
      // 5-8 stars: Jar becomes brighter, light fills upward
      else if (collected < 8) {
        ctx.globalAlpha = glowIntensity * 0.7
        const fillGrad = ctx.createLinearGradient(x, y + 40, x, y - 30)
        fillGrad.addColorStop(0, COLORS.starGold)
        fillGrad.addColorStop(0.5, 'rgba(255, 200, 80, 0.6)')
        fillGrad.addColorStop(1, 'rgba(255, 200, 80, 0.1)')
        ctx.fillStyle = fillGrad
        ctx.beginPath()
        ctx.ellipse(x, y + 10, jarWidth * 0.38, jarHeight * 0.4, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      // 8-10 stars: Fully illuminated with warmth
      else {
        ctx.globalAlpha = glowIntensity * 0.9
        const fullGrad = ctx.createRadialGradient(x, y + 10, 0, x, y, jarWidth * 0.5)
        fullGrad.addColorStop(0, '#FFE6A0')
        fullGrad.addColorStop(0.3, COLORS.starGold)
        fullGrad.addColorStop(0.7, 'rgba(255, 200, 80, 0.5)')
        fullGrad.addColorStop(1, 'rgba(255, 200, 80, 0.1)')
        ctx.fillStyle = fullGrad
        ctx.beginPath()
        ctx.ellipse(x, y, jarWidth * 0.42, jarHeight * 0.45, 0, 0, Math.PI * 2)
        ctx.fill()
        
        // Extra shimmer at top
        ctx.globalAlpha = glowIntensity * 0.4 * (1 + Math.sin(time * 0.05) * 0.3)
        const shimmer = ctx.createRadialGradient(x, y - 20, 0, x, y - 20, jarWidth * 0.3)
        shimmer.addColorStop(0, COLORS.starWhite)
        shimmer.addColorStop(0.5, 'rgba(255, 248, 231, 0.5)')
        shimmer.addColorStop(1, 'rgba(255, 248, 231, 0)')
        ctx.fillStyle = shimmer
        ctx.beginPath()
        ctx.arc(x, y - 20, jarWidth * 0.3, 0, Math.PI * 2)
        ctx.fill()
      }
      
      ctx.restore()
    }

    // Progress text
    ctx.save()
    ctx.fillStyle = COLORS.deepOcean
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '600 18px -apple-system, system-ui, sans-serif'
    ctx.fillText(`${collected}/${TOTAL_STARS}`, x, y + jarHeight / 2 + 30)
    ctx.restore()
  }

  function handleTap(e: React.PointerEvent<HTMLCanvasElement>) {
    if (phase !== 'collecting') return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (W / rect.width)
    const y = (e.clientY - rect.top) * (H / rect.height)

    // Find closest floating star
    let closestStar: Star | null = null
    let closestDist = 50 // tap radius

    starsRef.current.forEach(star => {
      if (star.state === 'floating') {
        const dist = Math.hypot(star.x - x, star.y - y)
        if (dist < closestDist) {
          closestStar = star
          closestDist = dist
        }
      }
    })

    if (closestStar) {
      const star = closestStar as Star
      star.state = 'sparkle'
      star.collectX = star.x
      star.collectY = star.y
      star.flyProgress = 0
      star.sparkleTimer = 0
      star.trailPoints = []

      // Show affirmation
      const shuffled = [...AFFIRMATIONS].sort(() => Math.random() - 0.5)
      setCurrentAffirmation(shuffled[0])
      setAffirmationAlpha(0)
      affirmationTimerRef.current = 0

      setCollectedCount(prev => prev + 1)

      // Create tap sparkle burst
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2
        particlesRef.current.push({
          x: (closestStar as Star).x,
          y: (closestStar as Star).y,
          vx: Math.cos(angle) * (1.5 + Math.random() * 1.5),
          vy: Math.sin(angle) * (1.5 + Math.random() * 1.5),
          alpha: 0.9,
          size: 2 + Math.random() * 3,
          color: Math.random() > 0.3 ? COLORS.starGold : COLORS.starWhite,
        })
      }
    }
  }

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block w-full h-full cursor-pointer"
        onPointerDown={handleTap}
        style={{ touchAction: 'none' }}
      />
    </div>
  )
}
