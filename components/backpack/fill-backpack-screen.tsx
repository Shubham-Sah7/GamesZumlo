'use client'

import { useState, useRef, useEffect } from 'react'
import type { Worry } from './index'

const COLORS = {
  bg: '#F0FFF0',
  text: '#083F56',
  muted: '#7A9E96',
  lavender: '#76648B',
  rock: '#6B7280',
  zummi: '#FF9D49',
  backpack: '#8B6F47',
}

const COMMON_WORRIES = [
  'Interview stress',
  'Money worries',
  'Relationship problems',
  'Fear of failure',
  'Health concerns',
  'Overthinking',
  'Loneliness',
  'Self-doubt',
  'Work pressure',
  'Family issues',
]

interface FillBackpackScreenProps {
  worries: Worry[]
  setWorries: (worries: Worry[]) => void
  onNext: () => void
}

export function FillBackpackScreen({ worries, setWorries, onNext }: FillBackpackScreenProps) {
  const [input, setInput] = useState('')
  const [droppingRock, setDroppingRock] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const addWorry = (text: string) => {
    if (!text.trim()) return

    const newWorry: Worry = {
      id: Date.now().toString(),
      text: text.trim(),
      canControl: null,
      mattersIn5Years: null,
      canTakeAction: null,
      released: false,
      isActionStone: false,
    }

    setWorries([...worries, newWorry])
    setDroppingRock(newWorry.id)
    
    // Play drop animation
    setTimeout(() => {
      setDroppingRock(null)
    }, 600)

    setInput('')
    inputRef.current?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addWorry(input)
  }

  const getBackpackSize = () => {
    const count = worries.length
    if (count < 3) return { width: 140, height: 160, opacity: 0.7 }
    if (count < 6) return { width: 160, height: 180, opacity: 0.85 }
    if (count < 10) return { width: 180, height: 200, opacity: 1 }
    return { width: 200, height: 220, opacity: 1 }
  }

  const getWeightLabel = () => {
    const count = worries.length
    if (count === 0) return 'Empty'
    if (count < 3) return 'Light'
    if (count < 6) return 'Medium'
    if (count < 10) return 'Heavy'
    return 'Very Heavy'
  }

  const backpackSize = getBackpackSize()

  return (
    <div className="h-full flex flex-col px-6 py-8 relative overflow-hidden">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2" style={{ color: COLORS.text }}>
          What's weighing on your mind?
        </h2>
        <p className="text-sm" style={{ color: COLORS.muted }}>
          Add what you're carrying today
        </p>
      </div>

      {/* Zummi with backpack visualization */}
      <div className="flex-1 flex items-center justify-center mb-6 relative">
        {/* Backpack with Zummi */}
        <div
          className="transition-all duration-500 relative"
          style={{
            width: `${backpackSize.width}px`,
            height: `${backpackSize.height}px`,
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 200 240" fill="none">
            <defs>
              <filter id="backpack-shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.2" />
              </filter>
            </defs>

            {/* Shadow */}
            <ellipse cx="100" cy="230" rx="40" ry="8" fill="rgba(0,0,0,0.15)" />
            
            {/* Backpack body - growing */}
            <g transform="translate(40, 40)">
              <rect
                x="15"
                y="0"
                width="90"
                height={100 + worries.length * 8}
                rx="15"
                fill={COLORS.backpack}
                opacity={backpackSize.opacity}
                filter="url(#backpack-shadow)"
              />
              <rect
                x="20"
                y="5"
                width="80"
                height={90 + worries.length * 8}
                rx="12"
                fill="#6B5537"
                opacity="0.6"
              />
              
              {/* Straps */}
              <path
                d={`M25 10 Q5 ${40 + worries.length * 4} 20 ${80 + worries.length * 6}`}
                stroke={COLORS.backpack}
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.8"
              />
              <path
                d={`M95 10 Q115 ${40 + worries.length * 4} 100 ${80 + worries.length * 6}`}
                stroke={COLORS.backpack}
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.8"
              />
              
              {/* Top flap */}
              <rect
                x="20"
                y="-12"
                width="80"
                height="18"
                rx="8"
                fill={COLORS.backpack}
                opacity={backpackSize.opacity}
              />
              
              {/* Buckle */}
              <rect x="50" y="-7" width="20" height="8" rx="2" fill="#C9A86A" />

              {/* Rocks inside (visible through opening) */}
              {worries.slice(0, 7).map((worry, index) => {
                const positions = [
                  { cx: 45, cy: 35 },
                  { cx: 75, cy: 38 },
                  { cx: 60, cy: 50 },
                  { cx: 40, cy: 62 },
                  { cx: 80, cy: 60 },
                  { cx: 55, cy: 75 },
                  { cx: 70, cy: 85 },
                ]
                const pos = positions[index] || { cx: 60, cy: 50 }
                
                return (
                  <g key={worry.id} className={droppingRock === worry.id ? 'animate-rock-drop' : ''}>
                    <ellipse
                      cx={pos.cx}
                      cy={pos.cy}
                      rx="10"
                      ry="8"
                      fill={COLORS.rock}
                      opacity="0.8"
                    />
                    {/* Rock texture */}
                    <ellipse
                      cx={pos.cx}
                      cy={pos.cy - 2}
                      rx="6"
                      ry="4"
                      fill="rgba(255,255,255,0.2)"
                    />
                  </g>
                )
              })}
            </g>

            {/* Zummi below backpack - bending more as backpack grows */}
            <g transform={`translate(50, ${130 + worries.length * 3}) rotate(${Math.min(worries.length * 2, 15)}, 50, 30)`}>
              {/* Zummi's body */}
              <path
                d="M30 10 C40 8 50 10 55 18 C58 24 58 32 54 38 C52 42 48 45 43 47 
                   C38 49 33 49 28 47 C23 45 20 42 18 37 C16 32 16 27 18 22 C20 15 24 12 30 10 Z"
                fill={COLORS.zummi}
              />
              
              {/* Arms holding straps */}
              <ellipse cx="15" cy="28" rx="7" ry="10" fill={COLORS.zummi} transform="rotate(-15, 15, 28)" />
              <ellipse cx="65" cy="28" rx="7" ry="10" fill={COLORS.zummi} transform="rotate(15, 65, 28)" />
              
              {/* Legs */}
              <ellipse cx="30" cy="52" rx="6" ry="12" fill={COLORS.zummi} />
              <ellipse cx="50" cy="52" rx="6" ry="12" fill={COLORS.zummi} />

              {/* Eyes - expression changes with weight */}
              <g transform="translate(22, 20)">
                {/* Eye whites */}
                <ellipse cx="6" cy="4" rx="6" ry="7" fill="#FEFEFE" />
                <ellipse cx="18" cy="4" rx="6" ry="7" fill="#FEFEFE" />
                {/* Pupils - get more worried as backpack grows */}
                <ellipse 
                  cx="6" 
                  cy={4 + Math.min(worries.length * 0.3, 2)} 
                  rx="3" 
                  ry="4" 
                  fill={COLORS.text} 
                />
                <ellipse 
                  cx="18" 
                  cy={4 + Math.min(worries.length * 0.3, 2)} 
                  rx="3" 
                  ry="4" 
                  fill={COLORS.text} 
                />
              </g>

              {/* Expression - gets more worried */}
              {worries.length < 3 ? (
                <path
                  d="M25 35 Q32 34 39 35"
                  stroke={COLORS.text}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.6"
                />
              ) : (
                <path
                  d="M25 36 Q32 34 39 36"
                  stroke={COLORS.text}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.7"
                />
              )}

              {/* Sweat drops when heavy */}
              {worries.length >= 6 && (
                <>
                  <ellipse cx="18" cy="30" rx="1.5" ry="2" fill={COLORS.muted} opacity="0.5" />
                  <ellipse cx="62" cy="30" rx="1.5" ry="2" fill={COLORS.muted} opacity="0.5" />
                </>
              )}
            </g>
          </svg>

          {/* Weight indicator */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-sm font-medium" style={{ color: COLORS.muted }}>
              {worries.length} {worries.length === 1 ? 'worry' : 'worries'}
            </p>
            <p
              className="text-xs font-semibold"
              style={{
                color: worries.length >= 10 ? '#E63946' : worries.length >= 6 ? '#F59A4A' : COLORS.lavender,
              }}
            >
              {getWeightLabel()}
            </p>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="space-y-4 mb-6">
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your worry..."
            className="w-full px-4 py-3 rounded-xl border-2 bg-white text-base outline-none focus:border-lavender transition-colors"
            style={{
              borderColor: COLORS.muted + '40',
              color: COLORS.text,
            }}
            maxLength={60}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-lg font-medium text-white text-sm transition-opacity disabled:opacity-40"
            style={{ backgroundColor: COLORS.lavender }}
          >
            Add
          </button>
        </form>

        {/* Common worries */}
        {worries.length < 3 && (
          <div className="space-y-2">
            <p className="text-xs" style={{ color: COLORS.muted }}>
              Or choose from common worries:
            </p>
            <div className="flex flex-wrap gap-2">
              {COMMON_WORRIES.slice(0, 6).map((worry) => (
                <button
                  key={worry}
                  onClick={() => addWorry(worry)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95"
                  style={{
                    backgroundColor: COLORS.lavender + '20',
                    color: COLORS.lavender,
                  }}
                >
                  {worry}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Worry list */}
      {worries.length > 0 && (
        <div className="space-y-2 mb-6 max-h-40 overflow-y-auto">
          {worries.map((worry, index) => (
            <div
              key={worry.id}
              className="flex items-center gap-3 p-3 rounded-lg animate-slide-in"
              style={{
                backgroundColor: 'rgba(118, 100, 139, 0.1)',
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS.rock }}
              />
              <p className="text-sm flex-1" style={{ color: COLORS.text }}>
                {worry.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Continue button */}
      {worries.length > 0 && (
        <button
          onClick={onNext}
          className="w-full py-4 rounded-full font-semibold text-white text-base transition-all active:scale-95 shadow-lg"
          style={{ backgroundColor: COLORS.lavender }}
        >
          Continue ({worries.length} {worries.length === 1 ? 'item' : 'items'})
        </button>
      )}

      <style jsx>{`
        @keyframes rock-drop {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          50% {
            opacity: 1;
          }
          70% {
            transform: translateY(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-rock-drop {
          animation: rock-drop 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  )
}
