import * as React from "react"

interface Options {
  maxRetries?: number
}

export function useContinuousRetry(
  callback: () => boolean | Promise<boolean>,
  interval: number = 100,
  options?: Options
): boolean {
  const [hasResolved, setHasResolved] = React.useState(false)
  const callbackRef = React.useRef(callback)
  const intervalRef = React.useRef(interval)
  const optionsRef = React.useRef(options)
  const retryCountRef = React.useRef(0)
  const timeoutIdRef = React.useRef(0)
  const isMountedRef = React.useRef(false)

  React.useEffect(() => {
    callbackRef.current = callback
    intervalRef.current = interval
    optionsRef.current = options
  })

  React.useEffect(() => {
    isMountedRef.current = true
    retryCountRef.current = 0
    setHasResolved(false)

    const execute = async () => {
      if (!isMountedRef.current) return

      try {
        const result = callbackRef.current()
        const resolved = result instanceof Promise ? await result : result

        if (resolved) {
          if (isMountedRef.current) setHasResolved(true)
        } else {
          scheduleRetry()
        }
      } catch (error) {
        console.error("Retry callback failed:", error)
        scheduleRetry()
      }
    }

    const scheduleRetry = () => {
      if (!isMountedRef.current) return

      const maxRetries = optionsRef.current?.maxRetries
      if (maxRetries !== undefined && retryCountRef.current >= maxRetries) {
        return
      }

      retryCountRef.current += 1
      timeoutIdRef.current = window.setTimeout(execute, intervalRef.current)
    }

    timeoutIdRef.current = window.setTimeout(execute, intervalRef.current)

    return () => {
      isMountedRef.current = false
      window.clearTimeout(timeoutIdRef.current)
    }
  }, [callback, interval, options])

  return hasResolved
}
