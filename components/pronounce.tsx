'use client'

import { useEffect, useRef, useState } from 'react'
import { site } from '@/lib/site'

export function Pronounce() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => () => audioRef.current?.pause(), [])

  function play() {
    if (!audioRef.current) {
      const audio = new Audio(site.pronunciation)
      audio.addEventListener('ended', () => setPlaying(false))
      audio.addEventListener('pause', () => setPlaying(false))
      audioRef.current = audio
    }
    const audio = audioRef.current
    audio.currentTime = 0
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }

  return (
    <button
      type="button"
      onClick={play}
      aria-label={`How to say ${site.name}`}
      className="inline-flex h-6 w-6 cursor-pointer items-center justify-center transition-colors hover:text-[var(--accent)]"
      style={{ color: playing ? 'var(--accent)' : 'var(--muted)' }}
    >
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" className={playing ? 'sound-wave' : ''} />
        <path d="M18.5 5.5a9 9 0 0 1 0 13" className={playing ? 'sound-wave sound-wave-2' : ''} />
      </svg>
    </button>
  )
}
