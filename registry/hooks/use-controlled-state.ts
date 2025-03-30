import * as React from "react"

import { useCallbackRef } from "./use-callback-ref"
import { useUncontrolledState } from "./use-uncontrolled-state"

interface UseControlledStateParams<T> {
  prop?: T
  defaultProp?: T
  onChange?: (state: T) => void
}

export function useControlledState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControlledStateParams<T>) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({
    defaultProp,
    onChange,
  })

  const isControlled = prop !== undefined
  const value = isControlled ? prop : uncontrolledProp
  const handleChange = useCallbackRef(onChange)

  const setValue = React.useCallback(
    (nextValue: React.SetStateAction<T | undefined>) => {
      if (isControlled) {
        const newValue =
          typeof nextValue === "function"
            ? (nextValue as (prevState?: T) => T)(prop)
            : nextValue

        if (!Object.is(prop, newValue) && newValue !== undefined) {
          handleChange(newValue)
        }
      } else {
        setUncontrolledProp(nextValue)
      }
    },
    [isControlled, prop, setUncontrolledProp, handleChange]
  )

  return [value, setValue] as const
}
