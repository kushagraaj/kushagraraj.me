'use client'

import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { site } from '@/lib/site'
import { ArrowIcon, GitHubIcon, LinkedInIcon, MailIcon } from './icons'
import { Pronounce } from './pronounce'
import { EmailPanel, GitHubPanel, LinkedInPanel } from './social-panels'
import { ThemeRuler } from './theme-ruler'

type Social = 'github' | 'linkedin' | 'email'

const SOCIALS: { key: Social; label: string; href: string; external: boolean; icon: React.ReactNode }[] = [
  { key: 'github', label: 'GitHub', href: site.socials.github.url, external: true, icon: <GitHubIcon size={17} /> },
  { key: 'linkedin', label: 'LinkedIn', href: site.socials.linkedin.url, external: true, icon: <LinkedInIcon size={16} /> },
  { key: 'email', label: `Email ${site.email}`, href: `mailto:${site.email}`, external: false, icon: <MailIcon size={17} /> },
]

const EASE = 'cubic-bezier(.23,1,.32,1)'

type Box = { left: number; top: number; width: number; height: number }

function IntroText({ text }: { text: string }) {
  return text.split(/(\{work\})/).map((part, i) =>
    part === '{work}' ? (
      <a key={i} href={site.work.url} target="_blank" rel="noopener noreferrer" className="chip">
        {site.work.name}
        <ArrowIcon />
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

export function Intro() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<Partial<Record<Social, HTMLDivElement | null>>>({})
  const closeTimer = useRef<number>(undefined)
  const resetTimer = useRef<number>(undefined)

  const [active, setActive] = useState<Social | null>(null)
  const [open, setOpen] = useState(false)
  const [box, setBox] = useState<Box>({ left: 0, top: 0, width: 0, height: 0 })
  const [morph, setMorph] = useState(false)
  const [loadGithub, setLoadGithub] = useState(false)
  const [copied, setCopied] = useState(false)

  const show = useCallback(
    (key: Social, trigger: HTMLElement) => {
      window.clearTimeout(closeTimer.current)
      window.clearTimeout(resetTimer.current)
      const wrap = wrapRef.current
      const panel = panelRefs.current[key]
      if (!wrap || !panel) return
      if (key === 'github') setLoadGithub(true)

      const w = wrap.getBoundingClientRect()
      const t = trigger.getBoundingClientRect()
      const width = panel.offsetWidth
      const center = t.left - w.left + t.width / 2

      // slide between cards if one is already open, otherwise just appear
      setMorph(active !== null)
      setBox({
        left: Math.max(-8, Math.min(center - width / 2, w.width - width + 8)),
        top: t.bottom - w.top + 8,
        width,
        height: panel.offsetHeight,
      })
      setActive(key)
      setOpen(true)
    },
    [active],
  )

  const close = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      setOpen(false)
      setCopied(false)
      resetTimer.current = window.setTimeout(() => setActive(null), 220)
    }, 90)
  }, [])

  const keepOpen = useCallback(() => window.clearTimeout(closeTimer.current), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(closeTimer.current)
      window.clearTimeout(resetTimer.current)
    }
  }, [close])

  function copyEmail(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!navigator.clipboard) return
    e.preventDefault()
    const target = e.currentTarget
    navigator.clipboard
      .writeText(site.email)
      .then(() => {
        setCopied(true)
        show('email', target)
      })
      .catch(() => {
        window.location.href = `mailto:${site.email}`
      })
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h1 className="text-[20px] font-medium leading-none tracking-[-0.02em] sm:text-[24px]">{site.name}</h1>
          <Pronounce />
        </div>
        <ThemeRuler />
      </div>

      <div className="mt-5 flex flex-col gap-3 text-[15px] leading-[1.7]">
        {site.intro.map((p, i) => (
          <p key={i}>
            <IntroText text={p} />
          </p>
        ))}
      </div>

      <div className="-ml-2 mt-3 flex items-center gap-1">
        {SOCIALS.map((s) => (
          <a
            key={s.key}
            href={s.href}
            target={s.external ? '_blank' : undefined}
            rel="noopener noreferrer"
            aria-label={s.label}
            className="social-icon"
            data-active={open && active === s.key}
            onClick={s.key === 'email' ? copyEmail : undefined}
            onPointerEnter={(e) => e.pointerType !== 'touch' && show(s.key, e.currentTarget)}
            onPointerLeave={close}
            onFocus={(e) => show(s.key, e.currentTarget)}
            onBlur={close}
          >
            {s.icon}
          </a>
        ))}
      </div>

      <div
        role="dialog"
        aria-hidden={!open}
        onPointerEnter={keepOpen}
        onPointerLeave={close}
        className="absolute z-30 origin-top overflow-hidden border shadow-[0_18px_40px_-12px_rgba(0,0,0,0.25)]"
        style={{
          ...box,
          background: 'var(--panel)',
          borderColor: 'var(--panel-border)',
          opacity: open ? 1 : 0,
          filter: open ? 'blur(0px)' : 'blur(4px)',
          transform: open ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.97)',
          pointerEvents: open ? 'auto' : 'none',
          transition: morph
            ? `left 240ms ${EASE}, top 240ms ${EASE}, width 240ms ${EASE}, height 240ms ${EASE}, opacity 180ms ease, transform 200ms ${EASE}, filter 200ms ease`
            : `opacity 180ms ease, transform 200ms ${EASE}, filter 200ms ease`,
        }}
      >
        {SOCIALS.map(({ key }) => (
          <div
            key={key}
            ref={(el) => {
              panelRefs.current[key] = el
            }}
            className="absolute left-0 top-0 transition-[opacity,filter] duration-200"
            style={{
              opacity: active === key ? 1 : 0,
              filter: active === key ? 'blur(0px)' : 'blur(4px)',
              pointerEvents: active === key ? 'auto' : 'none',
            }}
          >
            {key === 'github' && <GitHubPanel load={loadGithub} />}
            {key === 'linkedin' && <LinkedInPanel />}
            {key === 'email' && <EmailPanel copied={copied} />}
          </div>
        ))}
      </div>
    </div>
  )
}
