import * as React from "react"

import { useCallbackRef } from "./use-callback-ref"

interface Props<T> {
  defaultProp?: T
  onChange?: (state: T) => void
}

export function useUncontrolledState<T>({ defaultProp, onChange }: Props<T>) {
  const [state, setState] = React.useState(defaultProp)
  const prevStateRef = React.useRef(state)
  const handleChange = useCallbackRef(onChange)

  React.useEffect(() => {
    if (prevStateRef.current !== state && state !== undefined) {
      handleChange(state)
      prevStateRef.current = state
    }
  }, [state, handleChange])

  const setStateOptimized = React.useCallback(
    (value: React.SetStateAction<T | undefined>) => {
      setState((prev) => {
        const nextValue =
          typeof value === "function"
            ? (value as (prevState: T | undefined) => T | undefined)(prev)
            : value

        if (Object.is(prev, nextValue)) {
          return prev
        }
        return nextValue
      })
    },
    []
  )

  return [state, setStateOptimized] as const
}
