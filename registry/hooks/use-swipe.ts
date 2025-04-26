import * as React from "react"

type SwipeDirection = "left" | "right" | "up" | "down"

interface Options {
  onSwipe: (direction: SwipeDirection) => void
  threshold?: number
}

export const useSwipe = ({ onSwipe, threshold = 50 }: Options) => {
  const startX = React.useRef(0)
  const startY = React.useRef(0)
  const endX = React.useRef(0)
  const endY = React.useRef(0)

  const onStart = React.useCallback((x: number, y: number) => {
    startX.current = x
    startY.current = y
  }, [])

  const onMove = React.useCallback((x: number, y: number) => {
    endX.current = x
    endY.current = y
  }, [])

  const onEnd = React.useCallback(() => {
    const deltaX = endX.current - startX.current
    const deltaY = endY.current - startY.current

    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY)

    if (isHorizontal && Math.abs(deltaX) > threshold) {
      onSwipe(deltaX > 0 ? "right" : "left")
    } else if (!isHorizontal && Math.abs(deltaY) > threshold) {
      onSwipe(deltaY > 0 ? "down" : "up")
    }
  }, [onSwipe, threshold])

  const onTouchStart = React.useCallback(
    (e: React.TouchEvent) => {
      onStart(e.touches[0].clientX, e.touches[0].clientY)
    },
    [onStart]
  )

  const onTouchMove = React.useCallback(
    (e: React.TouchEvent) => {
      onMove(e.touches[0].clientX, e.touches[0].clientY)
    },
    [onMove]
  )

  const onTouchEnd = React.useCallback(() => {
    onEnd()
  }, [onEnd])

  const onMouseMove = React.useCallback(
    (e: MouseEvent) => {
      onMove(e.clientX, e.clientY)
    },
    [onMove]
  )

  const onMouseUp = React.useCallback(() => {
    onEnd()
    window.removeEventListener("mousemove", onMouseMove)
    window.removeEventListener("mouseup", onMouseUp)
  }, [onEnd, onMouseMove])

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      onStart(e.clientX, e.clientY)
      window.addEventListener("mousemove", onMouseMove)
      window.addEventListener("mouseup", onMouseUp)
    },
    [onStart, onMouseMove, onMouseUp]
  )

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
  }
}
