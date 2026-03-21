import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useMemoizedFn } from "../../registry/hooks/use-memoized-fn"

describe("useMemoizedFn", () => {
  it("keeps a stable function and runs cleanups between calls and on unmount", () => {
    const cleanupA = vi.fn()
    const cleanupB = vi.fn()
    const fnA = vi.fn(() => cleanupA)
    const fnB = vi.fn(() => cleanupB)

    const { result, rerender, unmount } = renderHook(
      ({ callback }) => useMemoizedFn(callback),
      {
        initialProps: { callback: fnA },
      }
    )

    const stableReference = result.current

    result.current()
    expect(fnA).toHaveBeenCalledTimes(1)
    expect(cleanupA).not.toHaveBeenCalled()

    result.current()
    expect(cleanupA).toHaveBeenCalledTimes(1)

    rerender({ callback: fnB })
    expect(result.current).toBe(stableReference)

    result.current()
    expect(cleanupA).toHaveBeenCalledTimes(2)
    expect(fnB).toHaveBeenCalledTimes(1)

    unmount()
    expect(cleanupB).toHaveBeenCalledTimes(1)
  })
})
