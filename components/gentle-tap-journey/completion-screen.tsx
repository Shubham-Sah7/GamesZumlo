'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HoneydewMascot } from '@/components/honeydew-mascot'

const COLORS = {
  honeydew: '#F0FFF0',
  lavenderFog: '#76648B',
  deepOcean: '#083F56',
}

const MESSAGES = [
  'Well done.',
  'You took a moment for yourself.',
  'Small pauses create big changes.',
  'You reconnected with yourself.',
]

export function CompletionScreen() {
  const router = useRouter()
  const [opacity, setOpacity] = useState(0)
  const [message] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)])

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="h-full flex flex-col items-center justify-center px-8"
      style={{
        background: COLORS.honeydew,
        transition: 'opacity 0.8s ease-out',
        opacity,
      }}
    >
      {/* Mascot */}
      <div className="mb-8">
        <HoneydewMascot size={120} mood="celebrating" />
      </div>

      {/* Title */}
      <h2
        className="text-[36px] font-medium text-center mb-2"
        style={{
          color: COLORS.deepOcean,
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
        }}
      >
        Heyy...
      </h2>

      {/* Message */}
      <p
        className="text-[14px] text-center mb-16"
        style={{
          color: COLORS.lavenderFog,
          lineHeight: '1.4',
          opacity: 0.85,
        }}
      >
        {message}
      </p>

      {/* CTA Button */}
      <button
        onClick={() => router.push('/')}
        className="w-full max-w-[340px] text-[16px] font-medium transition-all active:scale-[0.97]"
        style={{
          height: '58px',
          background: COLORS.lavenderFog,
          color: '#FFFFFF',
          borderRadius: '16px',
          letterSpacing: '0.01em',
        }}
      >
        Continue
      </button>
    </div>
  )
}
