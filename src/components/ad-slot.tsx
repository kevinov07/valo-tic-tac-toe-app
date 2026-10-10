import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
  adClient,
  adsEnabled,
  getAdSlot,
  getAdsenseScriptSrc,
  type AdPlacement,
} from '@/lib/ads'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

export function ensureAdsenseScript() {
  if (document.querySelector(`script[src^="${getAdsenseScriptSrc()}"]`)) return
  const script = document.createElement('script')
  script.async = true
  script.src = getAdsenseScriptSrc()
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
}

export function AdSlot({
  placement,
  className,
}: {
  placement: AdPlacement
  className?: string
}) {
  const slotId = getAdSlot(placement)
  const insRef = useRef<HTMLModElement>(null)
  const active = adsEnabled && Boolean(adClient && slotId)

  useEffect(() => {
    if (!active) return

    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      // AdSense ya inicializó el bloque: se ignora discretamente.
    }

    return () => {
      const el = insRef.current
      if (el && el.getAttribute('data-adsbygoogle-status')) {
        el.setAttribute('data-adsbygoogle-status', 'resetskipped')
      }
    }
  }, [active, slotId])

  if (!active) return null

  return (
    <div
      className={cn(
        'flex w-full items-center justify-center overflow-hidden',
        className,
      )}
    >
      <ins
        ref={insRef}
        className="adsbygoogle block w-full"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}