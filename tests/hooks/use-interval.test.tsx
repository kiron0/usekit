import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useInterval } from "../../registry/hooks/use-interval"

describe("useInterval", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it("runs on the configured interval and stops after unmount", () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useInterval(callback, 100))

    vi.advanceTimersByTime(350)
    expect(callback).toHaveBeenCalledTimes(3)

    unmount()
    vi.advanceTimersByTime(300)
    expect(callback).toHaveBeenCalledTimes(3)
  })
})
