import { Plus, X } from 'lucide-react'
import type { BoardCell } from '@/lib/game'
import { cn } from '@/lib/utils'

export function GridCell({
  cell,
  active,
  disabled,
  onClick,
}: {
  cell: BoardCell
  active: boolean
  disabled: boolean
  onClick: () => void
}) {
  const isEmpty = cell.status === 'empty'
  const isCorrect = cell.status === 'correct'
  const isWrong = cell.status === 'wrong'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !isEmpty}
      aria-label={
        isEmpty
          ? 'Celda vacía, toca para responder'
          : `${cell.playerAlias ?? ''} — ${isCorrect ? 'acierto' : 'fallo'}`
      }
      className={cn(
        'group relative flex aspect-square w-full items-center justify-center overflow-hidden bg-card transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isEmpty && !disabled && 'hover:bg-secondary active:scale-[0.97]',
        active && 'bg-secondary ring-2 ring-inset ring-[color:var(--correct)] animate-pulse-ring',
        isWrong && 'animate-glitch-shake',
      )}
    >
      <CornerBrackets
        show={isCorrect || isWrong || active}
        color={
          isCorrect
            ? 'var(--correct)'
            : isWrong
              ? 'var(--wrong)'
              : 'var(--correct)'
        }
      />

      {isCorrect && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[color:var(--correct)]/15"
        />
      )}

      {isEmpty && (
        <Plus
          className={cn(
            'size-8 text-muted-foreground/40 transition-colors sm:size-10',
            !disabled && 'group-hover:text-[color:var(--correct)]',
          )}
          strokeWidth={2}
          aria-hidden="true"
        />
      )}

      {isCorrect && cell.playerAlias && (
        <div className="animate-stamp-in relative z-10 flex flex-col items-center gap-1.5 px-2">
          {cell.avatarUrl && (
            <img
              src={cell.avatarUrl}
              alt={cell.playerAlias}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/avatar.png'
              }}
              className="size-14 rounded-full object-cover ring-1 ring-[color:var(--correct)] sm:size-20"
            />
          )}
          <span className="font-sans text-base font-700 leading-none text-foreground sm:text-lg">
            {cell.playerAlias}
          </span>
          {cell.teamName && (
            <span className="font-display text-[10px] tracking-[0.12em] text-[color:var(--correct)] sm:text-xs">
              {cell.teamName.toUpperCase()}
            </span>
          )}
        </div>
      )}

      {isWrong && (
        <div className="animate-stamp-in flex flex-col items-center gap-1.5 px-2">
          <X
            className="size-6 text-[color:var(--wrong)] sm:size-7"
            strokeWidth={3}
            aria-hidden="true"
          />
          {cell.playerAlias && (
            <span className="font-sans text-sm font-500 leading-none text-muted-foreground line-through sm:text-base">
              {cell.playerAlias}
            </span>
          )}
          <span className="font-display text-[9px] tracking-[0.2em] text-[color:var(--wrong)] sm:text-[10px]">
            MISS
          </span>
        </div>
      )}
    </button>
  )
}

function CornerBrackets({ show, color }: { show: boolean; color: string }) {
  if (!show) return null
  const common = 'absolute h-3 w-3 border-[color:var(--bracket)]'
  return (
    <span aria-hidden="true" style={{ ['--bracket' as string]: color }}>
      <span className={`${common} left-1 top-1 border-l-2 border-t-2`} />
      <span className={`${common} right-1 top-1 border-r-2 border-t-2`} />
      <span className={`${common} bottom-1 left-1 border-b-2 border-l-2`} />
      <span className={`${common} bottom-1 right-1 border-b-2 border-r-2`} />
    </span>
  )
}
