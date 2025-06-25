import * as React from "react"

export function useDomReady(callback: () => void): void {
  React.useEffect(() => {
    if (typeof document === "undefined") return

    if (
      document.readyState === "interactive" ||
      document.readyState === "complete"
    ) {
      callback()
      return
    } else {
      const handleReady = () => {
        if (
          document.readyState === "interactive" ||
          document.readyState === "complete"
        ) {
          callback()
          document.removeEventListener("DOMContentLoaded", handleReady)
        }
      }

      document.addEventListener("DOMContentLoaded", handleReady)
      return () => document.removeEventListener("DOMContentLoaded", handleReady)
    }
  }, [callback])
}
