import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useOverflowDetector } from "../../registry/hooks/use-overflow-detector"

let resizeCallback: (() => void) | undefined
const disconnect = vi.fn()

class MockResizeObserver {
  constructor(callback: () => void) {
    resizeCallback = callback
  }

  observe = vi.fn()
  disconnect = disconnect
}

function setDimensions(
  element: HTMLDivElement,
  {
    clientWidth,
    scrollWidth,
    clientHeight,
    scrollHeight,
  }: {
    clientWidth: number
    scrollWidth: number
    clientHeight: number
    scrollHeight: number
  }
) {
  Object.defineProperties(element, {
    clientWidth: { configurable: true, value: clientWidth },
    scrollWidth: { configurable: true, value: scrollWidth },
    clientHeight: { configurable: true, value: clientHeight },
    scrollHeight: { configurable: true, value: scrollHeight },
  })
}

describe("useOverflowDetector", () => {
  beforeEach(() => {
    resizeCallback = undefined
    disconnect.mockReset()
    vi.stubGlobal("ResizeObserver", MockResizeObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("detects overflow and updates when the observed element resizes", () => {
    const { result } = renderHook(() => useOverflowDetector())
    const element = document.createElement("div")

    setDimensions(element, {
      clientWidth: 100,
      scrollWidth: 180,
      clientHeight: 80,
      scrollHeight: 80,
    })

    act(() => {
      result.current.ref(element)
    })

    expect(result.current.hasOverflow).toEqual({
      horizontal: true,
      vertical: false,
      any: true,
    })

    setDimensions(element, {
      clientWidth: 100,
      scrollWidth: 100,
      clientHeight: 80,
      scrollHeight: 160,
    })

    act(() => {
      resizeCallback?.()
    })

    expect(result.current.hasOverflow).toEqual({
      horizontal: false,
      vertical: true,
      any: true,
    })
  })

  it("resets overflow state and disconnects observers when the ref is cleared", () => {
    const { result, unmount } = renderHook(() => useOverflowDetector())
    const element = document.createElement("div")

    setDimensions(element, {
      clientWidth: 100,
      scrollWidth: 200,
      clientHeight: 100,
      scrollHeight: 200,
    })

    act(() => {
      result.current.ref(element)
      result.current.ref(null)
    })

    expect(result.current.hasOverflow).toEqual({
      horizontal: false,
      vertical: false,
      any: false,
    })
    expect(disconnect).toHaveBeenCalled()

    unmount()

    expect(disconnect).toHaveBeenCalled()
  })
})
