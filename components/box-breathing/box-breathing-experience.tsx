"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HoneydewMascot } from "@/components/honeydew-mascot";

interface BoxBreathingExperienceProps {
  onComplete: () => void;
}

type Phase = "inhale" | "hold1" | "exhale" | "hold2";

const PHASES = [
  { phase: "inhale" as Phase, duration: 4000, label: "Breathe In",  seconds: 4 },
  { phase: "hold1"  as Phase, duration: 2000, label: "Hold",         seconds: 2 },
  { phase: "exhale" as Phase, duration: 6000, label: "Breathe Out", seconds: 6 },
  { phase: "hold2"  as Phase, duration: 2000, label: "Hold",         seconds: 2 },
] as const;

const TOTAL_DURATION = 14000;

// Pill path geometry — ViewBox 200 × 560
// Pill: x 50–150 (width 100), radius 50
// Straight sections: y 100 → 460  (360 units each)
// Perimeter ≈ 2×360 + 2×(π×50) = 1034
// Starts bottom-left, travels UP left side → top cap → DOWN right side → bottom cap
const VB_W = 200;
const VB_H = 560;
const PILL_PATH =
  "M 50,460 L 50,100 A 50 50 0 1 1 150,100 L 150,460 A 50 50 0 1 1 50,460 Z";
const FALLBACK_LENGTH = 1034;

// Per-phase accent colors (ambient background tint)
const PHASE_COLORS: Record<Phase, string> = {
  inhale: "rgba(87, 169, 154, 0.18)",
  hold1:  "rgba(118, 100, 139, 0.14)",
  exhale: "rgba(87, 169, 154, 0.08)",
  hold2:  "rgba(245, 154, 74, 0.08)",
};

export function BoxBreathingExperience({ onComplete }: BoxBreathingExperienceProps) {
  const [phaseIdx,      setPhaseIdx]      = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [trailLength,   setTrailLength]   = useState(0);
  const [zummiPos,      setZummiPos]      = useState({ x: 50, y: 460 });
  const [fadeOut,       setFadeOut]       = useState(false);
  const [pathLength,    setPathLength]    = useState(FALLBACK_LENGTH);

  const pathRef      = useRef<SVGPathElement>(null);
  const pathLenRef   = useRef(FALLBACK_LENGTH);
  const rafRef       = useRef<number>(0);
  const startRef     = useRef(0);
  const completedRef = useRef(false);
  const fadedRef     = useRef(false);

  useLayoutEffect(() => {
    if (pathRef.current) {
      const L = pathRef.current.getTotalLength();
      pathLenRef.current = L;
      setPathLength(L);
    }
  }, []);

  useEffect(() => {
    startRef.current     = performance.now();
    completedRef.current = false;
    fadedRef.current     = false;
    setFadeOut(false);
    setTrailLength(0);
    setPhaseIdx(0);
    setPhaseProgress(0);
    setZummiPos({ x: 50, y: 460 });

    const animate = (now: number) => {
      if (completedRef.current) return;
      const elapsed = now - startRef.current;

      if (elapsed >= TOTAL_DURATION - 1000 && !fadedRef.current) {
        fadedRef.current = true;
        setFadeOut(true);
      }

      if (elapsed >= TOTAL_DURATION) {
        completedRef.current = true;
        setTimeout(onComplete, 800);
        return;
      }

      let accumulated = 0, idx = 0, phaseElapsed = 0;
      for (let i = 0; i < PHASES.length; i++) {
        if (elapsed < accumulated + PHASES[i].duration) {
          idx = i; phaseElapsed = elapsed - accumulated; break;
        }
        accumulated += PHASES[i].duration;
      }

      const t = Math.min(phaseElapsed / PHASES[idx].duration, 1);
      setPhaseIdx(idx);
      setPhaseProgress(t);

      const L = pathLenRef.current;
      const currentLength = (idx + t) * (L / 4);
      setTrailLength(currentLength);

      if (pathRef.current) {
        const pt = pathRef.current.getPointAtLength(currentLength);
        setZummiPos({ x: pt.x, y: pt.y });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [onComplete]);

  const currentPhase = PHASES[phaseIdx];
  const countdown = Math.max(1, Math.ceil((1 - phaseProgress) * currentPhase.seconds));

  // Visual properties derived from breathing phase
  let glowPulse: number;
  let zummiScale: number;
  switch (currentPhase.phase) {
    case "inhale":
      glowPulse  = 0.15 + phaseProgress * 0.85;
      zummiScale = 1.0  + phaseProgress * 0.22;
      break;
    case "hold1":
      glowPulse  = 1.0;
      zummiScale = 1.22;
      break;
    case "exhale":
      glowPulse  = 1.0  - phaseProgress * 0.85;
      zummiScale = 1.22 - phaseProgress * 0.22;
      break;
    default:
      glowPulse  = 0.15;
      zummiScale = 1.0;
  }

  // Zummi % position within the pill container
  const zummiLeft = `${(zummiPos.x / VB_W) * 100}%`;
  const zummiTop  = `${(zummiPos.y / VB_H) * 100}%`;

  // Orb position for dynamic background (follows Zummi in screen %)
  // Pill container is centered; orb follows horizontally within ~20-80% range
  const orbX = 30 + (zummiPos.x / VB_W) * 40; // ~30–70% of screen width
  const orbY = 20 + (zummiPos.y / VB_H) * 60;  // ~20–80% of screen height

  return (
    <>
      <style>{`
        @keyframes bp-phase-in {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes bp-count-pop {
          0%   { transform: scale(1.4);  opacity: 0.2; }
          50%  { transform: scale(0.93); opacity: 1;   }
          100% { transform: scale(1);    opacity: 1;   }
        }
        @keyframes bp-chip-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      {/* Root — fills the IPhoneFrame device div exactly */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "linear-gradient(170deg, #E8FBF5 0%, #F0FFF8 45%, #EEF0FF 100%)",
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 1.1s ease-out",
          overflow: "hidden",
        }}
      >
        {/* ── Dynamic breathing orb (follows Zummi) ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 55% 45% at ${orbX}% ${orbY}%, ${PHASE_COLORS[currentPhase.phase]}, transparent 70%)`,
            transition: "background 0.12s ease-out",
            pointerEvents: "none",
          }}
        />

        {/* ── Phase label (glassmorphism chip) ── */}
        <div style={{ flexShrink: 0, height: 72, display: "flex", alignItems: "center" }}>
          <div
            key={`phase-${phaseIdx}`}
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(20px) saturate(1.6)",
              WebkitBackdropFilter: "blur(20px) saturate(1.6)",
              border: "1px solid rgba(255,255,255,0.75)",
              borderRadius: 999,
              padding: "10px 28px",
              animation: "bp-chip-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#083F56",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              {currentPhase.label}
            </span>
          </div>
        </div>

        {/* ── Flexible spacer ── */}
        <div style={{ flex: 1, minHeight: 16 }} />

        {/* ── Pill path + Zummi ── */}
        <div
          style={{
            flexShrink: 0,
            position: "relative",
            width: 130,
            height: Math.round(130 * (VB_H / VB_W)),  // 130 × 2.8 = 364px
          }}
        >
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="bp-ambient" x="-80%" y="-15%" width="260%" height="130%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="bp-glow" x="-60%" y="-12%" width="220%" height="124%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="bp-trail" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%"   stopColor="#5EEAD4" />
                <stop offset="60%"  stopColor="#57A99A" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>

            {/* Ambient pulse halo */}
            <path
              d={PILL_PATH}
              fill="none"
              stroke="#57A99A"
              strokeWidth="32"
              opacity={glowPulse * 0.13}
              filter="url(#bp-ambient)"
              style={{ transition: "opacity 0.2s ease-out" }}
            />

            {/* Ghost guide track */}
            <path
              d={PILL_PATH}
              fill="rgba(87,169,154,0.04)"
              stroke="rgba(87,169,154,0.18)"
              strokeWidth="3"
            />

            {/* Filled trail */}
            <path
              ref={pathRef}
              d={PILL_PATH}
              fill="none"
              stroke="url(#bp-trail)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength - trailLength}
              filter="url(#bp-glow)"
              opacity={0.75 + glowPulse * 0.25}
              style={{ transition: "opacity 0.2s ease-out" }}
            />
          </svg>

          {/* Zummi */}
          <div
            style={{
              position: "absolute",
              left: zummiLeft,
              top:  zummiTop,
              transform: `translate(-50%, -50%) scale(${zummiScale})`,
              transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              filter: `drop-shadow(0 0 ${7 + glowPulse * 14}px rgba(255,157,73,${0.4 + glowPulse * 0.4}))`,
              zIndex: 10,
              willChange: "left, top",
            }}
          >
            <HoneydewMascot size={62} />
          </div>
        </div>

        {/* ── Flexible spacer ── */}
        <div style={{ flex: 1, minHeight: 16 }} />

        {/* ── Countdown ── */}
        <div
          style={{
            flexShrink: 0,
            height: 130,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <div
            key={`${phaseIdx}-${countdown}`}
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: "#0D9488",
              letterSpacing: "-0.07em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              animation: "bp-count-pop 0.24s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {countdown}
          </div>

          {/* Phase progress pills */}
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            {PHASES.map((_, i) => (
              <div
                key={i}
                style={{
                  height: 4,
                  width: i === phaseIdx ? 20 : 4,
                  borderRadius: 2,
                  background: i === phaseIdx ? "#0D9488" : "rgba(13,148,136,0.2)",
                  transition: "width 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Bottom breathing room ── */}
        <div style={{ height: 36, flexShrink: 0 }} />
      </div>
    </>
  );
}
