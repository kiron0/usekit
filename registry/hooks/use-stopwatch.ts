import * as React from "react"

const addLeadingZero = (digit: number): string => {
  return digit.toString().padStart(2, "0")
}

interface Stopwatch {
  current: string
  isPaused: boolean
  currentDays: number
  currentHours: number
  currentMinutes: number
  currentSeconds: number
  elapsedSeconds: number
  pause: () => void
  play: () => void
  reset: () => void
  togglePause: () => void
}

export const useStopwatch = (): Stopwatch => {
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0)
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    if (paused) {
      return
    }
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [paused])

  const timeComponents = React.useMemo(() => {
    const days = Math.floor(elapsedSeconds / 86400)
    const hours = Math.floor((elapsedSeconds % 86400) / 3600)
    const minutes = Math.floor((elapsedSeconds % 3600) / 60)
    const seconds = elapsedSeconds % 60
    return { days, hours, minutes, seconds }
  }, [elapsedSeconds])

  const { days, hours, minutes, seconds } = timeComponents
  const divider = ":"
  const current = `${addLeadingZero(days)}${divider}${addLeadingZero(hours)}${divider}${addLeadingZero(minutes)}${divider}${addLeadingZero(seconds)}`

  return {
    current,
    isPaused: paused,
    currentDays: days,
    currentHours: hours,
    currentMinutes: minutes,
    currentSeconds: seconds,
    elapsedSeconds,
    pause: () => setPaused(true),
    play: () => setPaused(false),
    reset: () => {
      setElapsedSeconds(0)
    },
    togglePause: () => setPaused((prev) => !prev),
  }
}
