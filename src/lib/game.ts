/** Mirrors backend model.CategoryKind */
export type CategoryKind =
  | 'current_team'
  | 'past_team'
  | 'country'
  | 'role'
  | 'is_captain'
  | 'teammate'
  | 'agent'
  | 'title'

export interface Category {
  kind: CategoryKind
  label: string
  value: string
}

export interface PlayerSummary {
  alias: string
  current_team_name: string
  role?: string
  country_code?: string
}

export interface BoardCell {
  status: 'empty' | 'correct' | 'wrong'
  playerAlias?: string
  teamName?: string
  avatarUrl?: string
}

export interface Board {
  id: string
  rows: Category[]
  cols: Category[]
  cells: BoardCell[]
}

export const TOTAL_GUESSES = 9

export function cellIndex(rowIdx: number, colIdx: number): number {
  return rowIdx * 3 + colIdx
}

export function rowColFromIndex(index: number): { row: number; col: number } {
  return { row: Math.floor(index / 3), col: index % 3 }
}

export const kindColorVar: Record<CategoryKind, string> = {
  current_team: 'var(--type-team)',
  past_team: 'var(--type-team)',
  country: 'var(--type-country)',
  role: 'var(--type-role)',
  is_captain: 'var(--type-captain)',
  teammate: 'var(--type-team)',
  agent: 'var(--type-agent)',
  title: 'var(--type-title)',
}

export const kindLabel: Record<CategoryKind, string> = {
  current_team: 'EQUIPO',
  past_team: 'EQUIPO',
  country: 'PAÍS',
  role: 'ROL',
  is_captain: 'CAPITÁN',
  teammate: 'COMPAÑERO',
  agent: 'AGENTE',
  title: 'TÍTULO',
}

export const WINNING_COMBINATIONS: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export function checkWin(cells: BoardCell[]): { won: boolean; line: number[] | null } {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo
    if (
      cells[a].status === 'correct' &&
      cells[b].status === 'correct' &&
      cells[c].status === 'correct'
    ) {
      return { won: true, line: combo }
    }
  }
  return { won: false, line: null }
}
