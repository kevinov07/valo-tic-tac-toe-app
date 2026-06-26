import { Plus, X } from 'lucide-react'
import type { BoardCell } from '@/lib/game'
import { cn } from '@/lib/utils'

export function GridCell({
  cell,
  active,
  disabled,
  onClick,
  allowReanswer,
}: {
  cell: BoardCell
  active: boolean
  disabled: boolean
  onClick: () => void
  allowReanswer?: boolean
}) {
  const isEmpty = cell.status === 'empty'
  const isCorrect = cell.status === 'correct'
  const isWrong = cell.status === 'wrong'
  const isDisabled = allowReanswer ? disabled : disabled || !isEmpty

  // Player 0 = var(--correct) verde, Player 1 = var(--type-captain) morado
  const playerAccent =
    isCorrect && cell.ownerPlayer === 1 ? 'var(--type-captain)' : 'var(--correct)'
  const accentColor = isCorrect
    ? playerAccent
    : isWrong
      ? 'var(--wrong)'
      : 'var(--correct)'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-label={
        isEmpty
          ? 'Celda vacía, toca para responder'
          : `${cell.playerAlias ?? ''} — ${isCorrect ? 'acierto' : 'fallo'}`
      }
      className={cn(
        'group relative flex aspect-square w-full items-center justify-center overflow-hidden bg-card transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isDisabled && 'opacity-50',
        !disabled && (isEmpty || allowReanswer) && 'hover:bg-secondary active:scale-[0.97] cursor-pointer',
        active && 'bg-secondary animate-pulse-ring',
        active && isCorrect && 'ring-2 ring-inset',
        !active && isCorrect && 'ring-1 ring-inset',
        isWrong && 'animate-glitch-shake',
      )}
      style={
        isCorrect && !active
          ? { boxShadow: `inset 0 0 0 1px ${accentColor}` }
          : active && isCorrect
            ? { boxShadow: `inset 0 0 0 2px ${accentColor}` }
            : undefined
      }
    >
      <CornerBrackets
        show={isCorrect || isWrong || active}
        color={accentColor}
      />

      {isCorrect && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: `${accentColor}26` }}
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
              className="size-14 rounded-full object-cover sm:size-20"
              style={{ boxShadow: `0 0 0 1px ${accentColor}` }}
            />
          )}
          <span className="font-sans text-base font-700 leading-none text-foreground sm:text-lg">
            {cell.playerAlias}
          </span>
          {cell.teamName && (
            <span
              className="font-display text-[10px] tracking-[0.12em] sm:text-xs"
              style={{ color: accentColor }}
            >
              {cell.teamName.toUpperCase()}
            </span>
          )}
        </div>
      )}

      {isWrong && (
        <div className="animate-stamp-in flex flex-col items-center gap-1.5 px-2">
          <X
            className="size-6 sm:size-7"
            strokeWidth={3}
            aria-hidden="true"
            style={{ color: accentColor }}
          />
          {cell.playerAlias && (
            <span className="font-sans text-sm font-500 leading-none text-muted-foreground line-through sm:text-base">
              {cell.playerAlias}
            </span>
          )}
          <span
            className="font-display text-[9px] tracking-[0.2em] sm:text-[10px]"
            style={{ color: accentColor }}
          >
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
