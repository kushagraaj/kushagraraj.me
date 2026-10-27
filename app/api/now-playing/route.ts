// latest scrobble from last.fm, linked to spotify (exact track if spotify keys are set, else a search)
export const dynamic = 'force-dynamic'

type LfmImage = { size: string; '#text': string }

let spotifyToken: { value: string; expires: number } | null = null

async function getSpotifyToken() {
  const id = process.env.SPOTIFY_CLIENT_ID
  const secret = process.env.SPOTIFY_CLIENT_SECRET
  if (!id || !secret) return null
  if (spotifyToken && spotifyToken.expires > Date.now()) return spotifyToken.value
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })
  if (!res.ok) return null
  const d = await res.json()
  spotifyToken = { value: d.access_token, expires: Date.now() + (d.expires_in - 60) * 1000 }
  return spotifyToken.value
}

async function spotifyLink(title: string, artist: string) {
  const search = `https://open.spotify.com/search/${encodeURIComponent(`${title} ${artist}`)}`
  try {
    const token = await getSpotifyToken()
    if (!token) return search
    const q = new URLSearchParams({ q: `track:${title} artist:${artist}`, type: 'track', limit: '1' })
    const res = await fetch(`https://api.spotify.com/v1/search?${q}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return search
    const d = await res.json()
    return (d.tracks?.items?.[0]?.external_urls?.spotify as string | undefined) ?? search
  } catch {
    return search
  }
}

export async function GET() {
  const user = process.env.LASTFM_USERNAME
  const key = process.env.LASTFM_API_KEY
  if (!user || !key) return Response.json({ configured: false })

  try {
    const params = new URLSearchParams({
      method: 'user.getrecenttracks',
      user,
      api_key: key,
      format: 'json',
      limit: '1',
    })
    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Last.fm ${res.status}`)
    const data = await res.json()
    const track = data.recenttracks?.track?.[0]
    if (!track) return Response.json({ configured: true, track: null })

    const images: LfmImage[] = track.image ?? []
    const art =
      images.find((i) => i.size === 'extralarge')?.['#text'] ||
      images.find((i) => i.size === 'large')?.['#text'] ||
      ''

    const isPlaying = track['@attr']?.nowplaying === 'true'
    const playedAt = track.date?.uts ? Number(track.date.uts) * 1000 : null
    const title = track.name as string
    const artist = (track.artist?.['#text'] ?? '') as string

    return Response.json(
      {
        configured: true,
        track: {
          isPlaying,
          title,
          artist,
          album: (track.album?.['#text'] ?? '') as string,
          art,
          url: await spotifyLink(title, artist),
          playedAt,
        },
      },
      {
        headers: {
          'Cache-Control': isPlaying
            ? 'public, s-maxage=30, stale-while-revalidate=30'
            : 'public, s-maxage=120, stale-while-revalidate=60',
        },
      },
    )
  } catch (error) {
    console.error('Last.fm error:', error)
    return Response.json({ configured: true, error: true }, { status: 502 })
  }
}
