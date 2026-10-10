import { useState } from 'react'
import { adsEnabled, getConsent, setConsent, type ConsentValue } from '@/lib/ads'

export function ConsentBanner() {
  const [visible, setVisible] = useState(
    () => adsEnabled && getConsent() === null,
  )

  if (!visible) return null

  const decide = (value: ConsentValue) => {
    setConsent(value)
    setVisible(false)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-xs leading-relaxed text-muted-foreground">
          Usamos cookies para mostrar anuncios. Puedes aceptarlas o seguir
          navegando solo con lo esencial.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide('denied')}
            className="h-9 rounded-md border border-border px-3 font-display text-[10px] tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            SOLO ESENCIAL
          </button>
          <button
            type="button"
            onClick={() => decide('granted')}
            className="h-9 rounded-md bg-[color:var(--correct)] px-4 font-display text-[10px] font-700 tracking-wider text-[color:var(--primary-foreground)] transition-transform active:scale-[0.98]"
          >
            ACEPTAR
          </button>
        </div>
      </div>
    </div>
  )
}