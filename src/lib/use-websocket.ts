import { useCallback, useEffect, useRef, useState } from 'react'

export interface WsBoardCategory {
  kind: string
  label: string
  value: string
}

export interface WsBoardCell {
  answered: boolean
  player_alias?: string
  team_name?: string
  avatar_url?: string
  last_guess_alias?: string
  last_guess_wrong: boolean
  owner_player?: number
}

export interface WsBoard {
  id: string
  rows: WsBoardCategory[]
  cols: WsBoardCategory[]
  cells: WsBoardCell[][]
}

export interface WsMessage {
  type: string
  code?: string
  player_index?: number
  your_turn?: boolean
  board?: WsBoard
  row?: number
  col?: number
  correct?: boolean
  player_alias?: string
  team_name?: string
  avatar_url?: string
  winner?: number
  win_line?: number[]
  message?: string
  from_player?: number
}

type WsHandler = (msg: WsMessage) => void

export function useWebSocket(url: string) {
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const handlersRef = useRef<Map<string, WsHandler[]>>(new Map())
  const onMessageRef = useRef<((msg: WsMessage) => void) | null>(null)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    const ws = new WebSocket(url)
    const instance = ws
    wsRef.current = ws

    ws.onopen = () => {
      if (wsRef.current === instance) setConnected(true)
    }
    ws.onclose = () => {
      if (wsRef.current === instance) setConnected(false)
    }
    ws.onerror = () => {
      if (wsRef.current === instance) ws.close()
    }

    ws.onmessage = (event) => {
      try {
        const msg: WsMessage = JSON.parse(event.data)

        const typeHandlers = handlersRef.current.get(msg.type)
        if (typeHandlers) {
          typeHandlers.forEach((h) => h(msg))
        }

        if (onMessageRef.current) {
          onMessageRef.current(msg)
        }
      } catch {
        // ignore parse errors
      }
    }
  }, [url])

  const disconnect = useCallback(() => {
    const ws = wsRef.current
    if (ws) {
      ws.onopen = null
      ws.onclose = null
      ws.onerror = null
      if (ws.readyState !== WebSocket.CONNECTING) {
        ws.close()
      }
    }
    wsRef.current = null
    setConnected(false)
  }, [])

  const send = useCallback((data: Record<string, unknown>): boolean => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
      return true
    }
    return false
  }, [])

  const on = useCallback((type: string, handler: WsHandler) => {
    const existing = handlersRef.current.get(type) ?? []
    existing.push(handler)
    handlersRef.current.set(type, existing)

    return () => {
      const list = handlersRef.current.get(type)
      if (list) {
        handlersRef.current.set(type, list.filter((h) => h !== handler))
      }
    }
  }, [])

  const setGlobalHandler = useCallback((handler: (msg: WsMessage) => void) => {
    onMessageRef.current = handler
  }, [])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return { connected, connect, disconnect, send, on, setGlobalHandler }
}
