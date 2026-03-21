import { renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { usePageLoadTime } from "../../registry/hooks/use-page-load-time"

describe("usePageLoadTime", () => {
  const OriginalPerformanceObserver = globalThis.PerformanceObserver
  let callback:
    | ((list: { getEntries: () => PerformanceEntry[] }) => void)
    | undefined

  beforeEach(() => {
    callback = undefined
    globalThis.PerformanceObserver = class MockPerformanceObserver {
      constructor(
        observerCallback: (list: {
          getEntries: () => PerformanceEntry[]
        }) => void
      ) {
        callback = observerCallback
      }

      observe() {}

      disconnect() {}
    } as unknown as typeof PerformanceObserver
  })

  afterEach(() => {
    globalThis.PerformanceObserver = OriginalPerformanceObserver
  })

  it("reads navigation timing entries and exposes load times", async () => {
    const { result } = renderHook(() => usePageLoadTime())

    callback?.({
      getEntries: () =>
        [
          {
            entryType: "navigation",
            startTime: 0,
            domContentLoadedEventEnd: 120,
            loadEventEnd: 240,
            domComplete: 260,
            duration: 300,
          },
        ] as PerformanceEntry[],
    })

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true)
    })

    expect(result.current.timings.total).toBe(300)
    expect(result.current.getLoadTime("load")).toBe(240)
    expect(result.current.loadTime).toBe(300)
  })
})
