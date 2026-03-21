import * as React from "react"

export interface UseBroadcastChannelOptions<T> {
  onMessage?: (data: T) => void
  onMessageError?: (event: Event) => void
}

export interface UseBroadcastChannelResult<T> {
  isSupported: boolean
  isClosed: boolean
  lastMessage: T | null
  error: Error | null
  postMessage: (message: T) => boolean
  close: () => void
}

function toError(error: unknown, fallback: string) {
  return error instanceof Error ? error : new Error(fallback)
}

export function useBroadcastChannel<T>(
  name: string,
  options: UseBroadcastChannelOptions<T> = {}
): UseBroadcastChannelResult<T> {
  const [lastMessage, setLastMessage] = React.useState<T | null>(null)
  const [error, setError] = React.useState<Error | null>(null)
  const [isClosed, setIsClosed] = React.useState(false)
  const channelRef = React.useRef<BroadcastChannel | null>(null)
  const optionsRef = React.useRef(options)
  const isSupported = typeof BroadcastChannel !== "undefined"

  React.useEffect(() => {
    optionsRef.current = options
  }, [options])

  const close = React.useCallback(() => {
    const channel = channelRef.current

    if (!channel) {
      setIsClosed(true)
      return
    }

    channel.onmessage = null
    channel.onmessageerror = null
    channel.close()
    channelRef.current = null
    setIsClosed(true)
  }, [])

  const postMessage = React.useCallback(
    (message: T) => {
      const channel = channelRef.current

      if (!channel) {
        setError(
          new Error(
            isSupported
              ? "Broadcast channel is not active."
              : "BroadcastChannel is not supported in this browser."
          )
        )
        return false
      }

      try {
        channel.postMessage(message)
        return true
      } catch (error) {
        setError(toError(error, "Failed to post broadcast message."))
        return false
      }
    },
    [isSupported]
  )

  React.useEffect(() => {
    if (!isSupported) {
      setIsClosed(true)
      return
    }

    setError(null)
    setIsClosed(false)

    const channel = new BroadcastChannel(name)
    channelRef.current = channel

    channel.onmessage = (event: MessageEvent<T>) => {
      setLastMessage(event.data)
      optionsRef.current.onMessage?.(event.data)
    }

    channel.onmessageerror = (event) => {
      setError(new Error("Failed to receive broadcast message."))
      optionsRef.current.onMessageError?.(event)
    }

    return () => {
      channel.onmessage = null
      channel.onmessageerror = null
      channel.close()

      if (channelRef.current === channel) {
        channelRef.current = null
        setIsClosed(true)
      }
    }
  }, [isSupported, name])

  return {
    isSupported,
    isClosed,
    lastMessage,
    error,
    postMessage,
    close,
  }
}
