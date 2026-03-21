import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useVisibilityChange } from "../../registry/hooks/use-visibility-change"

describe("useVisibilityChange", () => {
  it("tracks document visibility changes", () => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    })

    const { result } = renderHook(() => useVisibilityChange())
    expect(result.current).toBe(true)

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    })

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"))
    })

    expect(result.current).toBe(false)
  })
})
