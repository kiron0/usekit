import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useTimeOfDay } from "../../registry/hooks/use-time-of-day"

describe("useTimeOfDay", () => {
  let hour = 9

  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(Date.prototype, "getHours").mockImplementation(() => hour)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("updates the segment of day over time", () => {
    const { result } = renderHook(() => useTimeOfDay())

    expect(result.current).toBe("morning")

    act(() => {
      hour = 18
      vi.advanceTimersByTime(60_000)
    })

    expect(result.current).toBe("evening")
  })
})
