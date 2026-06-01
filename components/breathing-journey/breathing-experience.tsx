"use client"

import { useEffect, useRef, useState } from "react"
import { HoneydewMascot } from "@/components/honeydew-mascot"

// 4-2-6 breathing rhythm (single cycle ≈ 12 s)
const INHALE = 4000
const HOLD   = 2000
const EXHALE = 6000
const TOTAL  = INHALE + HOLD + EXHALE

type Phase = "inhale" | "hold" | "exhale"

// Cubic bezier helper
function bez(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t
  return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3
}

// Smooth ease-in-out
function ease(t: number) {
  return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t
}

interface Props { onComplete: () => void }

export function BreathingExperience({ onComplete }: Props) {
  const [phase,     setPhase]     = useState<Phase>("inhale")
  const [pos,       setPos]       = useState({ x: 0, y: 80 })
  const [textAlpha, setTextAlpha] = useState(1)
  const rafRef   = useRef<number>(0)
  const startRef = useRef(Date.now())
  const doneRef  = useRef(false)

  useEffect(() => {
    startRef.current = Date.now()
    doneRef.current  = false

    const tick = () => {
      const elapsed  = Date.now() - startRef.current
      const progress = Math.min(1, elapsed / TOTAL)

      // ── Phase ───────────────────────────────────────────────────────────
      const newPhase: Phase =
        elapsed < INHALE              ? "inhale" :
        elapsed < INHALE + HOLD       ? "hold"   : "exhale"
      setPhase(p => p !== newPhase ? newPhase : p)

      // ── Mascot position along a smooth arch ─────────────────────────────
      // Arch: (0,80)–(20,80)–(40,15)–(52,15) then (52,15)–(65,15)–(82,80)–(100,80)
      let x: number, y: number

      if (elapsed <= INHALE) {
        const t = ease(elapsed / INHALE)
        x = bez(t, 0,  20, 40, 52)
        y = bez(t, 80, 80, 15, 15)
      } else if (elapsed <= INHALE + HOLD) {
        const t = (elapsed - INHALE) / HOLD
        // Gentle float at the peak
        x = 52 + Math.sin(t * Math.PI) * 2
        y = 15 + Math.sin(t * Math.PI * 2) * 2
      } else {
        const t = ease((elapsed - INHALE - HOLD) / EXHALE)
        x = bez(t, 52, 65, 82, 100)
        y = bez(t, 15, 15, 80, 80)
        // Fade instruction text in last 1.5 s
        const remaining = TOTAL - elapsed
        if (remaining < 1500) setTextAlpha(Math.max(0, remaining / 1500))
      }

      setPos({ x, y })

      // ── Completion ───────────────────────────────────────────────────────
      if (progress >= 1 && !doneRef.current) {
        doneRef.current = true
        setTimeout(onComplete, 500)
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [onComplete])

  const label =
    phase === "inhale" ? "Breathe In" :
    phase === "hold"   ? "Hold"       : "Breathe Out"

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center"
      style={{ background: "#F0FFF0" }}
    >
      {/* Phase instruction */}
      <div
        className="absolute left-0 right-0 flex justify-center"
        style={{ top: "14%", opacity: textAlpha, transition: "opacity 0.4s ease" }}
      >
        <h2
          className="text-[32px] font-semibold text-center"
          style={{ color: "#083F56", letterSpacing: "-0.02em" }}
        >
          {label}
        </h2>
      </div>

      {/* Arch guide + mascot */}
      <div className="relative h-[55%] w-full px-4">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Arch path */}
          <path
            d="M 0 80 C 20 80, 40 15, 52 15 C 65 15, 82 80, 100 80"
            fill="none"
            stroke="#B8CBBE"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.55"
          />
          {/* Subtle fill under arch */}
          <path
            d="M 0 80 C 20 80, 40 15, 52 15 C 65 15, 82 80, 100 80 L 100 100 L 0 100 Z"
            fill="#B8CBBE"
            opacity="0.10"
          />
        </svg>

        {/* Mascot travels along the arch */}
        <div
          className="absolute"
          style={{
            left: `${pos.x}%`,
            top:  `${pos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <HoneydewMascot size={80} />
        </div>
      </div>
    </div>
  )
}
