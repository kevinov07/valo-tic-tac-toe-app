import type { Board, BoardCell, Category, PlayerSummary } from '@/lib/game'

const API_BASE = getApiBase()

function getApiBase(): string {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl) return envUrl
  if (import.meta.env.DEV) return 'http://localhost:8080'
  throw new Error('VITE_API_URL no está definida. Defínela en .env para producción.')
}

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const timeoutMs = 10_000
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const userSignal = init?.signal
  if (userSignal) {
    userSignal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })

    if (!res.ok) {
      let message = res.statusText
      try {
        const body = (await res.json()) as { error?: string }
        if (body.error) message = body.error
      } catch {
        // ignore parse errors
      }
      throw new ApiError(message, res.status)
    }

    return res.json() as Promise<T>
  } catch (err) {
    if (err instanceof ApiError) throw err
    throw new ApiError(
      'No se pudo conectar con el servidor. intenta de nuevo mas tarde',
      0,
    )
  } finally {
    clearTimeout(timeoutId)
  }
}

interface ApiCategory {
  kind: Category['kind']
  label: string
  value: string
}

interface ApiCell {
  answered: boolean
  player_alias?: string
  team_name?: string
  avatar_url?: string
}

interface ApiBoard {
  id: string
  rows: ApiCategory[]
  cols: ApiCategory[]
  cells: ApiCell[][]
}

interface ApiGuessResponse {
  correct: boolean
  player?: {
    alias: string
    current_team_name: string
    avatar_url: string
  }
}

function flattenCells(cells: ApiCell[][]): BoardCell[] {
  const flat: BoardCell[] = Array.from({ length: 9 }, () => ({ status: 'empty' }))
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const apiCell = cells[r]?.[c]
      if (!apiCell) continue
      const idx = r * 3 + c
      if (apiCell.answered) {
        flat[idx] = {
          status: 'correct',
          playerAlias: apiCell.player_alias,
          teamName: apiCell.team_name,
          avatarUrl: apiCell.avatar_url,
        }
      }
    }
  }
  return flat
}

function toBoard(api: ApiBoard, localCells?: BoardCell[]): Board {
  const serverCells = flattenCells(api.cells)
  const cells =
    localCells?.map((local, i) => {
      if (local.status === 'wrong') return local
      if (serverCells[i].status === 'correct') return serverCells[i]
      return local.status === 'empty' ? serverCells[i] : local
    }) ?? serverCells

  return {
    id: api.id,
    rows: api.rows,
    cols: api.cols,
    cells,
  }
}

export async function createGame(): Promise<Board> {
  const api = await request<ApiBoard>('/api/games', { method: 'POST' })
  return toBoard(api)
}

export async function submitGuess(
  gameId: string,
  row: number,
  col: number,
  playerAlias: string,
): Promise<{ correct: boolean; player?: { alias: string; teamName: string; avatarUrl: string } }> {
  const res = await request<ApiGuessResponse>(`/api/games/${gameId}/guess`, {
    method: 'POST',
    body: JSON.stringify({ row, col, player_alias: playerAlias }),
  })

  return {
    correct: res.correct,
    player: res.player
      ? { alias: res.player.alias, teamName: res.player.current_team_name, avatarUrl: res.player.avatar_url }
      : undefined,
  }
}

export async function searchPlayers(
  query: string,
  signal?: AbortSignal,
): Promise<PlayerSummary[]> {
  const q = query.trim()
  if (!q) return []

  const params = new URLSearchParams({ q })
  return request<PlayerSummary[]>(`/api/players?${params}`, { signal })
}

export function getWsBase(): string {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl) return envUrl.replace(/^http/, 'ws').replace(/\/+$/, '') + '/ws'
  if (import.meta.env.DEV) return 'ws://localhost:8080/ws'
  throw new Error('VITE_API_URL no está definida. Defínela en .env para producción.')
}

export { ApiError }
