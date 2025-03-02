import { useEffect, useRef } from "react"

type Options = {
  ms: number
  when: boolean
  startImmediately?: boolean
}

export function useIntervalWhen(
  cb: () => void,
  { ms, when, startImmediately = false }: Options
): () => void {
  const savedCb = useRef(cb)
  const intervalId = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    savedCb.current = cb
  }, [cb])

  useEffect(() => {
    if (when) {
      if (startImmediately) {
        savedCb.current()
      }

      intervalId.current = setInterval(() => {
        savedCb.current()
      }, ms)
    } else {
      if (intervalId.current) {
        clearInterval(intervalId.current)
        intervalId.current = null
      }
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current)
        intervalId.current = null
      }
    }
  }, [ms, when, startImmediately])

  return () => {
    if (intervalId.current) {
      clearInterval(intervalId.current)
      intervalId.current = null
    }
  }
}
