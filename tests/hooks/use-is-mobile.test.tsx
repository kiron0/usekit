import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useIsMobile } from "../../registry/hooks/use-is-mobile"

describe("useIsMobile", () => {
  let listener: (() => void) | undefined
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    listener = undefined
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 500,
      writable: true,
    })
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({
        addEventListener: (_type: string, cb: () => void) => {
          listener = cb
        },
        removeEventListener: vi.fn(),
      })),
    })
  })

  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: originalMatchMedia,
    })
  })

  it("tracks mobile viewport changes", async () => {
    const { result } = renderHook(() => useIsMobile())

    await waitFor(() => {
      expect(result.current).toBe(true)
    })

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 900,
    })

    act(() => {
      listener?.()
    })

    expect(result.current).toBe(false)
  })
})
