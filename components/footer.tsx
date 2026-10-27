'use client'

import { useClock, useLastVisitor } from '@/lib/live-data'
import { site } from '@/lib/site'

export function Footer() {
  const visitor = useLastVisitor()
  const time = useClock(site.location.timeZone)

  return (
    <footer className="relative z-10 mx-auto mt-24 w-full max-w-[680px] px-5 pb-10">
      <div
        className="flex flex-col gap-1.5 border-t pt-4 font-mono text-[11px] sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
      >
        {visitor === undefined ? (
          <span className="inline-block h-3 w-36 animate-pulse" style={{ background: 'var(--chip)' }} />
        ) : visitor ? (
          <span>
            last visit from <span style={{ color: 'var(--text)' }}>{visitor}</span>
          </span>
        ) : (
          <span />
        )}
        <span>
          {site.location.label} · <span style={{ color: 'var(--text)' }}>{time ?? '--:--:--'}</span> {site.location.tz}
        </span>
      </div>
      <div className="mt-1.5 font-mono text-[11px]" style={{ color: 'var(--muted)' }}>
        © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  )
}
