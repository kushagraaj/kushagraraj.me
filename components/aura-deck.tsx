'use client'

import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { UI_CARDS } from './ui-cards'

// a small swipeable deck of gradient cards, each holding a tiny working ui piece.
// same feel as the tangent kyte site: spring snap, depth around the centre card, sliding pill on the dots.

const CARD_W = 120
const GAP = 12
const STEP = CARD_W + GAP
const SPRING = { type: 'spring', stiffness: 260, damping: 32 } as const
const START = 3 // open on the 4th card so there's something to swipe to on both sides

function Card({ k, x, active }: { k: number; x: MotionValue<number>; active: boolean }) {
  const { bg, El } = UI_CARDS[k]
  const range = [-(k + 1) * STEP, -k * STEP, -(k - 1) * STEP]
  const scale = useTransform(x, range, [0.84, 1, 0.84])
  const rotateY = useTransform(x, range, [16, 0, -16])
  const opacity = useTransform(x, range, [0.45, 1, 0.45])

  return (
    <motion.div
      className="ui-card"
      style={{ scale, rotateY, opacity, background: bg }}
      inert={!active}
    >
      <span className="ui-n">{String(k + 1).padStart(2, '0')}</span>
      <div className="ui-body">
        <El />
      </div>
    </motion.div>
  )
}

export default function AuraDeck() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(START)
  const x = useMotionValue(-START * STEP)
  const dragEndedAt = useRef(0)

  useEffect(() => () => x.stop(), [x])

  const go = (n: number) => {
    const k = Math.max(0, Math.min(UI_CARDS.length - 1, n))
    setI(k)
    if (reduce) x.set(-k * STEP)
    else animate(x, -k * STEP, SPRING)
  }

  return (
    <div
      className="aura"
      role="region"
      aria-roledescription="carousel"
      aria-label="ui pieces"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'ArrowRight') go(i + 1)
        if (e.key === 'ArrowLeft') go(i - 1)
      }}
    >
      <div className="aura-view">
        <motion.div
          className="aura-track"
          style={{ x, gap: GAP }}
          drag="x"
          dragConstraints={{ left: -(UI_CARDS.length - 1) * STEP, right: 0 }}
          dragElastic={0.14}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            dragEndedAt.current = performance.now()
            go(Math.round(-(x.get() + info.velocity.x * 0.18) / STEP))
          }}
        >
          {UI_CARDS.map((c, k) => (
            <div
              key={c.name}
              className="aura-slot"
              style={{ width: CARD_W }}
              onClick={() => {
                // a drag ends with a click; only a plain tap on a side card should move to it
                if (k !== i && performance.now() - dragEndedAt.current > 120) go(k)
              }}
            >
              <Card k={k} x={x} active={k === i} />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="aura-dots" role="tablist" aria-label="choose a card">
        {UI_CARDS.map((c, k) => (
          <button key={c.name} type="button" role="tab" aria-selected={k === i} aria-label={c.name} onClick={() => go(k)}>
            {k === i && (
              <motion.span
                layoutId="aura-pill"
                className="aura-pill"
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 34 }}
              />
            )}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{`${UI_CARDS[i].name}, card ${i + 1} of ${UI_CARDS.length}`}</p>
    </div>
  )
}
