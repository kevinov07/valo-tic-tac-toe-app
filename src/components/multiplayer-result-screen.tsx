import { RotateCcw, Home, X, Check } from 'lucide-react'
import type { Board } from '@/lib/game'
import { cn } from '@/lib/utils'

export function MultiplayerResultScreen({
  board,
  won,
  isTie,
  winLine,
  playerIndex,
  pendingRequest,
  onPlayAgain,
  onAcceptPlayAgain,
  onDeclinePlayAgain,
  onExit,
}: {
  board: Board
  won: boolean
  isTie: boolean
  winLine: number[] | null
  playerIndex: number
  pendingRequest: { type: string; from: number } | null
  onPlayAgain: () => void
  onAcceptPlayAgain: () => void
  onDeclinePlayAgain: () => void
  onExit: () => void
}) {
  const title = won ? 'VICTORIA' : isTie ? 'EMPATE' : 'DERROTA'
  const subtitle = won
    ? '¡Línea completada!'
    : isTie
      ? 'Nadie consiguió tres en raya.'
      : 'El oponente ganó la partida.'
  const color = won
    ? 'var(--correct)'
    : isTie
      ? 'var(--type-country)'
      : 'var(--wrong)'

  const isWaiting = pendingRequest && pendingRequest.from === playerIndex
  const isIncoming = pendingRequest && pendingRequest.from !== playerIndex

  return (
    <div className="tactical-grid-bg flex min-h-full flex-col px-6 pb-8 pt-10">
      <div className="text-center">
        <p className="font-display text-[11px] tracking-[0.4em] text-muted-foreground">
          PARTIDA FINALIZADA
        </p>
        <h2
          className="mt-2 font-display text-4xl font-700 tracking-tight"
          style={{ color }}
        >
          {title}
        </h2>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>

      <div className="my-6 flex items-end justify-center gap-2">
        <span
          className="font-display text-7xl font-700 leading-none"
          style={{ color }}
        >
          {board.cells.filter((c) => c.status === 'correct').length}
        </span>
        <span className="mb-2 font-display text-2xl text-muted-foreground">
          / 9
        </span>
      </div>

      <div className="mx-auto grid w-full max-w-[320px] grid-cols-3 gap-1.5">
        {board.cells.map((cell, i) => {
          const isWinCell = won && winLine?.includes(i)
          return (
            <div
              key={i}
              className={cn(
                'flex aspect-square flex-col items-center justify-center rounded-md border text-center',
                cell.status === 'correct' &&
                  'border-[color:var(--correct)] bg-[color:var(--correct)]/10',
                cell.status === 'wrong' &&
                  'border-[color:var(--wrong)] bg-[color:var(--wrong)]/10',
                cell.status === 'empty' && 'border-border bg-card',
                isWinCell &&
                  'ring-2 ring-[color:var(--correct)] shadow-[0_0_12px_rgba(45,225,194,0.5)]',
              )}
            >
              {cell.status === 'correct' && cell.playerAlias && (
                <div className="flex flex-col items-center gap-0.5 px-1">
                  {cell.avatarUrl ? (
                    <img
                      src={cell.avatarUrl}
                      alt={cell.playerAlias}
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).src =
                          '/avatar.png'
                      }}
                      className="mt-1 size-10 rounded-full object-cover ring-1 ring-[color:var(--correct)]"
                    />
                  ) : (
                    <span className="font-sans text-[9px] font-600 leading-tight text-foreground">
                      {cell.playerAlias}
                    </span>
                  )}
                  <span className="font-sans text-[9px] font-600 leading-tight text-foreground">
                    {cell.playerAlias}
                  </span>
                </div>
              )}
              {cell.status === 'wrong' && (
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-sans text-[9px] font-500 leading-tight text-muted-foreground line-through">
                    {cell.playerAlias ?? ''}
                  </span>
                </div>
              )}
              {cell.status === 'empty' && (
                <span className="font-display text-xs text-muted-foreground/50">
                  —
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <Stat
          label="J1"
          value={board.cells.filter((c) => c.status === 'correct').length}
          color="var(--correct)"
        />
        <Stat
          label="EMPATE"
          value={board.cells.filter((c) => c.status === 'correct').length}
          color="var(--type-country)"
        />
        <Stat
          label="J2"
          value={board.cells.filter((c) => c.status === 'correct').length}
          color="var(--type-captain)"
        />
      </div>

      <div className="flex-1" />

      <div className="mt-8 flex flex-col gap-3">
        {isIncoming && pendingRequest?.type === 'play_again' && (
          <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-4 text-center">
            <p className="font-display text-xs tracking-wider text-muted-foreground">
              El oponente quiere jugar de nuevo
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onAcceptPlayAgain}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[color:var(--correct)] py-2 font-display text-xs font-700 tracking-wider text-[color:var(--primary-foreground)] transition-transform active:scale-[0.98]"
              >
                <Check className="size-4" strokeWidth={2.5} />
                ACEPTAR
              </button>
              <button
                type="button"
                onClick={onDeclinePlayAgain}
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border py-2 font-display text-xs font-700 tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" strokeWidth={2.5} />
                RECHAZAR
              </button>
            </div>
          </div>
        )}

        {isWaiting && (
          <div className="flex items-center justify-center gap-2 rounded-md border border-border bg-card py-3">
            <span className="font-display text-xs tracking-wider text-muted-foreground">
              Esperando respuesta del oponente…
            </span>
          </div>
        )}

        {!pendingRequest && (
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[color:var(--correct)] font-display text-sm font-700 tracking-[0.1em] text-[color:var(--primary-foreground)] transition-transform active:scale-[0.98]"
          >
            <RotateCcw className="size-5" strokeWidth={2.5} />
            JUGAR DE NUEVO
          </button>
        )}

        {!isIncoming && (
          <button
            type="button"
            onClick={onExit}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border font-display text-sm font-700 tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="size-5" strokeWidth={2.5} />
            SALIR AL INICIO
          </button>
        )}
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="flex flex-col items-center rounded-md border border-border bg-card py-3">
      <span
        className="font-display text-2xl font-700 leading-none"
        style={{ color }}
      >
        {value}
      </span>
      <span className="mt-1 font-display text-[9px] tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
    </div>
  )
}
