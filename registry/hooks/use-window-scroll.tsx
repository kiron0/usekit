import * as React from "react"

interface ScrollState {
  x: number | null
  y: number | null
}

interface ScrollToOptions {
  top?: number
  left?: number
  behavior?: ScrollBehavior
}

type ScrollToFunction = (
  optionsOrX: ScrollToOptions | number,
  y?: number,
  behavior?: ScrollBehavior
) => void

export function useWindowScroll(): [ScrollState, ScrollToFunction] {
  const [state, setState] = React.useState<ScrollState>({
    x: null,
    y: null,
  })

  const scrollTo: ScrollToFunction = React.useCallback((...args) => {
    if (typeof window === "undefined") return

    if (typeof args[0] === "object") {
      window.scrollTo(args[0])
    } else if (typeof args[0] === "number" && typeof args[1] === "number") {
      const [x, y, behavior] = args as [
        number,
        number,
        ScrollBehavior | undefined,
      ]
      window.scrollTo({ top: y, left: x, behavior })
    } else {
      throw new Error(
        `Invalid arguments passed to scrollTo. See: https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo`
      )
    }
  }, [])

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      setState({ x: window.scrollX, y: window.scrollY })
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return [state, scrollTo]
}
