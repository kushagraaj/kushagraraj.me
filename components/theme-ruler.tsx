'use client'

import { useEffect, useRef, useState } from 'react'
import { applyDayTheme, DAY_THEMES, STEPS, STORAGE_KEY, tick } from '@/lib/themes'

// drag the strip under the marker to change theme; arrow keys also work

const GAP = 44
const VIEW = 150
const clamp = (n: number) => Math.max(0, Math.min(STEPS - 1, n))

export function ThemeRuler() {
  const [step, setStep] = useState<number | null>(null)
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [settled, setSettled] = useState(false) // skip the transition on first render
  const startX = useRef(0)
  const startStep = useRef(0)

  // theme was already applied by the inline script
  useEffect(() => {
    const s = Number(document.documentElement.dataset.themeStep)
    setStep(Number.isInteger(s) ? clamp(s) : 1)
    requestAnimationFrame(() => requestAnimationFrame(() => setSettled(true)))
  }, [])

  const choose = (next: number) => {
    if (step === null || next === step) return
    setStep(next)
    applyDayTheme(next)
    tick(next)
    try {
      localStorage.setItem(STORAGE_KEY, `${next}|${Date.now()}`)
    } catch {}
  }

  const current = step ?? 1
  const offset = VIEW / 2 - current * GAP + drag

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Theme"
      aria-valuemin={0}
      aria-valuemax={STEPS - 1}
      aria-valuenow={current}
      aria-valuetext={DAY_THEMES[current].name}
      onKeyDown={(e) => {
        const d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0
        if (!d) return
        e.preventDefault()
        choose(clamp(current + d))
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        startX.current = e.clientX
        startStep.current = current
        setDragging(true)
      }}
      onPointerMove={(e) => {
        if (!dragging) return
        const dx = e.clientX - startX.current
        const s = clamp(startStep.current - Math.round(dx / GAP))
        setDrag(dx + (s - startStep.current) * GAP)
        choose(s)
      }}
      onPointerUp={(e) => {
        // tap: step towards the side that was tapped
        if (Math.abs(e.clientX - startX.current) < 4) {
          const rect = e.currentTarget.getBoundingClientRect()
          choose(clamp(current + (e.clientX - rect.left < VIEW / 2 ? -1 : 1)))
        }
        setDragging(false)
        setDrag(0)
      }}
      onPointerCancel={() => {
        setDragging(false)
        setDrag(0)
      }}
      className="relative h-10 shrink-0 cursor-grab touch-none select-none overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] active:cursor-grabbing"
      style={{
        width: VIEW,
        visibility: step === null ? 'hidden' : 'visible',
        maskImage: 'linear-gradient(90deg, transparent, black 25%, black 75%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 25%, black 75%, transparent)',
      }}
    >
      <div
        className="absolute top-0 h-full"
        style={{
          transform: `translateX(${offset}px)`,
          transition: dragging || !settled ? 'none' : 'transform 350ms cubic-bezier(.23,1,.32,1)',
        }}
      >
        {Array.from({ length: (STEPS - 1) * 4 + 1 }, (_, i) => {
          const major = i % 4 === 0
          return (
            <span
              key={i}
              className="absolute top-1.5 w-px -translate-x-1/2"
              style={{ left: (i * GAP) / 4, height: major ? 11 : 5, background: 'var(--muted)', opacity: major ? 0.9 : 0.45 }}
            />
          )
        })}
        {DAY_THEMES.map((t, i) => (
          <span
            key={t.name}
            className="absolute top-[22px] -translate-x-1/2 font-mono text-[10px] transition-colors"
            style={{ left: i * GAP, color: i === current ? 'var(--text)' : 'var(--muted)' }}
          >
            {t.name}
          </span>
        ))}
      </div>
      <span className="absolute left-1/2 top-0 h-[22px] w-[2px] -translate-x-1/2 rounded-full" style={{ background: 'var(--accent)' }} />
    </div>
  )
}
