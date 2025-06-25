import * as React from "react"

interface Return<T> {
  result: T | null
  error: Error | null
  isRunning: boolean
  run: (data: any) => void
}

export function useWorker<T>(workerScript: string): Return<T> {
  const [result, setResult] = React.useState<T | null>(null)
  const [error, setError] = React.useState<Error | null>(null)
  const [isRunning, setIsRunning] = React.useState(false)
  const workerRef = React.useRef<Worker | null>(null)

  React.useEffect(() => {
    workerRef.current = new Worker(workerScript)
    workerRef.current.onmessage = (e: MessageEvent) => {
      setResult(e.data)
      setIsRunning(false)
    }
    workerRef.current.onerror = (e: ErrorEvent) => {
      setError(new Error(e.message))
      setIsRunning(false)
    }
    return () => workerRef.current?.terminate()
  }, [workerScript])

  const run = React.useCallback((data: any) => {
    if (workerRef.current) {
      setIsRunning(true)
      workerRef.current.postMessage(data)
    }
  }, [])

  return { result, error, isRunning, run }
}
