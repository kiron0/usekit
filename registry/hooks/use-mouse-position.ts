import * as React from "react"

import { useIsMobile } from "./use-is-mobile"

export interface Position {
  x: number
  y: number
  elementX?: number
  elementY?: number
  elementPositionX?: number
  elementPositionY?: number
}

interface Return<T extends HTMLElement> {
  state: Position
  ref: React.Ref<T>
  isSupported: boolean
}

export function useMousePosition<T extends HTMLElement>(): Return<T> {
  const isMobile = useIsMobile()

  const [isSupported, setIsSupported] = React.useState(true)

  const [state, setState] = React.useState<Position>({
    x: 0,
    y: 0,
  })

  const ref = React.useRef<T>(null)

  React.useEffect(() => {
    if (isMobile) {
      setIsSupported(false)
      return
    }

    const handleMouseMove = (event: MouseEvent) => {
      const newState: Position = {
        x: event.pageX,
        y: event.pageY,
      }

      if (ref.current?.nodeType === Node.ELEMENT_NODE) {
        const { left, top } = ref.current.getBoundingClientRect()
        const elementPositionX = left + window.scrollX
        const elementPositionY = top + window.scrollY
        const elementX = event.pageX - elementPositionX
        const elementY = event.pageY - elementPositionY

        newState.elementPositionX = elementPositionX
        newState.elementPositionY = elementPositionY
        newState.elementX = elementX
        newState.elementY = elementY
      }

      setState((s) => ({
        ...s,
        ...newState,
      }))
    }

    document.addEventListener("mousemove", handleMouseMove)

    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [isMobile])

  return { state, ref, isSupported }
}
