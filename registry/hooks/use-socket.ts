import * as React from "react"
import * as Socket from "socket.io-client"

interface Options {
  withCredentials?: boolean
  transports?: string[]
  reconnection?: boolean
  reconnectionDelay?: number // in ms
  autoConnect?: boolean
  timeout?: number // in ms
}

interface Return {
  socket: Socket.Socket | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
}

export function useSocket(url: string, options: Options = {}): Return {
  const [socket, setSocket] = React.useState<Socket.Socket | null>(null)
  const [isConnected, setIsConnected] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const socketInstance = Socket.io(url, {
      withCredentials: options.withCredentials ?? true,
      transports: options.transports ?? ["websocket", "polling"],
      reconnection: options.reconnection ?? true,
      reconnectionDelay: options.reconnectionDelay ?? 1000,
      autoConnect: options.autoConnect ?? true,
      timeout: options.timeout ?? 10000,
    })

    socketInstance.on("connect", () => {
      setIsConnected(true)
      console.log("Socket connected:", socketInstance.id)
    })

    socketInstance.on("disconnect", (reason) => {
      setIsConnected(false)
      console.log("Socket disconnected:", reason)
    })

    socketInstance.on("connect_error", (error) => {
      setIsConnected(false)
      console.error("Socket connection error:", error)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.off("connect")
      socketInstance.off("disconnect")
      socketInstance.off("connect_error")
      socketInstance.disconnect()
    }
  }, [
    url,
    options.withCredentials,
    options.transports,
    options.reconnection,
    options.reconnectionDelay,
    options.autoConnect,
    options.timeout,
  ])

  const connect = React.useCallback(() => {
    if (socket) {
      socket.connect()
    }
  }, [socket])

  const disconnect = React.useCallback(() => {
    socket?.disconnect()
  }, [socket])

  return { socket, isConnected, connect, disconnect }
}
