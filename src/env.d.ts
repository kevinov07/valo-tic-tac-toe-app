/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_AD_ENABLED?: string
  readonly VITE_AD_CLIENT?: string
  readonly VITE_AD_SLOT_HOME?: string
  readonly VITE_AD_SLOT_LOBBY?: string
  readonly VITE_AD_SLOT_WAITING?: string
  readonly VITE_AD_SLOT_RESULT?: string
  readonly VITE_SHOW_MEDIA?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}