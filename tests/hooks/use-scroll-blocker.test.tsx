import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useScrollBlocker } from "../../registry/hooks/use-scroll-blocker"

describe("useScrollBlocker", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 120,
    })
    window.scrollTo = vi.fn()
    document.body.style.cssText = ""
  })

  afterEach(() => {
    document.body.style.cssText = ""
  })

  it("blocks scrolling and restores the previous state when unblocked", () => {
    const { result } = renderHook(() => useScrollBlocker())

    act(() => {
      result.current.block()
    })

    expect(document.body.style.overflow).toBe("hidden")
    expect(document.body.style.position).toBe("fixed")
    expect(document.body.style.top).toBe("-120px")
    expect(document.body.style.width).toBe("100%")

    act(() => {
      result.current.unblock()
    })

    expect(document.body.style.overflow).toBe("")
    expect(document.body.style.position).toBe("")
    expect(document.body.style.top).toBe("")
    expect(document.body.style.width).toBe("")
    expect(window.scrollTo).toHaveBeenCalledWith(0, 120)
  })

  it("keeps scrolling blocked until the last blocker is released", () => {
    const first = renderHook(() => useScrollBlocker())
    const second = renderHook(() => useScrollBlocker())

    act(() => {
      first.result.current.block()
      second.result.current.block()
    })

    first.unmount()

    expect(document.body.style.position).toBe("fixed")

    act(() => {
      second.result.current.unblock()
    })

    expect(document.body.style.position).toBe("")
    expect(window.scrollTo).toHaveBeenCalledWith(0, 120)
  })

  it("restores pre-existing body styles after unblocking", () => {
    document.body.style.overflow = "clip"
    document.body.style.position = "relative"
    document.body.style.top = "12px"
    document.body.style.width = "80%"

    const { result } = renderHook(() => useScrollBlocker())

    act(() => {
      result.current.block()
      result.current.unblock()
    })

    expect(document.body.style.overflow).toBe("clip")
    expect(document.body.style.position).toBe("relative")
    expect(document.body.style.top).toBe("12px")
    expect(document.body.style.width).toBe("80%")
  })
})
