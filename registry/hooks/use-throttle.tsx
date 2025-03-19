import React from "react"

export function useThrottle<T>(value: T, interval: number = 500): T {
  const [throttledValue, setThrottledValue] = React.useState(value)
  const lastUpdated = React.useRef<number | null>(null)
  const timeoutId = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    const now = Date.now()

    if (lastUpdated.current === null || now >= lastUpdated.current + interval) {
      lastUpdated.current = now
      setThrottledValue(value)
    } else {
      const remainingTime = lastUpdated.current + interval - now

      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }

      timeoutId.current = setTimeout(() => {
        lastUpdated.current = Date.now()
        setThrottledValue(value)
      }, remainingTime)
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }
    }
  }, [value, interval])

  return throttledValue
}
