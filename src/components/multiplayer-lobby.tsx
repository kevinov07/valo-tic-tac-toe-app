import { useState } from 'react'
import { Gamepad2, Link, Loader2, LogIn, Plus, Shield, Globe, Crosshair, Crown, Users, Swords, Trophy, Sword, Zap, Ban } from 'lucide-react'
import { CATEGORY_KINDS, VCT_LEAGUES, kindLabel } from '@/lib/game'
import type { GameConfig, CategoryKind } from '@/lib/game'
import { cn } from '@/lib/utils'

const kindIcons: Record<CategoryKind, typeof Shield> = {
  current_team: Shield,
  past_team: Shield,
  country: Globe,
  role: Crosshair,
  is_captain: Crown,
  teammate: Users,
  agent: Sword,
  title: Trophy,
}

export function MultiplayerLobby({
  onCreate,
  onJoin,
  connected,
  error,
}: {
  onCreate: (config: GameConfig) => void
  onJoin: (code: string) => void
  connected: boolean
  error: string | null
}) {
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [codeInput, setCodeInput] = useState('')
  const [stealEnabled, setStealEnabled] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<CategoryKind[]>([])
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([])

  const toggleCategory = (kind: CategoryKind) => {
    setSelectedCategories((prev) =>
      prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind],
    )
  }

  const toggleLeague = (league: string) => {
    setSelectedLeagues((prev) =>
      prev.includes(league) ? prev.filter((l) => l !== league) : [...prev, league],
    )
  }

  const handleCreate = () => {
    onCreate({
      stealEnabled,
      categories: selectedCategories,
      leagues: selectedLeagues,
    })
  }

  return (
    <div className="flex min-h-full flex-col px-6 pb-8 pt-12">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="grid size-20 grid-cols-3 grid-rows-3 gap-1 rounded-md border-2 border-[color:var(--correct)] p-1.5">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <span
                key={i}
                className="rounded-[2px]"
                style={{
                  background:
                    i === 0 || i === 4 || i === 8
                      ? 'var(--correct)'
                      : 'var(--secondary)',
                }}
              />
            ))}
          </div>
        </div>

        <p className="font-display text-[11px] tracking-[0.4em] text-[color:var(--correct)]">
          MULTIJUGADOR
        </p>
        <h1 className="mt-2 font-display text-3xl font-700 leading-none tracking-tight text-foreground">
          PARTIDA RÁPIDA
        </h1>
      </div>

      {!connected && (
        <div className="mb-4 flex items-center justify-center gap-2 rounded-md border border-border bg-card py-3">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
          <span className="font-display text-xs tracking-wider text-muted-foreground">
            CONECTANDO…
          </span>
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-md border border-[color:var(--wrong)] bg-[color:var(--wrong)]/10 px-3 py-2 text-center font-sans text-sm text-[color:var(--wrong)]">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('create')}
          disabled={!connected}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-md border py-3 font-display text-xs tracking-wider transition-colors',
            mode === 'create'
              ? 'border-[color:var(--correct)] bg-[color:var(--correct)]/10 text-[color:var(--correct)]'
              : 'border-border text-muted-foreground',
          )}
        >
          <Plus className="size-4" strokeWidth={2.5} />
          CREAR SALA
        </button>
        <button
          type="button"
          onClick={() => setMode('join')}
          disabled={!connected}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-md border py-3 font-display text-xs tracking-wider transition-colors',
            mode === 'join'
              ? 'border-[color:var(--correct)] bg-[color:var(--correct)]/10 text-[color:var(--correct)]'
              : 'border-border text-muted-foreground',
          )}
        >
          <LogIn className="size-4" strokeWidth={2.5} />
          UNIRSE
        </button>
      </div>

      {mode === 'create' && (
        <div className="mt-4 flex flex-col gap-4">
          {/* Steal toggle */}
          <div className="rounded-md border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {stealEnabled ? (
                  <Zap className="size-4 text-[color:var(--correct)]" strokeWidth={2.5} />
                ) : (
                  <Ban className="size-4 text-muted-foreground" strokeWidth={2.5} />
                )}
                <span className="font-display text-xs tracking-wider text-foreground">
                  Steal
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStealEnabled(!stealEnabled)}
                className={cn(
                  'relative h-6 w-11 rounded-full transition-colors',
                  stealEnabled ? 'bg-[color:var(--correct)]' : 'bg-border',
                )}
              >
                <span
                  className={cn(
                    'absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-transform',
                    stealEnabled && 'translate-x-5',
                  )}
                />
              </button>
            </div>
            <p className="mt-1.5 font-sans text-[10px] text-muted-foreground">
              {stealEnabled
                ? 'Las celdas se pueden re-responder y robar al rival.'
                : 'Cada celda se responde una sola vez. No se puede robar.'}
            </p>
          </div>

          {/* Category filters */}
          <div className="rounded-md border border-border bg-card p-3">
            <p className="mb-2 font-display text-[10px] tracking-[0.2em] text-muted-foreground">
              CATEGORÍAS
            </p>
            <p className="mb-2 font-sans text-[10px] text-muted-foreground">
              Vacío = todas las categorías disponibles.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_KINDS.map((kind) => {
                const Icon = kindIcons[kind]
                const selected = selectedCategories.includes(kind)
                return (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => toggleCategory(kind)}
                    className={cn(
                      'flex items-center gap-1 rounded-md border px-2 py-1 font-display text-[10px] tracking-wider transition-colors',
                      selected
                        ? 'border-[color:var(--correct)] bg-[color:var(--correct)]/10 text-[color:var(--correct)]'
                        : 'border-border text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <Icon className="size-3" strokeWidth={2.5} />
                    {kindLabel[kind]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* League filters */}
          <div className="rounded-md border border-border bg-card p-3">
            <p className="mb-2 font-display text-[10px] tracking-[0.2em] text-muted-foreground">
              LIGAS
            </p>
            <p className="mb-2 font-sans text-[10px] text-muted-foreground">
              Vacío = todas las ligas. Solo jugadores de las ligas seleccionadas participarán.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {VCT_LEAGUES.map((league) => {
                const selected = selectedLeagues.includes(league.value)
                return (
                  <button
                    key={league.value}
                    type="button"
                    onClick={() => toggleLeague(league.value)}
                    className={cn(
                      'rounded-md border px-3 py-1 font-display text-[10px] tracking-wider transition-colors',
                      selected
                        ? 'border-[color:var(--correct)] bg-[color:var(--correct)]/10 text-[color:var(--correct)]'
                        : 'border-border text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {league.label}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            disabled={!connected}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-md bg-[color:var(--correct)] font-display text-lg font-700 tracking-[0.1em] text-[color:var(--primary-foreground)] transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            <Gamepad2 className="size-5" strokeWidth={2.5} />
            CREAR PARTIDA
          </button>
        </div>
      )}

      {mode === 'join' && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="relative">
            <Link className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              placeholder="CÓDIGO DE SALA"
              maxLength={6}
              className="h-12 w-full rounded-md border border-input bg-background pl-10 pr-3 font-display text-sm tracking-[0.2em] text-foreground placeholder:text-muted-foreground focus:border-[color:var(--correct)] focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => onJoin(codeInput)}
            disabled={!connected || codeInput.length < 6}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-md bg-[color:var(--correct)] font-display text-lg font-700 tracking-[0.1em] text-[color:var(--primary-foreground)] transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            <LogIn className="size-5" strokeWidth={2.5} />
            UNIRSE A SALA
          </button>
        </div>
      )}
    </div>
  )
}