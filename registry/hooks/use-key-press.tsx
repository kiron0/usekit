import * as React from "react"

type KeyboardEventType = "keydown" | "keyup" | "keypress"

export function useKeyPress(
  key: string,
  cb: (event: KeyboardEvent) => void,
  options?: {
    event?: KeyboardEventType
    target?: EventTarget
    eventOptions?: AddEventListenerOptions | boolean
  }
): void {
  const {
    event = "keydown",
    target = typeof window !== "undefined" ? window : null,
    eventOptions,
  } = options || {}

  React.useEffect(() => {
    const handleEvent = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key === key) {
        cb(e)
      }
    }

    if (target) {
      target.addEventListener(event, handleEvent, eventOptions)
      return () => {
        target.removeEventListener(event, handleEvent, eventOptions)
      }
    }
  }, [key, cb, event, target, eventOptions])
}
