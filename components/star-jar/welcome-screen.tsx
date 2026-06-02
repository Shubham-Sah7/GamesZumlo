'use client'

import { HoneydewMascot } from '@/components/honeydew-mascot'

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-8">
      {/* Zummi centered */}
      <div className="mb-8 animate-[fadeIn_0.6s_ease-out]">
        <HoneydewMascot size={140} mood="happy" />
      </div>

      {/* Title */}
      <h1
        className="mb-4 animate-[fadeIn_0.8s_ease-out] text-center text-[36px] font-semibold leading-tight"
        style={{
          color: '#083F56',
          letterSpacing: '-0.02em',
        }}
      >
        Star Jar
      </h1>

      {/* Subheading */}
      <p
        className="mb-12 animate-[fadeIn_1s_ease-out] max-w-[320px] text-center text-[15px] leading-relaxed"
        style={{
          color: '#76648B',
          opacity: 0.85,
          lineHeight: '1.6',
        }}
      >
        Collect small moments of light and fill your jar with positivity.
      </p>

      {/* CTA Button */}
      <button
        onClick={onStart}
        className="animate-[fadeIn_1.2s_ease-out] rounded-full px-12 py-4 text-[16px] font-medium transition-all active:scale-95"
        style={{
          backgroundColor: '#76648B',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(118, 100, 139, 0.3)',
        }}
      >
        Start Collecting
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
