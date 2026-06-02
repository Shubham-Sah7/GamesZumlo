'use client'

import { useEffect, useState } from 'react'

const COLORS = {
  bg: '#F0FFF0',
  darkSky: '#4A5D6B',
  text: '#083F56',
  muted: '#7A9E96',
  lavender: '#76648B',
  zummi: '#FF9D49',
  backpack: '#8B6F47',
}

interface IntroScreenProps {
  onNext: () => void
}

export function IntroScreen({ onNext }: IntroScreenProps) {
  const [phase, setPhase] = useState<'clouds' | 'text1' | 'text2' | 'button'>('clouds')

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('text1'), 1000)
    const timer2 = setTimeout(() => setPhase('text2'), 3500)
    const timer3 = setTimeout(() => setPhase('button'), 5500)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div
      className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${COLORS.darkSky} 0%, ${COLORS.bg} 60%)`,
      }}
    >
      {/* Dark clouds */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-64 h-32 rounded-full opacity-30 animate-float-slow"
          style={{
            background: 'rgba(74, 93, 107, 0.4)',
            top: '10%',
            left: '-10%',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute w-80 h-40 rounded-full opacity-25 animate-float-slower"
          style={{
            background: 'rgba(74, 93, 107, 0.3)',
            top: '15%',
            right: '-15%',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* Zummi with heavy backpack */}
      <div className="relative mb-12 animate-bounce-subtle">
        <svg width="180" height="200" viewBox="0 0 180 200" fill="none">
          {/* Shadow */}
          <ellipse cx="90" cy="190" rx="35" ry="8" fill="rgba(0,0,0,0.2)" />
          
          {/* Giant backpack behind Zummi */}
          <g transform="translate(40, 20)">
            <rect
              x="20"
              y="0"
              width="80"
              height="100"
              rx="12"
              fill={COLORS.backpack}
              opacity="0.9"
            />
            <rect
              x="25"
              y="5"
              width="70"
              height="90"
              rx="10"
              fill="#6B5537"
              opacity="0.6"
            />
            {/* Straps visible */}
            <path
              d="M30 10 Q10 40 25 80 M90 10 Q110 40 95 80"
              stroke={COLORS.backpack}
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Buckle */}
            <rect x="50" y="15" width="20" height="10" rx="3" fill="#C9A86A" />
            {/* Texture lines */}
            <line x1="30" y1="35" x2="90" y2="35" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
            <line x1="30" y1="55" x2="90" y2="55" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
            <line x1="30" y1="75" x2="90" y2="75" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
          </g>

          {/* Zummi body - bent forward, struggling */}
          <g transform="translate(45, 85) rotate(10, 45, 40)">
            {/* Zummi's organic blob shape - struggling posture */}
            <path
              d="M35 0 C45 0 55 5 60 15 C65 25 65 35 60 45 C58 50 55 55 50 58 
                 C45 61 40 62 35 62 C30 62 25 61 20 58 C15 55 12 50 10 45 
                 C8 40 7 35 8 30 C9 20 15 10 25 5 C28 3 31 0 35 0 Z"
              fill={COLORS.zummi}
            />
            
            {/* Arms holding straps - tense */}
            <ellipse cx="15" cy="35" rx="8" ry="12" fill={COLORS.zummi} transform="rotate(-20, 15, 35)" />
            <ellipse cx="55" cy="35" rx="8" ry="12" fill={COLORS.zummi} transform="rotate(20, 55, 35)" />
            
            {/* Legs - slightly bent */}
            <ellipse cx="25" cy="65" rx="7" ry="15" fill={COLORS.zummi} />
            <ellipse cx="45" cy="65" rx="7" ry="15" fill={COLORS.zummi} />

            {/* Eyes - worried/tired */}
            <g transform="translate(20, 20)">
              {/* Eye whites */}
              <ellipse cx="8" cy="5" rx="7" ry="8" fill="#FEFEFE" />
              <ellipse cx="22" cy="5" rx="7" ry="8" fill="#FEFEFE" />
              {/* Pupils - looking down tiredly */}
              <ellipse cx="8" cy="7" rx="4" ry="5" fill={COLORS.text} />
              <ellipse cx="22" cy="7" rx="4" ry="5" fill={COLORS.text} />
            </g>

            {/* Worried expression line */}
            <path
              d="M20 38 Q27 36 34 38"
              stroke={COLORS.text}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />

            {/* Sweat drops */}
            <ellipse cx="15" cy="32" rx="2" ry="3" fill={COLORS.muted} opacity="0.5" />
            <ellipse cx="55" cy="32" rx="2" ry="3" fill={COLORS.muted} opacity="0.5" />
          </g>

          {/* Breathing effort lines */}
          <g opacity="0.3">
            <path d="M25 105 L15 103" stroke={COLORS.darkSky} strokeWidth="2" strokeLinecap="round" />
            <path d="M25 115 L12 115" stroke={COLORS.darkSky} strokeWidth="2" strokeLinecap="round" />
            <path d="M25 125 L15 127" stroke={COLORS.darkSky} strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Text messages */}
      <div className="px-8 text-center space-y-6 max-w-md">
        {(phase === 'text1' || phase === 'text2' || phase === 'button') && (
          <p
            className="text-xl font-light animate-fade-in"
            style={{ color: COLORS.text }}
          >
            Sometimes life feels heavy.
          </p>
        )}

        {(phase === 'text2' || phase === 'button') && (
          <p
            className="text-lg font-medium animate-fade-in"
            style={{ color: COLORS.muted, animationDelay: '0.3s' }}
          >
            Let's see what you're carrying.
          </p>
        )}
      </div>

      {/* CTA Button */}
      {phase === 'button' && (
        <button
          onClick={onNext}
          className="mt-12 px-12 py-4 rounded-full font-semibold text-white text-lg transition-all active:scale-95 animate-fade-in shadow-lg"
          style={{
            backgroundColor: COLORS.lavender,
            animationDelay: '0.5s',
          }}
        >
          Open My Backpack 🎒
        </button>
      )}

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

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, -20px);
          }
        }

        @keyframes float-slower {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-40px, 15px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float-slower 25s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
