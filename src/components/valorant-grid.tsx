import { useCallback, useMemo, useState } from 'react'
import type { Board, PlayerSummary } from '@/lib/game'
import {
  TOTAL_GUESSES,
  cellIndex,
  rowColFromIndex,
  checkWin,
} from '@/lib/game'
import { createGame, submitGuess, ApiError } from '@/lib/api'
import { HomeScreen } from '@/components/home-screen'
import { BoardScreen } from '@/components/board-screen'
import { ResultScreen } from '@/components/result-screen'
import { PlayerSearch } from '@/components/player-search'
import { MultiplayerGrid } from '@/components/multiplayer-grid'

type Screen = 'home' | 'board' | 'result' | 'multiplayer'

export function ValorantGrid() {
  const [screen, setScreen] = useState<Screen>('home')
  const [board, setBoard] = useState<Board | null>(null)
  const [guessesLeft, setGuessesLeft] = useState(TOTAL_GUESSES)
  const [activeCell, setActiveCell] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [guessing, setGuessing] = useState(false)
  const [won, setWon] = useState(false)
  const [winLine, setWinLine] = useState<number[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const correctCount = useMemo(
    () => board?.cells.filter((c) => c.status === 'correct').length ?? 0,
    [board],
  )

  const startGame = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const newBoard = await createGame()
      setBoard(newBoard)
      setGuessesLeft(TOTAL_GUESSES)
      setActiveCell(null)
      setWon(false)
      setWinLine(null)
      setScreen('board')
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'No se pudo conectar con el servidor. ¿Está el backend en marcha?'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const finishIfNeeded = useCallback(
    (nextBoard: Board, nextGuesses: number) => {
      const { won: hasWon, line } = checkWin(nextBoard.cells)
      const filled = nextBoard.cells.every((c) => c.status !== 'empty')
      if (hasWon || filled || nextGuesses <= 0) {
        if (hasWon) {
          setWon(true)
          setWinLine(line)
        }
        setTimeout(() => setScreen('result'), 650)
      }
    },
    [],
  )

  const handleGuess = useCallback(
    async (player: PlayerSummary) => {
      if (board === null || activeCell === null || guessing) return

      const { row, col } = rowColFromIndex(activeCell)
      setGuessing(true)

      try {
        const result = await submitGuess(board.id, row, col, player.alias)

        const nextCells = board.cells.map((cell, i) => {
          if (i !== cellIndex(row, col)) return cell
          if (result.correct) {
            return {
              status: 'correct' as const,
              playerAlias: result.player?.alias ?? player.alias,
              teamName: result.player?.teamName ?? player.current_team_name,
              avatarUrl: result.player?.avatarUrl,
            }
          }
          return {
            status: 'wrong' as const,
            playerAlias: player.alias,
          }
        })

        const nextBoard = { ...board, cells: nextCells }
        const nextGuesses = guessesLeft - 1

        setBoard(nextBoard)
        setGuessesLeft(nextGuesses)
        setActiveCell(null)
        finishIfNeeded(nextBoard, nextGuesses)
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : 'Error al validar la respuesta. Intenta de nuevo.'
        setError(message)
        setActiveCell(null)
      } finally {
        setGuessing(false)
      }
    },
    [board, activeCell, guessesLeft, guessing, finishIfNeeded],
  )

  return screen === 'multiplayer' ? (
    <MultiplayerGrid onBack={() => setScreen('home')} />
  ) : (
    <main className="flex min-h-[100dvh] justify-center bg-background sm:items-center sm:py-6">
      <div className="relative flex min-h-[100dvh] w-full max-w-4xl flex-col bg-background">
        {screen === 'home' && (
          <HomeScreen
            onPlay={startGame}
            onMultiplayer={() => setScreen('multiplayer')}
            loading={loading}
            error={error}
          />
        )}

        {screen === 'board' && board && (
          <BoardScreen
            key={board.id}
            board={board}
            guessesLeft={guessesLeft}
            correctCount={correctCount}
            activeCell={activeCell}
            loading={guessing || loading}
            onSelectCell={(i) => {
              if (board.cells[i].status === 'empty' && !guessing) {
                setActiveCell(i)
              }
            }}
            onExit={() => {
              setScreen('home')
              setError(null)
            }}
            onNewBoard={startGame}
          />
        )}

        {screen === 'result' && board && (
          <ResultScreen
            board={board}
            correctCount={correctCount}
            won={won}
            winLine={winLine}
            onPlayAgain={startGame}
            loading={loading}
          />
        )}

        {screen === 'board' && board && activeCell !== null && (
          <PlayerSearch
            row={board.rows[Math.floor(activeCell / 3)]}
            col={board.cols[activeCell % 3]}
            onGuess={handleGuess}
            onClose={() => setActiveCell(null)}
          />
        )}
      </div>
    </main>
  )
}
