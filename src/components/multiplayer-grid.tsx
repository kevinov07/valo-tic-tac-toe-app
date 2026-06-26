import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { rowColFromIndex } from '@/lib/game'
import type { Board, PlayerSummary } from '@/lib/game'
import { getWsBase } from '@/lib/api'
import { useWebSocket } from '@/lib/use-websocket'
import type { WsMessage } from '@/lib/use-websocket'
import { wsBoardToBoard } from '@/lib/multiplayer'
import type { MultiplayerScreen } from '@/lib/multiplayer'
import { MultiplayerLobby } from '@/components/multiplayer-lobby'
import { MultiplayerBoardScreen } from '@/components/multiplayer-board-screen'
import { MultiplayerResultScreen } from '@/components/multiplayer-result-screen'
import { PlayerSearch } from '@/components/player-search'

export function MultiplayerGrid({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<MultiplayerScreen>('lobby')
  const [playerIndex, setPlayerIndex] = useState(-1)
  const [board, setBoard] = useState<Board | null>(null)
  const [yourTurn, setYourTurn] = useState(false)
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [winner, setWinner] = useState<number | null>(null)
  const [winLine, setWinLine] = useState<number[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeCell, setActiveCell] = useState<number | null>(null)
  const [sendingGuess, setSendingGuess] = useState(false)
  const [pendingRequest, setPendingRequest] = useState<{ type: string; from: number } | null>(null)

  useEffect(() => {
    if (!sendingGuess) return
    const timer = setTimeout(() => setSendingGuess(false), 8000)
    return () => clearTimeout(timer)
  }, [sendingGuess])

  const wsUrl = getWsBase()
  const { connected, connect, disconnect, send, on } =
    useWebSocket(wsUrl)

  const screenRef = useRef(screen)
  screenRef.current = screen

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  useEffect(() => {
    if (!connected && screenRef.current !== 'lobby') {
      setError('Conexión perdida. Vuelve al lobby.')
      setScreen('lobby')
    }
  }, [connected])

  const goToLobby = useCallback(() => {
    setScreen('lobby')
    setBoard(null)
    setRoomCode(null)
    setPlayerIndex(-1)
    setYourTurn(false)
    setWinner(null)
    setWinLine(null)
    setError(null)
    setActiveCell(null)
  }, [])

  const updateBoardFromGuess = useCallback(
    (msg: WsMessage) => {
      if (!board || msg.row === undefined || msg.col === undefined) {
        return
      }

      const idx = msg.row * 3 + msg.col
      const nextCells = board.cells.map((cell, i) => {
        if (i !== idx) return cell
        if (msg.correct) {
          return {
            status: 'correct' as const,
            playerAlias: msg.player_alias ?? '',
            teamName: msg.team_name ?? '',
            avatarUrl: msg.avatar_url,
            ownerPlayer: msg.player_index ?? -1,
          }
        }
        return {
          status: 'wrong' as const,
          playerAlias: msg.player_alias ?? '',
          ownerPlayer: -1,
        }
      })

      setBoard({ ...board, cells: nextCells })
      if (msg.your_turn !== undefined) {
        setYourTurn(msg.your_turn)
      }

      if (
        msg.type === 'game_over' &&
        msg.winner !== undefined &&
        msg.win_line
      ) {
        setWinner(msg.winner)
        setWinLine(msg.win_line)
        setScreen('result')
      }
    },
    [board],
  )

  useEffect(() => {
    const unsubs: (() => void)[] = []

    unsubs.push(
      on('room_created', (msg) => {
        setRoomCode(msg.code ?? null)
        setPlayerIndex(msg.player_index ?? 0)
        setYourTurn(msg.your_turn ?? true)
        setScreen('waiting')
      }),
    )

    unsubs.push(
      on('opponent_joined', (msg) => {
        if (msg.board) {
          setBoard(wsBoardToBoard(msg.board))
          setYourTurn(msg.your_turn ?? false)
        }
        setSendingGuess(false)
        setActiveCell(null)
        setScreen('board')
      }),
    )

    unsubs.push(
      on('room_joined', (msg) => {
        setPlayerIndex(msg.player_index ?? 1)
        setRoomCode(msg.code ?? null)
        if (msg.board) {
          setBoard(wsBoardToBoard(msg.board))
          setYourTurn(msg.your_turn ?? false)
        }
        setScreen('board')
      }),
    )

    unsubs.push(
      on('guess_result', (msg) => {
        setSendingGuess(false)
        setActiveCell(null)
        updateBoardFromGuess(msg)
      }),
    )

    unsubs.push(
      on('game_over', (msg) => {
        setSendingGuess(false)
        setActiveCell(null)
        updateBoardFromGuess(msg)
      }),
    )

    unsubs.push(
      on('error', (msg) => {
        setError(msg.message ?? 'Error del servidor')
        setSendingGuess(false)
        setActiveCell(null)
      }),
    )

    unsubs.push(
      on('game_restarted', (msg) => {
        if (msg.board) {
          setBoard(wsBoardToBoard(msg.board))
          setYourTurn(msg.your_turn ?? false)
        }
        setWinner(null)
        setWinLine(null)
        setSendingGuess(false)
        setActiveCell(null)
        setPendingRequest(null)
        setScreen('board')
      }),
    )

    unsubs.push(
      on('play_again_requested', (msg) => {
        setPendingRequest({ type: 'play_again', from: msg.from_player ?? 0 })
      }),
    )

    unsubs.push(
      on('play_again_declined', (msg) => {
        setPendingRequest(null)
        setError(msg.message ?? 'El oponente rechazó')
      }),
    )

    unsubs.push(
      on('reset_requested', (msg) => {
        setPendingRequest({ type: 'reset', from: msg.from_player ?? 0 })
      }),
    )

    unsubs.push(
      on('reset_declined', (msg) => {
        setPendingRequest(null)
        setError(msg.message ?? 'El oponente rechazó')
      }),
    )

    unsubs.push(
      on('opponent_left', () => {
        setError('El oponente abandonó la sala')
        goToLobby()
      }),
    )

    return () => unsubs.forEach((u) => u())
  }, [on, updateBoardFromGuess, goToLobby])

  const handleCreateRoom = useCallback(() => {
    setError(null)
    if (!send({ type: 'create_room' })) {
      setError('No hay conexión con el servidor')
    }
  }, [send])

  const handleJoinRoom = useCallback(
    (code: string) => {
      setError(null)
      if (!send({ type: 'join_room', code })) {
        setError('No hay conexión con el servidor')
      }
    },
    [send],
  )

  const handleSelectCell = useCallback(
    (idx: number) => {
      if (!yourTurn || sendingGuess) return
      setActiveCell(idx)
    },
    [yourTurn, sendingGuess],
  )

  const handleGuess = useCallback(
    (player: PlayerSummary) => {
      if (activeCell === null) {
        return
      }
      const { row, col } = rowColFromIndex(activeCell)
      setSendingGuess(true)
      setActiveCell(null)
      const sent = send({
        type: 'guess',
        row,
        col,
        player_alias: player.alias,
      })
      if (!sent) {
        setSendingGuess(false)
        setError('No hay conexión con el servidor')
      }
    },
    [activeCell, send, playerIndex],
  )

  const handleExitGame = useCallback(() => {
    send({ type: 'leave_room' })
    goToLobby()
  }, [send, goToLobby])

  const handleExitMultiplayer = useCallback(() => {
    disconnect()
    onBack()
  }, [disconnect, onBack])

  const handlePlayAgain = useCallback(() => {
    const sent = send({ type: 'play_again_request' })
    if (!sent) {
      setError('No hay conexión con el servidor')
    } else {
      setPendingRequest({ type: 'play_again', from: playerIndex })
    }
  }, [send, playerIndex])

  const handleAcceptPlayAgain = useCallback(() => {
    setPendingRequest(null)
    send({ type: 'accept_play_again' })
  }, [send])

  const handleDeclinePlayAgain = useCallback(() => {
    setPendingRequest(null)
    send({ type: 'decline_play_again' })
  }, [send])

  const handleRequestReset = useCallback(() => {
    const sent = send({ type: 'request_reset' })
    if (!sent) {
      setError('No hay conexión con el servidor')
    } else {
      setPendingRequest({ type: 'reset', from: playerIndex })
    }
  }, [send, playerIndex])

  const handleAcceptReset = useCallback(() => {
    setPendingRequest(null)
    send({ type: 'accept_reset' })
  }, [send])

  const handleDeclineReset = useCallback(() => {
    setPendingRequest(null)
    send({ type: 'decline_reset' })
  }, [send])

  return (
    <main className="flex min-h-[100dvh] justify-center bg-background sm:items-center sm:py-6">
      <div className="relative flex min-h-[100dvh] w-full max-w-4xl flex-col bg-background">
        {error && screen !== 'lobby' && (
          <div className="absolute left-0 right-0 top-0 z-50 rounded-none border-0 border-b border-[color:var(--wrong)] bg-[color:var(--wrong)]/10 px-4 py-2 text-center font-sans text-sm text-[color:var(--wrong)]">
            {error}
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-2 font-display text-[10px] tracking-wider underline"
            >
              OK
            </button>
          </div>
        )}

        {screen === 'lobby' && (
          <MultiplayerLobby
            onCreate={handleCreateRoom}
            onJoin={handleJoinRoom}
            connected={connected}
            error={error}
          />
        )}

        {screen === 'waiting' && (
          <WaitingScreen
            roomCode={roomCode ?? '------'}
            onCancel={goToLobby}
          />
        )}

        {screen === 'board' && board && (
          <>
            <MultiplayerBoardScreen
              board={board}
              yourTurn={yourTurn}
              roomCode={roomCode ?? ''}
              playerIndex={playerIndex}
              activeCell={activeCell}
              disabled={sendingGuess}
              pendingRequest={pendingRequest}
              onSelectCell={handleSelectCell}
              onExit={handleExitGame}
              onRequestReset={handleRequestReset}
              onAcceptReset={handleAcceptReset}
              onDeclineReset={handleDeclineReset}
            />

            {activeCell !== null && board && (
              <PlayerSearch
                row={board.rows[Math.floor(activeCell / 3)]}
                col={board.cols[activeCell % 3]}
                onGuess={handleGuess}
                onClose={() => setActiveCell(null)}
              />
            )}
          </>
        )}

        {screen === 'result' && board && (
          <MultiplayerResultScreen
            board={board}
            won={winner === playerIndex}
            isTie={winner === null}
            winLine={winLine}
            playerIndex={playerIndex}
            pendingRequest={pendingRequest}
            onPlayAgain={handlePlayAgain}
            onAcceptPlayAgain={handleAcceptPlayAgain}
            onDeclinePlayAgain={handleDeclinePlayAgain}
            onExit={handleExitMultiplayer}
          />
        )}
      </div>
    </main>
  )
}

function WaitingScreen({
  roomCode,
  onCancel,
}: {
  roomCode: string
  onCancel: () => void
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 pb-8 pt-12">
      <div className="mb-8 text-center">
        <p className="font-display text-[11px] tracking-[0.4em] text-[color:var(--correct)]">
          SALA CREADA
        </p>
        <h2 className="mt-2 font-display text-3xl font-700 tracking-tight text-foreground">
          ESPERANDO OPONENTE
        </h2>
      </div>

      <div className="mb-6 rounded-lg border border-border bg-card px-8 py-4">
        <p className="mb-2 text-center font-display text-[10px] tracking-[0.2em] text-muted-foreground">
          CÓDIGO DE SALA
        </p>
        <p className="text-center font-display text-4xl font-700 tracking-[0.2em] text-[color:var(--correct)]">
          {roomCode}
        </p>
      </div>

      <div className="mb-8 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span className="font-display text-xs tracking-wider">
          ESPERANDO JUGADOR…
        </span>
      </div>

      <p className="mb-6 max-w-xs text-center font-sans text-sm text-muted-foreground">
        Comparte este código con otro jugador para que se una a la partida.
      </p>

      <button
        type="button"
        onClick={onCancel}
        className="flex h-10 items-center gap-2 rounded-md border border-border px-4 font-display text-xs tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        CANCELAR
      </button>
    </div>
  )
}
