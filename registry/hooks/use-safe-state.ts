import * as React from "react"

export function useSafeState<T>(
  initialValue: T | (() => T),
  logUnmountedUpdates: boolean = false
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, unsafeSetState] = React.useState<T>(initialValue)

  const isMounted = React.useRef(true)

  const componentName = React.useRef(
    new Error().stack?.split("\n")[2]?.match(/at (\w+)/)?.[1] ||
      "UnknownComponent"
  )

  React.useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const safeSetState = React.useCallback<
    React.Dispatch<React.SetStateAction<T>>
  >(
    (value) => {
      if (isMounted.current) {
        unsafeSetState(value)
      } else if (logUnmountedUpdates) {
        console.warn(
          `Attempted to update state on unmounted component ${componentName.current}. ` +
            `This is a no-op, but indicates a memory leak in your application.`
        )
      }
    },
    [logUnmountedUpdates]
  )

  return [state, safeSetState]
}
