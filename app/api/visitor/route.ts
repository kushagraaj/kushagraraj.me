import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { cookies, headers } from 'next/headers'

// returns the previous visitor's city and stores the current one.
// location: vercel geo headers, falling back to an ip lookup.
// storage: upstash redis if configured, otherwise a local file.
export const dynamic = 'force-dynamic'

const KEY = 'portfolio:last-visitor'
const SEEN_COOKIE = 'lv_seen'

// file fallback (not persistent on serverless hosts)
const FILE = path.join(
  process.env.NODE_ENV === 'development' ? path.join(process.cwd(), '.data') : os.tmpdir(),
  'last-visitor.txt',
)

async function readFile() {
  try {
    return (await fs.readFile(FILE, 'utf8')).trim() || null
  } catch {
    return null
  }
}

async function writeFile(value: string) {
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true })
    await fs.writeFile(FILE, value, 'utf8')
  } catch (error) {
    console.error('Could not save last visitor:', error)
  }
}

async function redis(commands: (string | number)[][]) {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Upstash ${res.status}`)
  return (await res.json()) as { result: unknown }[]
}

function isPrivateIp(ip: string) {
  return (
    ip === '::1' ||
    ip.startsWith('127.') ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    ip.startsWith('fc') ||
    ip.startsWith('fd') ||
    ip.startsWith('::ffff:127.')
  )
}

async function lookupIp(ip: string | null): Promise<string | null> {
  // empty ip = look up the server itself (used in dev)
  const res = await fetch(`https://ipwho.is/${ip ?? ''}?fields=success,city,country_code`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(3000),
  })
  const d = await res.json()
  return d.success && d.city && d.country_code ? `${d.city}, ${d.country_code}` : null
}

async function locate(h: Headers): Promise<string | null> {
  const vercelCity = h.get('x-vercel-ip-city')
  const vercelCountry = h.get('x-vercel-ip-country')
  if (vercelCity && vercelCountry) return `${decodeURIComponent(vercelCity)}, ${vercelCountry}`

  const ip = (h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? '').split(',')[0].trim()
  try {
    if (ip && !isPrivateIp(ip)) return await lookupIp(ip)
    if (process.env.NODE_ENV === 'development') return await lookupIp(null)
  } catch (error) {
    console.error('IP lookup failed:', error)
  }
  return null
}

export async function GET() {
  try {
    const h = await headers()
    const jar = await cookies()

    // cookie so a reload doesn't overwrite the previous visitor with yourself
    const firstLoad = !jar.get(SEEN_COOKIE)
    const here = firstLoad ? await locate(h) : null

    let previous: string | null
    const commands: (string | number)[][] = [['GET', KEY]]
    if (here) commands.push(['SET', KEY, here])

    const result = await redis(commands)
    if (result) {
      previous = typeof result[0]?.result === 'string' ? result[0].result : null
    } else {
      previous = await readFile()
      if (here) await writeFile(here)
    }

    const response = Response.json({ location: previous })
    if (firstLoad) {
      response.headers.append('Set-Cookie', `${SEEN_COOKIE}=1; Path=/; Max-Age=1800; SameSite=Lax; HttpOnly`)
    }
    return response
  } catch (error) {
    console.error('Visitor error:', error)
    return Response.json({ location: null }, { status: 502 })
  }
}
