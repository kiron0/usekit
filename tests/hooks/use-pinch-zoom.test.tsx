import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { usePinchZoom } from "../../registry/hooks/use-pinch-zoom"

describe("usePinchZoom", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "maxTouchPoints", {
      configurable: true,
      value: 2,
    })
  })

  afterEach(() => {
    Object.defineProperty(navigator, "maxTouchPoints", {
      configurable: true,
      value: 0,
    })
    vi.restoreAllMocks()
  })

  it("updates scale during a pinch gesture", () => {
    const onZoom = vi.fn()
    const { result } = renderHook(() =>
      usePinchZoom({
        minScale: 1,
        maxScale: 2,
        onZoom,
      })
    )

    act(() => {
      result.current.onTouchStart?.({
        touches: [
          { clientX: 0, clientY: 0 },
          { clientX: 0, clientY: 10 },
        ],
      } as React.TouchEvent)
      result.current.onTouchMove?.({
        touches: [
          { clientX: 0, clientY: 0 },
          { clientX: 0, clientY: 20 },
        ],
      } as React.TouchEvent)
      result.current.onTouchEnd?.()
    })

    expect(result.current.scale).toBe(2)
    expect(onZoom).toHaveBeenCalledWith(2)
    expect(result.current.isSupported).toBe(true)
  })
})
