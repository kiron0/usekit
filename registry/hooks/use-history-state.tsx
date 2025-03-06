import * as React from "react"

export function useHistoryState<T extends object = object>(
  initialPresent: T = {} as T
) {
  const initialObject = <T extends object>(initialPresent: T) => ({
    past: [] as T[],
    present: initialPresent,
    future: [] as T[],
  })

  const [history, setHistory] = React.useState(initialObject(initialPresent))

  const set = React.useCallback((newPresent: T) => {
    setHistory((current) => ({
      past: [...current.past, current.present],
      present: newPresent,
      future: [],
    }))
  }, [])

  const undo = React.useCallback(() => {
    setHistory((current) => {
      if (current.past.length === 0) return current
      const previous = current.past[current.past.length - 1]
      const newPast = current.past.slice(0, -1)
      return {
        past: newPast,
        present: previous,
        future: [current.present, ...current.future],
      }
    })
  }, [])

  const redo = React.useCallback(() => {
    setHistory((current) => {
      if (current.future.length === 0) return current
      const next = current.future[0]
      const newFuture = current.future.slice(1)
      return {
        past: [...current.past, current.present],
        present: next,
        future: newFuture,
      }
    })
  }, [])

  const clear = React.useCallback(() => {
    setHistory({
      past: [],
      present: initialPresent,
      future: [],
    })
  }, [initialPresent])

  return {
    state: history.present,
    set,
    undo,
    redo,
    clear,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  }
}
