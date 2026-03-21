import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useRandomInterval } from "../../registry/hooks/use-random-interval"

describe("useRandomInterval", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(Math, "random").mockReturnValue(0)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("runs repeatedly using delays within the configured range", () => {
    const callback = vi.fn()
    const { result } = renderHook(() =>
      useRandomInterval(callback, {
        minDelay: 100,
        maxDelay: 200,
      })
    )

    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(callback).toHaveBeenCalledTimes(2)

    act(() => {
      result.current()
      vi.advanceTimersByTime(200)
    })
    expect(callback).toHaveBeenCalledTimes(2)
  })
})
