// time-of-day themes. `dark` also switches the map tiles etc. (see globals.css)

export type DayTheme = {
  name: string
  dark: boolean
  vars: Record<string, string>
}

const palette = (bg: string, text: string, muted: string, chip: string, panel: string, accent: string, line: string) => ({
  '--bg': bg,
  '--text': text,
  '--muted': muted,
  '--chip': chip,
  '--chip-text': text,
  '--panel': panel,
  '--accent': accent,
  '--line': line,
  '--panel-border': line,
})

export const DAY_THEMES: DayTheme[] = [
  { name: 'dawn', dark: false, vars: palette('#f4ece1', '#1f1a14', '#7d7062', '#e4d8c7', '#fbf6ef', '#c2410c', 'rgba(70,45,20,0.18)') },
  { name: 'morning', dark: false, vars: palette('#efefed', '#161616', '#6b6b6b', '#d2d2cf', '#fbfbfa', '#1d2bd6', 'rgba(0,0,0,0.18)') },
  { name: 'noon', dark: false, vars: palette('#ffffff', '#0e0e0e', '#6f6f6f', '#e9e9e9', '#fafafa', '#1d2bd6', 'rgba(0,0,0,0.14)') },
  { name: 'dusk', dark: true, vars: palette('#1e1a26', '#ece7f3', '#9b93aa', '#2f2a3a', '#26212f', '#9584ff', 'rgba(255,255,255,0.14)') },
  { name: 'night', dark: true, vars: palette('#0f0f0f', '#e8e8e6', '#8a8a88', '#262626', '#181818', '#4856ff', 'rgba(255,255,255,0.14)') },
]

export const STEPS = DAY_THEMES.length

// start hour of each theme in the visitor's local time; before 5am is night
export const THEME_HOURS = [5, 8, 12, 16, 20]

// a manual pick is stored as "step|timestamp" and overrides the clock for 6h
export const STORAGE_KEY = 'theme-pick'
export const PICK_LASTS_MS = 6 * 60 * 60 * 1000

export function applyDayTheme(step: number) {
  const t = DAY_THEMES[step]
  const root = document.documentElement
  root.dataset.theme = t.dark ? 'dark' : 'light'
  root.dataset.themeStep = String(step)
  for (const [k, v] of Object.entries(t.vars)) root.style.setProperty(k, v)
}

// inlined in <head> so the theme is set before first paint
export const themeBootScript = `try{
var T=${JSON.stringify(DAY_THEMES.map((t) => [t.dark, t.vars]))},H=${JSON.stringify(THEME_HOURS)},s=-1;
var p=(localStorage.getItem('${STORAGE_KEY}')||'').split('|');
if(p.length===2&&Date.now()-Number(p[1])<${PICK_LASTS_MS})s=parseInt(p[0],10);
if(!(s>=0&&s<T.length)){var h=new Date().getHours();s=T.length-1;for(var i=H.length-1;i>=0;i--)if(h>=H[i]){s=i;break}}
var r=document.documentElement;r.dataset.theme=T[s][0]?'dark':'light';r.dataset.themeStep=s;
for(var k in T[s][1])r.style.setProperty(k,T[s][1][k]);
}catch(e){}`

// short click, pitch rises with the step
let ctx: AudioContext | null = null
export function tick(step: number) {
  try {
    ctx ??= new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const f = 620 + step * 230
    o.type = 'sine'
    o.frequency.setValueAtTime(f, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(f * 0.65, ctx.currentTime + 0.04)
    g.gain.setValueAtTime(0.12, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05)
    o.connect(g).connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 0.06)
  } catch {
    // no audio support
  }
}
