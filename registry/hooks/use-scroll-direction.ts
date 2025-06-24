import * as React from "react"

type Direction = "up" | "down"

interface Options {
  initialDirection?: Direction
  threshold?: number
  target?: HTMLElement | Window | null
}

export function useScrollDirection({
  initialDirection = "up",
  threshold = 0,
  target = typeof window !== "undefined" ? window : null,
}: Options = {}) {
  const [direction, setDirection] = React.useState<Direction>(initialDirection)
  const lastScrollY = React.useRef(0)

  React.useEffect(() => {
    const element = target === window ? window : target
    if (!element) return

    const handleScroll = () => {
      const currentY =
        target === window ? window.scrollY : (target as HTMLElement).scrollTop

      const diff = currentY - lastScrollY.current

      if (Math.abs(diff) > threshold) {
        setDirection(diff > 0 ? "down" : "up")
        lastScrollY.current = currentY
      }
    }

    element.addEventListener("scroll", handleScroll)
    return () => element.removeEventListener("scroll", handleScroll)
  }, [target, threshold])

  return direction
}
