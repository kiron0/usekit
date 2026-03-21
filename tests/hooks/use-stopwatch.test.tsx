import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useStopwatch } from "../../registry/hooks/use-stopwatch"

describe("useStopwatch", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it("tracks elapsed time, pauses, resumes, and resets", () => {
    const { result } = renderHook(() => useStopwatch())

    expect(result.current.current).toBe("00:00:00:00")
    expect(result.current.elapsedSeconds).toBe(0)

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.elapsedSeconds).toBe(3)
    expect(result.current.current).toBe("00:00:00:03")

    act(() => {
      result.current.pause()
    })

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.elapsedSeconds).toBe(3)

    act(() => {
      result.current.play()
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.elapsedSeconds).toBe(4)

    act(() => {
      result.current.reset()
    })
    expect(result.current.elapsedSeconds).toBe(0)
    expect(result.current.current).toBe("00:00:00:00")
  })
})
