import { ChevronLeft, RefreshCw, Users, Zap, Ban, Check, X, Loader2 } from 'lucide-react'
import type { Board } from '@/lib/game'
import { cellIndex } from '@/lib/game'
import { CategoryChip } from '@/components/category-chip'
import { GridCell } from '@/components/grid-cell'
import { cn } from '@/lib/utils'

export function MultiplayerBoardScreen({
  board,
  yourTurn,
  roomCode,
  playerIndex,
  activeCell,
  disabled,
  pendingRequest,
  stealEnabled,
  onSelectCell,
  onExit,
  onRequestReset,
  onAcceptReset,
  onDeclineReset,
}: {
  board: Board
  yourTurn: boolean
  roomCode: string
  playerIndex: number
  activeCell: number | null
  disabled: boolean
  pendingRequest: { type: string; from: number } | null
  stealEnabled: boolean
  onSelectCell: (index: number) => void
  onExit: () => void
  onRequestReset: () => void
  onAcceptReset: () => void
  onDeclineReset: () => void
}) {
  const isWaiting = pendingRequest && pendingRequest.from === playerIndex
  const isIncoming = pendingRequest && pendingRequest.from !== playerIndex

  return (
    <div className="flex min-h-full flex-col px-6 pb-8 pt-6">
      <header className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onExit}
          className="flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Salir de la partida"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="text-center">
          <p className="font-display text-xs tracking-[0.3em] text-muted-foreground sm:text-sm">
            VALO TIC TAC TOE
          </p>
          <div className="flex items-center justify-center gap-2">
            <TurnIndicator yourTurn={yourTurn} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StealBadge enabled={stealEnabled} />
          <button
            type="button"
            onClick={onRequestReset}
            disabled={!!pendingRequest}
            className="flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground active:scale-[0.95] disabled:opacity-60"
            aria-label="Reiniciar tablero"
          >
            {isWaiting ? (
              <Loader2 className="size-4 animate-spin" strokeWidth={2} />
            ) : (
              <RefreshCw className="size-4" strokeWidth={2} />
            )}
          </button>
          <RoomCodeBadge code={roomCode} />
        </div>
      </header>

      {isIncoming && pendingRequest?.type === 'reset' && (
        <div className="mx-auto mb-4 flex w-full max-w-2xl flex-col gap-2 rounded-md border border-border bg-card p-4 text-center">
          <p className="font-display text-xs tracking-wider text-muted-foreground">
            El oponente quiere reiniciar el tablero
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onAcceptReset}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[color:var(--correct)] py-2 font-display text-xs font-700 tracking-wider text-[color:var(--primary-foreground)] transition-transform active:scale-[0.98]"
            >
              <Check className="size-4" strokeWidth={2.5} />
              ACEPTAR
            </button>
            <button
              type="button"
              onClick={onDeclineReset}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border py-2 font-display text-xs font-700 tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" strokeWidth={2.5} />
              RECHAZAR
            </button>
          </div>
        </div>
      )}

      {isWaiting && (
        <div className="mx-auto mb-4 flex w-full max-w-2xl items-center justify-center gap-2 rounded-md border border-border bg-card py-3">
          <span className="font-display text-xs tracking-wider text-muted-foreground">
            Esperando respuesta del oponente…
          </span>
        </div>
      )}

      <div className="mx-auto w-full max-w-2xl">
        <div className="grid grid-cols-[1.1fr_repeat(3,1fr)] grid-rows-[auto_repeat(3,1fr)] gap-2 sm:gap-3">
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
              className="rounded-md border border-border"
            >
              <CategoryChip
                category={col}
                active={activeCell !== null && activeCell % 3 === c}
              />
            </div>
          ))}

          {board.rows.map((row, r) => (
            <div key={`row-${r}`} className="contents">
              <div className="rounded-md border border-border">
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
                      disabled={disabled || !yourTurn}
                      onClick={() => onSelectCell(idx)}
                      allowReanswer={stealEnabled}
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <PlayerStat
          label="J1"
          active={playerIndex === 0 && yourTurn}
          correct={board.cells.filter(
            (c) => c.status === 'correct' && c.ownerPlayer === 0,
          ).length}
          color="var(--correct)"
        />
        <div className="h-8 w-px bg-border" />
        <PlayerStat
          label="J2"
          active={playerIndex === 1 && yourTurn}
          correct={board.cells.filter(
            (c) => c.status === 'correct' && c.ownerPlayer === 1,
          ).length}
          color="var(--type-captain)"
        />
      </div>

      <p className="mt-4 text-center font-sans text-sm text-muted-foreground">
        {yourTurn
          ? 'Toca una celda vacía para adivinar.'
          : 'Esperando al oponente…'}
      </p>
    </div>
  )
}

function TurnIndicator({ yourTurn }: { yourTurn: boolean }) {
  return (
    <span
      className={cn(
        'font-display text-sm font-700 tracking-widest',
        yourTurn ? 'text-[color:var(--correct)]' : 'text-muted-foreground',
      )}
    >
      {yourTurn ? 'TU TURNO' : 'ESPERANDO'}
    </span>
  )
}

function StealBadge({ enabled }: { enabled: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-md border px-2 py-1.5',
        enabled
          ? 'border-[color:var(--correct)]/30 bg-[color:var(--correct)]/10'
          : 'border-border',
      )}
    >
      {enabled ? (
        <Zap className="size-3 text-[color:var(--correct)]" strokeWidth={2.5} />
      ) : (
        <Ban className="size-3 text-muted-foreground" strokeWidth={2.5} />
      )}
      <span
        className={cn(
          'font-display text-[9px] tracking-wider',
          enabled ? 'text-[color:var(--correct)]' : 'text-muted-foreground',
        )}
      >
        {enabled ? 'STEAL' : 'NO STEAL'}
      </span>
    </div>
  )
}

function RoomCodeBadge({ code }: { code: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5">
      <Users className="size-3.5 text-muted-foreground" strokeWidth={2} />
      <span className="font-display text-xs tracking-[0.2em] text-foreground">
        {code}
      </span>
    </div>
  )
}

function PlayerStat({
  label,
  active,
  correct,
  color,
}: {
  label: string
  active: boolean
  correct: number
  color: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'flex size-7 items-center justify-center rounded-full font-display text-xs font-700',
          active
            ? 'text-[color:var(--primary-foreground)]'
            : 'text-muted-foreground',
        )}
        style={{
          backgroundColor: active ? color : undefined,
          border: active ? undefined : `1px solid var(--border)`,
        }}
      >
        {label}
      </span>
      <span
        className="font-display text-base font-700"
        style={{ color: active ? color : undefined }}
      >
        {correct}
      </span>
    </div>
  )
}
