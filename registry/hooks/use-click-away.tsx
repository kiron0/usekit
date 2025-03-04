import * as React from "react"

type ClickAwayCallback = (event: MouseEvent | TouchEvent) => void

export function useClickAway<T extends HTMLElement = HTMLElement>(
  callback: ClickAwayCallback
): React.RefObject<T> {
  const ref = React.useRef<T>(null)
  const callbackRef = React.useRef(callback)

  React.useLayoutEffect(() => {
    callbackRef.current = callback
  })

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const element = ref.current
      if (element && !element.contains(event.target as Node)) {
        callbackRef.current(event)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

  return ref as React.RefObject<T>
}
