import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { usePageTransition } from "../../registry/hooks/use-page-transition"

describe("usePageTransition", () => {
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState

  beforeEach(() => {
    vi.useFakeTimers()
    const now = 0

    vi.spyOn(performance, "now").mockImplementation(() => now)
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(now)
      return 1
    })
  })

  afterEach(() => {
    history.pushState = originalPushState
    history.replaceState = originalReplaceState
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it("wraps history changes in a transition window", async () => {
    const { result } = renderHook(() => usePageTransition({ minDuration: 50 }))

    act(() => {
      history.pushState({}, "", "#direct-test")
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.isTransitioning).toBe(true)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(50)
      await Promise.resolve()
    })

    expect(result.current.isTransitioning).toBe(false)
  })

  it("keeps remaining instances subscribed after another instance unmounts", async () => {
    const first = renderHook(() => usePageTransition({ minDuration: 50 }))
    const patchedPushState = history.pushState
    const second = renderHook(() => usePageTransition({ minDuration: 50 }))

    expect(history.pushState).toBe(patchedPushState)

    first.unmount()

    act(() => {
      history.pushState({}, "", "#multi-instance")
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(second.result.current.isTransitioning).toBe(true)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(50)
      await Promise.resolve()
    })

    expect(second.result.current.isTransitioning).toBe(false)

    second.unmount()
  })
})
