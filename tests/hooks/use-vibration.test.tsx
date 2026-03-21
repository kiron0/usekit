import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useVibration } from "../../registry/hooks/use-vibration"

describe("useVibration", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      value: vi.fn(),
    })
  })

  it("starts and stops vibration state", () => {
    const { result } = renderHook(() => useVibration([100, 50]))

    expect(result.current.isSupported).toBe(true)

    act(() => {
      result.current.vibrate()
    })

    expect(navigator.vibrate).toHaveBeenCalledWith([100, 50])
    expect(result.current.isVibrating).toBe(true)

    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(result.current.isVibrating).toBe(false)

    act(() => {
      result.current.stop()
    })

    expect(navigator.vibrate).toHaveBeenCalledWith(0)
  })
})
