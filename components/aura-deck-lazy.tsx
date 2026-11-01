'use client'

import dynamic from 'next/dynamic'

// loaded after the page is up so framer-motion stays out of the first load.
// the wrapper reserves the deck's height so nothing jumps when it arrives.
const AuraDeck = dynamic(() => import('./aura-deck'), { ssr: false })

export function AuraDeckLazy() {
  return (
    <div className="h-[180px] w-full max-w-[280px] sm:h-[192px]">
      <AuraDeck />
    </div>
  )
}
