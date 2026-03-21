import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useThrottle } from "../../registry/hooks/use-throttle"

describe("useThrottle", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"))
  })

  it("delays updates until the throttle interval has elapsed", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 500),
      {
        initialProps: { value: "a" },
      }
    )

    expect(result.current).toBe("a")

    rerender({ value: "b" })
    expect(result.current).toBe("a")

    await act(async () => {
      vi.setSystemTime(new Date("2026-01-01T00:00:00.500Z"))
      await vi.advanceTimersByTimeAsync(500)
    })

    expect(result.current).toBe("b")
  })
})
