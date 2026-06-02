'use client'

import { useState, useEffect } from 'react'
import type { Worry } from './index'

const COLORS = {
  bg: '#F0FFF0',
  sky: '#87CEEB',
  text: '#083F56',
  muted: '#7A9E96',
  lavender: '#76648B',
  rock: '#6B7280',
  bird: '#57A99A',
  sun: '#FFC850',
  plant: '#3B8B7E',
}

interface LetGoJourneyScreenProps {
  worries: Worry[]
  setWorries: (worries: Worry[]) => void
  onComplete: () => void
}

type QuestionPhase = 'worry' | 'control' | 'future' | 'action' | 'release'

export function LetGoJourneyScreen({ worries, setWorries, onComplete }: LetGoJourneyScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<QuestionPhase>('worry')
  const [lightLevel, setLightLevel] = useState(0)
  const [releasing, setReleasing] = useState(false)

  const currentWorry = worries[currentIndex]
  const releasedCount = worries.filter((w) => w.released).length
  const progress = ((currentIndex + 1) / worries.length) * 100

  useEffect(() => {
    // Calculate light level based on released worries
    const newLightLevel = (releasedCount / worries.length) * 100
    setLightLevel(newLightLevel)
  }, [releasedCount, worries.length])

  const updateWorry = (updates: Partial<Worry>) => {
    const updated = worries.map((w) =>
      w.id === currentWorry.id ? { ...w, ...updates } : w
    )
    setWorries(updated)
  }

  const handleControlAnswer = (answer: 'yes' | 'partially' | 'no') => {
    updateWorry({ canControl: answer })
    setPhase('future')
  }

  const handleFutureAnswer = (answer: 'definitely' | 'maybe' | 'probably-not') => {
    updateWorry({ mattersIn5Years: answer })
    setPhase('action')
  }

  const handleActionAnswer = (answer: 'yes' | 'no') => {
    updateWorry({ canTakeAction: answer })
    setPhase('release')
  }

  const handleRelease = () => {
    const shouldRelease =
      currentWorry.canControl === 'no' ||
      currentWorry.mattersIn5Years === 'probably-not' ||
      (currentWorry.canControl === 'partially' && currentWorry.mattersIn5Years !== 'definitely')

    const isActionStone = currentWorry.canTakeAction === 'yes' && currentWorry.canControl !== 'no'

    updateWorry({ released: shouldRelease, isActionStone })

    setReleasing(true)

    setTimeout(() => {
      setReleasing(false)
      if (currentIndex < worries.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setPhase('worry')
      } else {
        onComplete()
      }
    }, 2500)
  }

  const skyOpacity = Math.min(0.5, lightLevel / 200)
  const plantOpacity = Math.min(1, lightLevel / 80)

  return (
    <div
      className="h-full flex flex-col relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${COLORS.sky} 0%, ${COLORS.bg} 50%)`,
      }}
    >
      {/* Sky with increasing light */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `linear-gradient(to bottom, ${COLORS.sky} 0%, ${COLORS.bg} 60%)`,
          opacity: skyOpacity,
        }}
      />

      {/* Sun */}
      {lightLevel > 25 && (
        <div
          className="absolute top-12 right-12 w-16 h-16 rounded-full animate-sun-rise"
          style={{
            background: `radial-gradient(circle, ${COLORS.sun} 0%, rgba(255, 200, 80, 0) 70%)`,
            opacity: Math.min(0.8, lightLevel / 100),
          }}
        />
      )}

      {/* Plants */}
      {lightLevel > 0 && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-around px-8 pointer-events-none">
          {[...Array(Math.floor(lightLevel / 20))].map((_, i) => (
            <div
              key={i}
              className="animate-grow-plant"
              style={{
                opacity: plantOpacity,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <svg width="30" height="40" viewBox="0 0 30 40">
                <path
                  d="M15 40 Q12 30 10 20 Q15 15 12 8 M15 40 Q17 32 18 22 Q15 18 17 10"
                  stroke={COLORS.plant}
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <ellipse cx="8" cy="15" rx="5" ry="8" fill={COLORS.plant} opacity="0.7" />
                <ellipse cx="22" cy="18" rx="5" ry="8" fill={COLORS.plant} opacity="0.7" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Progress */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: COLORS.text }}>
            {currentIndex + 1} of {worries.length}
          </span>
          <span className="text-sm" style={{ color: COLORS.muted }}>
            {releasedCount} released
          </span>
        </div>
        <div className="h-2 bg-white bg-opacity-40 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: COLORS.lavender,
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {!releasing ? (
          <>
            {/* Current worry display */}
            {phase === 'worry' && (
              <div className="text-center space-y-6 animate-fade-in">
                <div
                  className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(107, 114, 128, 0.2)' }}
                >
                  <span className="text-4xl">🪨</span>
                </div>

                <div className="max-w-md">
                  <p className="text-xl font-medium mb-4" style={{ color: COLORS.text }}>
                    {currentWorry.text}
                  </p>
                </div>

                <button
                  onClick={() => setPhase('control')}
                  className="px-12 py-4 rounded-full font-semibold text-white transition-all active:scale-95"
                  style={{ backgroundColor: COLORS.lavender }}
                >
                  Let's look at this
                </button>
              </div>
            )}

            {/* Question 1: Can you control this? */}
            {phase === 'control' && (
              <div className="text-center space-y-6 animate-fade-in max-w-lg">
                <p className="text-lg font-medium mb-6" style={{ color: COLORS.text }}>
                  Can you fully control this?
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => handleControlAnswer('yes')}
                    className="w-full py-4 rounded-xl font-medium transition-all active:scale-98 border-2"
                    style={{
                      backgroundColor: 'white',
                      borderColor: COLORS.lavender,
                      color: COLORS.text,
                    }}
                  >
                    Yes, I can control this
                  </button>
                  <button
                    onClick={() => handleControlAnswer('partially')}
                    className="w-full py-4 rounded-xl font-medium transition-all active:scale-98 border-2"
                    style={{
                      backgroundColor: 'white',
                      borderColor: COLORS.muted,
                      color: COLORS.text,
                    }}
                  >
                    Partially
                  </button>
                  <button
                    onClick={() => handleControlAnswer('no')}
                    className="w-full py-4 rounded-xl font-medium transition-all active:scale-98 border-2"
                    style={{
                      backgroundColor: 'white',
                      borderColor: COLORS.muted,
                      color: COLORS.text,
                    }}
                  >
                    No, it's outside my control
                  </button>
                </div>
              </div>
            )}

            {/* Question 2: Will this matter in 5 years? */}
            {phase === 'future' && (
              <div className="text-center space-y-6 animate-fade-in max-w-lg">
                <p className="text-lg font-medium mb-6" style={{ color: COLORS.text }}>
                  Will this matter in 5 years?
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => handleFutureAnswer('definitely')}
                    className="w-full py-4 rounded-xl font-medium transition-all active:scale-98 border-2"
                    style={{
                      backgroundColor: 'white',
                      borderColor: COLORS.lavender,
                      color: COLORS.text,
                    }}
                  >
                    Definitely
                  </button>
                  <button
                    onClick={() => handleFutureAnswer('maybe')}
                    className="w-full py-4 rounded-xl font-medium transition-all active:scale-98 border-2"
                    style={{
                      backgroundColor: 'white',
                      borderColor: COLORS.muted,
                      color: COLORS.text,
                    }}
                  >
                    Maybe
                  </button>
                  <button
                    onClick={() => handleFutureAnswer('probably-not')}
                    className="w-full py-4 rounded-xl font-medium transition-all active:scale-98 border-2"
                    style={{
                      backgroundColor: 'white',
                      borderColor: COLORS.muted,
                      color: COLORS.text,
                    }}
                  >
                    Probably not
                  </button>
                </div>
              </div>
            )}

            {/* Question 3: Can you take one small action? */}
            {phase === 'action' && (
              <div className="text-center space-y-6 animate-fade-in max-w-lg">
                <p className="text-lg font-medium mb-6" style={{ color: COLORS.text }}>
                  Can you take one small action today?
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => handleActionAnswer('yes')}
                    className="w-full py-4 rounded-xl font-medium transition-all active:scale-98 border-2"
                    style={{
                      backgroundColor: 'white',
                      borderColor: COLORS.lavender,
                      color: COLORS.text,
                    }}
                  >
                    Yes, I can
                  </button>
                  <button
                    onClick={() => handleActionAnswer('no')}
                    className="w-full py-4 rounded-xl font-medium transition-all active:scale-98 border-2"
                    style={{
                      backgroundColor: 'white',
                      borderColor: COLORS.muted,
                      color: COLORS.text,
                    }}
                  >
                    Not right now
                  </button>
                </div>
              </div>
            )}

            {/* Release decision */}
            {phase === 'release' && (
              <div className="text-center space-y-6 animate-fade-in">
                <button
                  onClick={handleRelease}
                  className="px-12 py-4 rounded-full font-semibold text-white transition-all active:scale-95 shadow-lg"
                  style={{ backgroundColor: COLORS.bird }}
                >
                  Continue
                </button>
              </div>
            )}
          </>
        ) : (
          /* Release animation */
          <div className="text-center space-y-8 animate-fade-in">
            {currentWorry.released ? (
              <>
                <div className="animate-float-away">
                  <span className="text-6xl">🕊️</span>
                </div>
                <p className="text-xl font-light max-w-sm mx-auto" style={{ color: COLORS.text }}>
                  You don't need to carry this right now.
                </p>
              </>
            ) : currentWorry.isActionStone ? (
              <>
                <div className="animate-transform">
                  <span className="text-6xl">🧭</span>
                </div>
                <p className="text-xl font-light max-w-sm mx-auto" style={{ color: COLORS.text }}>
                  Keep the action. Release the fear.
                </p>
              </>
            ) : (
              <>
                <div>
                  <span className="text-6xl">💪</span>
                </div>
                <p className="text-xl font-light max-w-sm mx-auto" style={{ color: COLORS.text }}>
                  You're keeping this one. That's okay.
                </p>
              </>
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

        @keyframes float-away {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
          }
        }

        @keyframes transform {
          0% {
            transform: scale(0.5) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }

        @keyframes grow-plant {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes sun-rise {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 0.8;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-float-away {
          animation: float-away 2s ease-out;
        }

        .animate-transform {
          animation: transform 1.5s ease-out;
        }

        .animate-grow-plant {
          animation: grow-plant 0.8s ease-out;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animate-sun-rise {
          animation: sun-rise 1.5s ease-out;
        }

        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  )
}
