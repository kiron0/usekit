import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useSectionTracker } from "../../registry/hooks/use-section-tracker"

let observerCallback:
  | ((entries: IntersectionObserverEntry[]) => void)
  | undefined
const observe = vi.fn()
const disconnect = vi.fn()

class MockIntersectionObserver {
  constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
    observerCallback = callback
  }

  observe = observe
  disconnect = disconnect
}

describe("useSectionTracker", () => {
  const originalInnerHeight = window.innerHeight

  beforeEach(() => {
    observerCallback = undefined
    observe.mockReset()
    disconnect.mockReset()
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    })
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)
  })

  afterEach(() => {
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: originalInnerHeight,
    })
    vi.unstubAllGlobals()
  })

  it("selects the nearest visible section as active", () => {
    const first = document.createElement("section")
    const second = document.createElement("section")

    const sections = [
      { id: "intro", ref: { current: first } },
      { id: "api", ref: { current: second } },
    ]

    const { result, unmount } = renderHook(() => useSectionTracker(sections))

    act(() => {
      observerCallback?.([
        {
          target: first,
          intersectionRatio: 0.7,
          boundingClientRect: { top: 300 },
        } as IntersectionObserverEntry,
        {
          target: second,
          intersectionRatio: 0.8,
          boundingClientRect: { top: 120 },
        } as IntersectionObserverEntry,
      ])
    })

    expect(result.current.activeSection).toBe("api")

    unmount()

    expect(disconnect).toHaveBeenCalled()
  })
})
