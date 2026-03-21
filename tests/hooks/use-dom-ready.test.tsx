import { renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useDomReady } from "../../registry/hooks/use-dom-ready"

describe("useDomReady", () => {
  afterEach(() => {
    Object.defineProperty(document, "readyState", {
      configurable: true,
      value: "complete",
    })
  })

  it("runs immediately when the DOM is already ready", async () => {
    const callback = vi.fn()

    Object.defineProperty(document, "readyState", {
      configurable: true,
      value: "complete",
    })

    renderHook(() => useDomReady(callback))

    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })
})
