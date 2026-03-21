import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCountdown } from "../../registry/hooks/use-countdown"

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"))
  })

  it("counts down over time and fires tick and complete callbacks", async () => {
    const onTick = vi.fn()
    const onComplete = vi.fn()
    const startTime = new Date("2026-01-01T00:00:00.000Z")

    const { result } = renderHook(() =>
      useCountdown(startTime.getTime() + 3000, {
        interval: 1000,
        onTick,
        onComplete,
      })
    )

    expect(result.current).toBe(3000)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })
    expect(result.current).toBe(2000)
    expect(onTick).toHaveBeenCalledWith(2000)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000)
    })
    expect(result.current).toBe(0)
    expect(onComplete).toHaveBeenCalledWith(0)
  })
})
