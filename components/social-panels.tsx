'use client'

import { useEffect, useState } from 'react'
import { site } from '@/lib/site'
import { GitHubIcon, LinkedInIcon, MailIcon } from './icons'

const WEEKS = 20

type Contrib = { total: number; weeks: number[][] } // weeks[week][day] = level 0..4, -1 = no day

export function GitHubPanel({ load }: { load: boolean }) {
  const [data, setData] = useState<Contrib | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!load || data || failed) return
    fetch('/api/github')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setFailed(true))
  }, [load, data, failed])

  const weeks = data?.weeks ?? Array.from({ length: WEEKS }, () => Array(7).fill(0))

  return (
    <a href={site.socials.github.url} target="_blank" rel="noopener noreferrer" className="block w-[296px] p-3.5">
      <div className="flex items-center gap-2 text-[13px]">
        <GitHubIcon size={14} />
        <span className="font-medium">@{site.socials.github.username}</span>
        <span className="ml-auto font-mono text-[11px]" style={{ color: 'var(--muted)' }}>
          {data ? `${data.total.toLocaleString()} this year` : failed ? 'unavailable' : 'loading'}
        </span>
      </div>
      <div className="mt-3 flex gap-[3px]">
        {weeks.map((week, w) => (
          <div key={w} className="flex flex-col gap-[3px]">
            {week.map((level, d) => (
              <span
                key={d}
                className={`block h-[11px] w-[11px] ${data ? '' : 'animate-pulse'}`}
                style={{ background: level < 0 ? 'transparent' : `var(--gh-${level})` }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center justify-between font-mono text-[10px]" style={{ color: 'var(--muted)' }}>
        <span>last {WEEKS} weeks</span>
        <span className="flex items-center gap-[3px]">
          less
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className="block h-[8px] w-[8px]" style={{ background: `var(--gh-${l})` }} />
          ))}
          more
        </span>
      </div>
    </a>
  )
}

export function LinkedInPanel() {
  const li = site.socials.linkedin
  const initials = site.name
    .split(' ')
    .map((w) => w[0])
    .join('')
  return (
    <a href={li.url} target="_blank" rel="noopener noreferrer" className="block w-[268px] p-3.5">
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center text-[14px] font-medium"
          style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-medium">{site.name}</div>
          <div className="truncate font-mono text-[11px]" style={{ color: 'var(--muted)' }}>
            in/{li.username}
          </div>
        </div>
        <LinkedInIcon size={14} />
      </div>
      <p className="mt-2.5 text-[13px] leading-snug">{li.headline}</p>
      <div className="mt-3 font-mono text-[11px]" style={{ color: 'var(--muted)' }}>
        {site.location.label}
      </div>
    </a>
  )
}

export function EmailPanel({ copied }: { copied: boolean }) {
  return (
    <div className="w-[236px] p-3.5">
      <div className="flex items-center gap-2 text-[13px] font-medium">
        <MailIcon size={13} />
        {site.email}
      </div>
      <div className="mt-1.5 font-mono text-[11px]" style={{ color: copied ? 'var(--accent)' : 'var(--muted)' }}>
        {copied ? 'copied to clipboard' : 'click to copy'}
      </div>
      <a
        href={`mailto:${site.email}`}
        className="mt-3 inline-flex px-2 py-1 text-[12px]"
        style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
      >
        Open mail app
      </a>
    </div>
  )
}
