import * as React from "react"

export interface MemoryInfo {
  readonly jsHeapSizeLimit: number
  readonly totalJSHeapSize: number
  readonly usedJSHeapSize: number
  [Symbol.toStringTag]: "MemoryInfo"
}

interface Options {
  interval?: number
  immediate?: boolean
}

type PerformanceMemory = Performance & { memory: MemoryInfo }

export function useMemory({
  interval = 1000,
  immediate = false,
}: Options = {}): {
  isSupported: boolean
  memory: MemoryInfo | undefined
} {
  const [memory, setMemory] = React.useState<MemoryInfo>()
  const isSupported =
    typeof performance !== "undefined" && "memory" in performance

  const updateMemory = React.useCallback(() => {
    if (isSupported) {
      setMemory((performance as PerformanceMemory).memory)
    }
  }, [isSupported])

  React.useEffect(() => {
    if (!isSupported) return

    if (immediate) updateMemory()
    const intervalId = setInterval(updateMemory, interval)

    return () => clearInterval(intervalId)
  }, [isSupported, interval, immediate, updateMemory])

  return { isSupported, memory }
}
