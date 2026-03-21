import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useReducedMotion } from "../../registry/hooks/use-reduced-motion"

describe("useReducedMotion", () => {
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
        media: "(prefers-reduced-motion: reduce)",
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

  it("tracks reduced motion preference changes", () => {
    const { result } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(false)

    matches = true

    act(() => {
      changeListener?.()
    })

    expect(result.current).toBe(true)
  })
})
