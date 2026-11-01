'use client'

import { useEffect, useRef } from 'react'

// the tangent kyte wordmark, same as the studio's landing page.
// the T's crossbar is a tangent line with a wheel rolling on it; a kite flies off "kyte".

const BAR_Y = 14
const R = 17
const SW = 3.5
const CY = BAR_Y - R - SW / 2
const W = 90
const MIN = 14
const MAX = 76
const MID = 45

export function KyteMark({ href }: { href: string }) {
  const root = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const svg = el.querySelector<SVGSVGElement>('.tkm-T svg')!
    const wheel = el.querySelector<SVGGElement>('.tkm-wheel')!
    const spin = el.querySelector<SVGGElement>('.tkm-spin')!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

    let x = reduce ? MID : -40
    let v = 0
    let target = MID
    let pointer = false
    let raf = 0
    let visible = true
    let last = performance.now()
    const start = performance.now() + 400

    const draw = () => {
      wheel.setAttribute('transform', `translate(${x.toFixed(2)} 0)`)
      spin.setAttribute('transform', `rotate(${((x / R) * 57.2958).toFixed(1)} 0 ${CY})`)
    }
    draw()

    const tick = (now: number) => {
      raf = 0
      const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05)
      last = now
      if (now < start) {
        raf = requestAnimationFrame(tick)
        return
      }
      if (!pointer && !reduce && now > start + 1600) target = MID + Math.sin(((now - start) / 1000) * 0.55) * 28
      v += ((target - x) * 60 - v * 11) * dt
      x += v * dt
      draw()
      const settled = Math.abs(target - x) < 0.05 && Math.abs(v) < 0.05
      if (visible && (!settled || pointer || !reduce)) raf = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!raf && visible) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }

    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect()
      target = Math.min(MAX, Math.max(MIN, ((e.clientX - r.left) / r.width) * W))
      pointer = true
      wake()
    }
    const onLeave = () => {
      pointer = false
      target = MID
      wake()
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting
      if (visible) wake()
    })
    io.observe(el)
    wake()
    el.classList.add('is-on')

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <a ref={root} href={href} target="_blank" rel="noopener noreferrer" className="tkm">
      <span className="sr-only">Tangent Kyte</span>
      <span className="tkm-l1" aria-hidden="true">
        <span className="tkm-T">
          <svg viewBox={`0 0 ${W} 100`} overflow="visible">
            <line className="tkm-ext" x1="-70" y1={BAR_Y} x2="330" y2={BAR_Y} />
            <rect className="tkm-bar" x="0" y={BAR_Y} width={W} height="15" rx="2" />
            <rect className="tkm-stem" x={W / 2 - 7.5} y={BAR_Y} width="15" height={100 - BAR_Y} rx="1.5" />
            <g className="tkm-wheel">
              <g className="tkm-spin">
                <circle cx="0" cy={CY} r={R} />
                <line x1="0" y1={CY - R + 3} x2="0" y2={CY + R - 3} />
                <line className="tkm-spoke2" x1={-R + 3} y1={CY} x2={R - 3} y2={CY} />
              </g>
              <line className="tkm-radius" x1="0" y1={CY} x2="0" y2={BAR_Y} />
              <path className="tkm-tick" d={`M 5 ${BAR_Y} V ${BAR_Y - 5} H 0`} />
              <polygon className="tkm-dot" points={`0,${BAR_Y - 6} 4.2,${BAR_Y} 0,${BAR_Y + 6} -4.2,${BAR_Y}`} />
            </g>
          </svg>
        </span>
        angent
      </span>
      <span className="tkm-l2" aria-hidden="true">
        <span className="tkm-serif">Kyte</span>
        <svg className="tkm-fly" viewBox="0 0 120 90" overflow="visible">
          <path className="tkm-string" d="M2 86 C 30 80, 34 52, 58 50 S 88 40, 98 18" pathLength="1" />
          <g transform="translate(98 16) rotate(24)">
            <g className="tkm-kite">
              <g className="tkm-tug">
                <g className="tkm-bob">
                  <path className="tkm-tail" d="M0 9 q-4 5 0 9 q4 5 0 9 q-4 5 0 9" />
                  <polygon points="0,-10 7,-1 0,10 -7,-1" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </span>
    </a>
  )
}
