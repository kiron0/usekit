import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useLongPress } from "../../registry/hooks/use-long-press"

describe("useLongPress", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("fires start, callback, and finish for a completed long press", () => {
    const callback = vi.fn()
    const onStart = vi.fn()
    const onFinish = vi.fn()

    const { result } = renderHook(() =>
      useLongPress(callback, { threshold: 100, onStart, onFinish })
    )

    const startEvent = { type: "mousedown" } as React.MouseEvent
    const endEvent = { type: "mouseup" } as React.MouseEvent

    act(() => {
      result.current.onMouseDown(startEvent)
    })

    expect(onStart).toHaveBeenCalledWith(startEvent)

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(callback).toHaveBeenCalledWith(startEvent)

    act(() => {
      result.current.onMouseUp(endEvent)
    })

    expect(onFinish).toHaveBeenCalledWith(endEvent)
  })

  it("fires cancel when the press ends before the threshold", () => {
    const callback = vi.fn()
    const onCancel = vi.fn()

    const { result } = renderHook(() =>
      useLongPress(callback, { threshold: 100, onCancel })
    )

    const startEvent = { type: "touchstart" } as React.TouchEvent
    const endEvent = { type: "touchend" } as React.TouchEvent

    act(() => {
      result.current.onTouchStart(startEvent)
      vi.advanceTimersByTime(50)
      result.current.onTouchEnd(endEvent)
    })

    expect(callback).not.toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalledWith(endEvent)
  })
})
