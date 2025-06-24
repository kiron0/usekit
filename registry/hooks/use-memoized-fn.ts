import * as React from "react"

export function useMemoizedFn<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  const fnRef = React.useRef(fn)
  const cleanupRef = React.useRef<(() => void) | null>(null)

  React.useEffect(() => {
    fnRef.current = fn
  }, [fn])

  const memoizedFn = React.useCallback(
    (...args: Parameters<T>): ReturnType<T> => {
      cleanupRef.current?.()
      cleanupRef.current = null
      const result = fnRef.current(...args)
      if (typeof result === "function") {
        cleanupRef.current = result as () => void
      }
      return result
    },
    []
  )

  React.useEffect(() => {
    return () => cleanupRef.current?.()
  }, [])

  return memoizedFn
}
