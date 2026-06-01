'use client'

import { useEffect, useRef, useState } from 'react'

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg:          '#F0FFF0',
  trunk:       '#8B6343',
  branch:      '#A67C52',
  leafDark:    '#3B8B7E',
  leafMid:     '#57A99A',
  leafLight:   '#7EC5BE',
  flower:      '#F59A4A',
  flowerCtr:   '#FFF0D8',
  ground:      '#B8CBBE',
  text:        '#083F56',
  lavender:    '#76648B',
  muted:       '#7A9E96',
}

// ── localStorage helpers ──────────────────────────────────────────────────────
interface Entry { text: string; date: string }

function load(): Entry[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem('gratitude-entries') || '[]') } catch { return [] }
}

function save(entries: Entry[], text: string): Entry[] {
  const updated = [...entries, { text, date: new Date().toISOString() }]
  localStorage.setItem('gratitude-entries', JSON.stringify(updated))
  return updated
}

function calcStreak(entries: Entry[]): number {
  if (!entries.length) return 0
  const dates = [...new Set(entries.map(e => e.date.slice(0, 10)))].sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10)
  if (dates[0] !== today && dates[0] !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    if ((prev.getTime() - curr.getTime()) === 864e5) streak++
    else break
  }
  return streak
}

function stage(count: number): 1 | 2 | 3 | 4 | 5 {
  if (count < 3)  return 1
  if (count < 8)  return 2
  if (count < 16) return 3
  if (count < 30) return 4
  return 5
}

const STAGE_LABELS: Record<number, string> = {
  1: 'Tiny Sapling', 2: 'Small Tree', 3: 'Growing Tree',
  4: 'Healthy Tree', 5: 'Blooming Tree',
}

// ── Tree SVG ──────────────────────────────────────────────────────────────────
function TreeSVG({ s, pulse }: { s: 1|2|3|4|5; pulse: boolean }) {
  const vis = (min: number) => s >= min

  // Fade-in transition helper — applied to every group
  const appear = (min: number): React.CSSProperties => ({
    opacity:    vis(min) ? 1 : 0,
    transition: 'opacity 0.8s ease',
  })

  return (
    <div
      style={{
        animation: pulse ? 'tree-pulse 0.7s cubic-bezier(.36,.07,.19,.97)' : 'none',
      }}
    >
      <style>{`
        @keyframes tree-pulse {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.07); }
          65%  { transform: scale(0.97); }
          100% { transform: scale(1); }
        }
        @keyframes leaf-pop {
          0%   { opacity:0; transform:scale(0); }
          70%  { transform:scale(1.15); }
          100% { opacity:1; transform:scale(1); }
        }
      `}</style>
      <svg viewBox="0 0 200 230" fill="none" style={{ width: '100%', height: '100%' }}>

        {/* Ground */}
        <ellipse cx="100" cy="222" rx="36" ry="7" fill={C.ground} opacity="0.45"/>

        {/* ── Stage 1: thin sapling stem ─────────────────────────────── */}
        <g style={appear(1)}>
          <path d="M100 222 Q99 210 100 196" stroke={C.trunk} strokeWidth="3"
            strokeLinecap="round"/>
        </g>

        {/* ── Stage 1: two tiny leaves on the sapling ─────────────────── */}
        <g style={{ ...appear(1), opacity: vis(2) ? 0 : 1 }}>
          <ellipse cx="91" cy="193" rx="7" ry="10" fill={C.leafMid} opacity="0.9"
            transform="rotate(-28 91 193)"/>
          <ellipse cx="109" cy="193" rx="7" ry="10" fill={C.leafMid} opacity="0.9"
            transform="rotate(28 109 193)"/>
        </g>

        {/* ── Stage 2+: proper trunk ──────────────────────────────────── */}
        <g style={appear(2)}>
          <path d="M93 222 C92 205 91 188 94 172 L106 172 C109 188 108 205 107 222 Z"
            fill={C.trunk}/>
          {/* Subtle bark texture line */}
          <path d="M98 222 C97 210 96 195 97 175" stroke="#7A4F2A" strokeWidth="0.8"
            opacity="0.35" strokeLinecap="round"/>
        </g>

        {/* ── Stage 2: main round canopy ──────────────────────────────── */}
        <g style={appear(2)}>
          <circle cx="100" cy="158" r="30" fill={C.leafMid} opacity="0.88"/>
          <circle cx="84"  cy="166" r="20" fill={C.leafLight} opacity="0.80"/>
          <circle cx="116" cy="166" r="20" fill={C.leafLight} opacity="0.80"/>
          <circle cx="100" cy="142" r="20" fill={C.leafDark} opacity="0.72"/>
        </g>

        {/* ── Stage 3: side branches + wider canopy ───────────────────── */}
        <g style={appear(3)}>
          <path d="M96 180 C88 172 76 167 68 163" stroke={C.branch}
            strokeWidth="4.5" strokeLinecap="round"/>
          <path d="M104 180 C112 172 124 167 132 163" stroke={C.branch}
            strokeWidth="4.5" strokeLinecap="round"/>
          <circle cx="68"  cy="158" r="18" fill={C.leafMid} opacity="0.80"/>
          <circle cx="132" cy="158" r="18" fill={C.leafMid} opacity="0.80"/>
          <circle cx="82"  cy="148" r="18" fill={C.leafLight} opacity="0.75"/>
          <circle cx="118" cy="148" r="18" fill={C.leafLight} opacity="0.75"/>
          <circle cx="100" cy="134" r="18" fill={C.leafDark} opacity="0.70"/>
        </g>

        {/* ── Stage 4: extra volume all round ─────────────────────────── */}
        <g style={appear(4)}>
          <circle cx="55"  cy="163" r="16" fill={C.leafLight} opacity="0.70"/>
          <circle cx="145" cy="163" r="16" fill={C.leafLight} opacity="0.70"/>
          <circle cx="70"  cy="144" r="15" fill={C.leafMid} opacity="0.72"/>
          <circle cx="130" cy="144" r="15" fill={C.leafMid} opacity="0.72"/>
          <circle cx="88"  cy="130" r="16" fill={C.leafDark} opacity="0.68"/>
          <circle cx="112" cy="130" r="16" fill={C.leafDark} opacity="0.68"/>
          <circle cx="100" cy="120" r="16" fill="#2F7A70" opacity="0.65"/>
        </g>

        {/* ── Stage 5: flowers ────────────────────────────────────────── */}
        {([[78,148],[122,148],[62,156],[138,156],[100,126],[88,136],[112,136]] as const)
          .map(([cx, cy], i) => (
            <g key={i} style={appear(5)}>
              <circle cx={cx} cy={cy} r="6"   fill={C.flower}/>
              <circle cx={cx} cy={cy} r="2.8" fill={C.flowerCtr}/>
            </g>
          ))}

        {/* ── Stage 5: sparkle stars ──────────────────────────────────── */}
        {([[52,148],[148,148],[45,162],[155,162]] as const).map(([x, y], i) => (
          <g key={i} style={appear(5)}>
            <path d={`M${x},${y-5}L${x},${y+5}M${x-5},${y}L${x+5},${y}`}
              stroke={C.flower} strokeWidth="1.6" strokeLinecap="round"/>
            <path d={`M${x-3.5},${y-3.5}L${x+3.5},${y+3.5}M${x+3.5},${y-3.5}L${x-3.5},${y+3.5}`}
              stroke={C.flower} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          </g>
        ))}

      </svg>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
interface Props { onComplete: () => void }

export function GratitudeExperience({ onComplete }: Props) {
  const [entries, setEntries]   = useState<Entry[]>([])
  const [input,   setInput]     = useState('')
  const [phase,   setPhase]     = useState<'input' | 'growing' | 'done'>('input')
  const [pulse,   setPulse]     = useState(false)
  const inputRef                = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEntries(load())
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  const currentStage = stage(entries.length)
  const streak       = calcStreak(entries)
  const isFirst      = entries.length === 0
  const canSubmit    = input.trim().length > 0

  const handleGrow = () => {
    if (!canSubmit) return
    setPhase('growing')
    setPulse(true)
    setTimeout(() => setPulse(false), 700)
    setTimeout(() => {
      const updated = save(entries, input.trim())
      setEntries(updated)
      setPhase('done')
      setTimeout(onComplete, 1600)
    }, 900)
  }

  return (
    <div
      className="h-full flex flex-col px-6 pt-12 pb-8"
      style={{ background: C.bg }}
    >
      {/* Stage label + streak */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold tracking-wide uppercase"
          style={{ color: C.muted, letterSpacing: '0.12em' }}>
          {STAGE_LABELS[currentStage]}
        </span>
        {streak > 1 && (
          <span className="text-[11px] font-medium" style={{ color: C.lavender }}>
            🔥 {streak} day streak
          </span>
        )}
      </div>

      {/* Tree */}
      <div className="flex-1 flex items-center justify-center" style={{ minHeight: 0 }}>
        <div style={{ width: '200px', height: '230px' }}>
          <TreeSVG s={currentStage} pulse={pulse} />
        </div>
      </div>

      {/* Empty state */}
      {isFirst && phase === 'input' && (
        <p className="text-center text-[12px] mb-3" style={{ color: C.muted }}>
          Every big tree starts with a single seed.
        </p>
      )}

      {/* Post-grow confirmation */}
      {phase === 'done' && (
        <p className="text-center text-[13px] font-medium mb-3"
          style={{ color: C.leafMid, animation: 'fade-in 0.5s ease' }}>
          ✨ Your tree is growing
        </p>
      )}

      {/* Input area */}
      {phase === 'input' && (
        <>
          <p className="text-center text-[15px] font-medium mb-4"
            style={{ color: C.text }}>
            What are you grateful for today?
          </p>
          <div className="mb-4" style={{
            borderBottom: `1.5px solid ${C.lavender}`,
            paddingBottom: '8px',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value.slice(0, 60))}
              onKeyDown={e => e.key === 'Enter' && handleGrow()}
              placeholder="My family, a warm meal..."
              className="w-full bg-transparent text-[15px] outline-none text-center"
              style={{ color: C.text }}
            />
          </div>
          <p className="text-right text-[11px] mb-5" style={{ color: C.muted, opacity: 0.6 }}>
            {input.length}/60
          </p>
          <button
            onClick={handleGrow}
            disabled={!canSubmit}
            className="w-full text-[16px] font-medium transition-all active:scale-[0.97]"
            style={{
              height: '58px',
              background: canSubmit ? C.lavender : '#D0C8D8',
              color: '#fff',
              borderRadius: '16px',
              cursor: canSubmit ? 'pointer' : 'default',
              transition: 'background 0.2s ease',
            }}
          >
            Grow Tree 🌱
          </button>
        </>
      )}

      {/* Growing state */}
      {phase === 'growing' && (
        <div className="text-center py-4">
          <p className="text-[15px] font-medium" style={{ color: C.leafMid }}>
            Growing your tree...
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
