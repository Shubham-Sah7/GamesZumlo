'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { HoneydewMascot } from '@/components/honeydew-mascot'

export function CompletionScreen() {
  const router = useRouter()
  const fadeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Trigger fade in animation
    if (fadeRef.current) {
      fadeRef.current.style.opacity = '1'
    }
  }, [])

  const handleContinue = () => {
    router.push('/')
  }

  return (
    <div
      ref={fadeRef}
      className="flex h-full w-full flex-col items-center justify-center px-8 transition-opacity duration-700"
      style={{ opacity: 0 }}
    >
      {/* Zummi centered */}
      <div className="mb-8 animate-[fadeIn_0.6s_ease-out]">
        <HoneydewMascot size={140} mood="celebrating" />
      </div>

      {/* Title */}
      <h1
        className="mb-3 animate-[fadeIn_0.8s_ease-out] text-center text-[36px] font-semibold"
        style={{
          color: '#083F56',
          letterSpacing: '-0.02em',
        }}
      >
        Heyy...
      </h1>

      {/* Message */}
      <p
        className="mb-12 animate-[fadeIn_1s_ease-out] text-center text-[16px] leading-relaxed"
        style={{
          color: '#76648B',
          opacity: 0.85,
          lineHeight: '1.6',
        }}
      >
        you found moments of light today
      </p>

      {/* CTA Button */}
      <button
        onClick={handleContinue}
        className="animate-[fadeIn_1.2s_ease-out] rounded-full px-12 py-4 text-[16px] font-medium transition-all active:scale-95"
        style={{
          backgroundColor: '#76648B',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(118, 100, 139, 0.3)',
        }}
      >
        Continue
      </button>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
