'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HoneydewMascot } from './honeydew-mascot'

const COLORS = {
  honeydew: '#F0FFF0',
  lavenderFog: '#76648B',
  deepOcean: '#083F56',
}

interface HoneydewCompletionScreenProps {
  message: string
  onContinue?: () => void
  stats?: Array<{ label: string; value: string }>
}

export function HoneydewCompletionScreen({ message, onContinue, stats }: HoneydewCompletionScreenProps) {
  const router = useRouter()
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    // Fade in
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
      {/* Honeydew Mascot */}
      <div className="mb-8">
        <HoneydewMascot size={120} mood="celebrating" />
      </div>

      {/* Title - Large and friendly */}
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

      {/* Message - Small and lightweight, single line */}
      <p
        className="text-[14px] text-center mb-8"
        style={{
          color: COLORS.lavenderFog,
          lineHeight: '1.4',
          opacity: 0.85,
        }}
      >
        {message}
      </p>

      {/* Optional Stats */}
      {stats && stats.length > 0 && (
        <div className="mb-8 flex gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p
                className="text-[24px] font-medium mb-1"
                style={{ color: COLORS.deepOcean }}
              >
                {stat.value}
              </p>
              <p
                className="text-[12px]"
                style={{ color: COLORS.lavenderFog, opacity: 0.7 }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={() => onContinue ? onContinue() : router.push('/')}
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
