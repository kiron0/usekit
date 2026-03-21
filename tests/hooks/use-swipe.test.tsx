import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useSwipe } from "../../registry/hooks/use-swipe"

describe("useSwipe", () => {
  it("detects touch swipe directions above the threshold", () => {
    const onSwipe = vi.fn()
    const { result } = renderHook(() => useSwipe({ onSwipe, threshold: 20 }))

    act(() => {
      result.current.onTouchStart({
        touches: [{ clientX: 10, clientY: 10 }],
      } as React.TouchEvent)
      result.current.onTouchMove({
        touches: [{ clientX: 60, clientY: 15 }],
      } as React.TouchEvent)
      result.current.onTouchEnd()
    })

    expect(onSwipe).toHaveBeenCalledWith("right")
  })

  it("detects mouse swipes through window move/up listeners", () => {
    const onSwipe = vi.fn()
    const { result } = renderHook(() => useSwipe({ onSwipe, threshold: 20 }))

    act(() => {
      result.current.onMouseDown({
        clientX: 100,
        clientY: 100,
      } as React.MouseEvent)
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 90, clientY: 30 })
      )
      window.dispatchEvent(new MouseEvent("mouseup"))
    })

    expect(onSwipe).toHaveBeenCalledWith("up")
  })
})
