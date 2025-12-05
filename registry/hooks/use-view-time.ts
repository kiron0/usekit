import * as React from "react"

export interface UseViewTimeOptions {
  threshold?: number
}

export interface UseViewTimeResult {
  secondsViewed: number
}

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined"
}

export function useViewTime(
  ref: React.RefObject<HTMLElement | null>,
  options: UseViewTimeOptions = {}
): UseViewTimeResult {
  const { threshold = 0.5 } = options

  const [secondsViewed, setSecondsViewed] = React.useState(0)
  const totalMsRef = React.useRef(0)
  const lastStartRef = React.useRef<number | null>(null)
  const isTrackingRef = React.useRef(false)

  const stopTracking = React.useCallback(() => {
    if (!isBrowser()) return
    if (!isTrackingRef.current || lastStartRef.current === null) return

    const now = performance.now()
    const elapsed = now - lastStartRef.current
    lastStartRef.current = null
    isTrackingRef.current = false

    if (elapsed <= 0) return

    totalMsRef.current += elapsed
    setSecondsViewed(Math.floor(totalMsRef.current / 1000))
  }, [])

  const startTracking = React.useCallback(() => {
    if (!isBrowser()) return
    if (isTrackingRef.current) return
    if (document.hidden) return

    isTrackingRef.current = true
    lastStartRef.current = performance.now()
  }, [])

  React.useEffect(() => {
    if (!isBrowser()) return
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        if (entry.intersectionRatio >= threshold) {
          startTracking()
        } else {
          stopTracking()
        }
      },
      {
        threshold,
      }
    )

    observer.observe(node)

    const handleVisibility = () => {
      if (document.hidden) {
        stopTracking()
      } else {
        const rect = node.getBoundingClientRect()
        const fullyOutside =
          rect.bottom <= 0 ||
          rect.right <= 0 ||
          rect.top >= window.innerHeight ||
          rect.left >= window.innerWidth

        if (!fullyOutside) {
          startTracking()
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      observer.unobserve(node)
      observer.disconnect()
      document.removeEventListener("visibilitychange", handleVisibility)
      stopTracking()
    }
  }, [ref, startTracking, stopTracking, threshold])

  return { secondsViewed }
}
