import * as React from "react"
import { renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useMemoryLeakGuard } from "../../registry/hooks/use-memory-leak-guard"

describe("useMemoryLeakGuard", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("restores the original timer globals after unmount", () => {
    const originalSetTimeout = window.setTimeout
    const originalClearTimeout = window.clearTimeout
    const originalSetInterval = window.setInterval
    const originalClearInterval = window.clearInterval

    const { unmount } = renderHook(() => useMemoryLeakGuard())

    expect(window.setTimeout).not.toBe(originalSetTimeout)
    expect(window.clearTimeout).not.toBe(originalClearTimeout)
    expect(window.setInterval).not.toBe(originalSetInterval)
    expect(window.clearInterval).not.toBe(originalClearInterval)

    unmount()

    expect(window.setTimeout).toBe(originalSetTimeout)
    expect(window.clearTimeout).toBe(originalClearTimeout)
    expect(window.setInterval).toBe(originalSetInterval)
    expect(window.clearInterval).toBe(originalClearInterval)
  })

  it("warns when a tracked ref points to a detached dom node", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    const setIntervalSpy = vi
      .spyOn(window, "setInterval")
      .mockImplementation(() => 1 as unknown as ReturnType<typeof setInterval>)
    const clearIntervalSpy = vi
      .spyOn(window, "clearInterval")
      .mockImplementation(() => {})
    const node = document.createElement("div")
    const ref = { current: node } as React.RefObject<Element | null>

    const { unmount } = renderHook(() =>
      useMemoryLeakGuard({
        refs: [ref],
        domCheckIntervalMs: 10,
      })
    )

    expect(warnSpy).toHaveBeenCalled()
    expect(String(warnSpy.mock.calls[0]?.[0])).toContain(
      "ref still points to a DOM node"
    )
    expect(setIntervalSpy).toHaveBeenCalled()

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})
