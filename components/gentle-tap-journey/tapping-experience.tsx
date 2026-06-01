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
  highlightY: number
}

const STEPS: TappingStep[] = [
  {
    id: 'forehead',
    area: 'Forehead',
    instruction: 'Gently tap your forehead',
    taps: 3,
    highlightY: 50,
  },
  {
    id: 'cheeks',
    area: 'Cheeks',
    instruction: 'Tap each cheek gently',
    taps: 4,
    highlightY: 90,
  },
  {
    id: 'chest',
    area: 'Upper Chest',
    instruction: 'Place your hand and tap gently',
    taps: 3,
    highlightY: 160,
  },
  {
    id: 'shoulders',
    area: 'Shoulders',
    instruction: 'Tap each shoulder',
    taps: 4,
    highlightY: 140,
  },
  {
    id: 'hands',
    area: 'Hands',
    instruction: 'Give your hands gentle taps',
    taps: 3,
    highlightY: 230,
  },
]

interface TappingExperienceProps {
  onComplete: () => void
}

export function TappingExperience({ onComplete }: TappingExperienceProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tapsCompleted, setTapsCompleted] = useState(0)
  const [showRipple, setShowRipple] = useState(false)
  const [showGlow, setShowGlow] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const step = STEPS[currentStep]
  const progress = ((currentStep + (tapsCompleted / step.taps)) / STEPS.length) * 100
  const isLastStep = currentStep === STEPS.length - 1

  const handleTap = () => {
    // Prevent taps during transition
    if (isTransitioning) return

    // Trigger visual feedback
    setShowRipple(true)
    setShowGlow(true)
    
    setTimeout(() => setShowRipple(false), 600)
    setTimeout(() => setShowGlow(false), 300)

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }

    const newTaps = tapsCompleted + 1

    if (newTaps >= step.taps) {
      // Completed this step
      setIsTransitioning(true)
      
      if (isLastStep) {
        // Complete the entire journey
        setTimeout(() => {
          onComplete()
        }, 800)
      } else {
        // Move to next step
        setTimeout(() => {
          setCurrentStep(currentStep + 1)
          setTapsCompleted(0)
          setIsTransitioning(false)
        }, 800)
      }
    } else {
      // Continue tapping current step
      setTapsCompleted(newTaps)
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
          zIndex: 10,
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
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-8 pb-4">
        {/* Character Illustration */}
        <div className="relative mb-8" style={{ width: '200px', height: '300px' }}>
          <svg
            width="200"
            height="300"
            viewBox="0 0 200 300"
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

            {/* Eyes - blinking */}
            <g style={{ animation: 'blink 4s ease-in-out infinite' }}>
              <circle cx="85" cy="45" r="4" fill={COLORS.deepOcean} />
              <circle cx="115" cy="45" r="4" fill={COLORS.deepOcean} />
            </g>

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
              cy="260"
              rx="18"
              ry="35"
              fill="#B8E6D5"
              stroke={COLORS.deepOcean}
              strokeWidth="2"
            />
            <ellipse
              cx="120"
              cy="260"
              rx="18"
              ry="35"
              fill="#B8E6D5"
              stroke={COLORS.deepOcean}
              strokeWidth="2"
            />

            {/* Highlight indicator - Glow */}
            {showGlow && (
              <circle
                cx="100"
                cy={step.highlightY}
                r="35"
                fill={COLORS.lavenderFog}
                opacity="0.3"
                style={{ animation: 'glow-pulse 0.3s ease-out' }}
              />
            )}

            {/* Highlight indicator - Pulse ring */}
            <circle
              cx="100"
              cy={step.highlightY}
              r="30"
              fill="none"
              stroke={COLORS.lavenderFog}
              strokeWidth="3"
              opacity="0.6"
              style={{
                animation: showRipple ? 'ripple 0.6s ease-out' : 'pulse 2s ease-in-out infinite',
              }}
            />

            {/* Highlight indicator - Inner circle */}
            <circle
              cx="100"
              cy={step.highlightY}
              r="20"
              fill={COLORS.lavenderFog}
              opacity="0.2"
            />

            {/* Ripple effect */}
            {showRipple && (
              <circle
                cx="100"
                cy={step.highlightY}
                r="30"
                fill="none"
                stroke={COLORS.calmTeal}
                strokeWidth="2"
                opacity="0.8"
                style={{ animation: 'ripple 0.6s ease-out' }}
              />
            )}
          </svg>
        </div>

        {/* Step indicator */}
        <div
          className="text-[12px] font-semibold mb-2"
          style={{
            color: COLORS.calmTeal,
            letterSpacing: '0.05em',
          }}
        >
          STEP {currentStep + 1} OF {STEPS.length}
        </div>

        {/* Instruction */}
        <div className="text-center mb-2">
          <h2
            className="text-[24px] font-medium mb-1"
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

        {/* Tap counter dots */}
        <div className="flex gap-2 mb-8">
          {Array.from({ length: step.taps }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: i < tapsCompleted ? COLORS.calmTeal : 'rgba(87, 169, 154, 0.2)',
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Tap Button */}
        <button
          onClick={handleTap}
          disabled={isTransitioning}
          className="transition-all active:scale-95"
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: isTransitioning ? 'rgba(118, 100, 139, 0.5)' : COLORS.lavenderFog,
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: 600,
            border: 'none',
            cursor: isTransitioning ? 'not-allowed' : 'pointer',
            boxShadow: isTransitioning ? 'none' : '0 8px 24px rgba(118, 100, 139, 0.3)',
            opacity: isTransitioning ? 0.5 : 1,
          }}
        >
          {isTransitioning ? 'Next...' : 'Tap'}
        </button>
      </div>

      <style jsx>{`
        @keyframes gentle-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @keyframes blink {
          0%, 48%, 52%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.1); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        @keyframes glow-pulse {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.2); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
