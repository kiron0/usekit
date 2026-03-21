import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useIntervalWhen } from "../../registry/hooks/use-interval-when"

describe("useIntervalWhen", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it("runs on an interval only while enabled", () => {
    const callback = vi.fn()

    const { result, rerender } = renderHook(
      ({ when }) =>
        useIntervalWhen(callback, {
          ms: 100,
          when,
          startImmediately: true,
        }),
      {
        initialProps: { when: true },
      }
    )

    expect(callback).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(callback).toHaveBeenCalledTimes(3)

    rerender({ when: false })

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(callback).toHaveBeenCalledTimes(3)

    act(() => {
      result.current()
    })
  })
})
