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

    expect(result.current.remaining).toBe(3000)
    expect(result.current.isPaused).toBe(false)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })
    expect(result.current.remaining).toBe(2000)
    expect(onTick).toHaveBeenCalledWith(2000)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000)
    })
    expect(result.current.remaining).toBe(0)
    expect(onComplete).toHaveBeenCalledWith(0)
  })

  it("pause freezes remaining until resume", async () => {
    const endMs = new Date("2026-01-01T00:00:10.000Z").getTime()

    const { result } = renderHook(() => useCountdown(endMs, { interval: 1000 }))

    expect(result.current.remaining).toBe(10_000)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })
    expect(result.current.remaining).toBe(9000)

    act(() => {
      result.current.pause()
    })
    expect(result.current.isPaused).toBe(true)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000)
    })
    expect(result.current.remaining).toBe(9000)

    act(() => {
      result.current.resume()
    })
    expect(result.current.isPaused).toBe(false)
    // Paused 5s wall-clock: effective end shifts, so remaining stays ~9s like when paused
    expect(result.current.remaining).toBe(9000)
  })

  it("does not tick remaining while paused", async () => {
    const endMs = new Date("2026-01-01T00:01:00.000Z").getTime()

    const { result } = renderHook(() => useCountdown(endMs, { interval: 1000 }))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000)
    })
    const frozen = result.current.remaining

    act(() => {
      result.current.pause()
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000)
    })

    expect(result.current.remaining).toBe(frozen)
    expect(result.current.isPaused).toBe(true)
  })
})
