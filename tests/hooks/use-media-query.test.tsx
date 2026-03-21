import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useMediaQuery } from "../../registry/hooks/use-media-query"

describe("useMediaQuery", () => {
  let matches = false
  let changeListener: (() => void) | undefined
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    matches = false
    changeListener = undefined
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({
        get matches() {
          return matches
        },
        media: "(min-width: 768px)",
        addEventListener: (_type: string, listener: () => void) => {
          changeListener = listener
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

  it("tracks media query changes", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"))

    expect(result.current).toBe(false)

    matches = true

    act(() => {
      changeListener?.()
    })

    expect(result.current).toBe(true)
  })
})
