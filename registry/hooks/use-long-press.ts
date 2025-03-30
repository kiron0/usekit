import * as React from "react"

type LongPressEvent = React.MouseEvent | React.TouchEvent

export type LongPressCallback = (event: LongPressEvent) => void

interface LongPressOptions {
  threshold?: number
  onStart?: (event: LongPressEvent) => void
  onFinish?: (event: LongPressEvent) => void
  onCancel?: (event: LongPressEvent) => void
}

export function useLongPress(
  callback: LongPressCallback,
  options: LongPressOptions = {}
): {
  onMouseDown: (event: React.MouseEvent) => void
  onMouseUp: (event: React.MouseEvent) => void
  onMouseLeave: (event: React.MouseEvent) => void
  onTouchStart: (event: React.TouchEvent) => void
  onTouchEnd: (event: React.TouchEvent) => void
} {
  const { threshold = 400, onStart, onFinish, onCancel } = options
  const isLongPressActive = React.useRef(false)
  const isPressed = React.useRef(false)
  const timerId = React.useRef<number>(0)

  const isMouseEvent = (event: unknown): event is React.MouseEvent =>
    (event as React.MouseEvent).type?.startsWith("mouse")

  const isTouchEvent = (event: unknown): event is React.TouchEvent =>
    (event as React.TouchEvent).type?.startsWith("touch")

  return React.useMemo(() => {
    const start = (event: LongPressEvent) => {
      if (!isMouseEvent(event) && !isTouchEvent(event)) return

      onStart?.(event)
      isPressed.current = true

      timerId.current = window.setTimeout(() => {
        callback(event)
        isLongPressActive.current = true
      }, threshold)
    }

    const cancel = (event: LongPressEvent) => {
      if (!isMouseEvent(event) && !isTouchEvent(event)) return

      if (isLongPressActive.current) {
        onFinish?.(event)
      } else if (isPressed.current) {
        onCancel?.(event)
      }

      isLongPressActive.current = false
      isPressed.current = false
      window.clearTimeout(timerId.current)
    }

    return {
      onMouseDown: (e: React.MouseEvent) => start(e),
      onMouseUp: (e: React.MouseEvent) => cancel(e),
      onMouseLeave: (e: React.MouseEvent) => cancel(e),
      onTouchStart: (e: React.TouchEvent) => start(e),
      onTouchEnd: (e: React.TouchEvent) => cancel(e),
    }
  }, [callback, threshold, onStart, onFinish, onCancel])
}
