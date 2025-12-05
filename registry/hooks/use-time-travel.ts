import * as React from "react"

type Listener = () => void

type TimeTravelSnapshot<TState = unknown> = {
  id: string
  version: number
  timestamp: number
  label?: string
  state: TState
}

interface SnapshotOptions {
  label?: string
}

interface UseTimeTravelOptions<TState> {
  maxHistory?: number
  resolver?: () => TState
  onRestore?: (state: TState) => void
}

interface UseTimeTravelReturn<TState> {
  history: TimeTravelSnapshot<TState>[]
  snapshot: (
    state?: SnapshotInput<TState>,
    options?: SnapshotOptions
  ) => TimeTravelSnapshot<TState> | undefined
  restore: (
    index?: number,
    apply?: (state: TState) => void
  ) => TState | undefined
  clear: () => void
}

type SnapshotInput<T> = T | (() => T)

const historyStore = new Map<string, TimeTravelSnapshot[]>()
const listeners = new Map<string, Set<Listener>>()

function subscribe(id: string, listener: Listener) {
  let bucket = listeners.get(id)
  if (!bucket) {
    bucket = new Set()
    listeners.set(id, bucket)
  }
  bucket.add(listener)
  return () => {
    bucket?.delete(listener)
    if (bucket && bucket.size === 0) {
      listeners.delete(id)
    }
  }
}

function emit(id: string) {
  listeners.get(id)?.forEach((listener) => listener())
}

function getHistory<TState>(id: string) {
  let history = historyStore.get(id) as TimeTravelSnapshot<TState>[] | undefined

  if (!history) {
    history = []
    historyStore.set(id, history)
  }

  return history
}

function setHistory<TState>(id: string, history: TimeTravelSnapshot<TState>[]) {
  historyStore.set(id, history)
  emit(id)
}

function updateHistory<TState>(
  id: string,
  updater: (
    current: TimeTravelSnapshot<TState>[]
  ) => TimeTravelSnapshot<TState>[]
) {
  const current = getHistory<TState>(id)
  const next = updater(current)
  setHistory(id, next)
  return next
}

function resolveInput<T>(input: SnapshotInput<T> | undefined) {
  if (typeof input === "function") {
    return (input as () => T)()
  }
  return input
}

function cloneState<T>(state: T): T {
  const structuredCloneFn =
    typeof globalThis !== "undefined"
      ? (
          globalThis as typeof globalThis & {
            structuredClone?: <Value>(value: Value) => Value
          }
        ).structuredClone
      : undefined

  if (typeof structuredCloneFn === "function") {
    return structuredCloneFn(state)
  }

  try {
    return JSON.parse(JSON.stringify(state))
  } catch {
    return state
  }
}

export function useTimeTravel<TState = unknown>(
  id: string,
  options: UseTimeTravelOptions<TState> = {}
): UseTimeTravelReturn<TState> {
  const { maxHistory = 20 } = options
  const resolverRef = React.useRef(options.resolver)
  const restoreCallbackRef = React.useRef(options.onRestore)

  React.useEffect(() => {
    resolverRef.current = options.resolver
    restoreCallbackRef.current = options.onRestore
  }, [options.onRestore, options.resolver])

  const clientSnapshotRef = React.useRef<TimeTravelSnapshot<TState>[]>(
    getHistory<TState>(id)
  )

  const subscribeStore = React.useCallback(
    (listener: Listener) => subscribe(id, listener),
    [id]
  )

  const getClientSnapshot = React.useCallback<
    () => TimeTravelSnapshot<TState>[]
  >(() => {
    const latest = getHistory<TState>(id)
    if (clientSnapshotRef.current !== latest) {
      clientSnapshotRef.current = latest
    }
    return clientSnapshotRef.current
  }, [id])

  const getServerSnapshot = React.useMemo<
    () => TimeTravelSnapshot<TState>[]
  >(() => {
    const cached = getHistory<TState>(id)
    return () => cached
  }, [id])

  const history = React.useSyncExternalStore(
    subscribeStore,
    getClientSnapshot,
    getServerSnapshot
  )

  const snapshot = React.useCallback<UseTimeTravelReturn<TState>["snapshot"]>(
    (input, snapshotOptions) => {
      const resolvedInput =
        resolveInput(input) ?? resolverRef.current?.() ?? undefined

      if (typeof resolvedInput === "undefined") {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `[useTimeTravel] Missing snapshot payload for "${id}". Pass state manually or provide a resolver.`
          )
        }
        return undefined
      }

      let nextEntry: TimeTravelSnapshot<TState> | undefined
      updateHistory<TState>(id, (current) => {
        const version = (current.at(-1)?.version ?? 0) + 1
        nextEntry = {
          id,
          version,
          timestamp: Date.now(),
          label: snapshotOptions?.label,
          state: cloneState(resolvedInput),
        }
        const next = [...current, nextEntry!]
        if (next.length > maxHistory) {
          next.shift()
        }
        return next
      })

      return nextEntry
    },
    [id, maxHistory]
  )

  const restore = React.useCallback<UseTimeTravelReturn<TState>["restore"]>(
    (index, apply) => {
      if (history.length === 0) {
        return undefined
      }

      const target =
        typeof index === "number"
          ? history.at(index >= 0 ? index : history.length + index)
          : history.at(-1)

      if (!target) {
        return undefined
      }

      const cloned = cloneState(target.state)
      const callback = apply ?? restoreCallbackRef.current
      callback?.(cloned)
      return cloned
    },
    [history]
  )

  const clear = React.useCallback(() => {
    if (history.length === 0) {
      return
    }
    setHistory(id, [])
  }, [history.length, id])

  return {
    history,
    snapshot,
    restore,
    clear,
  }
}

export type { TimeTravelSnapshot, UseTimeTravelOptions, UseTimeTravelReturn }
