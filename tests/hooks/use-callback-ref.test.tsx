import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useCallbackRef } from "../../registry/hooks/use-callback-ref"

describe("useCallbackRef", () => {
  it("keeps a stable function identity while calling the latest callback", () => {
    const first = vi.fn()
    const second = vi.fn()

    const { result, rerender } = renderHook(
      ({ callback }) => useCallbackRef(callback),
      {
        initialProps: { callback: first },
      }
    )

    const stableReference = result.current
    result.current("alpha" as never)
    expect(first).toHaveBeenCalledWith("alpha")

    rerender({ callback: second })

    expect(result.current).toBe(stableReference)
    result.current("beta" as never)
    expect(second).toHaveBeenCalledWith("beta")
    expect(first).toHaveBeenCalledTimes(1)
  })
})
