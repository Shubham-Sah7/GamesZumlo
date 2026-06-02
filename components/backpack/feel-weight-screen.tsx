'use client'

import { useEffect, useState } from 'react'

const COLORS = {
  bg: '#F0FFF0',
  text: '#083F56',
  muted: '#7A9E96',
  lavender: '#76648B',
}

interface FeelWeightScreenProps {
  worryCount: number
  onNext: () => void
}

export function FeelWeightScreen({ worryCount, onNext }: FeelWeightScreenProps) {
  const [walkProgress, setWalkProgress] = useState(0)
  const [breathingPhase, setBreathingPhase] = useState(0)

  useEffect(() => {
    // Walking animation
    const walkInterval = setInterval(() => {
      setWalkProgress((prev) => {
        if (prev >= 100) {
          clearInterval(walkInterval)
          return 100
        }
        return prev + 0.5
      })
    }, 50)

    // Breathing animation
    const breathInterval = setInterval(() => {
      setBreathingPhase((prev) => (prev + 1) % 60)
    }, 50)

    // Auto-advance after walk complete
    const timer = setTimeout(() => {
      onNext()
    }, 12000)

    return () => {
      clearInterval(walkInterval)
      clearInterval(breathInterval)
      clearTimeout(timer)
    }
  }, [onNext])

  const getWeightLevel = () => {
    if (worryCount < 3) return 'Light'
    if (worryCount < 6) return 'Medium'
    if (worryCount < 10) return 'Heavy'
    return 'Very Heavy'
  }

  const getBendAngle = () => {
    return Math.min(30, worryCount * 3)
  }

  const breathScale = 1 + Math.sin(breathingPhase * 0.1) * 0.03

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Path */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <path
            d="M0,80 Q200,70 400,80 L400,130 L0,130 Z"
            fill="#B8CBBE"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Character walking with backpack */}
      <div
        className="relative mb-16 transition-transform duration-300"
        style={{
          transform: `translateX(${(walkProgress - 50) * 2}px) scale(${breathScale})`,
        }}
      >
        <svg width="140" height="200" viewBox="0 0 140 200" fill="none">
          {/* Shadow */}
          <ellipse cx="70" cy="190" rx="25" ry="6" fill="rgba(0,0,0,0.15)" />

          {/* Legs - walking animation */}
          <g transform={`rotate(${Math.sin(walkProgress * 0.2) * 15} 70 150)`}>
            <path
              d="M60 150 L55 180"
              stroke={COLORS.lavender}
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>
          <g transform={`rotate(${Math.sin(walkProgress * 0.2 + Math.PI) * 15} 80 150)`}>
            <path
              d="M80 150 L85 180"
              stroke={COLORS.lavender}
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>

          {/* Body - bent forward based on weight */}
          <g transform={`rotate(${getBendAngle()} 70 140)`}>
            <ellipse cx="70" cy="130" rx="24" ry="32" fill={COLORS.lavender} />

            {/* Arms - holding straps */}
            <path
              d="M48 125 L35 135 M92 125 L105 135"
              stroke={COLORS.lavender}
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Head */}
            <circle cx="70" cy="95" r="20" fill="#F5D6BA" />

            {/* Tired face */}
            <circle cx="64" cy="93" r="2" fill={COLORS.text} />
            <circle cx="76" cy="93" r="2" fill={COLORS.text} />
            <path
              d="M62 103 Q70 101 78 103"
              stroke={COLORS.text}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Sweat drops */}
            {breathingPhase % 30 > 15 && (
              <>
                <ellipse cx="58" cy="100" rx="2" ry="3" fill={COLORS.muted} opacity="0.6" />
                <ellipse cx="82" cy="100" rx="2" ry="3" fill={COLORS.muted} opacity="0.6" />
              </>
            )}
          </g>

          {/* Heavy backpack */}
          <g transform={`translate(0, ${Math.sin(walkProgress * 0.2) * 3})`}>
            <rect x="45" y="50" width="80" height="100" rx="12" fill={COLORS.text} opacity="0.9" />
            <rect x="50" y="55" width="70" height="90" rx="10" fill="#0A4F66" opacity="0.7" />

            {/* Backpack straps */}
            <path
              d="M55 60 Q30 90 48 125 M115 60 Q140 90 92 125"
              stroke={COLORS.text}
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Weight lines */}
            <line x1="55" y1="80" x2="115" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <line x1="55" y1="100" x2="115" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <line x1="55" y1="120" x2="115" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Message */}
      <div className="text-center space-y-4 mb-8 animate-fade-in">
        <p className="text-2xl font-light" style={{ color: COLORS.text }}>
          You're carrying a lot.
        </p>

        <div className="inline-block px-6 py-3 rounded-full" style={{ backgroundColor: 'rgba(118, 100, 139, 0.15)' }}>
          <p className="text-sm font-semibold" style={{ color: COLORS.lavender }}>
            {worryCount} {worryCount === 1 ? 'worry' : 'worries'} · {getWeightLevel()}
          </p>
        </div>

        <p className="text-base max-w-sm mx-auto" style={{ color: COLORS.muted }}>
          Let's look at each one and see what you can release.
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{
              width: `${walkProgress}%`,
              backgroundColor: COLORS.lavender,
            }}
          />
        </div>
      </div>

      {/* Skip button */}
      <button
        onClick={onNext}
        className="mt-8 text-sm font-medium underline transition-opacity hover:opacity-70"
        style={{ color: COLORS.muted }}
      >
        Continue
      </button>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}
