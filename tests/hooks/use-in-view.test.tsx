import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import useInView from "../../registry/hooks/use-in-view"

const observe = vi.fn()
const unobserve = vi.fn()
let intersectionCallback:
  | ((entries: Array<{ isIntersecting: boolean }>) => void)
  | undefined

class MockIntersectionObserver {
  constructor(callback: (entries: Array<{ isIntersecting: boolean }>) => void) {
    intersectionCallback = callback
  }

  observe = observe
  unobserve = unobserve
}

describe("useInView", () => {
  beforeEach(() => {
    observe.mockReset()
    unobserve.mockReset()
    intersectionCallback = undefined
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("tracks whether the target element is intersecting", () => {
    const element = document.createElement("div")
    const ref = { current: element }

    const { result, unmount } = renderHook(() =>
      useInView(ref, { threshold: 0.5, rootMargin: "10px" })
    )

    expect(result.current).toBe(false)
    expect(observe).toHaveBeenCalledWith(element)

    act(() => {
      intersectionCallback?.([{ isIntersecting: true }])
    })

    expect(result.current).toBe(true)

    unmount()

    expect(unobserve).toHaveBeenCalledWith(element)
  })
})
