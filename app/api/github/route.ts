import { site } from '@/lib/site'

// public contribution data, cached for 6h
export const revalidate = 21600

const WEEKS = 20

type Day = { date: string; count: number; level: number }

export async function GET() {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${site.socials.github.username}?y=last`,
      { next: { revalidate } },
    )
    if (!res.ok) throw new Error(`status ${res.status}`)
    const json: { total: Record<string, number>; contributions: Day[] } = await res.json()

    // group into sunday-first weeks
    const days = json.contributions
    const weeks: number[][] = []
    let week: number[] = []
    for (const day of days) {
      if (new Date(day.date).getUTCDay() === 0 && week.length) {
        weeks.push(week)
        week = []
      }
      week.push(day.level)
    }
    if (week.length) weeks.push(week)

    const recent = weeks.slice(-WEEKS).map((w, i, all) =>
      // pad partial weeks; -1 renders as an empty cell
      i === 0 ? [...Array(7 - w.length).fill(-1), ...w] : i === all.length - 1 ? [...w, ...Array(7 - w.length).fill(-1)] : w,
    )

    const total = json.total.lastYear ?? Object.values(json.total).reduce((a, b) => a + b, 0)
    return Response.json({ total, weeks: recent })
  } catch (error) {
    console.error('GitHub contributions error:', error)
    return Response.json({ error: true }, { status: 502 })
  }
}
