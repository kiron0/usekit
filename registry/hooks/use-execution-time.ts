import * as React from "react"

interface Return {
  runWithTiming: <T>(fn: () => T | Promise<T>) => Promise<T>
  time: number | null
  isRunning: boolean
}

export function useExecutionTime(): Return {
  const [time, setTime] = React.useState<number | null>(null)
  const [isRunning, setIsRunning] = React.useState(false)
  const startTimeRef = React.useRef<number | null>(null)

  const runWithTiming = React.useCallback(
    async <T>(fn: () => T | Promise<T>): Promise<T> => {
      setIsRunning(true)
      startTimeRef.current = performance.now()

      try {
        const result = await fn()
        const endTime = performance.now()
        setTime(endTime - startTimeRef.current)
        return result
      } finally {
        setIsRunning(false)
        startTimeRef.current = null
      }
    },
    []
  )

  return {
    runWithTiming,
    time,
    isRunning,
  }
}
