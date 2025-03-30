import * as React from "react"

export function useMediaQuery(query: string): boolean {
  const getDefaultSnapshot = () => false

  const getServerSnapshot = React.useCallback(getDefaultSnapshot, [])

  const mediaQueryList = React.useMemo(() => {
    if (typeof window === "undefined") {
      return null
    }
    return window.matchMedia(query)
  }, [query])

  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      if (!mediaQueryList) {
        return () => {}
      }
      const listener = () => onStoreChange()
      mediaQueryList.addEventListener("change", listener)
      return () => mediaQueryList.removeEventListener("change", listener)
    },
    [mediaQueryList]
  )

  const getSnapshot = React.useCallback(() => {
    if (!mediaQueryList) {
      return getDefaultSnapshot()
    }
    return mediaQueryList.matches
  }, [mediaQueryList])

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
