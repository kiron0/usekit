import * as React from "react"

interface IdleDeadlineLike {
  didTimeout: boolean
  timeRemaining: () => number
}

interface UseIdleCallbackOptions {
  timeout?: number
  autoStart?: boolean
}

interface UseIdleCallbackResult {
  isSupported: boolean
  isPending: boolean
  didTimeout: boolean
  start: () => boolean
  cancel: () => void
}

type IdleCallbackHandle = number

function isIdleCallbackSupported() {
  if (typeof window === "undefined") return false
  return (
    typeof window.requestIdleCallback === "function" &&
    typeof window.cancelIdleCallback === "function"
  )
}

export function useIdleCallback(
  callback: (deadline: IdleDeadlineLike) => void,
  options: UseIdleCallbackOptions = {}
): UseIdleCallbackResult {
  const { timeout, autoStart = true } = options
  const callbackRef = React.useRef(callback)
  const handleRef = React.useRef<IdleCallbackHandle | null>(null)
  const [isPending, setIsPending] = React.useState(false)
  const [didTimeout, setDidTimeout] = React.useState(false)
  const isSupported = React.useMemo(() => isIdleCallbackSupported(), [])

  React.useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const cancel = React.useCallback(() => {
    if (!isSupported) {
      setIsPending(false)
      return
    }

    if (handleRef.current !== null) {
      window.cancelIdleCallback(handleRef.current)
      handleRef.current = null
    }

    setIsPending(false)
  }, [isSupported])

  const start = React.useCallback(() => {
    if (!isSupported) return false
    if (handleRef.current !== null) return true

    setDidTimeout(false)
    setIsPending(true)

    handleRef.current = window.requestIdleCallback(
      (deadline) => {
        handleRef.current = null
        setIsPending(false)
        setDidTimeout(deadline.didTimeout)
        callbackRef.current(deadline)
      },
      timeout != null ? { timeout } : undefined
    )

    return true
  }, [isSupported, timeout])

  React.useEffect(() => {
    if (autoStart) {
      start()
    }

    return () => {
      cancel()
    }
  }, [autoStart, cancel, start])

  return {
    isSupported,
    isPending,
    didTimeout,
    start,
    cancel,
  }
}
