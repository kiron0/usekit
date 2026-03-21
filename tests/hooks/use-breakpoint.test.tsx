import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useBreakpoint } from "../../registry/hooks/use-breakpoint"

describe("useBreakpoint", () => {
  it("tracks the current breakpoint and helper comparisons", () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 800,
    })

    const { result } = renderHook(() => useBreakpoint())

    expect(result.current.currentBreakpoint).toBe("md")
    expect(result.current.isAbove("sm")).toBe(true)
    expect(result.current.isBelow("lg")).toBe(true)

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1300,
    })

    act(() => {
      window.dispatchEvent(new Event("resize"))
    })

    expect(result.current.currentBreakpoint).toBe("xl")
    expect(result.current.isAbove("lg")).toBe(true)
    expect(result.current.isBelow("2xl")).toBe(true)
  })
})
