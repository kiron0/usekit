import * as React from "react"

export function useQueue<T>(initialValue: T[] = []) {
  const [queue, setQueue] = React.useState<T[]>(initialValue)

  const add = React.useCallback((element: T) => {
    setQueue((q) => [...q, element])
  }, [])

  const remove = React.useCallback(() => {
    let removedElement: T | undefined

    setQueue(([first, ...rest]) => {
      removedElement = first
      return rest
    })

    return removedElement
  }, [])

  const clear = React.useCallback(() => {
    setQueue([])
  }, [])

  return {
    add,
    remove,
    clear,
    first: queue[0],
    last: queue[queue.length - 1],
    size: queue.length,
    queue,
  }
}

export interface Queue<T> {
  add: (element: T) => void
  remove: () => T | undefined
  clear: () => void
  first: T | undefined
  last: T | undefined
  size: number
  queue: T[]
}
