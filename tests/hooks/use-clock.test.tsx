import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useClock } from "../../registry/hooks/use-clock"

describe("useClock", () => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  })

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T10:00:00.000Z"))
  })

  it("formats the current time and updates on the configured interval", async () => {
    const { result } = renderHook(() =>
      useClock({
        locale: "en-GB",
        interval: 1000,
        formatOptions: {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "UTC",
        },
      })
    )

    expect(result.current).toBe(formatter.format(new Date()))

    await act(async () => {
      vi.setSystemTime(new Date("2026-01-01T10:00:01.000Z"))
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(result.current).toBe(formatter.format(new Date()))
  })
})
