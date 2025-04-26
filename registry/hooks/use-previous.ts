import * as React from "react"

export function usePrevious<T>(
  newValue: T,
  initialPreviousValue?: T | null
): T | null | undefined {
  const previousRef = React.useRef<T | null | undefined>(
    initialPreviousValue ?? null
  )

  React.useEffect(() => {
    previousRef.current = newValue
  }, [newValue])

  return previousRef.current
}
