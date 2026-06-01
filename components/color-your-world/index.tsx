'use client'

import { useState } from 'react'
import { SCENES, type Scene } from './scenes'

// ── Palette ───────────────────────────────────────────────────────────────────
const PALETTE = [
  '#1C1C1E', '#FFFFFF', '#EF4444', '#F97316',
  '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6',
  '#EC4899', '#78350F', '#6B7280', '#0EA5E9',
  '#FCD34D', '#6EE7B7', '#FCA5A5', '#C4B5FD',
]

const COLORS = { bg: '#C5D9CF', deepOcean: '#083F56', teal: '#57A99A' }

interface Props { onComplete: () => void }

// Encouraging messages at progress milestones
const MESSAGES: Record<number, string> = {
  25: 'Nice start! ✨',
  50: 'Halfway there — looking beautiful!',
  75: 'Almost alive! Keep going 🎨',
  100: 'Your world is complete! 🌟',
}

export function ColorYourWorld({ onComplete }: Props) {
  // Pick a random scene once on mount
  const [scene] = useState<Scene>(
    () => SCENES[Math.floor(Math.random() * SCENES.length)]
  )

  const [fills,       setFills]       = useState<Record<string, string>>({})
  const [color,       setColor]       = useState('#3B82F6')
  const [showPalette, setShowPalette] = useState(false)
  const [milestones,  setMilestones]  = useState<Set<number>>(new Set())
  const [toast,       setToast]       = useState<string | null>(null)

  const totalRegions  = scene.regions.length
  const coloredCount  = Object.keys(fills).length
  const pct           = Math.round((coloredCount / totalRegions) * 100)

  function colorRegion(id: string) {
    setFills(prev => {
      const next = { ...prev, [id]: color }
      const newPct = Math.round((Object.keys(next).length / totalRegions) * 100)

      // Fire milestone toasts
      for (const m of [25, 50, 75, 100]) {
        if (newPct >= m && !milestones.has(m)) {
          setMilestones(ms => new Set([...ms, m]))
          setToast(MESSAGES[m])
          setTimeout(() => setToast(null), 2800)
          break
        }
      }
      return next
    })
  }

  return (
    <div
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: COLORS.bg, userSelect: 'none', WebkitUserSelect: 'none' }}
      onClick={() => showPalette && setShowPalette(false)}
    >
      {/* ── Minimal Top bar ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '16px 18px 8px', flexShrink: 0 }}>
        <button onClick={onComplete} style={{ background: COLORS.deepOcean, color: '#fff', borderRadius: 999, padding: '9px 18px', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
          Done
          <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ── SVG Canvas ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, margin: '0 14px 8px', borderRadius: 22, overflow: 'hidden', background: '#FAFAF8', boxShadow: '0 2px 20px rgba(0,0,0,0.09), inset 0 0 0 1px rgba(0,0,0,0.05)', position: 'relative' }}>
        <svg
          width="100%"
          height="100%"
          viewBox={scene.viewBox}
          preserveAspectRatio="xMidYMid meet"
          style={{ display: 'block' }}
        >
          {/* Fillable regions */}
          {scene.regions.map(region => (
            <path
              key={region.id}
              d={region.d}
              fill={fills[region.id] ?? region.fill}
              stroke={region.stroke ?? '#2a2a2a'}
              strokeWidth={region.strokeWidth ?? 1.4}
              strokeLinejoin="round"
              fillRule={region.fillRule ?? 'nonzero'}
              onClick={() => colorRegion(region.id)}
              style={{ cursor: 'pointer', transition: 'fill 0.18s ease' }}
            />
          ))}

          {/* Non-interactive decorative overlays */}
          {scene.decorations.map((deco, i) => (
            <path
              key={`deco-${i}`}
              d={deco.d}
              fill="none"
              stroke={deco.stroke}
              strokeWidth={deco.strokeWidth ?? 1}
              strokeLinecap="round"
              strokeLinejoin="round"
              pointerEvents="none"
            />
          ))}
        </svg>

        {/* Empty-state hint (shown when nothing colored yet) */}
        {coloredCount === 0 && (
          <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: 999, padding: '6px 16px', fontSize: 12, color: '#888', fontWeight: 500 }}>
              Tap any region to bring it to life 🎨
            </div>
          </div>
        )}
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div style={{ padding: '6px 18px 28px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }} onClick={e => e.stopPropagation()}>

        {/* Color wheel */}
        <div style={{ position: 'relative' }}>
          {showPalette && (
            <div style={{ position: 'absolute', bottom: 'calc(100% + 10px)', left: 0, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 18, padding: 10, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.9)', zIndex: 50 }}>
              {PALETTE.map(c => (
                <button key={c} onClick={() => { setColor(c); setShowPalette(false) }}
                  style={{ width: 36, height: 36, borderRadius: 999, background: c, cursor: 'pointer', border: c === color ? `3px solid ${COLORS.deepOcean}` : c === '#FFFFFF' ? '2px solid rgba(0,0,0,0.15)' : '2px solid transparent', boxShadow: '0 1px 4px rgba(0,0,0,0.14)', transform: c === color ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.15s ease' }}
                />
              ))}
            </div>
          )}

          <button onClick={() => setShowPalette(p => !p)} style={{ width: 52, height: 52, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 0, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', flexShrink: 0 }}>
            <svg width={52} height={52} viewBox="0 0 52 52">
              {Array.from({ length: 12 }, (_, i) => {
                const a1 = (i / 12) * Math.PI * 2, a2 = ((i + 1) / 12) * Math.PI * 2, r = 26
                return <path key={i} d={`M${r},${r}L${r+r*Math.cos(a1)},${r+r*Math.sin(a1)}A${r},${r}0,0,1,${r+r*Math.cos(a2)},${r+r*Math.sin(a2)}Z`} fill={`hsl(${(i/12)*360},80%,60%)`} />
              })}
              <circle cx={26} cy={26} r={13} fill="white" />
              <line x1={26} y1={20} x2={26} y2={32} stroke="#999" strokeWidth={2} strokeLinecap="round" />
              <line x1={20} y1={26} x2={32} y2={26} stroke="#999" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Active color swatch */}
        <div style={{ width: 40, height: 40, borderRadius: 999, background: color, border: color === '#FFFFFF' ? '2px solid rgba(0,0,0,0.18)' : '3px solid rgba(255,255,255,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', flexShrink: 0 }} />

        <div style={{ flex: 1 }} />

        {/* Undo last color */}
        <button
          onClick={() => {
            const keys = Object.keys(fills)
            if (keys.length === 0) return
            const last = keys[keys.length - 1]
            setFills(prev => { const n = { ...prev }; delete n[last]; return n })
          }}
          style={{ width: 52, height: 52, borderRadius: 16, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.9)', color: COLORS.deepOcean, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', flexShrink: 0 }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
          </svg>
        </button>

        {/* Clear all */}
        <button
          onClick={() => { setFills({}); setMilestones(new Set()) }}
          style={{ width: 52, height: 52, borderRadius: 16, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.9)', color: COLORS.deepOcean, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', flexShrink: 0 }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4h6v2" />
          </svg>
        </button>
      </div>

      {/* ── Toast notification ─────────────────────────────────────────────── */}
      {toast && (
        <div style={{ position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)', background: COLORS.deepOcean, color: '#fff', borderRadius: 999, padding: '10px 22px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(0,0,0,0.25)', zIndex: 100, pointerEvents: 'none', animation: 'cyw-toast 0.3s ease-out' }}>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes cyw-toast {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
