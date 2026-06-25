import { useEffect, useRef, useState } from 'react'
import { Search, X, SearchX } from 'lucide-react'
import type { Category, PlayerSummary } from '@/lib/game'
import { CategoryChip } from '@/components/category-chip'
import { searchPlayers } from '@/lib/api'

export function PlayerSearch({
  row,
  col,
  onGuess,
  onClose,
}: {
  row: Category
  col: Category
  onGuess: (player: PlayerSummary) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PlayerSummary[]>([])
  const [searching, setSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const players = await searchPlayers(q, controller.signal)
        setResults(players.slice(0, 6))
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 250)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Cerrar buscador"
        onClick={onClose}
        className="flex-1 bg-background/70 backdrop-blur-[1px]"
      />

      <div className="animate-sheet-up rounded-t-xl border-t border-border bg-card shadow-2xl">
        <div className="mx-auto max-w-md px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-display text-[10px] tracking-[0.2em] text-muted-foreground">
                INTERSECCIÓN
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Cerrar"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            <div className="overflow-hidden rounded-md border border-border">
              <CategoryChip category={row} />
            </div>
            <div className="overflow-hidden rounded-md border border-border">
              <CategoryChip category={col} />
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca un pro de Valorant…"
              autoComplete="off"
              spellCheck={false}
              className="h-12 w-full rounded-md border border-input bg-background pl-10 pr-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:border-[color:var(--correct)] focus:outline-none"
            />
          </div>

          <ul className="mt-2 max-h-64 overflow-y-auto overscroll-contain">
            {results.map((p) => (
              <li key={p.alias}>
                <button
                  type="button"
                  onClick={() => onGuess(p)}
                  className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-3 text-left transition-colors hover:bg-secondary active:bg-secondary"
                >
                  <span className="font-sans text-base font-600 text-foreground">
                    {p.alias}
                  </span>
                  <span className="flex items-center gap-2 font-display text-[10px] tracking-wider">
                    {p.country_code && (
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-muted-foreground">
                        {p.country_code.toUpperCase()}
                      </span>
                    )}
                    {p.role && (
                      <span className="text-[color:var(--type-role)]">
                        {p.role.toUpperCase()}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}

            {query.trim() && !searching && results.length === 0 && (
              <li className="flex flex-col items-center gap-2 py-6 text-center">
                <SearchX className="size-6 text-muted-foreground" />
                <p className="font-sans text-sm text-muted-foreground">
                  Ningún jugador coincide con{' '}
                  <span className="font-600 text-foreground">
                    &ldquo;{query}&rdquo;
                  </span>
                </p>
                <p className="font-display text-[10px] tracking-widest text-muted-foreground/70">
                  PRUEBA OTRO NOMBRE
                </p>
              </li>
            )}

            {searching && (
              <li className="py-6 text-center font-sans text-sm text-muted-foreground">
                Buscando…
              </li>
            )}

            {!query.trim() && (
              <li className="py-6 text-center font-sans text-sm text-muted-foreground">
                Escribe para ver sugerencias. Tienes{' '}
                <span className="text-foreground">un intento</span> por celda.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
