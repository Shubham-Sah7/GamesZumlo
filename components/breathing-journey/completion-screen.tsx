"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { HoneydewMascot } from "@/components/honeydew-mascot"

export function CompletionScreen() {
  const router = useRouter()
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setOpacity(1), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center px-8"
      style={{ transition: "opacity 0.8s ease-out", opacity }}
    >
      <div className="mb-8">
        <HoneydewMascot size={120} />
      </div>

      <h2
        className="mb-2 text-center text-[36px] font-semibold"
        style={{ color: "#083F56", letterSpacing: "-0.02em", lineHeight: "1.1" }}
      >
        Heyy...
      </h2>

      <p
        className="mb-16 text-center text-[14px]"
        style={{ color: "#76648B", opacity: 0.85, lineHeight: "1.4" }}
      >
        you took a moment for yourself
      </p>

      <button
        onClick={() => router.push("/")}
        className="w-full max-w-[340px] text-[16px] font-medium transition-all active:scale-[0.97]"
        style={{
          height: "58px",
          background: "#76648B",
          color: "#FFFFFF",
          borderRadius: "16px",
        }}
      >
        Continue
      </button>
    </div>
  )
}
