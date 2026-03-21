import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useRenderCount } from "../../registry/hooks/use-render-count"

describe("useRenderCount", () => {
  it("increments on every render", () => {
    const { result, rerender } = renderHook(() => useRenderCount())

    expect(result.current).toBe(1)

    rerender()
    expect(result.current).toBe(2)
  })
})
