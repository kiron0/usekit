import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useAutoScroll } from "../../registry/hooks/use-auto-scroll"

let mutationCallback: (() => void) | undefined

class MockMutationObserver {
  constructor(callback: () => void) {
    mutationCallback = callback
  }

  observe() {}
  disconnect() {}
}

describe("useAutoScroll", () => {
  const originalRequestAnimationFrame = window.requestAnimationFrame
  const originalCancelAnimationFrame = window.cancelAnimationFrame

  beforeEach(() => {
    mutationCallback = undefined
    vi.stubGlobal("MutationObserver", MockMutationObserver)
    window.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
      cb(0)
      return 1
    })
    window.cancelAnimationFrame = vi.fn()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    window.requestAnimationFrame = originalRequestAnimationFrame
    window.cancelAnimationFrame = originalCancelAnimationFrame
  })

  it("scrolls to the bottom on mutation while auto-scroll is enabled", () => {
    const { result, rerender } = renderHook(
      ({ dep }) => useAutoScroll(true, [dep]),
      { initialProps: { dep: 0 } }
    )

    const element = document.createElement("div") as HTMLUListElement
    element.scrollTo = vi.fn()
    Object.defineProperties(element, {
      scrollHeight: { configurable: true, value: 500 },
      clientHeight: { configurable: true, value: 100 },
      scrollTop: { configurable: true, writable: true, value: 400 },
    })

    act(() => {
      result.current.current = element
    })

    rerender({ dep: 1 })

    act(() => {
      mutationCallback?.()
    })

    expect(element.scrollTo).toHaveBeenCalledWith({
      top: 500,
      behavior: "smooth",
    })
  })
})
