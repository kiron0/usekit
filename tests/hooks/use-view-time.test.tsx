import * as React from "react"
import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useViewTime } from "../../registry/hooks/use-view-time"

describe("useViewTime", () => {
  const originalObserver = globalThis.IntersectionObserver
  let observerCallback:
    | ((entries: Array<{ intersectionRatio: number }>) => void)
    | undefined
  let now = 0

  beforeEach(() => {
    observerCallback = undefined
    now = 0
    vi.spyOn(performance, "now").mockImplementation(() => now)
    globalThis.IntersectionObserver = class MockIntersectionObserver {
      constructor(
        callback: (entries: Array<{ intersectionRatio: number }>) => void
      ) {
        observerCallback = callback
      }

      observe() {}

      unobserve() {}

      disconnect() {}
    } as unknown as typeof IntersectionObserver
  })

  afterEach(() => {
    globalThis.IntersectionObserver = originalObserver
    vi.restoreAllMocks()
  })

  it("accumulates viewed seconds while the element is visible", () => {
    const element = document.createElement("div")
    const ref = { current: element } as React.RefObject<HTMLElement>

    const { result } = renderHook(() => useViewTime(ref))

    act(() => {
      observerCallback?.([{ intersectionRatio: 1 }])
    })

    act(() => {
      now = 1500
      observerCallback?.([{ intersectionRatio: 0 }])
    })

    expect(result.current.secondsViewed).toBe(1)
  })
})
