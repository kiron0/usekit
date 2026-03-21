import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { usePrevious } from "../../registry/hooks/use-previous"

describe("usePrevious", () => {
  it("returns null initially and then the previous value after rerenders", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: "alpha" },
    })

    expect(result.current).toBeNull()

    rerender({ value: "beta" })
    expect(result.current).toBe("alpha")

    rerender({ value: "gamma" })
    expect(result.current).toBe("beta")
  })

  it("respects an explicit initial previous value", () => {
    const { result } = renderHook(() => usePrevious("alpha", "seed"))

    expect(result.current).toBe("seed")
  })
})
