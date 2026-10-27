import { site } from '@/lib/site'
import { ArrowIcon } from './icons'

export function ProjectsTimeline() {
  const years = [...new Set(site.projects.map((p) => p.year))]

  return (
    <div className="flex flex-col pt-5">
      {years.map((year) => (
        <div key={year} className="grid grid-cols-[48px_1fr] gap-3 sm:grid-cols-[56px_1fr] sm:gap-4">
          <div className="pt-[3px] font-mono text-[12px]" style={{ color: 'var(--muted)' }}>
            {year}
          </div>
          <div className="relative border-l pb-6 pl-5" style={{ borderColor: 'var(--line)' }}>
            {site.projects
              .filter((p) => p.year === year)
              .map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative mb-4 block last:mb-0"
                >
                  <span
                    className="absolute -left-[25px] top-[7px] h-[9px] w-[9px] rounded-full border-2 transition-colors group-hover:bg-[var(--accent)]"
                    style={{ borderColor: 'var(--accent)', background: 'var(--bg)' }}
                  />
                  <span className="flex items-center gap-1.5 text-[15px] group-hover:text-[var(--accent)]">
                    {p.name} <ArrowIcon />
                  </span>
                  <span className="mt-0.5 block text-[14px] leading-snug" style={{ color: 'var(--muted)' }}>
                    {p.description}
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1.5 font-mono text-[10px]">
                    {p.tags.map((t) => (
                      <span key={t} className="border px-1.5 py-px" style={{ borderColor: 'var(--line)' }}>
                        {t}
                      </span>
                    ))}
                  </span>
                </a>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
