import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useUpdateEffect } from "../../registry/hooks/use-update-effect"

describe("useUpdateEffect", () => {
  it("skips the initial render and runs on dependency updates", () => {
    const callback = vi.fn()

    const { rerender } = renderHook(
      ({ value }) => {
        useUpdateEffect(callback, [value])
      },
      {
        initialProps: { value: 1 },
      }
    )

    expect(callback).not.toHaveBeenCalled()

    rerender({ value: 2 })
    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ value: 3 })
    expect(callback).toHaveBeenCalledTimes(2)
  })
})
