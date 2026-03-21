import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useIntersectionObserver } from "../../registry/hooks/use-intersection-observer"

const observe = vi.fn()
const disconnect = vi.fn()
let observerCallback:
  | ((entries: IntersectionObserverEntry[]) => void)
  | undefined

class MockIntersectionObserver {
  constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
    observerCallback = callback
  }

  observe = observe
  disconnect = disconnect
}

describe("useIntersectionObserver", () => {
  beforeEach(() => {
    observe.mockReset()
    disconnect.mockReset()
    observerCallback = undefined
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns the latest observer entry for the target element", () => {
    const element = document.createElement("div")
    const ref = { current: element }

    const { result, unmount } = renderHook(() =>
      useIntersectionObserver(ref, { threshold: 0.25, rootMargin: "5px" })
    )

    expect(result.current).toBeUndefined()
    expect(observe).toHaveBeenCalledWith(element)

    const entry = {
      isIntersecting: true,
      intersectionRatio: 0.8,
      target: element,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback?.([entry])
    })

    expect(result.current).toBe(entry)

    unmount()

    expect(disconnect).toHaveBeenCalledTimes(1)
  })
})
