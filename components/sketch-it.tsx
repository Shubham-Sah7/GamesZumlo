'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// ── Prompts ───────────────────────────────────────────────────────────────────
const PROMPTS = [
  { text: 'Draw a Tree',                         emoji: '🌳' },
  { text: 'Draw Your Dream House',               emoji: '🏠' },
  { text: 'Draw a Cat',                          emoji: '🐱' },
  { text: 'Draw a Mountain',                     emoji: '⛰️' },
  { text: 'Draw Something That Makes You Happy', emoji: '😊' },
  { text: 'Draw the Ocean',                      emoji: '🌊' },
  { text: 'Draw a Sunset',                       emoji: '🌅' },
  { text: 'Draw a Flower',                       emoji: '🌸' },
  { text: 'Draw Your Happy Place',               emoji: '✨' },
  { text: 'Draw a Bird in Flight',               emoji: '🕊️' },
  { text: 'Draw a Rainy Day',                    emoji: '🌧️' },
  { text: 'Draw a Cup of Tea',                   emoji: '🍵' },
  { text: 'Draw a Starry Night',                 emoji: '🌙' },
  { text: 'Draw Something Soft',                 emoji: '☁️' },
]

const PALETTE = [
  '#1C1C1E', '#FFFFFF', '#EF4444', '#F97316',
  '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6',
  '#EC4899', '#78350F', '#6B7280', '#0EA5E9',
]

const COLORS = { bg: '#C5D9CF', deepOcean: '#083F56', teal: '#57A99A' }

// Fixed internal canvas resolution — independent of CSS layout timing
const CANVAS_W = 800
const CANVAS_H = 1300

type Tool = 'pen' | 'eraser'
interface Point  { x: number; y: number }
interface Stroke { points: Point[]; color: string; width: number; eraser: boolean }

interface Props { onComplete: () => void }

const TIMER_SECONDS = 90

export function SketchItGame({ onComplete }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const ctxRef     = useRef<CanvasRenderingContext2D | null>(null)
  const strokesRef = useRef<Stroke[]>([])
  const liveRef    = useRef<Stroke | null>(null)
  const drawingRef = useRef(false)

  const [tool,        setTool]        = useState<Tool>('pen')
  const [color,       setColor]       = useState('#1C1C1E')
  const [showPalette, setShowPalette] = useState(false)
  const [timeLeft,    setTimeLeft]    = useState(TIMER_SECONDS)
  const [hasDrawn,    setHasDrawn]    = useState(false)

  const [prompt] = useState(
    () => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
  )

  // ── Canvas setup — fixed size, no layout dependency ───────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = CANVAS_W
    canvas.height = CANVAS_H
    const ctx = canvas.getContext('2d')!
    ctx.lineCap   = 'round'
    ctx.lineJoin  = 'round'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    ctxRef.current = ctx
  }, [])

  // ── Countdown ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft <= 0) { onComplete(); return }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, onComplete])

  // ── Scale: converts CSS pointer coords → canvas pixel coords ─────────────────
  function scale(): number {
    const canvas = canvasRef.current
    if (!canvas) return 1
    return CANVAS_W / canvas.getBoundingClientRect().width
  }

  function toCanvas(e: React.PointerEvent<HTMLCanvasElement>): Point {
    const rect = canvasRef.current!.getBoundingClientRect()
    const s    = CANVAS_W / rect.width
    return {
      x: (e.clientX - rect.left) * s,
      y: (e.clientY - rect.top)  * s,
    }
  }

  // ── Redraw ───────────────────────────────────────────────────────────────────
  const redrawAll = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx) return
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    for (const s of strokesRef.current) paintStroke(ctx, s)
  }, [])

  function paintStroke(ctx: CanvasRenderingContext2D, s: Stroke) {
    if (s.points.length < 2) return
    ctx.save()
    ctx.globalCompositeOperation = s.eraser ? 'destination-out' : 'source-over'
    ctx.strokeStyle = s.eraser ? 'rgba(0,0,0,1)' : s.color
    ctx.lineWidth   = s.width
    ctx.beginPath()
    ctx.moveTo(s.points[0].x, s.points[0].y)
    for (let i = 1; i < s.points.length - 1; i++) {
      const mid = {
        x: (s.points[i].x + s.points[i + 1].x) / 2,
        y: (s.points[i].y + s.points[i + 1].y) / 2,
      }
      ctx.quadraticCurveTo(s.points[i].x, s.points[i].y, mid.x, mid.y)
    }
    const last = s.points.at(-1)!
    ctx.lineTo(last.x, last.y)
    ctx.stroke()
    ctx.restore()
  }

  // ── Pointer events ───────────────────────────────────────────────────────────
  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    drawingRef.current = true
    const isEraser = tool === 'eraser'
    const s = scale()
    liveRef.current = {
      points: [toCanvas(e)],
      color,
      width:  isEraser ? 28 * s : 5 * s,
      eraser: isEraser,
    }
    if (!hasDrawn) setHasDrawn(true)
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault()
    if (!drawingRef.current || !liveRef.current || !ctxRef.current) return
    const ctx = ctxRef.current
    const p   = toCanvas(e)
    const pts = liveRef.current.points
    pts.push(p)

    if (pts.length >= 3) {
      const p1  = pts[pts.length - 3]
      const p2  = pts[pts.length - 2]
      const p3  = pts[pts.length - 1]
      const m1  = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
      const m2  = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 }
      ctx.save()
      ctx.globalCompositeOperation = liveRef.current.eraser ? 'destination-out' : 'source-over'
      ctx.strokeStyle = liveRef.current.eraser ? 'rgba(0,0,0,1)' : liveRef.current.color
      ctx.lineWidth   = liveRef.current.width
      ctx.beginPath()
      ctx.moveTo(m1.x, m1.y)
      ctx.quadraticCurveTo(p2.x, p2.y, m2.x, m2.y)
      ctx.stroke()
      ctx.restore()
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault()
    if (liveRef.current) strokesRef.current.push(liveRef.current)
    liveRef.current  = null
    drawingRef.current = false
  }

  const timerPct   = timeLeft / TIMER_SECONDS
  const timerColor = timeLeft > 20 ? COLORS.teal : '#EF4444'

  return (
    <div
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: COLORS.bg, userSelect: 'none', WebkitUserSelect: 'none' }}
      onClick={() => showPalette && setShowPalette(false)}
    >
      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '52px 18px 10px', flexShrink: 0 }}>
        <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.85)', borderRadius: 999, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6, maxWidth: '60%' }}>
          <span style={{ fontSize: 16 }}>{prompt.emoji}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.deepOcean, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{prompt.text}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: timerColor, fontVariantNumeric: 'tabular-nums', minWidth: 34, textAlign: 'right' }}>
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </span>
          <button onClick={onComplete} style={{ background: COLORS.deepOcean, color: '#fff', borderRadius: 999, padding: '9px 18px', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            Done
            <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Timer bar */}
      <div style={{ height: 3, background: 'rgba(255,255,255,0.3)', margin: '0 18px 0', flexShrink: 0, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${timerPct * 100}%`, background: timerColor, transition: 'width 1s linear, background 0.5s ease' }} />
      </div>

      {/* ── Canvas ───────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, margin: '10px 16px', borderRadius: 22, overflow: 'hidden', background: '#FFF', boxShadow: '0 2px 20px rgba(0,0,0,0.09), inset 0 0 0 1px rgba(0,0,0,0.05)', position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none', cursor: tool === 'eraser' ? 'cell' : 'crosshair' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        {!hasDrawn && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.22)', fontWeight: 500 }}>Tap to start drawing…</span>
          </div>
        )}
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: '8px 18px 30px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }} onClick={e => e.stopPropagation()}>

        {/* Color wheel */}
        <div style={{ position: 'relative' }}>
          {showPalette && (
            <div style={{ position: 'absolute', bottom: 'calc(100% + 10px)', left: 0, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 16, padding: 10, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.9)', zIndex: 50 }}>
              {PALETTE.map(c => (
                <button key={c} onClick={() => { setColor(c); setTool('pen'); setShowPalette(false) }}
                  style={{ width: 36, height: 36, borderRadius: 999, background: c, cursor: 'pointer', border: c === color ? `3px solid ${COLORS.deepOcean}` : c === '#FFFFFF' ? '2px solid rgba(0,0,0,0.15)' : '2px solid transparent', boxShadow: '0 1px 4px rgba(0,0,0,0.14)', transform: c === color ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.15s ease' }} />
              ))}
            </div>
          )}
          <button onClick={() => setShowPalette(p => !p)} style={{ width: 52, height: 52, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 0, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', flexShrink: 0 }}>
            <svg width={52} height={52} viewBox="0 0 52 52">
              {Array.from({ length: 12 }, (_, i) => {
                const a1 = (i / 12) * Math.PI * 2, a2 = ((i + 1) / 12) * Math.PI * 2, r = 26
                return <path key={i} d={`M ${r},${r} L ${r+r*Math.cos(a1)},${r+r*Math.sin(a1)} A ${r},${r} 0 0,1 ${r+r*Math.cos(a2)},${r+r*Math.sin(a2)} Z`} fill={`hsl(${(i/12)*360},80%,60%)`} />
              })}
              <circle cx={26} cy={26} r={13} fill="white" />
              <line x1={26} y1={20} x2={26} y2={32} stroke="#999" strokeWidth={2} strokeLinecap="round" />
              <line x1={20} y1={26} x2={32} y2={26} stroke="#999" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Active color */}
        <div style={{ width: 40, height: 40, borderRadius: 999, background: color, border: color === '#FFFFFF' ? '2px solid rgba(0,0,0,0.18)' : '3px solid rgba(255,255,255,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', flexShrink: 0 }} />

        <div style={{ flex: 1 }} />

        {/* Pen */}
        <ToolBtn active={tool === 'pen'} onClick={() => setTool('pen')}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </ToolBtn>

        {/* Eraser */}
        <ToolBtn active={tool === 'eraser'} onClick={() => setTool('eraser')}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 20H7L3 16l10-10 7 7-1.5 1.5" /><path d="M6.5 17.5 16 8" />
          </svg>
        </ToolBtn>

        {/* Undo */}
        <ToolBtn active={false} onClick={() => { strokesRef.current.pop(); redrawAll() }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
          </svg>
        </ToolBtn>

        {/* Clear */}
        <ToolBtn active={false} onClick={() => { strokesRef.current = []; redrawAll(); setHasDrawn(false) }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4h6v2" />
          </svg>
        </ToolBtn>
      </div>
    </div>
  )
}

function ToolBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ width: 52, height: 52, borderRadius: 16, border: 'none', cursor: 'pointer', background: active ? '#083F56' : 'rgba(255,255,255,0.9)', color: active ? '#fff' : '#083F56', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', transition: 'background 0.15s ease, color 0.15s ease', flexShrink: 0 }}>
      {children}
    </button>
  )
}
