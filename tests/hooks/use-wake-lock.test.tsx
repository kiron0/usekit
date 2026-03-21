import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useWakeLock } from "../../registry/hooks/use-wake-lock"

type WakeLockSentinelLike = {
  released: boolean
  type: "screen"
  onrelease: ((event: Event) => void) | null
  release: ReturnType<typeof vi.fn>
}

function createSentinel(): WakeLockSentinelLike {
  const sentinel: WakeLockSentinelLike = {
    released: false,
    type: "screen",
    onrelease: null,
    release: vi.fn(async () => {
      sentinel.released = true
      sentinel.onrelease?.(new Event("release"))
    }),
  }

  return sentinel
}

describe("useWakeLock", () => {
  const originalWakeLock = (
    navigator as Navigator & {
      wakeLock?: unknown
    }
  ).wakeLock

  afterEach(() => {
    Object.defineProperty(navigator, "wakeLock", {
      configurable: true,
      value: originalWakeLock,
    })

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    })
  })

  it("requests and releases a wake lock", async () => {
    const sentinel = createSentinel()
    const request = vi.fn().mockResolvedValue(sentinel)

    Object.defineProperty(navigator, "wakeLock", {
      configurable: true,
      value: { request },
    })

    const { result } = renderHook(() => useWakeLock())

    await act(async () => {
      await result.current.request()
    })

    expect(result.current.isSupported).toBe(true)
    expect(result.current.isActive).toBe(true)
    expect(request).toHaveBeenCalledWith("screen")

    await act(async () => {
      await result.current.release()
    })

    expect(sentinel.release).toHaveBeenCalledTimes(1)
    expect(result.current.isActive).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it("reacquires a wake lock when the page becomes visible again", async () => {
    const firstSentinel = createSentinel()
    const secondSentinel = createSentinel()
    const request = vi
      .fn()
      .mockResolvedValueOnce(firstSentinel)
      .mockResolvedValueOnce(secondSentinel)

    Object.defineProperty(navigator, "wakeLock", {
      configurable: true,
      value: { request },
    })

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    })

    const { result } = renderHook(() => useWakeLock())

    await act(async () => {
      await result.current.request()
    })

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    })

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"))
    })

    await waitFor(() => expect(result.current.isActive).toBe(false))
    expect(firstSentinel.release).toHaveBeenCalledTimes(1)

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    })

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"))
    })

    await waitFor(() => expect(result.current.isActive).toBe(true))
    expect(request).toHaveBeenCalledTimes(2)
  })

  it("reports unsupported browsers", async () => {
    Object.defineProperty(navigator, "wakeLock", {
      configurable: true,
      value: undefined,
    })

    const { result } = renderHook(() => useWakeLock())

    await act(async () => {
      await result.current.request()
    })

    expect(result.current.isSupported).toBe(false)
    expect(result.current.isActive).toBe(false)
    expect(result.current.error?.message).toBe(
      "Wake Lock API is not supported in this browser."
    )
  })
})
