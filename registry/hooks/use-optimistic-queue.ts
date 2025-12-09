import * as React from "react"

interface QueuedAction<T> {
  id: string
  action: T
  rollback?: () => void
}

export function useOptimisticQueue<T>() {
  const [queue, setQueue] = React.useState<QueuedAction<T>[]>([])
  const baseId = React.useId()
  const counterRef = React.useRef(0)

  const generateId = React.useCallback(() => {
    counterRef.current += 1
    return `${baseId}-${counterRef.current}`
  }, [baseId])

  const enqueue = React.useCallback(
    (action: T, rollback?: () => void) => {
      const id = generateId()
      setQueue((prev) => [...prev, { id, action, rollback }])
      return id
    },
    [generateId]
  )

  const confirm = React.useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const rollback = React.useCallback((id: string) => {
    setQueue((prev) => {
      const item = prev.find((item) => item.id === id)
      if (item?.rollback) {
        try {
          item.rollback()
        } catch (error) {
          console.error("Error executing rollback:", error)
        }
      }
      return prev.filter((item) => item.id !== id)
    })
  }, [])

  const clear = React.useCallback(() => {
    setQueue([])
  }, [])

  const actionsQueue = React.useMemo(
    () => queue.map((item) => item.action),
    [queue]
  )

  return {
    enqueue,
    confirm,
    rollback,
    clear,
    queue: actionsQueue,
    pending: queue,
    size: queue.length,
  }
}
