import * as React from "react"

type Listener = () => void

export interface TinyReduxStore<TState> {
  get: () => TState
  set: (updater: TState | ((prev: TState) => TState)) => void
  subscribe: (listener: Listener) => () => void
}

export function createTinyReduxStore<TState>(
  initialState: TState
): TinyReduxStore<TState> {
  let state = initialState
  const listeners = new Set<Listener>()

  const get = () => state

  const set: TinyReduxStore<TState>["set"] = (updater) => {
    const next =
      typeof updater === "function"
        ? (updater as (prev: TState) => TState)(state)
        : updater

    if (Object.is(next, state)) return
    state = next
    listeners.forEach((listener) => listener())
  }

  const subscribe: TinyReduxStore<TState>["subscribe"] = (listener) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  return { get, set, subscribe }
}

export interface UseTinyReduxOptions<TState, TSelected> {
  selector?: (state: TState) => TSelected
}

export function useTinyRedux<TState, TSelected = TState>(
  store: TinyReduxStore<TState>,
  options: UseTinyReduxOptions<TState, TSelected> = {}
): {
  state: TSelected
  get: TinyReduxStore<TState>["get"]
  set: TinyReduxStore<TState>["set"]
  subscribe: TinyReduxStore<TState>["subscribe"]
} {
  const { selector } = options

  const getSnapshot = React.useCallback((): TSelected => {
    const value = store.get()
    return selector ? selector(value) : (value as unknown as TSelected)
  }, [selector, store])

  const state = React.useSyncExternalStore(
    store.subscribe,
    getSnapshot,
    getSnapshot
  )

  return React.useMemo(
    () => ({
      state,
      get: store.get,
      set: store.set,
      subscribe: store.subscribe,
    }),
    [state, store.get, store.set, store.subscribe]
  )
}
