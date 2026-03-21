import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useTimeAgo } from "../../registry/hooks/use-time-ago"

describe("useTimeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:02:00.000Z"))
  })

  it("formats relative time and updates on interval ticks", () => {
    const timestamp = new Date("2026-01-01T00:00:30.000Z")
    const { result } = renderHook(() =>
      useTimeAgo(timestamp, {
        interval: 60_000,
        locale: "en",
      })
    )

    const initialValue = result.current
    expect(initialValue).toContain("minute")

    act(() => {
      vi.setSystemTime(new Date("2026-01-01T00:03:00.000Z"))
      vi.advanceTimersByTime(60_000)
    })

    expect(result.current).toContain("minute")
    expect(result.current).not.toBe(initialValue)
  })
})
