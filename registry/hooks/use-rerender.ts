import * as React from "react"

export function useRerender(): () => void {
  const [, setCount] = React.useState(0)

  return React.useCallback(() => setCount((prev) => prev + 1), [])
}
