import { site } from '@/lib/site'
import { MAP_CREDIT, MapTiles } from './map/map-tiles'

const TILES = 260 // rendered size; smaller cards crop the centre

export function LocationMap() {
  const { lat, lon } = site.location
  return (
    <a
      href={site.location.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Map of ${site.location.label}`}
      className="group relative block h-[180px] w-[180px] shrink-0 overflow-hidden rounded-xl border sm:h-[260px] sm:w-[260px] sm:rounded-2xl"
      style={{ borderColor: 'var(--line)' }}
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: TILES, height: TILES }}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
          <MapTiles lat={lat} lon={lon} zoom={12} size={TILES} style="light" className="map-light" />
          <MapTiles lat={lat} lon={lon} zoom={12} size={TILES} style="dark" className="map-dark" />
        </div>
      </div>

      <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <span className="map-pulse absolute -inset-[10px] rounded-full" style={{ background: 'var(--accent)' }} />
        <span
          className="relative block h-[16px] w-[16px] rounded-full border-[3px] border-white shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:h-[18px] sm:w-[18px]"
          style={{ background: 'var(--accent)' }}
        />
      </span>

      <span
        className="absolute bottom-2 right-2 z-10 hidden rounded-md border px-1.5 py-1 text-[12px] sm:block"
        style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)', color: 'var(--text)' }}
      >
        {site.location.short}
      </span>
      <span
        className="absolute bottom-1 left-1.5 z-10 hidden font-mono text-[8px] opacity-60 sm:block"
        style={{ color: 'var(--muted)' }}
      >
        {MAP_CREDIT}
      </span>
      <span className="absolute left-1.5 top-1 z-10 font-mono text-[7px] opacity-60 sm:hidden" style={{ color: 'var(--muted)' }}>
        © Esri
      </span>
    </a>
  )
}
