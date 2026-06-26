import { useState } from 'react'
import { Gamepad2, Link, Loader2, LogIn, Plus } from 'lucide-react'

export function MultiplayerLobby({
  onCreate,
  onJoin,
  connected,
  error,
}: {
  onCreate: () => void
  onJoin: (code: string) => void
  connected: boolean
  error: string | null
}) {
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [codeInput, setCodeInput] = useState('')

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
        <p className="mt-4 max-w-xs text-pretty font-sans text-sm leading-relaxed text-muted-foreground">
          Enfréntate a otro jugador. Cada turno alterna — fallar no bloquea la
          celda, el rival puede robarla.
        </p>
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
          className={`flex flex-1 items-center justify-center gap-2 rounded-md border py-3 font-display text-xs tracking-wider transition-colors ${
            mode === 'create'
              ? 'border-[color:var(--correct)] bg-[color:var(--correct)]/10 text-[color:var(--correct)]'
              : 'border-border text-muted-foreground'
          }`}
        >
          <Plus className="size-4" strokeWidth={2.5} />
          CREAR SALA
        </button>
        <button
          type="button"
          onClick={() => setMode('join')}
          disabled={!connected}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md border py-3 font-display text-xs tracking-wider transition-colors ${
            mode === 'join'
              ? 'border-[color:var(--correct)] bg-[color:var(--correct)]/10 text-[color:var(--correct)]'
              : 'border-border text-muted-foreground'
          }`}
        >
          <LogIn className="size-4" strokeWidth={2.5} />
          UNIRSE
        </button>
      </div>

      {mode === 'create' && (
        <button
          type="button"
          onClick={onCreate}
          disabled={!connected}
          className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-md bg-[color:var(--correct)] font-display text-lg font-700 tracking-[0.1em] text-[color:var(--primary-foreground)] transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          <Gamepad2 className="size-5" strokeWidth={2.5} />
          CREAR PARTIDA
        </button>
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
