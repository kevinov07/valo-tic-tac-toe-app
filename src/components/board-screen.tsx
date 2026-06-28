import { ChevronLeft, RotateCcw, Zap } from 'lucide-react'
import type { Board } from '@/lib/game'
import { TOTAL_GUESSES, cellIndex } from '@/lib/game'
import { cn } from '@/lib/utils'
import { CategoryChip } from '@/components/category-chip'
import { GridCell } from '@/components/grid-cell'

export function BoardScreen({
  board,
  guessesLeft,
  correctCount,
  activeCell,
  loading,
  onSelectCell,
  onExit,
  onNewBoard,
}: {
  board: Board
  guessesLeft: number
  correctCount: number
  activeCell: number | null
  loading?: boolean
  onSelectCell: (index: number) => void
  onExit: () => void
  onNewBoard: () => void
}) {
  return (
    <div className="flex min-h-full flex-col px-3 pb-4 pt-3 sm:px-6 sm:pb-8 sm:pt-6">
      <header className="mb-2 flex items-center justify-between sm:mb-6">
        <button
          type="button"
          onClick={onExit}
          className="flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Salir al inicio"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="text-center">
          <p className="font-display text-xs tracking-[0.3em] text-muted-foreground sm:text-sm">
            VALO TIC TAC TOE
          </p>
          <p className="font-display text-base font-700 tracking-widest text-foreground sm:text-lg">
            {correctCount}/9 ASEGURADAS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewBoard}
            disabled={loading}
            className="flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground active:scale-[0.95] disabled:opacity-60"
            aria-label="Nuevo tablero"
          >
            <RotateCcw className={cn('size-4', loading && 'animate-spin-reverse')} strokeWidth={2} />
          </button>
          <GuessMeter left={guessesLeft} />
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl">
        <div className="grid grid-cols-[1.1fr_repeat(3,1fr)] grid-rows-[auto_repeat(3,1fr)] gap-1 sm:gap-3">
          <div className="flex items-center justify-center rounded-md border border-dashed border-border bg-card/40">
            <Zap
              className="size-6 text-[color:var(--correct)] sm:size-7"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </div>

          {board.cols.map((col, c) => (
            <div
              key={`col-${c}`}
              className="overflow-hidden rounded-md border border-border"
            >
              <CategoryChip
                category={col}
                active={activeCell !== null && activeCell % 3 === c}
              />
            </div>
          ))}

          {board.rows.map((row, r) => (
            <RowGroup key={`row-${r}`}>
              <div className="overflow-hidden rounded-md border border-border">
                <CategoryChip
                  category={row}
                  active={
                    activeCell !== null && Math.floor(activeCell / 3) === r
                  }
                />
              </div>
              {board.cols.map((_, c) => {
                const idx = cellIndex(r, c)
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-md border border-border"
                  >
                    <GridCell
                      cell={board.cells[idx]}
                      active={activeCell === idx}
                      disabled={guessesLeft <= 0 || !!loading}
                      onClick={() => onSelectCell(idx)}
                    />
                  </div>
                )
              })}
            </RowGroup>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center font-sans text-sm text-muted-foreground sm:text-base">
        Toca una celda vacía para buscar al jugador que cruza ambas categorías.
      </p>
    </div>
  )
}

function RowGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function GuessMeter({ left }: { left: number }) {
  const low = left <= 3
  return (
    <div className="flex flex-col items-end">
      <span className="font-display text-[10px] tracking-[0.2em] text-muted-foreground sm:text-xs">
        INTENTOS
      </span>
      <div className="flex items-center gap-1">
        <span
          className="font-display text-xl font-700 leading-none sm:text-2xl"
          style={{ color: low ? 'var(--wrong)' : 'var(--correct)' }}
        >
          {left}
        </span>
        <span className="font-display text-sm text-muted-foreground sm:text-base">
          /{TOTAL_GUESSES}
        </span>
      </div>
    </div>
  )
}
