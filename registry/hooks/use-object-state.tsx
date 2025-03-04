import * as React from "react"

function isPlainObject(obj: any): obj is object {
  return typeof obj === "object" && obj !== null && obj.constructor === Object
}

export function useObjectState<T extends object>(
  initialValue: T
): [T, (update: Partial<T> | ((prevState: T) => Partial<T>)) => void] {
  const [state, setState] = React.useState<T>(initialValue)

  const handleUpdate = React.useCallback(
    (arg: Partial<T> | ((prevState: T) => Partial<T>)) => {
      if (typeof arg === "function") {
        setState((prev) => {
          const update = arg(prev)
          return isPlainObject(update) ? { ...prev, ...update } : prev
        })
      } else {
        setState((prev) => ({ ...prev, ...arg }))
      }
    },
    []
  )

  return [state, handleUpdate]
}
