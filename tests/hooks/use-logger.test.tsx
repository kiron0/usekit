import { renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useLogger } from "../../registry/hooks/use-logger"

describe("useLogger", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("logs mount, update, and unmount lifecycle messages", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {})

    const { rerender, unmount } = renderHook(
      ({ value }) => useLogger("Widget", value),
      {
        initialProps: { value: 1 },
      }
    )

    rerender({ value: 2 })
    unmount()

    expect(logSpy).toHaveBeenCalledWith("Widget mounted", 1)
    expect(logSpy).toHaveBeenCalledWith("Widget updated", 1)
    expect(logSpy).toHaveBeenCalledWith("Widget updated", 2)
    expect(logSpy).toHaveBeenCalledWith("Widget unmounted", 2)
  })
})
