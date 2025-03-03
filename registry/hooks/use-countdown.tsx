import * as React from "react"

type CountdownOptions = {
  interval?: number
  onTick?: (timeRemaining: number) => void
  onComplete?: (timeRemaining: number) => void
}

export function useCountdown(
  endTime: Date | number,
  options?: CountdownOptions
): number {
  const { interval: intervalOption = 1000, onTick, onComplete } = options || {}

  const endTimestamp = endTime instanceof Date ? endTime.getTime() : endTime

  const [count, setCount] = React.useState(endTimestamp - Date.now())

  const onTickRef = React.useRef(onTick)
  const onCompleteRef = React.useRef(onComplete)

  React.useEffect(() => {
    onTickRef.current = onTick
    onCompleteRef.current = onComplete
  }, [onTick, onComplete])

  React.useEffect(() => {
    const calculateRemaining = () => endTimestamp - Date.now()
    let remaining = calculateRemaining()

    setCount(remaining)

    if (remaining <= 0) {
      onCompleteRef.current?.(remaining)
      return
    }

    const intervalId = setInterval(() => {
      remaining = calculateRemaining()

      if (remaining <= 0) {
        setCount(remaining)
        onCompleteRef.current?.(remaining)
        clearInterval(intervalId)
      } else {
        setCount(remaining)
        onTickRef.current?.(remaining)
      }
    }, intervalOption)

    return () => clearInterval(intervalId)
  }, [endTimestamp, intervalOption])

  return count
}
