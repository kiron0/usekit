import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { useOrientation } from "../../registry/hooks/use-orientation"

describe("useOrientation", () => {
  let changeListener: (() => void) | undefined
  const originalOrientation = screen.orientation

  beforeEach(() => {
    changeListener = undefined
    Object.defineProperty(window, "orientation", {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(screen, "orientation", {
      configurable: true,
      value: {
        angle: 0,
        type: "portrait-primary",
        addEventListener: (_type: string, listener: () => void) => {
          changeListener = listener
        },
        removeEventListener: () => {
          changeListener = undefined
        },
      },
    })
  })

  afterEach(() => {
    Object.defineProperty(screen, "orientation", {
      configurable: true,
      value: originalOrientation,
    })
  })

  it("tracks screen orientation changes", () => {
    const { result } = renderHook(() => useOrientation())

    expect(result.current).toEqual({
      angle: 0,
      type: "portrait-primary",
    })

    Object.defineProperty(screen, "orientation", {
      configurable: true,
      value: {
        angle: 90,
        type: "landscape-primary",
        addEventListener: (_type: string, listener: () => void) => {
          changeListener = listener
        },
        removeEventListener: () => {
          changeListener = undefined
        },
      },
    })

    act(() => {
      changeListener?.()
    })

    expect(result.current).toEqual({
      angle: 90,
      type: "landscape-primary",
    })
  })
})
