import * as React from "react"

type ThrottledFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void

function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ThrottledFunction<T> {
  let lastFunc: ReturnType<typeof setTimeout>
  let lastRan: number

  return (...args: Parameters<T>) => {
    if (!lastRan) {
      func(...args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func(...args)
            lastRan = Date.now()
          }
        },
        limit - (Date.now() - lastRan)
      )
    }
  }
}

export function useIdle(ms: number = 1000 * 60): boolean {
  const [idle, setIdle] = React.useState(false)
  const timeoutId = React.useRef<number>(0)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const handleTimeout = () => {
      setIdle(true)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleEvent = throttle((e: Event) => {
      setIdle(false)

      if (timeoutId.current !== undefined) {
        window.clearTimeout(timeoutId.current)
      }
      timeoutId.current = window.setTimeout(handleTimeout, ms)
    }, 500)

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleEvent(new Event("visibilitychange"))
      }
    }

    timeoutId.current = window.setTimeout(handleTimeout, ms)

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "resize",
      "keydown",
      "touchstart",
      "wheel",
    ]

    events.forEach((event) => {
      window.addEventListener(event, handleEvent)
    })
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleEvent)
      })
      document.removeEventListener("visibilitychange", handleVisibilityChange)

      if (timeoutId.current !== undefined) {
        window.clearTimeout(timeoutId.current)
      }
    }
  }, [ms])

  return idle
}
