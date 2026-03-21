import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useTimeout } from "../../registry/hooks/use-timeout"

describe("useTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it("runs once after the delay and cancels on unmount", () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useTimeout(callback, 100))

    vi.advanceTimersByTime(99)
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledTimes(1)

    unmount()
    vi.advanceTimersByTime(100)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
