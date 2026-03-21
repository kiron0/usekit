import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { useScrollDirection } from "../../registry/hooks/use-scroll-direction"

describe("useScrollDirection", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    })
  })

  it("tracks window scrolling and ignores movement below the threshold", () => {
    const { result } = renderHook(() =>
      useScrollDirection({ initialDirection: "up", threshold: 5 })
    )

    expect(result.current).toBe("up")

    act(() => {
      window.scrollY = 3
      window.dispatchEvent(new Event("scroll"))
    })

    expect(result.current).toBe("up")

    act(() => {
      window.scrollY = 10
      window.dispatchEvent(new Event("scroll"))
    })

    expect(result.current).toBe("down")

    act(() => {
      window.scrollY = 7
      window.dispatchEvent(new Event("scroll"))
    })

    expect(result.current).toBe("down")

    act(() => {
      window.scrollY = 0
      window.dispatchEvent(new Event("scroll"))
    })

    expect(result.current).toBe("up")
  })

  it("supports scrolling targets other than window", () => {
    const target = document.createElement("div")

    Object.defineProperty(target, "scrollTop", {
      configurable: true,
      writable: true,
      value: 0,
    })

    const { result } = renderHook(() =>
      useScrollDirection({ initialDirection: "down", target })
    )

    expect(result.current).toBe("down")

    act(() => {
      target.scrollTop = 15
      target.dispatchEvent(new Event("scroll"))
    })

    expect(result.current).toBe("down")

    act(() => {
      target.scrollTop = 5
      target.dispatchEvent(new Event("scroll"))
    })

    expect(result.current).toBe("up")
  })
})
