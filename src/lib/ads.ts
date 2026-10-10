export const showMedia = import.meta.env.VITE_SHOW_MEDIA !== 'false'

export const adsEnabled = import.meta.env.VITE_AD_ENABLED === 'true'

export const adClient = import.meta.env.VITE_AD_CLIENT ?? ''

const ADSENSE_BASE =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

export function getAdsenseScriptSrc(): string {
  // Con ?client= activas los "auto ads"; las unidades manuales usan el mismo
  // loader añadiendo data-ad-client/data-ad-slot en cada <ins>.
  return adClient ? `${ADSENSE_BASE}?client=${adClient}` : ADSENSE_BASE
}

const SLOT_IDS: Record<string, string | undefined> = {
  home: import.meta.env.VITE_AD_SLOT_HOME,
  lobby: import.meta.env.VITE_AD_SLOT_LOBBY,
  waiting: import.meta.env.VITE_AD_SLOT_WAITING,
  result: import.meta.env.VITE_AD_SLOT_RESULT,
}

export type AdPlacement = keyof typeof SLOT_IDS

export function getAdSlot(placement: AdPlacement): string | undefined {
  return SLOT_IDS[placement]
}

export type ConsentValue = 'granted' | 'denied'

const CONSENT_KEY = 'vtt-ad-consent'

export function getConsent(): ConsentValue | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

export function setConsent(value: ConsentValue) {
  try {
    localStorage.setItem(CONSENT_KEY, value)
  } catch {
    // Sin acceso a localStorage (privacidad estricta): se ignora.
  }

  try {
    const w = window as unknown as { dataLayer?: unknown[] }
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({
      event: 'consent_default',
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
    })
  } catch {
    // dataLayer es opcional.
  }
}