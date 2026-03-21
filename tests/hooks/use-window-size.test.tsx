import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useWindowSize } from "../../registry/hooks/use-window-size"

describe("useWindowSize", () => {
  it("tracks window dimension changes", () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 600,
    })
    Object.defineProperty(window, "outerWidth", {
      configurable: true,
      value: 1024,
    })
    Object.defineProperty(window, "outerHeight", {
      configurable: true,
      value: 768,
    })

    const { result } = renderHook(() => useWindowSize())

    expect(result.current).toEqual({
      innerHeight: 600,
      innerWidth: 800,
      outerHeight: 768,
      outerWidth: 1024,
    })

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1280,
    })
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 720,
    })

    act(() => {
      window.dispatchEvent(new Event("resize"))
    })

    expect(result.current.innerWidth).toBe(1280)
    expect(result.current.innerHeight).toBe(720)
  })
})
