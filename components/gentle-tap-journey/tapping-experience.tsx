'use client'

import { useState } from 'react'
import Image from 'next/image'

const COLORS = {
  honeydew: '#F0FFF0',
  lavenderFog: '#76648B',
  deepOcean: '#083F56',
  calmTeal: '#57A99A',
  purpleGlow: 'rgba(118, 100, 139, 0.6)',
  purpleBright: '#9B7EBD',
  orangeGlow: 'rgba(255, 159, 64, 0.8)',
}

interface TappingStep {
  id: string
  instruction: string
  taps: number
  areaY: number // percentage from top
  areaX: number // percentage from left
  areaWidth: number // percentage
  areaHeight: number // percentage
}

const STEPS: TappingStep[] = [
  {
    id: 'forehead',
    instruction: 'Tap your forehead 3 times',
    taps: 3,
    areaY: 24,
    areaX: 50,
    areaWidth: 20,
    areaHeight: 8,
  },
  {
    id: 'cheeks',
    instruction: 'Tap your cheeks 4 times',
    taps: 4,
    areaY: 30,
    areaX: 50,
    areaWidth: 25,
    areaHeight: 6,
  },
  {
    id: 'chest',
    instruction: 'Tap your chest 3 times',
    taps: 3,
    areaY: 50,
    areaX: 50,
    areaWidth: 22,
    areaHeight: 10,
  },
  {
    id: 'shoulders',
    instruction: 'Tap your shoulders 4 times',
    taps: 4,
    areaY: 40,
    areaX: 50,
    areaWidth: 35,
    areaHeight: 8,
  },
  {
    id: 'hands',
    instruction: 'Tap your hands 3 times',
    taps: 3,
    areaY: 72,
    areaX: 50,
    areaWidth: 45,
    areaHeight: 6,
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
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const step = STEPS[currentStep]
  const progress = ((currentStep + (tapsCompleted / step.taps)) / STEPS.length) * 100
  const isLastStep = currentStep === STEPS.length - 1

  const handleTap = () => {
    if (isTransitioning) return

    setShowRipple(true)
    setShowGlow(true)
    
    setTimeout(() => setShowRipple(false), 800)
    setTimeout(() => setShowGlow(false), 400)

    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }

    const newTaps = tapsCompleted + 1

    if (newTaps >= step.taps) {
      setIsTransitioning(true)
      setCompletedSteps(prev => new Set([...prev, currentStep]))
      
      if (isLastStep) {
        setTimeout(() => {
          onComplete()
        }, 1000)
      } else {
        setTimeout(() => {
          setCurrentStep(currentStep + 1)
          setTapsCompleted(0)
          setIsTransitioning(false)
        }, 1000)
      }
    } else {
      setTapsCompleted(newTaps)
    }
  }

  return (
    <div
      className="relative h-full w-full flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #F0FFF0 0%, #E8F5E9 100%)',
      }}
    >
      {/* Progress Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'rgba(118, 100, 139, 0.15)',
          zIndex: 20,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #76648B 0%, #9B7EBD 100%)',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      {/* Main Content - Body Image with Interaction Overlays */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-4">
        {/* Body Silhouette Container */}
        <div 
          className="relative"
          style={{ 
            width: '100%',
            maxWidth: '280px',
            height: '75vh',
            maxHeight: '650px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Actual Body Image */}
          <div
            className="relative w-full h-full"
            style={{
              animation: 'gentle-float 4s ease-in-out infinite',
            }}
          >
            <Image
              src="/body-silhouette.svg"
              alt="Body silhouette"
              fill
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 20px rgba(118, 100, 139, 0.15))',
              }}
              priority
            />
          </div>

          {/* Active Area Glow Overlay */}
          <div
            style={{
              position: 'absolute',
              top: `${step.areaY}%`,
              left: `${step.areaX}%`,
              transform: 'translate(-50%, -50%)',
              width: `${step.areaWidth}%`,
              height: `${step.areaHeight}%`,
              borderRadius: '50%',
              background: showGlow
                ? 'radial-gradient(circle, rgba(255, 159, 64, 0.9) 0%, rgba(155, 126, 189, 0.6) 50%, transparent 100%)'
                : 'radial-gradient(circle, rgba(155, 126, 189, 0.7) 0%, rgba(118, 100, 139, 0.4) 50%, transparent 100%)',
              animation: showGlow 
                ? 'glow-burst 0.4s ease-out' 
                : 'pulse-glow 2s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />

          {/* Ripple Effects */}
          {showRipple && (
            <>
              <div
                style={{
                  position: 'absolute',
                  top: `${step.areaY}%`,
                  left: `${step.areaX}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${step.areaWidth}%`,
                  height: `${step.areaHeight}%`,
                  borderRadius: '50%',
                  border: '3px solid #FF9F40',
                  opacity: 0.8,
                  animation: 'ripple-expand 0.8s ease-out',
                  pointerEvents: 'none',
                  zIndex: 6,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: `${step.areaY}%`,
                  left: `${step.areaX}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${step.areaWidth}%`,
                  height: `${step.areaHeight}%`,
                  borderRadius: '50%',
                  border: '2px solid #9B7EBD',
                  opacity: 0.6,
                  animation: 'ripple-expand 0.8s ease-out 0.1s',
                  pointerEvents: 'none',
                  zIndex: 6,
                }}
              />
            </>
          )}

          {/* Completed Steps Indicators */}
          {Array.from(completedSteps).map((stepIndex) => {
            const completedStep = STEPS[stepIndex]
            return (
              <div
                key={stepIndex}
                style={{
                  position: 'absolute',
                  top: `${completedStep.areaY}%`,
                  left: `${completedStep.areaX}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${completedStep.areaWidth * 0.4}%`,
                  height: `${completedStep.areaHeight * 0.4}%`,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(155, 126, 189, 0.8) 0%, transparent 70%)',
                  pointerEvents: 'none',
                  zIndex: 4,
                }}
              />
            )
          })}

          {/* Invisible Tap Target Overlay */}
          <div
            onClick={handleTap}
            style={{
              position: 'absolute',
              top: `${step.areaY}%`,
              left: `${step.areaX}%`,
              transform: 'translate(-50%, -50%)',
              width: `${step.areaWidth + 10}%`,
              height: `${step.areaHeight + 10}%`,
              cursor: isTransitioning ? 'not-allowed' : 'pointer',
              zIndex: 10,
              // Debug: uncomment to see tap zones
              // background: 'rgba(255, 0, 0, 0.2)',
              // border: '2px solid red',
            }}
          />
        </div>

        {/* Instruction - Minimal & Elegant */}
        <div
          className="absolute bottom-24 left-0 right-0 text-center px-8"
          style={{
            animation: 'fade-slide-up 0.6s ease-out',
          }}
        >
          <p
            className="text-[18px] font-medium mb-3"
            style={{
              color: COLORS.deepOcean,
              letterSpacing: '-0.01em',
              lineHeight: '1.4',
            }}
          >
            {step.instruction}
          </p>

          {/* Tap Dots */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: step.taps }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: i < tapsCompleted 
                    ? 'linear-gradient(135deg, #FF9F40 0%, #FFA726 100%)'
                    : 'rgba(118, 100, 139, 0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: i < tapsCompleted ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: i < tapsCompleted ? '0 2px 8px rgba(255, 159, 64, 0.4)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        @keyframes glow-burst {
          0% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.7; transform: scale(1); }
        }

        @keyframes ripple-expand {
          0% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2.5); }
        }

        @keyframes fade-slide-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
