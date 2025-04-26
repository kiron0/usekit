import * as React from "react"

interface Options {
  minDelay: number
  maxDelay: number
}

export function useRandomInterval(
  cb: () => void,
  options: Options
): () => void {
  const { minDelay, maxDelay } = options
  const timeoutId = React.useRef<number>(0)
  const isMounted = React.useRef(false)
  const savedCallback = React.useRef(cb)

  React.useEffect(() => {
    savedCallback.current = cb
  }, [cb])

  const clear = React.useCallback(() => {
    window.clearTimeout(timeoutId.current)
    isMounted.current = false
  }, [])

  React.useEffect(() => {
    isMounted.current = true

    const getRandomNumber = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min

    const tick = () => {
      if (!isMounted.current) return

      savedCallback.current()

      const nextTick = () => {
        timeoutId.current = window.setTimeout(
          tick,
          getRandomNumber(minDelay, maxDelay)
        )
      }

      nextTick()
    }

    timeoutId.current = window.setTimeout(
      tick,
      getRandomNumber(minDelay, maxDelay)
    )

    return clear
  }, [minDelay, maxDelay, clear])

  return clear
}
