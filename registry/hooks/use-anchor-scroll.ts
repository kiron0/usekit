import * as React from "react"

export function useAnchorScroll() {
  const scrollToId = React.useCallback((id: string) => {
    if (typeof window === "undefined") return

    const element = document.getElementById(id)
    if (!element) return

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }, [])

  return { scrollToId }
}
