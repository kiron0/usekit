import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useIdle } from "../../registry/hooks/use-idle"

describe("useIdle", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"))
  })

  it("becomes idle after inactivity and resets on activity", () => {
    const { result } = renderHook(() => useIdle(1000))

    expect(result.current).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe(true)

    act(() => {
      window.dispatchEvent(new Event("mousemove"))
    })
    expect(result.current).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe(true)
  })
})
