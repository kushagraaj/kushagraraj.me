// square map centred on lat/lon, built from esri tiles

export type TileStyle = 'street' | 'light' | 'dark' | 'light_nolabels' | 'dark_nolabels' | 'satellite'

const TILE = 256

const LAYERS: Record<TileStyle, string[]> = {
  street: ['World_Street_Map'],
  light: ['Canvas/World_Light_Gray_Base', 'Canvas/World_Light_Gray_Reference'],
  dark: ['Canvas/World_Dark_Gray_Base', 'Canvas/World_Dark_Gray_Reference'],
  light_nolabels: ['Canvas/World_Light_Gray_Base'],
  dark_nolabels: ['Canvas/World_Dark_Gray_Base'],
  satellite: ['World_Imagery'],
}

function tileUrl(layer: string, z: number, x: number, y: number) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/${layer}/MapServer/tile/${z}/${y}/${x}`
}

// web mercator pixel position at a zoom level
export function project(lat: number, lon: number, zoom: number) {
  const n = 2 ** zoom
  const latRad = (lat * Math.PI) / 180
  return {
    x: ((lon + 180) / 360) * n * TILE,
    y: ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n * TILE,
  }
}

export function MapTiles({
  lat,
  lon,
  zoom,
  size,
  style,
  className = '',
}: {
  lat: number
  lon: number
  zoom: number
  size: number
  style: TileStyle
  className?: string
}) {
  const n = 2 ** zoom
  const { x: px, y: py } = project(lat, lon, zoom)

  const left = px - size / 2
  const top = py - size / 2
  const x0 = Math.floor(left / TILE)
  const y0 = Math.floor(top / TILE)
  const x1 = Math.floor((left + size) / TILE)
  const y1 = Math.floor((top + size) / TILE)

  const tiles = []
  for (const layer of LAYERS[style]) {
  for (let x = x0; x <= x1; x++) {
    for (let y = y0; y <= y1; y++) {
      tiles.push(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${layer}-${x}-${y}`}
          src={tileUrl(layer, zoom, ((x % n) + n) % n, y)}
          alt=""
          width={TILE}
          height={TILE}
          draggable={false}
          className="absolute max-w-none select-none"
          style={{ left: Math.round(x * TILE - left), top: Math.round(y * TILE - top), width: TILE, height: TILE }}
        />,
      )
    }
  }
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {tiles}
    </div>
  )
}

export const MAP_CREDIT = '© Esri, HERE, Garmin, OSM'
export const SATELLITE_CREDIT = '© Esri, Maxar, Earthstar'
