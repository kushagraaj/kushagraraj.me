import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Inter } from 'next/font/google'
import { Footer } from '@/components/footer'
import { site } from '@/lib/site'
import { themeBootScript } from '@/lib/themes'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#efefed' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { title: site.title, description: site.description, url: site.url, type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="flex flex-col">
        <main className="relative z-10 mx-auto flex w-full max-w-[680px] flex-1 flex-col px-5 pt-16 sm:pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
