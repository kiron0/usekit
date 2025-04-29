import * as React from "react"

interface Options<T extends HTMLElement> {
  canDrag?: (element: T) => boolean
}

interface Return<T extends HTMLElement> {
  ref: React.RefObject<T | null>
  isDragging: boolean
}

export function useDraggable<T extends HTMLElement>(
  options: Options<T> = {}
): Return<T> {
  const { canDrag } = options

  const ref = React.useRef<T>(null)

  const [isDragging, setIsDragging] = React.useState(false)

  const positionRef = React.useRef({ x: 0, y: 0 })

  const eventListeners = React.useRef<{
    move?: (e: MouseEvent | TouchEvent) => void
    up?: () => void
  }>({})

  React.useEffect(() => {
    return () => {
      if (eventListeners.current.move) {
        document.removeEventListener("mousemove", eventListeners.current.move)
        document.removeEventListener("touchmove", eventListeners.current.move)
      }
      if (eventListeners.current.up) {
        document.removeEventListener("mouseup", eventListeners.current.up)
        document.removeEventListener("touchend", eventListeners.current.up)
      }
    }
  }, [])

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false)
    if (eventListeners.current.move) {
      document.removeEventListener("mousemove", eventListeners.current.move)
      document.removeEventListener("touchmove", eventListeners.current.move)
    }
    if (eventListeners.current.up) {
      document.removeEventListener("mouseup", eventListeners.current.up)
      document.removeEventListener("touchend", eventListeners.current.up)
    }
    eventListeners.current = {}
  }, [])

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const element = ref.current
    if (!element) return

    const handleStart = (e: MouseEvent | TouchEvent) => {
      const isTouchEvent = e.type === "touchstart"
      const clientX = isTouchEvent
        ? (e as TouchEvent).touches[0].clientX
        : (e as MouseEvent).clientX
      const clientY = isTouchEvent
        ? (e as TouchEvent).touches[0].clientY
        : (e as MouseEvent).clientY

      if (!isTouchEvent && (e as MouseEvent).button !== 0) return
      e.preventDefault()

      if (canDrag && !canDrag(element)) return

      setIsDragging(true)
      const startX = clientX - positionRef.current.x
      const startY = clientY - positionRef.current.y

      const rect = element.getBoundingClientRect()
      const elementWidth = element.offsetWidth
      const elementHeight = element.offsetHeight
      const originalLeft = rect.left - positionRef.current.x
      const originalTop = rect.top - positionRef.current.y

      const moveListener = (e: MouseEvent | TouchEvent) => {
        e.preventDefault()
        const isTouchMove = e.type === "touchmove"
        const moveX = isTouchMove
          ? (e as TouchEvent).touches[0].clientX
          : (e as MouseEvent).clientX
        const moveY = isTouchMove
          ? (e as TouchEvent).touches[0].clientY
          : (e as MouseEvent).clientY

        let newX = moveX - startX
        let newY = moveY - startY

        const maxX = window.innerWidth - originalLeft - elementWidth
        const minX = -originalLeft
        newX = Math.max(minX, Math.min(newX, maxX))

        const maxY = window.innerHeight - originalTop - elementHeight
        const minY = -originalTop
        newY = Math.max(minY, Math.min(newY, maxY))

        positionRef.current = { x: newX, y: newY }
        element.style.transform = `translate(${newX}px, ${newY}px)`
      }

      const upListener = () => {
        handleMouseUp()
        document.removeEventListener("mousemove", moveListener)
        document.removeEventListener("mouseup", upListener)
        document.removeEventListener("touchmove", moveListener)
        document.removeEventListener("touchend", upListener)
      }

      eventListeners.current.move = moveListener
      eventListeners.current.up = upListener

      document.addEventListener("mousemove", moveListener)
      document.addEventListener("mouseup", upListener)
      document.addEventListener("touchmove", moveListener)
      document.addEventListener("touchend", upListener)
    }

    element.addEventListener("mousedown", handleStart)
    element.addEventListener("touchstart", handleStart)
    return () => {
      element.removeEventListener("mousedown", handleStart)
      element.removeEventListener("touchstart", handleStart)
    }
  }, [ref, canDrag, handleMouseUp])

  return { ref, isDragging }
}
