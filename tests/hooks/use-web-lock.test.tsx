import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useWebLock } from "../../registry/hooks/use-web-lock"

type LockMode = "exclusive" | "shared"

class MockLockManager {
  shouldReturnNull = false
  request = vi.fn(
    async (
      name: string,
      options: {
        mode?: LockMode
        ifAvailable?: boolean
        steal?: boolean
      },
      callback: (lock: { name: string; mode: LockMode } | null) => Promise<void>
    ) => {
      if (this.shouldReturnNull) {
        await callback(null)
        return
      }

      await callback({
        name,
        mode: options.mode ?? "exclusive",
      })
    }
  )
}

describe("useWebLock", () => {
  const originalLocks = (navigator as Navigator & { locks?: unknown }).locks

  afterEach(() => {
    if (originalLocks) {
      Object.defineProperty(navigator, "locks", {
        configurable: true,
        value: originalLocks,
      })
    } else {
      delete (navigator as Navigator & { locks?: unknown }).locks
    }
  })

  it("acquires and releases a web lock", async () => {
    const locks = new MockLockManager()
    const onAcquire = vi.fn()
    const onRelease = vi.fn()

    Object.defineProperty(navigator, "locks", {
      configurable: true,
      value: locks,
    })

    const { result } = renderHook(() =>
      useWebLock("sync-room", { onAcquire, onRelease })
    )

    await act(async () => {
      expect(await result.current.acquire()).toBe(true)
    })

    expect(result.current.isSupported).toBe(true)
    expect(result.current.isLocked).toBe(true)
    expect(locks.request).toHaveBeenCalledWith(
      "sync-room",
      { mode: "exclusive", ifAvailable: false, steal: false },
      expect.any(Function)
    )
    expect(onAcquire).toHaveBeenCalledWith({
      name: "sync-room",
      mode: "exclusive",
    })

    act(() => {
      result.current.release()
    })

    await waitFor(() => expect(result.current.isLocked).toBe(false))
    expect(onRelease).toHaveBeenCalledTimes(1)
  })

  it("returns false when the lock is unavailable with ifAvailable", async () => {
    const locks = new MockLockManager()
    locks.shouldReturnNull = true

    Object.defineProperty(navigator, "locks", {
      configurable: true,
      value: locks,
    })

    const { result } = renderHook(() =>
      useWebLock("maybe-lock", { ifAvailable: true })
    )

    await act(async () => {
      expect(await result.current.acquire()).toBe(false)
    })

    expect(result.current.isLocked).toBe(false)
  })

  it("reports unsupported browsers", async () => {
    delete (navigator as Navigator & { locks?: unknown }).locks

    const { result } = renderHook(() => useWebLock("missing"))

    await act(async () => {
      expect(await result.current.acquire()).toBe(false)
    })

    expect(result.current.isSupported).toBe(false)
    expect(result.current.error?.message).toBe(
      "Web Locks API is not supported in this browser."
    )
  })
})
