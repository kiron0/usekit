import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useSafeState } from "../../registry/hooks/use-safe-state"

describe("useSafeState", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("does not update state after unmount and can warn when enabled", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    const { result, unmount } = renderHook(() => useSafeState(1, true))
    const setState = result.current[1]

    act(() => {
      setState(2)
    })
    expect(result.current[0]).toBe(2)

    unmount()

    act(() => {
      setState(3)
    })

    expect(warnSpy).toHaveBeenCalledTimes(1)
  })
})
