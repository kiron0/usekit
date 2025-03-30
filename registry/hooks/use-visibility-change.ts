import * as React from "react"

export function useVisibilityChange(): boolean {
  const [isVisible, setIsVisible] = React.useState(() => {
    if (typeof document === "undefined") return true
    return document.visibilityState === "visible"
  })

  React.useEffect(() => {
    if (typeof document === "undefined") return

    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible")
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return isVisible
}
