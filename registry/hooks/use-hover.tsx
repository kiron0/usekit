import { useCallback, useEffect, useState } from "react"

type HoverRef = (node: Element | null) => void

export function useHover(): [HoverRef, boolean] {
  const [element, setElement] = useState<Element | null>(null)
  const [hovering, setHovering] = useState(false)

  const ref = useCallback<HoverRef>((node) => {
    setElement(node)
  }, [])

  useEffect(() => {
    if (!element) return

    const handleMouseEnter = () => setHovering(true)
    const handleMouseLeave = () => setHovering(false)

    element.addEventListener("mouseenter", handleMouseEnter)
    element.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter)
      element.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [element])

  return [ref, hovering]
}
