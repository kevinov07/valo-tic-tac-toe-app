import { RotateCcw, Check, X, Minus } from 'lucide-react'
import type { Board } from '@/lib/game'
import { cn } from '@/lib/utils'

export function ResultScreen({
  board,
  correctCount,
  won,
  winLine,
  onPlayAgain,
  loading,
}: {
  board: Board
  correctCount: number
  won: boolean
  winLine: number[] | null
  onPlayAgain: () => void
  loading?: boolean
}) {
  const verdict = getVerdict(correctCount, won)

  return (
    <div className="tactical-grid-bg flex min-h-full flex-col px-6 pb-8 pt-10">
      <div className="text-center">
        <p className="font-display text-[11px] tracking-[0.4em] text-muted-foreground">
          PARTIDA FINALIZADA
        </p>
        <h2
          className="mt-2 font-display text-3xl font-700 tracking-tight"
          style={{ color: verdict.color }}
        >
          {verdict.title}
        </h2>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          {verdict.subtitle}
        </p>
      </div>

      <div className="my-6 flex items-end justify-center gap-2">
        <span
          className="font-display text-7xl font-700 leading-none"
          style={{ color: 'var(--correct)' }}
        >
          {correctCount}
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
              isWinCell && 'ring-2 ring-[color:var(--correct)] shadow-[0_0_12px_rgba(45,225,194,0.5)]',
            )}
          >
            {cell.status === 'correct' && cell.playerAlias && (
              <div className="flex flex-col items-center gap-0.5 px-1">
                {cell.avatarUrl ? (
                  <img
                    src={cell.avatarUrl}
                    alt={cell.playerAlias}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/avatar.png'
                    }}
                    className="mt-1 size-10 rounded-full object-cover ring-1 ring-[color:var(--correct)]"
                  />
                ) : (
                  <Check
                    className="mt-1 size-4 text-[color:var(--correct)]"
                    strokeWidth={3}
                  />
                )}
                <span className="font-sans text-[9px] font-600 leading-tight text-foreground">
                  {cell.playerAlias}
                </span>
              </div>
            )}
            {cell.status === 'wrong' && (
              <div className="flex flex-col items-center gap-0.5">
                <X className="size-5 text-[color:var(--wrong)]" strokeWidth={3} />
                {cell.playerAlias && (
                  <span className="font-sans text-[9px] font-500 leading-tight text-muted-foreground line-through">
                    {cell.playerAlias}
                  </span>
                )}
              </div>
            )}
            {cell.status === 'empty' && (
              <Minus className="size-5 text-muted-foreground/50" />
            )}
          </div>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <Stat label="ACIERTOS" value={correctCount} color="var(--correct)" />
        <Stat
          label="FALLOS"
          value={board.cells.filter((c) => c.status === 'wrong').length}
          color="var(--wrong)"
        />
        <Stat
          label="VACÍAS"
          value={board.cells.filter((c) => c.status === 'empty').length}
          color="var(--muted-foreground)"
        />
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={onPlayAgain}
        disabled={loading}
        className="mt-8 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[color:var(--correct)] font-display text-sm font-700 tracking-[0.1em] text-[color:var(--primary-foreground)] transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        <RotateCcw className="size-5" strokeWidth={2.5} />
        {loading ? 'CARGANDO…' : 'JUGAR DE NUEVO'}
      </button>
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

function getVerdict(score: number, won: boolean) {
  if (won)
    return {
      title: 'LÍNEA COMPLETA',
      subtitle: '¡Tres en raya! Lectura perfecta de la escena.',
      color: 'var(--correct)',
    }
  if (score === 9)
    return {
      title: 'PERFECT GRID',
      subtitle: 'Tablero limpio. Eres un analista de élite.',
      color: 'var(--correct)',
    }
  if (score >= 6)
    return {
      title: 'CLUTCH',
      subtitle: 'Gran lectura de la escena competitiva.',
      color: 'var(--correct)',
    }
  if (score >= 3)
    return {
      title: 'TRADE EVEN',
      subtitle: 'Sólido, pero hay rondas que repasar.',
      color: 'var(--type-country)',
    }
  return {
    title: 'ECO ROUND',
    subtitle: 'A estudiar más VODs antes de la revancha.',
    color: 'var(--wrong)',
  }
}
