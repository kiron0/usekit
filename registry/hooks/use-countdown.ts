import * as React from "react"

export interface CountdownOptions {
  interval?: number
  onTick?: (timeRemaining: number) => void
  onComplete?: (timeRemaining: number) => void
}

export interface UseCountdownReturn {
  remaining: number
  isPaused: boolean

  pause: () => void

  resume: () => void
}

export function useCountdown(
  endTime: Date | number,
  options?: CountdownOptions
): UseCountdownReturn {
  const { interval: intervalOption = 1000, onTick, onComplete } = options || {}

  const endTimestamp = endTime instanceof Date ? endTime.getTime() : endTime

  const [paused, setPaused] = React.useState(false)
  const [remaining, setRemaining] = React.useState(
    () => endTimestamp - Date.now()
  )

  const onTickRef = React.useRef(onTick)
  const onCompleteRef = React.useRef(onComplete)
  const completedRef = React.useRef(false)
  const pausedRef = React.useRef(paused)

  const totalPausedMsRef = React.useRef(0)
  const pauseStartedAtRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    onTickRef.current = onTick
    onCompleteRef.current = onComplete
  }, [onTick, onComplete])

  React.useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  React.useEffect(() => {
    totalPausedMsRef.current = 0
    pauseStartedAtRef.current = null
  }, [endTimestamp])

  const remainingFromClock = React.useCallback(
    () => endTimestamp + totalPausedMsRef.current - Date.now(),
    [endTimestamp]
  )

  React.useEffect(() => {
    if (paused) {
      return
    }

    const calculateRemaining = () => remainingFromClock()
    let live = calculateRemaining()

    setRemaining(live)

    if (live <= 0) {
      if (!completedRef.current) {
        completedRef.current = true
        onCompleteRef.current?.(live)
      }
      return
    }

    completedRef.current = false

    const intervalId = setInterval(() => {
      if (pausedRef.current) {
        return
      }

      live = calculateRemaining()

      if (live <= 0) {
        setRemaining(live)
        if (!completedRef.current) {
          completedRef.current = true
          onCompleteRef.current?.(live)
        }
        clearInterval(intervalId)
      } else {
        setRemaining(live)
        onTickRef.current?.(live)
      }
    }, intervalOption)

    return () => {
      clearInterval(intervalId)
    }
  }, [endTimestamp, intervalOption, paused, remainingFromClock])

  const pause = React.useCallback(() => {
    pauseStartedAtRef.current = Date.now()
    pausedRef.current = true
    setPaused(true)
  }, [])

  const resume = React.useCallback(() => {
    const started = pauseStartedAtRef.current
    if (started !== null) {
      totalPausedMsRef.current += Date.now() - started
      pauseStartedAtRef.current = null
    }
    completedRef.current = false
    pausedRef.current = false
    setPaused(false)
    setRemaining(remainingFromClock())
  }, [remainingFromClock])

  return {
    remaining,
    isPaused: paused,
    pause,
    resume,
  }
}
