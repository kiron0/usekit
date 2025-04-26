import * as React from "react"

export function useDefault<T>(initialState: T, defaultState: T) {
  const [state, setState] = React.useState<T>(initialState)

  const setDefaultState = (newState: T | null) => {
    if (newState === null || newState === undefined) {
      setState(defaultState)
    } else {
      setState(newState)
    }
  }

  return [state, setDefaultState] as const
}
