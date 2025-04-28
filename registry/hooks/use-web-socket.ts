import * as React from "react"

interface Options {
  onOpen?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onError?: (event: Event) => void
  onMessage?: (event: MessageEvent) => void
  reconnectInterval?: number // in ms
  shouldReconnect?: boolean
}

export function useWebSocket(url: string, options?: Options) {
  const [isConnected, setIsConnected] = React.useState(false)
  const [lastMessage, setLastMessage] = React.useState<MessageEvent | null>(
    null
  )
  const websocketRef = React.useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = React.useRef<number | null>(null)

  const connect = React.useCallback(() => {
    websocketRef.current = new WebSocket(url)

    websocketRef.current.onopen = (event) => {
      setIsConnected(true)
      options?.onOpen?.(event)
    }

    websocketRef.current.onmessage = (event) => {
      setLastMessage(event)
      options?.onMessage?.(event)
    }

    websocketRef.current.onerror = (event) => {
      options?.onError?.(event)
    }

    websocketRef.current.onclose = (event) => {
      setIsConnected(false)
      options?.onClose?.(event)

      if (options?.shouldReconnect) {
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connect()
        }, options.reconnectInterval ?? 3000)
      }
    }
  }, [url, options])

  const sendMessage = React.useCallback(
    (message: string | ArrayBufferLike | Blob | ArrayBufferView) => {
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(message)
      } else {
        console.warn("WebSocket is not open. Unable to send message.")
      }
    },
    []
  )

  const disconnect = React.useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    websocketRef.current?.close()
  }, [])

  React.useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    isConnected,
    lastMessage,
    sendMessage,
    disconnect,
  }
}
