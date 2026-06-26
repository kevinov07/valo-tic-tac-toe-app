import { Shield, Globe, Crosshair, Crown, Users, Play, Gamepad2 } from 'lucide-react'

export function HomeScreen({
  onPlay,
  onMultiplayer,
  loading,
  error,
}: {
  onPlay: () => void
  onMultiplayer?: () => void
  loading?: boolean
  error?: string | null
}) {
  return (
    <div className="tactical-grid-bg flex min-h-full flex-col px-6 pb-8 pt-12">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <Logo />
        </div>

        <p className="font-display text-[11px] tracking-[0.4em] text-[color:var(--correct)]">
          TACTICAL TRIVIA
        </p>
        <h1 className="mt-2 font-display text-4xl font-700 leading-none tracking-tight text-foreground">
          VALO
          <br />
          <span className="text-[color:var(--correct)]">TIC TAC TOE</span>
        </h1>
        <p className="mt-4 max-w-xs text-pretty font-sans text-sm leading-relaxed text-muted-foreground">
          Un 3x3 donde cada celda cruza dos categorías. Nombra al pro que cumple
          ambas. Proyecto fan independiente, sin afiliación con Riot Games.
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <p className="mb-3 font-display text-[10px] tracking-[0.2em] text-muted-foreground">
          CÓMO SE JUEGA
        </p>
        <ol className="flex flex-col gap-3">
          <Step n="01" text="Cada fila y columna tiene una categoría: equipo actual (juega), equipo pasado (jugó), país, rol, capitán o compañero (juega con)." />
          <Step n="02" text="Toca una celda y escribe un pro que cumpla AMBAS categorías." />
          <Step n="03" text="Tienes 9 intentos — uno por celda. Consigue 3 en raya para ganar." />
        </ol>

        <div className="mt-4 flex items-center justify-around border-t border-border pt-3">
          <Legend icon={Shield} label="EQUIPO" color="var(--type-team)" />
          <Legend icon={Globe} label="PAÍS" color="var(--type-country)" />
          <Legend icon={Crosshair} label="ROL" color="var(--type-role)" />
          <Legend icon={Crown} label="CAPITÁN" color="var(--type-captain)" />
          <Legend icon={Users} label="COMPAÑERO" color="var(--type-team)" />
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-[color:var(--wrong)] bg-[color:var(--wrong)]/10 px-3 py-2 text-center font-sans text-sm text-[color:var(--wrong)]">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onPlay}
        disabled={loading}
        className="group flex h-14 w-full items-center justify-center gap-2 rounded-md bg-[color:var(--correct)] font-display text-lg font-700 tracking-[0.1em] text-[color:var(--primary-foreground)] transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        <Play className="size-5 fill-current" strokeWidth={0} />
        {loading ? 'CARGANDO…' : 'JUGAR'}
      </button>
      <p className="mt-3 text-center font-display text-[10px] tracking-[0.2em] text-muted-foreground">
        GENERA UN TABLERO ALEATORIO
      </p>

      <div className="relative my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="font-display text-[10px] tracking-[0.2em] text-muted-foreground">
          O
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        onClick={onMultiplayer}
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-border font-display text-sm font-700 tracking-[0.1em] text-foreground transition-colors hover:bg-secondary active:scale-[0.98]"
      >
        <Gamepad2 className="size-5" strokeWidth={2.5} />
        MULTIJUGADOR
      </button>
    </div>
  )
}

function Logo() {
  return (
    <div className="relative grid size-20 grid-cols-3 grid-rows-3 gap-1 rounded-md border-2 border-[color:var(--correct)] p-1.5">
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
  )
}

function Step({ n, text }: { n: string; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="font-display text-sm font-700 text-[color:var(--correct)]">
        {n}
      </span>
      <span className="font-sans text-sm leading-relaxed text-foreground">
        {text}
      </span>
    </li>
  )
}

function Legend({
  icon: Icon,
  label,
  color,
}: {
  icon: typeof Shield
  label: string
  color: string
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className="size-4" style={{ color }} strokeWidth={2.5} />
      <span
        className="font-display text-[9px] tracking-[0.16em]"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  )
}
