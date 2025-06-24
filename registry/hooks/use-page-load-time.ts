import * as React from "react"

interface LoadTiming {
  navigationStart: number
  domContentLoaded: number | null
  load: number | null
  domComplete: number | null
  total: number | null
}

type PageLoadEvent = "dom-content-loaded" | "load" | "complete"

export function usePageLoadTime() {
  const [timings, setTimings] = React.useState<LoadTiming>({
    navigationStart: Date.now(),
    domContentLoaded: null,
    load: null,
    domComplete: null,
    total: null,
  })

  const [isLoaded, setIsLoaded] = React.useState(false)

  const getLoadTime = React.useCallback(
    (event: PageLoadEvent = "load"): number | null => {
      switch (event) {
        case "dom-content-loaded":
          return timings.domContentLoaded
        case "load":
          return timings.load
        case "complete":
          return timings.domComplete
        default:
          return timings.total
      }
    },
    [timings]
  )

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.PerformanceObserver) {
      return
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.entryType === "navigation") {
          const navEntry = entry as PerformanceNavigationTiming
          setTimings({
            navigationStart: navEntry.startTime,
            domContentLoaded: navEntry.domContentLoadedEventEnd,
            load: navEntry.loadEventEnd,
            domComplete: navEntry.domComplete,
            total: navEntry.duration,
          })
          setIsLoaded(true)
        }
      })
    })

    observer.observe({ type: "navigation", buffered: true })
    return () => observer.disconnect()
  }, [])

  return {
    timings,
    getLoadTime,
    isLoaded,
    loadTime: timings.total,
  }
}
