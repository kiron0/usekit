import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useIsFirstRender } from "../../registry/hooks/use-is-first-render"

describe("useIsFirstRender", () => {
  it("returns true only on the first render", () => {
    const { result, rerender } = renderHook(() => useIsFirstRender())

    expect(result.current).toBe(true)

    rerender()
    expect(result.current).toBe(false)
  })
})
