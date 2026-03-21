import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useSubmitLock } from "../../registry/hooks/use-submit-lock"

describe("useSubmitLock", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it("locks, unlocks, toggles, and auto-unlocks when configured", () => {
    const { result } = renderHook(() => useSubmitLock({ autoUnlockDelay: 200 }))

    expect(result.current.locked).toBe(false)

    act(() => result.current.lock())
    expect(result.current.locked).toBe(true)

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current.locked).toBe(false)

    act(() => result.current.toggle())
    expect(result.current.locked).toBe(true)

    act(() => result.current.unlock())
    expect(result.current.locked).toBe(false)
  })
})
