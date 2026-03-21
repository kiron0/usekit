import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useUnmount } from "../../registry/hooks/use-unmount"

describe("useUnmount", () => {
  it("calls the latest callback on unmount", () => {
    const first = vi.fn()
    const second = vi.fn()

    const { rerender, unmount } = renderHook(
      ({ callback }) => useUnmount(callback),
      {
        initialProps: { callback: first },
      }
    )

    rerender({ callback: second })
    unmount()

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })
})
