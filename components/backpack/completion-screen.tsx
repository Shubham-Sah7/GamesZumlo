'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const COLORS = {
  bg: '#F0FFF0',
  sky: '#87CEEB',
  text: '#083F56',
  muted: '#7A9E96',
  lavender: '#76648B',
  sun: '#FFC850',
  plant: '#3B8B7E',
  rainbow: ['#FF6B6B', '#F59A4A', '#FFC850', '#57A99A', '#76648B'],
}

interface CompletionScreenProps {
  totalWorries: number
  releasedCount: number
}

export function CompletionScreen({ totalWorries, releasedCount }: CompletionScreenProps) {
  const [phase, setPhase] = useState<'backpack-remove' | 'world' | 'message' | 'complete'>('backpack-remove')
  const router = useRouter()

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('world'), 2000)
    const timer2 = setTimeout(() => setPhase('message'), 4000)
    const timer3 = setTimeout(() => setPhase('complete'), 6500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const releasePercentage = Math.round((releasedCount / totalWorries) * 100)

  return (
    <div
      className="h-full flex flex-col relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${COLORS.sky} 0%, ${COLORS.bg} 60%)`,
      }}
    >
      {/* Sun */}
      <div
        className="absolute top-16 right-16 w-24 h-24 rounded-full animate-sun-shine"
        style={{
          background: `radial-gradient(circle, ${COLORS.sun} 0%, rgba(255, 200, 80, 0.5) 50%, rgba(255, 200, 80, 0) 70%)`,
          boxShadow: `0 0 60px ${COLORS.sun}`,
        }}
      />

      {/* Rainbow */}
      {(phase === 'world' || phase === 'message' || phase === 'complete') && (
        <div className="absolute top-32 left-0 right-0 animate-rainbow-appear">
          <svg width="100%" height="120" viewBox="0 0 400 120" preserveAspectRatio="none">
            {COLORS.rainbow.map((color, i) => (
              <path
                key={i}
                d={`M0,${80 + i * 8} Q200,${30 + i * 8} 400,${80 + i * 8}`}
                stroke={color}
                strokeWidth="6"
                fill="none"
                opacity="0.7"
              />
            ))}
          </svg>
        </div>
      )}

      {/* Birds */}
      {(phase === 'world' || phase === 'message' || phase === 'complete') && (
        <div className="absolute top-24 left-0 right-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bird-fly"
              style={{
                left: `${-10 + i * 25}%`,
                top: `${20 + Math.sin(i) * 30}px`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${8 + i * 2}s`,
              }}
            >
              <svg width="30" height="20" viewBox="0 0 30 20" fill={COLORS.text} opacity="0.6">
                <path d="M5,10 Q10,5 15,10 Q20,5 25,10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Flowers */}
      {(phase === 'world' || phase === 'message' || phase === 'complete') && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-around px-6 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-flower-bloom"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <svg width="40" height="50" viewBox="0 0 40 50">
                {/* Stem */}
                <path d="M20 50 Q18 40 20 25" stroke={COLORS.plant} strokeWidth="2" fill="none" />
                {/* Petals */}
                <circle cx="20" cy="20" r="5" fill="#FFB6C1" />
                <circle cx="14" cy="22" r="4" fill="#FFC0CB" />
                <circle cx="26" cy="22" r="4" fill="#FFC0CB" />
                <circle cx="18" cy="15" r="4" fill="#FFD1DC" />
                <circle cx="22" cy="15" r="4" fill="#FFD1DC" />
                {/* Center */}
                <circle cx="20" cy="20" r="2.5" fill={COLORS.sun} />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Golden particles */}
      {(phase === 'message' || phase === 'complete') && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: COLORS.sun,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {phase === 'backpack-remove' && (
          <div className="text-center animate-fade-in space-y-8">
            <div className="animate-backpack-remove">
              <svg width="140" height="180" viewBox="0 0 140 180" fill="none">
                {/* Character standing tall */}
                <ellipse cx="70" cy="170" rx="25" ry="6" fill="rgba(0,0,0,0.1)" />
                
                {/* Legs */}
                <path d="M60 140 L58 165 M80 140 L82 165" stroke={COLORS.lavender} strokeWidth="7" strokeLinecap="round" />
                
                {/* Body - upright */}
                <ellipse cx="70" cy="115" rx="24" ry="32" fill={COLORS.lavender} />
                
                {/* Arms - relaxed */}
                <path d="M48 110 L38 125 M92 110 L102 125" stroke={COLORS.lavender} strokeWidth="6" strokeLinecap="round" />
                
                {/* Head */}
                <circle cx="70" cy="80" r="20" fill="#F5D6BA" />
                
                {/* Happy face */}
                <circle cx="64" cy="78" r="2" fill={COLORS.text} />
                <circle cx="76" cy="78" r="2" fill={COLORS.text} />
                <path d="M60 88 Q70 92 80 88" stroke={COLORS.text} strokeWidth="2" strokeLinecap="round" fill="none" />

                {/* Wind lines */}
                <g opacity="0.4">
                  <path d="M100 70 L120 68" stroke={COLORS.sky} strokeWidth="2" strokeLinecap="round" />
                  <path d="M105 80 L130 78" stroke={COLORS.sky} strokeWidth="2" strokeLinecap="round" />
                  <path d="M100 90 L125 88" stroke={COLORS.sky} strokeWidth="2" strokeLinecap="round" />
                </g>
              </svg>
            </div>

            <p className="text-xl font-light" style={{ color: COLORS.text }}>
              Letting go...
            </p>
          </div>
        )}

        {(phase === 'world' || phase === 'message' || phase === 'complete') && (
          <div className="text-center space-y-8 animate-fade-in">
            {/* Achievement badge */}
            <div className="inline-flex flex-col items-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-4 animate-badge-appear"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.sun} 0%, ${COLORS.lavender} 100%)`,
                  boxShadow: '0 8px 32px rgba(118, 100, 139, 0.3)',
                }}
              >
                <span className="text-5xl">🏆</span>
              </div>
              <p className="text-sm font-semibold tracking-wide" style={{ color: COLORS.lavender }}>
                THE LIGHT TRAVELER
              </p>
            </div>

            {/* Statistics */}
            <div className="flex gap-6 justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: COLORS.text }}>
                  {releasedCount}
                </p>
                <p className="text-sm" style={{ color: COLORS.muted }}>
                  Released
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: COLORS.text }}>
                  {releasePercentage}%
                </p>
                <p className="text-sm" style={{ color: COLORS.muted }}>
                  Lighter
                </p>
              </div>
            </div>

            {/* Messages */}
            {(phase === 'message' || phase === 'complete') && (
              <div className="space-y-4 max-w-md animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <p className="text-2xl font-light" style={{ color: COLORS.text }}>
                  You were never weak.
                </p>
                <p className="text-xl font-medium" style={{ color: COLORS.muted }}>
                  You were just carrying too much.
                </p>
              </div>
            )}

            {/* Buttons */}
            {phase === 'complete' && (
              <div className="space-y-3 pt-4 animate-fade-in" style={{ animationDelay: '1s' }}>
                <button
                  onClick={() => router.push('/')}
                  className="w-full max-w-sm px-12 py-4 rounded-full font-semibold text-white transition-all active:scale-95 shadow-lg"
                  style={{ backgroundColor: COLORS.lavender }}
                >
                  Continue
                </button>

                <p className="text-sm" style={{ color: COLORS.muted }}>
                  Come back tomorrow to check in again
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes backpack-remove {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(-100px);
            opacity: 0;
          }
        }

        @keyframes sun-shine {
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        @keyframes rainbow-appear {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bird-fly {
          from {
            transform: translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          to {
            transform: translateX(calc(100vw + 50px));
            opacity: 0;
          }
        }

        @keyframes flower-bloom {
          from {
            opacity: 0;
            transform: scale(0) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes badge-appear {
          from {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animate-backpack-remove {
          animation: backpack-remove 2s ease-out;
        }

        .animate-sun-shine {
          animation: sun-shine 3s ease-in-out infinite;
        }

        .animate-rainbow-appear {
          animation: rainbow-appear 1.5s ease-out;
        }

        .animate-bird-fly {
          animation: bird-fly linear infinite;
        }

        .animate-flower-bloom {
          animation: flower-bloom 0.6s ease-out;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animate-sparkle {
          animation: sparkle ease-in-out infinite;
        }

        .animate-badge-appear {
          animation: badge-appear 1s ease-out;
        }
      `}</style>
    </div>
  )
}
