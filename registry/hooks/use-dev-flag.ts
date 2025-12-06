import * as React from "react"

export function useDevFlag(): boolean {
  return React.useMemo(() => {
    return process.env.NODE_ENV === "development"
  }, [])
}
