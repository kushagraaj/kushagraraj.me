'use client'

import { useEffect, useState } from 'react'

// shared so components that need the same data reuse one request

export type Track = {
  isPlaying: boolean
  title: string
  artist: string
  album: string
  art: string
  url: string
  playedAt: number | null
}

export type Music =
  | { status: 'loading' }
  | { status: 'off'; reason: 'unconfigured' | 'none' | 'error' }
  | { status: 'ok'; track: Track }

let musicPromise: Promise<Music> | null = null
let musicFetchedAt = 0

function loadMusic(): Promise<Music> {
  if (musicPromise && Date.now() - musicFetchedAt < 55_000) return musicPromise
  musicFetchedAt = Date.now()
  musicPromise = fetch('/api/now-playing')
    .then((r) => r.json())
    .then((d): Music => {
      if (d.configured === false) return { status: 'off', reason: 'unconfigured' }
      if (d.error) return { status: 'off', reason: 'error' }
      if (!d.track) return { status: 'off', reason: 'none' }
      return { status: 'ok', track: d.track }
    })
    .catch((): Music => ({ status: 'off', reason: 'error' }))
  return musicPromise
}

export function useMusic() {
  const [music, setMusic] = useState<Music>({ status: 'loading' })
  useEffect(() => {
    let alive = true
    const run = () => loadMusic().then((m) => alive && setMusic(m))
    run()
    const id = window.setInterval(run, 60_000)
    return () => {
      alive = false
      window.clearInterval(id)
    }
  }, [])
  return music
}

let visitorPromise: Promise<string | null> | null = null

export function useLastVisitor() {
  const [visitor, setVisitor] = useState<string | null | undefined>(undefined)
  useEffect(() => {
    visitorPromise ??= fetch('/api/visitor')
      .then((r) => r.json())
      .then((d) => (d.location as string | null) ?? null)
      .catch(() => null)
    let alive = true
    visitorPromise.then((v) => alive && setVisitor(v))
    return () => {
      alive = false
    }
  }, [])
  return visitor
}

export function useClock(timeZone: string) {
  const [now, setNow] = useState<string | null>(null)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone })
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [timeZone])
  return now
}

export function timeAgo(ms: number) {
  const s = Math.max(1, Math.round((Date.now() - ms) / 1000))
  if (s < 60) return `${s}s ago`
  const m = Math.round(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}
