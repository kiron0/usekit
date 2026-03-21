import * as React from "react"
import { renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useMemoryLeakGuard } from "../../registry/hooks/use-memory-leak-guard"

describe("useMemoryLeakGuard", () => {
  afterEach(() => {
    vi.restoreAllMocks()
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
