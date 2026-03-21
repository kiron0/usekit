import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useWindowScroll } from "../../registry/hooks/use-window-scroll"

describe("useWindowScroll", () => {
  const originalScrollTo = window.scrollTo

  beforeEach(() => {
    Object.defineProperty(window, "scrollX", {
      configurable: true,
      value: 0,
      writable: true,
    })
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    })
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    window.scrollTo = originalScrollTo
  })

  it("tracks scroll position and proxies scroll commands", () => {
    const { result } = renderHook(() => useWindowScroll())

    expect(result.current[0]).toEqual({ x: 0, y: 0 })

    Object.defineProperty(window, "scrollX", {
      configurable: true,
      value: 10,
    })
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 20,
    })

    act(() => {
      window.dispatchEvent(new Event("scroll"))
    })

    expect(result.current[0]).toEqual({ x: 10, y: 20 })

    act(() => {
      result.current[1](5, 7, "smooth")
    })

    expect(window.scrollTo).toHaveBeenCalledWith({
      left: 5,
      top: 7,
      behavior: "smooth",
    })
  })
})
