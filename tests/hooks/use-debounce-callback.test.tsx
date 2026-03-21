import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useDebounceCallback } from "../../registry/hooks/use-debounce-callback"

describe("useDebounceCallback", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("delays invocation and tracks pending state", () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebounceCallback(callback, 100))

    expect(result.current.isPending()).toBe(false)

    act(() => {
      result.current("alpha")
    })

    expect(callback).not.toHaveBeenCalled()
    expect(result.current.isPending()).toBe(true)

    act(() => {
      vi.advanceTimersByTime(99)
    })

    expect(callback).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(callback).toHaveBeenCalledWith("alpha")
    expect(result.current.isPending()).toBe(false)
  })

  it("supports cancel and flush controls", () => {
    const callback = vi.fn((value: string) => value.toUpperCase())
    const { result } = renderHook(() => useDebounceCallback(callback, 100))

    act(() => {
      result.current("beta")
      result.current.cancel()
    })

    act(() => {
      vi.runAllTimers()
    })

    expect(callback).not.toHaveBeenCalled()
    expect(result.current.isPending()).toBe(false)

    let flushedValue: string | undefined
    act(() => {
      result.current("gamma")
      flushedValue = result.current.flush()
    })

    expect(callback).toHaveBeenCalledWith("gamma")
    expect(flushedValue).toBe("GAMMA")
    expect(result.current.isPending()).toBe(false)
  })
})
