import * as React from "react"

export function useMediaQuery(query: string): boolean {
  if (typeof window === "undefined") {
    throw new Error("useMediaQuery can only be used on the client side")
  }

  const mediaQueryList = React.useMemo(() => window.matchMedia(query), [query])

  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const listener = () => onStoreChange()
      mediaQueryList.addEventListener("change", listener)
      return () => mediaQueryList.removeEventListener("change", listener)
    },
    [mediaQueryList]
  )

  const getSnapshot = React.useCallback(
    () => mediaQueryList.matches,
    [mediaQueryList]
  )

  return React.useSyncExternalStore(subscribe, getSnapshot)
}
