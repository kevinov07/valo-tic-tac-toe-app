import { Shield, Globe, Crosshair, Crown, Users, Swords, Trophy } from 'lucide-react'
import type { Category, CategoryKind } from '@/lib/game'
import { kindLabel } from '@/lib/game'
import { cn } from '@/lib/utils'

const iconFor: Partial<Record<CategoryKind, typeof Shield>> = {
  current_team: Shield,
  past_team: Shield,
  country: Globe,
  role: Crosshair,
  is_captain: Crown,
  teammate: Users,
  agent: Swords,
  title: Trophy,
}

const colorClass: Partial<Record<CategoryKind, string>> = {
  current_team: 'text-[color:var(--type-team)] border-t-[color:var(--type-team)]',
  past_team: 'text-[color:var(--type-team)] border-t-[color:var(--type-team)]',
  country: 'text-[color:var(--type-country)] border-t-[color:var(--type-country)]',
  role: 'text-[color:var(--type-role)] border-t-[color:var(--type-role)]',
  is_captain: 'text-[color:var(--type-captain)] border-t-[color:var(--type-captain)]',
  teammate: 'text-[color:var(--type-team)] border-t-[color:var(--type-team)]',
  agent: 'text-[color:var(--type-agent)] border-t-[color:var(--type-agent)]',
  title: 'text-[color:var(--type-title)] border-t-[color:var(--type-title)]',
}

export function CategoryChip({
  category,
  active = false,
}: {
  category: Category
  active?: boolean
}) {
  const Icon = iconFor[category.kind] ?? Shield
  const label = kindLabel[category.kind] ?? category.kind.toUpperCase()

  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-center gap-1 border-t-2 bg-card px-2 py-2 text-center transition-colors',
        colorClass[category.kind] ?? 'text-foreground border-t-border',
        active && 'bg-secondary',
      )}
    >
      <div className="flex items-center gap-1.5">
        <Icon className="size-4 shrink-0 sm:size-5" strokeWidth={2.5} aria-hidden="true" />
        <span className="font-display text-[10px] font-600 tracking-[0.16em] text-muted-foreground sm:text-xs">
          {label}
        </span>
      </div>
      <span className="font-display text-sm font-700 leading-tight tracking-wide text-foreground text-balance sm:text-base">
        {category.label}
      </span>
    </div>
  )
}
