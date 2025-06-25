import * as React from "react"

interface Options {
  target?: HTMLElement | Window | null
  behavior?: ScrollBehavior // "auto" | "smooth"
}

export function useScrollToTop({
  target = typeof window !== "undefined" ? window : null,
  behavior = "auto",
}: Options) {
  React.useEffect(() => {
    const el = target === window ? window : target
    if (!el) return

    if (el === window) {
      window.scrollTo({ top: 0, behavior })
    } else if ("scrollTo" in el) {
      el.scrollTo({ top: 0, behavior })
    }
  }, [target, behavior])
}
