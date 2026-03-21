import * as React from "react"

export interface UsePageTransitionOptions {
  minDuration?: number
}

export interface UsePageTransitionResult {
  isTransitioning: boolean
}

const HISTORY_EVENT_PATCH_MARKER = Symbol.for("usekit.history-events.patched")

type HistoryMethod = "pushState" | "replaceState"
type HistoryFunction = History["pushState"] | History["replaceState"]

declare global {
  interface WindowEventMap {
    pushstate: CustomEvent<{ state: unknown }>
    replacestate: CustomEvent<{ state: unknown }>
  }
}

type PatchedHistoryFunction = {
  [HISTORY_EVENT_PATCH_MARKER]?: true
}

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined"
}

function ensureHistoryEventsPatched(): void {
  if (!isBrowser()) {
    return
  }

  const patchHistoryMethod = (method: HistoryMethod) => {
    const currentMethod = history[method] as HistoryFunction &
      PatchedHistoryFunction

    if (currentMethod[HISTORY_EVENT_PATCH_MARKER]) {
      return
    }

    const originalMethod = history[method]

    const patchedMethod = function (
      this: History,
      data: unknown,
      title: string,
      url?: string | null
    ) {
      const result = originalMethod.apply(this, [data, title, url])
      window.dispatchEvent(
        new CustomEvent<{ state: unknown }>(method.toLowerCase(), {
          detail: { state: data },
        })
      )
      return result
    }

    ;(patchedMethod as typeof patchedMethod & PatchedHistoryFunction)[
      HISTORY_EVENT_PATCH_MARKER
    ] = true

    history[method] = patchedMethod as History[typeof method]
  }

  patchHistoryMethod("pushState")
  patchHistoryMethod("replaceState")
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

    ensureHistoryEventsPatched()

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

    const handlePushState = () => {
      startTransition()
      window.requestAnimationFrame(endTransition)
    }

    const handleReplaceState = () => {
      startTransition()
      window.requestAnimationFrame(endTransition)
    }

    document.addEventListener("visibilitychange", handleVisibility)
    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("pagehide", handlePageHide)
    window.addEventListener("pageshow", handlePageShow)
    window.addEventListener("popstate", handlePopState)
    window.addEventListener("pushstate", handlePushState)
    window.addEventListener("replacestate", handleReplaceState)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("pagehide", handlePageHide)
      window.removeEventListener("pageshow", handlePageShow)
      window.removeEventListener("popstate", handlePopState)
      window.removeEventListener("pushstate", handlePushState)
      window.removeEventListener("replacestate", handleReplaceState)

      clearTimer()
    }
  }, [clearTimer, endTransition, startTransition])

  return { isTransitioning }
}
