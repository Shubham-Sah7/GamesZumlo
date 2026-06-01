'use client'

import { useState, useEffect } from 'react'

const COLORS = {
  honeydew: '#F0FFF0',
  lavenderFog: '#76648B',
  deepOcean: '#083F56',
  calmTeal: '#57A99A',
}

interface TappingStep {
  id: string
  area: string
  instruction: string
  taps: number
  position: { x: number; y: number }
}

const STEPS: TappingStep[] = [
  {
    id: 'forehead',
    area: 'Forehead',
    instruction: 'Gently tap your forehead',
    taps: 3,
    position: { x: 50, y: 15 },
  },
  {
    id: 'cheeks',
    area: 'Cheeks',
    instruction: 'Tap each cheek gently',
    taps: 4,
    position: { x: 50, y: 35 },
  },
  {
    id: 'chest',
    area: 'Upper Chest',
    instruction: 'Place your hand and tap gently',
    taps: 3,
    position: { x: 50, y: 55 },
  },
  {
    id: 'shoulders',
    area: 'Shoulders',
    instruction: 'Tap each shoulder',
    taps: 4,
    position: { x: 50, y: 48 },
  },
  {
    id: 'hands',
    area: 'Hands',
    instruction: 'Give your hands gentle taps',
    taps: 3,
    position: { x: 50, y: 75 },
  },
]

interface TappingExperienceProps {
  onComplete: () => void
}

export function TappingExperience({ onComplete }: TappingExperienceProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tapsCompleted, setTapsCompleted] = useState(0)
  const [showRipple, setShowRipple] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  const step = STEPS[currentStep]
  const progress = ((currentStep + (tapsCompleted / step.taps)) / STEPS.length) * 100

  const handleTap = () => {
    if (tapsCompleted < step.taps) {
      // Trigger ripple
      setShowRipple(true)
      setTimeout(() => setShowRipple(false), 600)

      // Add particle
      const newParticle = {
        id: Date.now(),
        x: step.position.x + (Math.random() - 0.5) * 20,
        y: step.position.y + (Math.random() - 0.5) * 20,
      }
      setParticles((prev) => [...prev, newParticle])
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id))
      }, 1000)

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(10)
      }

      const newTaps = tapsCompleted + 1

      if (newTaps >= step.taps) {
        // Move to next step
        setTimeout(() => {
          if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1)
            setTapsCompleted(0)
          } else {
            // Complete
            setTimeout(onComplete, 800)
          }
        }, 600)
      } else {
        setTapsCompleted(newTaps)
      }
    }
  }

  return (
    <div
      className="relative h-full w-full flex flex-col"
      style={{ background: COLORS.honeydew }}
    >
      {/* Progress Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'rgba(87, 169, 154, 0.2)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: COLORS.calmTeal,
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-12">
        {/* Character Illustration */}
        <div className="relative mb-12" style={{ width: '200px', height: '280px' }}>
          {/* Simple gender-neutral character */}
          <svg
            width="200"
            height="280"
            viewBox="0 0 200 280"
            fill="none"
            style={{ animation: 'gentle-breathe 4s ease-in-out infinite' }}
          >
            {/* Head */}
            <ellipse
              cx="100"
              cy="50"
              rx="45"
              ry="50"
              fill="#FFE4C4"
              stroke={COLORS.deepOcean}
              strokeWidth="2"
            />

            {/* Eyes */}
            <circle cx="85" cy="45" r="4" fill={COLORS.deepOcean} />
            <circle cx="115" cy="45" r="4" fill={COLORS.deepOcean} />

            {/* Gentle smile */}
            <path
              d="M 85 60 Q 100 68 115 60"
              stroke={COLORS.deepOcean}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Body */}
            <ellipse
              cx="100"
              cy="160"
              rx="55"
              ry="70"
              fill="#B8E6D5"
              stroke={COLORS.deepOcean}
              strokeWidth="2"
            />

            {/* Arms */}
            <ellipse
              cx="45"
              cy="140"
              rx="15"
              ry="50"
              fill="#B8E6D5"
              stroke={COLORS.deepOcean}
              strokeWidth="2"
              transform="rotate(-20 45 140)"
            />
            <ellipse
              cx="155"
              cy="140"
              rx="15"
              ry="50"
              fill="#B8E6D5"
              stroke={COLORS.deepOcean}
              strokeWidth="2"
              transform="rotate(20 155 140)"
            />

            {/* Legs */}
            <ellipse
              cx="80"
              cy="250"
              rx="18"
              ry="35"
              fill="#B8E6D5"
              stroke={COLORS.deepOcean}
              strokeWidth="2"
            />
            <ellipse
              cx="120"
              cy="250"
              rx="18"
              ry="35"
              fill="#B8E6D5"
              stroke={COLORS.deepOcean}
              strokeWidth="2"
            />

            {/* Highlight indicator */}
            <g style={{ opacity: showRipple ? 1 : 0.6 }}>
              <circle
                cx={step.position.x * 2}
                cy={step.position.y * 2.8}
                r="30"
                fill="none"
                stroke={COLORS.lavenderFog}
                strokeWidth="3"
                opacity="0.6"
                style={{
                  animation: showRipple ? 'ripple 0.6s ease-out' : 'pulse 2s ease-in-out infinite',
                }}
              />
              <circle
                cx={step.position.x * 2}
                cy={step.position.y * 2.8}
                r="20"
                fill={COLORS.lavenderFog}
                opacity="0.2"
              />
            </g>

            {/* Particles */}
            {particles.map((particle) => (
              <circle
                key={particle.id}
                cx={particle.x * 2}
                cy={particle.y * 2.8}
                r="4"
                fill={COLORS.calmTeal}
                style={{ animation: 'particle-float 1s ease-out forwards' }}
              />
            ))}
          </svg>
        </div>

        {/* Instruction */}
        <div className="text-center mb-8">
          <h2
            className="text-[24px] font-medium mb-2"
            style={{ color: COLORS.deepOcean, letterSpacing: '-0.01em' }}
          >
            {step.instruction}
          </h2>
          <p
            className="text-[14px]"
            style={{ color: COLORS.lavenderFog, opacity: 0.8 }}
          >
            {tapsCompleted} / {step.taps} taps
          </p>
        </div>

        {/* Tap Button */}
        <button
          onClick={handleTap}
          className="transition-all active:scale-95"
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: COLORS.lavenderFog,
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(118, 100, 139, 0.3)',
          }}
        >
          Tap
        </button>
      </div>

      <style jsx>{`
        @keyframes gentle-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }

        @keyframes particle-float {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-30px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
