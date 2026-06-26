import type { Board } from '@/lib/game'
import type { WsMessage } from '@/lib/use-websocket'

export type MultiplayerScreen = 'lobby' | 'waiting' | 'board' | 'result'

export interface MultiplayerState {
  screen: MultiplayerScreen
  playerIndex: number
  board: Board | null
  yourTurn: boolean
  roomCode: string | null
  winner: number | null
  winLine: number[] | null
  error: string | null
}

export function emptyMultiplayerState(): MultiplayerState {
  return {
    screen: 'lobby',
    playerIndex: -1,
    board: null,
    yourTurn: false,
    roomCode: null,
    winner: null,
    winLine: null,
    error: null,
  }
}

export function wsBoardToBoard(wsBoard: NonNullable<WsMessage['board']>): Board {
  const cells = wsBoard.cells.flatMap((row, r) =>
    row.map((cell, c) => {
      const status = cell.last_guess_wrong && cell.last_guess_alias
        ? 'wrong'
        : cell.player_alias
          ? 'correct'
          : 'empty'
      if (status === 'wrong') {
        return {
          status: 'wrong' as const,
          playerAlias: cell.last_guess_alias!,
          ownerPlayer: -1,
        }
      }
      if (status === 'correct') {
        return {
          status: 'correct' as const,
          playerAlias: cell.player_alias!,
          teamName: cell.team_name ?? '',
          avatarUrl: cell.avatar_url,
          ownerPlayer: cell.owner_player ?? -1,
        }
      }
      return { status: 'empty' as const }
    }),
  )

  return {
    id: wsBoard.id,
    rows: wsBoard.rows.map((r) => ({ kind: r.kind as Board['rows'][0]['kind'], label: r.label, value: r.value })),
    cols: wsBoard.cols.map((c) => ({ kind: c.kind as Board['cols'][0]['kind'], label: c.label, value: c.value })),
    cells,
  }
}
