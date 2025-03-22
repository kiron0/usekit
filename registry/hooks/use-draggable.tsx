import * as React from "react"

interface DragOptions<T extends HTMLElement> {
  canDrag?: (element: T) => boolean
}

export function useDraggable<T extends HTMLElement>(
  options: DragOptions<T> = {}
): { ref: React.RefObject<T>; isDragging: boolean } {
  const { canDrag } = options
  const ref = React.useRef<T>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const positionRef = React.useRef({ x: 0, y: 0 })
  const eventListeners = React.useRef<{
    move?: (e: MouseEvent) => void
    up?: () => void
  }>({})

  React.useEffect(() => {
    return () => {
      if (eventListeners.current.move) {
        document.removeEventListener("mousemove", eventListeners.current.move)
      }
      if (eventListeners.current.up) {
        document.removeEventListener("mouseup", eventListeners.current.up)
      }
    }
  }, [])

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false)
    if (eventListeners.current.move) {
      document.removeEventListener("mousemove", eventListeners.current.move)
    }
    if (eventListeners.current.up) {
      document.removeEventListener("mouseup", eventListeners.current.up)
    }
    eventListeners.current = {}
  }, [])

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const element = ref.current
    if (!element) return

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      e.preventDefault()

      if (canDrag && !canDrag(element)) return

      setIsDragging(true)
      const startX = e.clientX - positionRef.current.x
      const startY = e.clientY - positionRef.current.y

      const rect = element.getBoundingClientRect()
      const elementWidth = element.offsetWidth
      const elementHeight = element.offsetHeight
      const originalLeft = rect.left - positionRef.current.x
      const originalTop = rect.top - positionRef.current.y

      const moveListener = (e: MouseEvent) => {
        e.preventDefault()
        let newX = e.clientX - startX
        let newY = e.clientY - startY

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
      }

      eventListeners.current.move = moveListener
      eventListeners.current.up = upListener

      document.addEventListener("mousemove", moveListener)
      document.addEventListener("mouseup", upListener)
    }

    element.addEventListener("mousedown", handleMouseDown)
    return () => element.removeEventListener("mousedown", handleMouseDown)
  }, [ref, canDrag, handleMouseUp])

  return { ref: ref as React.RefObject<T>, isDragging }
}
