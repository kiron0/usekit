import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useIdleCallback } from "../../registry/hooks/use-idle-callback"

type IdleCallbackEntry = {
  callback: (deadline: {
    didTimeout: boolean
    timeRemaining: () => number
  }) => void
}

describe("useIdleCallback", () => {
  const originalRequestIdleCallback = window.requestIdleCallback
  const originalCancelIdleCallback = window.cancelIdleCallback

  afterEach(() => {
    if (originalRequestIdleCallback) {
      window.requestIdleCallback = originalRequestIdleCallback
    } else {
      delete (window as Window & { requestIdleCallback?: unknown })
        .requestIdleCallback
    }

    if (originalCancelIdleCallback) {
      window.cancelIdleCallback = originalCancelIdleCallback
    } else {
      delete (window as Window & { cancelIdleCallback?: unknown })
        .cancelIdleCallback
    }
  })

  it("starts automatically and invokes the callback with deadline info", () => {
    let nextId = 1
    const entries = new Map<number, IdleCallbackEntry>()
    const callback = vi.fn()

    window.requestIdleCallback = vi.fn((cb) => {
      const id = nextId++
      entries.set(id, { callback: cb })
      return id
    })
    window.cancelIdleCallback = vi.fn((id) => {
      entries.delete(id)
    })

    const { result } = renderHook(() => useIdleCallback(callback))

    expect(result.current.isSupported).toBe(true)
    expect(result.current.isPending).toBe(true)

    act(() => {
      entries.get(1)?.callback({
        didTimeout: false,
        timeRemaining: () => 12,
      })
    })

    expect(callback).toHaveBeenCalledWith({
      didTimeout: false,
      timeRemaining: expect.any(Function),
    })
    expect(result.current.isPending).toBe(false)
    expect(result.current.didTimeout).toBe(false)
  })

  it("cancels a scheduled idle callback", () => {
    let nextId = 1
    const callback = vi.fn()

    window.requestIdleCallback = vi.fn(() => nextId++)
    window.cancelIdleCallback = vi.fn()

    const { result } = renderHook(() =>
      useIdleCallback(callback, { autoStart: false })
    )

    act(() => {
      result.current.start()
    })

    expect(result.current.isPending).toBe(true)

    act(() => {
      result.current.cancel()
    })

    expect(window.cancelIdleCallback).toHaveBeenCalledWith(1)
    expect(result.current.isPending).toBe(false)
  })

  it("reports unsupported browsers", () => {
    delete (window as Window & { requestIdleCallback?: unknown })
      .requestIdleCallback
    delete (window as Window & { cancelIdleCallback?: unknown })
      .cancelIdleCallback

    const callback = vi.fn()
    const { result } = renderHook(() =>
      useIdleCallback(callback, { autoStart: false })
    )

    expect(result.current.isSupported).toBe(false)
    expect(result.current.start()).toBe(false)
  })
})
