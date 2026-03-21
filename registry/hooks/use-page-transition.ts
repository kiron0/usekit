import * as React from "react"

export interface UsePageTransitionOptions {
  minDuration?: number
}

export interface UsePageTransitionResult {
  isTransitioning: boolean
}

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined"
}

function scheduleMicrotask(callback: () => void) {
  if (typeof queueMicrotask === "function") {
    queueMicrotask(callback)
    return
  }
  Promise.resolve()
    .then(callback)
    .catch(() => {})
}

export function usePageTransition(
  options: UsePageTransitionOptions = {}
): UsePageTransitionResult {
  const { minDuration = 150 } = options
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const isTransitioningRef = React.useRef(false)
  const startTimeRef = React.useRef<number | null>(null)
  const timeoutRef = React.useRef<number | null>(null)
  const originalPushStateRef = React.useRef<typeof history.pushState | null>(
    null
  )
  const originalReplaceStateRef = React.useRef<
    typeof history.replaceState | null
  >(null)

  const clearTimer = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const setTransitioning = React.useCallback((value: boolean) => {
    isTransitioningRef.current = value
    setIsTransitioning(value)
  }, [])

  const startTransition = React.useCallback(() => {
    if (!isBrowser()) return
    clearTimer()
    startTimeRef.current = performance.now()
    isTransitioningRef.current = true
    scheduleMicrotask(() => {
      setTransitioning(true)
    })
  }, [clearTimer, setTransitioning])

  const endTransition = React.useCallback(() => {
    if (!isBrowser()) return
    if (!isTransitioningRef.current) return

    const now = performance.now()
    const startedAt = startTimeRef.current ?? now
    const elapsed = now - startedAt
    const remaining = Math.max(minDuration - elapsed, 0)

    clearTimer()
    if (remaining === 0) {
      scheduleMicrotask(() => {
        setTransitioning(false)
        startTimeRef.current = null
      })
    } else {
      timeoutRef.current = window.setTimeout(() => {
        setTransitioning(false)
        startTimeRef.current = null
        timeoutRef.current = null
      }, remaining)
    }
  }, [clearTimer, isTransitioningRef, minDuration, setTransitioning])

  React.useEffect(() => {
    if (!isBrowser()) return

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        startTransition()
      } else if (document.visibilityState === "visible") {
        endTransition()
      }
    }

    const handleBeforeUnload = () => {
      startTransition()
    }

    const handlePageHide = () => {
      startTransition()
    }

    const handlePageShow = () => {
      endTransition()
    }

    const handlePopState = () => {
      startTransition()
      window.requestAnimationFrame(endTransition)
    }

    document.addEventListener("visibilitychange", handleVisibility)
    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("pagehide", handlePageHide)
    window.addEventListener("pageshow", handlePageShow)
    window.addEventListener("popstate", handlePopState)

    originalPushStateRef.current = history.pushState
    originalReplaceStateRef.current = history.replaceState

    history.pushState = ((...args: Parameters<typeof history.pushState>) => {
      const result = originalPushStateRef.current?.apply(history, args)
      startTransition()
      window.requestAnimationFrame(endTransition)
      return result
    }) as typeof history.pushState

    history.replaceState = ((
      ...args: Parameters<typeof history.replaceState>
    ) => {
      const result = originalReplaceStateRef.current?.apply(history, args)
      startTransition()
      window.requestAnimationFrame(endTransition)
      return result
    }) as typeof history.replaceState

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("pagehide", handlePageHide)
      window.removeEventListener("pageshow", handlePageShow)
      window.removeEventListener("popstate", handlePopState)

      clearTimer()

      if (originalPushStateRef.current) {
        history.pushState = originalPushStateRef.current
      }
      if (originalReplaceStateRef.current) {
        history.replaceState = originalReplaceStateRef.current
      }
    }
  }, [clearTimer, endTransition, startTransition])

  return { isTransitioning }
}
