'use client'

import { useEffect, useState } from 'react'

// ten tiny working ui pieces, one per card in the deck under the music player

const AURA = {
  dusk: 'radial-gradient(80% 70% at 60% 65%, #f2c9b4 0%, #b06a7c 45%, #2c1b2b 100%)',
  mauve: 'radial-gradient(75% 75% at 40% 40%, #e9c9c0 0%, #9a6f86 45%, #2a1d2c 100%)',
  tide: 'radial-gradient(80% 70% at 55% 60%, #c9efe2 0%, #5f9e9a 45%, #10232a 100%)',
  ember: 'radial-gradient(80% 70% at 50% 70%, #ffd0a8 0%, #d2703f 42%, #2a140c 100%)',
  midnight: 'radial-gradient(80% 70% at 60% 40%, #c7cdfb 0%, #4c55b8 45%, #0e1028 100%)',
}

function Toggle() {
  const [on, setOn] = useState(true)
  return (
    <button type="button" role="switch" aria-checked={on} aria-label="toggle" className="ui-toggle" data-on={on} onClick={() => setOn(!on)}>
      <span />
    </button>
  )
}

function Slider() {
  const [v, setV] = useState(64)
  return (
    <div className="ui-slider">
      <span className="ui-val">{v}</span>
      <input type="range" onPointerDownCapture={(e) => e.stopPropagation()} min={0} max={100} value={v} aria-label="value" onChange={(e) => setV(+e.target.value)} style={{ '--p': `${v}%` } as React.CSSProperties} />
    </div>
  )
}

function Like() {
  const [on, setOn] = useState(false)
  return (
    <button type="button" aria-pressed={on} aria-label="like" className="ui-like" data-on={on} onClick={() => setOn(!on)}>
      <svg viewBox="0 0 24 24" width="26" height="26">
        <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z" />
      </svg>
      <span className="ui-count">{on ? 129 : 128}</span>
    </button>
  )
}

function Segmented() {
  const opts = ['d', 'w', 'm']
  const [i, setI] = useState(1)
  return (
    <div className="ui-seg" role="tablist" aria-label="range">
      <span className="ui-seg-pill" style={{ transform: `translateX(${i * 100}%)` }} />
      {opts.map((o, k) => (
        <button key={o} type="button" role="tab" aria-selected={k === i} onClick={() => setI(k)}>
          {o}
        </button>
      ))}
    </div>
  )
}

function Ring() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setP(72), 300)
    return () => clearTimeout(t)
  }, [])
  const c = 2 * Math.PI * 22
  return (
    <button type="button" aria-label="replay progress" className="ui-ring" onClick={() => { setP(0); setTimeout(() => setP(Math.round(40 + Math.random() * 55)), 350) }}>
      <svg viewBox="0 0 56 56" width="62" height="62">
        <circle cx="28" cy="28" r="22" className="ui-ring-bg" />
        <circle cx="28" cy="28" r="22" className="ui-ring-fg" strokeDasharray={c} strokeDashoffset={c * (1 - p / 100)} />
      </svg>
      <span>{p}%</span>
    </button>
  )
}

function Island() {
  const [open, setOpen] = useState(false)
  return (
    <button type="button" aria-expanded={open} aria-label="dynamic island" className="ui-island" data-open={open} onClick={() => setOpen(!open)}>
      <span className="ui-island-dot" />
      <span className="ui-island-bars">
        <i />
        <i />
        <i />
      </span>
    </button>
  )
}

function Checklist() {
  const [done, setDone] = useState([true, false, false])
  return (
    <div className="ui-check">
      {done.map((d, k) => (
        <button key={k} type="button" role="checkbox" aria-checked={d} aria-label={`task ${k + 1}`} data-on={d} onClick={() => setDone(done.map((x, j) => (j === k ? !x : x)))}>
          <span className="ui-box">
            <svg viewBox="0 0 12 12" width="9" height="9">
              <path d="M2 6.5 5 9l5-6" />
            </svg>
          </span>
          <span className="ui-bar" style={{ width: `${[70, 52, 62][k]}%` }} />
        </button>
      ))}
    </div>
  )
}

function Stepper() {
  const [n, setN] = useState(3)
  return (
    <div className="ui-step">
      <button type="button" aria-label="decrease" onClick={() => setN(Math.max(0, n - 1))}>
        −
      </button>
      <span key={n} className="ui-step-n">
        {n}
      </span>
      <button type="button" aria-label="increase" onClick={() => setN(Math.min(9, n + 1))}>
        +
      </button>
    </div>
  )
}

function Stars() {
  const [r, setR] = useState(4)
  const [h, setH] = useState(0)
  return (
    <div className="ui-stars" onPointerLeave={() => setH(0)}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" aria-label={`${s} stars`} data-on={s <= (h || r)} onPointerEnter={() => setH(s)} onClick={() => setR(s)}>
          <svg viewBox="0 0 24 24" width="15" height="15">
            <path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9Z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

function Send() {
  const [s, setS] = useState<'idle' | 'busy' | 'done'>('idle')
  const go = () => {
    if (s !== 'idle') return setS('idle')
    setS('busy')
    setTimeout(() => setS('done'), 1100)
  }
  return (
    <button type="button" className="ui-send" data-s={s} onClick={go} aria-label="send">
      {s === 'idle' && (
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M4 12h14M13 6l6 6-6 6" />
        </svg>
      )}
      {s === 'busy' && <span className="ui-spin" />}
      {s === 'done' && (
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="m5 12.5 4.5 4.5L19 7" />
        </svg>
      )}
    </button>
  )
}

export const UI_CARDS: { name: string; bg: string; El: () => React.ReactNode }[] = [
  { name: 'toggle', bg: AURA.mauve, El: Toggle },
  { name: 'slider', bg: AURA.dusk, El: Slider },
  { name: 'like', bg: AURA.ember, El: Like },
  { name: 'segmented control', bg: AURA.tide, El: Segmented },
  { name: 'progress ring', bg: AURA.midnight, El: Ring },
  { name: 'dynamic island', bg: AURA.mauve, El: Island },
  { name: 'checklist', bg: AURA.tide, El: Checklist },
  { name: 'stepper', bg: AURA.dusk, El: Stepper },
  { name: 'rating', bg: AURA.ember, El: Stars },
  { name: 'send button', bg: AURA.midnight, El: Send },
]
