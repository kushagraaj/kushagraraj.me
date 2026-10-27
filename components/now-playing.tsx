'use client'

import { timeAgo, useMusic } from '@/lib/live-data'

// tonearm: rests on the disc while playing. viewBox units are relative to a 100-wide disc
function Tonearm({ playing }: { playing: boolean }) {
  const PIVOT = { x: 108, y: 4 }
  return (
    <svg
      viewBox="0 0 120 100"
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-10 h-full w-[120%] overflow-visible"
    >
      <g
        style={{
          transformOrigin: `${PIVOT.x}px ${PIVOT.y}px`,
          transform: `rotate(${playing ? 26 : 2}deg)`,
          transition: 'transform 900ms cubic-bezier(.45,0,.2,1)',
        }}
      >
        <rect x={PIVOT.x - 4.5} y={PIVOT.y - 13} width={9} height={8} rx={1.5} fill="var(--muted)" />
        {/* drawn twice for an outline, so it stays visible on dark covers */}
        {[
          { stroke: 'var(--bg)', width: 5.5 },
          { stroke: 'var(--text)', width: 3 },
        ].map((s) => (
          <path
            key={s.width}
            d={`M ${PIVOT.x} ${PIVOT.y} L ${PIVOT.x} ${PIVOT.y + 62} L ${PIVOT.x - 6} ${PIVOT.y + 80}`}
            fill="none"
            stroke={s.stroke}
            strokeWidth={s.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        <rect
          x={PIVOT.x - 11}
          y={PIVOT.y + 77}
          width={10}
          height={13}
          rx={2}
          fill="var(--text)"
          stroke="var(--bg)"
          strokeWidth={1.4}
          transform={`rotate(18 ${PIVOT.x - 6} ${PIVOT.y + 83})`}
        />
        <circle cx={PIVOT.x - 7.5} cy={PIVOT.y + 90} r={1.6} fill="var(--accent)" />
      </g>
      <circle cx={PIVOT.x} cy={PIVOT.y} r={7} fill="var(--panel)" stroke="var(--muted)" strokeWidth={1.5} />
      <circle cx={PIVOT.x} cy={PIVOT.y} r={2.5} fill="var(--muted)" />
    </svg>
  )
}

export function NowPlaying() {
  const music = useMusic()

  if (music.status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
        <div className="h-[56px] w-[56px] shrink-0 animate-pulse rounded-full sm:h-[84px] sm:w-[84px]" style={{ background: 'var(--chip)' }} />
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <div className="h-3 w-24 animate-pulse" style={{ background: 'var(--chip)' }} />
          <div className="h-4 w-40 animate-pulse" style={{ background: 'var(--chip)' }} />
          <div className="h-3 w-28 animate-pulse" style={{ background: 'var(--chip)' }} />
        </div>
      </div>
    )
  }

  if (music.status === 'off') {
    return (
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-5 sm:text-left">
        <div className="h-[56px] w-[56px] shrink-0 rounded-full border border-dashed sm:h-[84px] sm:w-[84px]" style={{ borderColor: 'var(--line)' }} />
        <span className="font-mono text-[12px]" style={{ color: 'var(--muted)' }}>
          {music.reason === 'unconfigured'
            ? 'music: add LASTFM_USERNAME and LASTFM_API_KEY to .env.local'
            : 'nothing on the speakers lately'}
        </span>
      </div>
    )
  }

  const t = music.track
  return (
    <a href={t.url} target="_blank" rel="noopener noreferrer" className="disc group flex max-w-full flex-col items-center gap-2 text-center sm:flex-row sm:gap-5 sm:text-left">
      <div className="relative h-[56px] w-[56px] shrink-0 sm:h-[84px] sm:w-[84px]">
        <div
          className="disc-spin relative h-full w-full overflow-hidden rounded-full shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]"
        >
          {t.art ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.art} alt={`${t.title} by ${t.artist}`} width={84} height={84} className="h-full w-full object-cover" />
          ) : (
            <span className="block h-full w-full" style={{ background: 'var(--chip)' }} />
          )}
          <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.25),transparent_30%,rgba(255,255,255,0.15),transparent_60%)]" />
        </div>
        <span
          className="absolute left-1/2 top-1/2 h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] sm:h-[18px] sm:w-[18px] sm:border-4"
          style={{ background: 'var(--bg)', borderColor: 'rgba(0,0,0,0.25)' }}
        />
        <Tonearm playing={t.isPlaying} />
      </div>
      <div className="min-w-0 max-w-full">
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] sm:justify-start sm:text-[11px]" style={{ color: 'var(--muted)' }}>
          {t.isPlaying && (
            <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
              <span className="eq-bar" style={{ animationDuration: '0.8s' }} />
              <span className="eq-bar" style={{ animationDuration: '1.15s' }} />
              <span className="eq-bar" style={{ animationDuration: '0.65s' }} />
            </span>
          )}
          {t.isPlaying ? 'listening now' : `last played${t.playedAt ? ` ${timeAgo(t.playedAt)}` : ''}`}
        </div>
        <div className="mt-0.5 truncate text-[14px] font-medium sm:mt-1 sm:text-[17px] tracking-[-0.02em] group-hover:text-[var(--accent)]">{t.title}</div>
        <div className="truncate text-[12px] sm:text-[13px]" style={{ color: 'var(--muted)' }}>
          {t.artist}
          {t.album ? ` · ${t.album}` : ''}
        </div>
      </div>
    </a>
  )
}
