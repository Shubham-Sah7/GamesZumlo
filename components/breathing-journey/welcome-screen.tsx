"use client"

import { HoneydewMascot } from "@/components/honeydew-mascot"

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-8">
      <div className="mb-8">
        <HoneydewMascot size={120} mood="happy" onTap={() => console.log('Tap!')} />
      </div>

      <h1
        className="mb-4 text-center text-[36px] font-semibold leading-tight"
        style={{ color: "#083F56", letterSpacing: "-0.02em" }}
      >
        Breathe With Honeydew
      </h1>

      <p
        className="mb-16 max-w-[280px] text-center text-[14px] leading-relaxed"
        style={{ color: "#76648B", opacity: 0.85, lineHeight: "1.5" }}
      >
        One calm breath to reset your mind. Follow Zummie through a gentle breathing cycle.
      </p>

      <button
        onClick={onStart}
        className="w-full max-w-[340px] text-[16px] font-medium transition-all active:scale-[0.97]"
        style={{
          height: "58px",
          background: "#76648B",
          color: "#FFFFFF",
          borderRadius: "16px",
        }}
      >
        Let's Breathe
      </button>
    </div>
  )
}
