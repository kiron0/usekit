import * as React from "react"

interface Options {
  onZoom?: (scale: number) => void
  minScale?: number
  maxScale?: number
}

export const usePinchZoom = ({
  onZoom,
  minScale = 0.5,
  maxScale = 3,
}: Options = {}) => {
  const isTouchSupported =
    (typeof window !== "undefined" && "ontouchstart" in window) ||
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0)

  const [isSupported, setIsSupported] = React.useState(isTouchSupported)
  const initialDistance = React.useRef<number | null>(null)
  const lastScale = React.useRef(1)
  const [scale, setScale] = React.useState(1)

  const getDistance = (touches: TouchList) => {
    const [touch1, touch2] = [touches[0], touches[1]]
    const dx = touch2.clientX - touch1.clientX
    const dy = touch2.clientY - touch1.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const onTouchStart = React.useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      initialDistance.current = getDistance(e.touches as unknown as TouchList)
    }
  }, [])

  const onTouchMove = React.useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && initialDistance.current !== null) {
        const currentDistance = getDistance(e.touches as unknown as TouchList)
        let newScale =
          (currentDistance / initialDistance.current) * lastScale.current
        newScale = Math.min(Math.max(newScale, minScale), maxScale)

        setScale(newScale)
        onZoom?.(newScale)
      }
    },
    [minScale, maxScale, onZoom]
  )

  const onTouchEnd = React.useCallback(() => {
    lastScale.current = scale
    initialDistance.current = null
  }, [scale])

  React.useEffect(() => {
    setIsSupported(isTouchSupported)
  }, [isTouchSupported])

  if (!isTouchSupported) {
    return {
      isSupported,
    }
  }

  return {
    scale,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSupported,
  }
}
