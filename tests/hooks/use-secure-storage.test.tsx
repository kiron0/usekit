import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useSecureStorage } from "../../registry/hooks/use-secure-storage"

describe("useSecureStorage", () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("encrypts stored values, restores them, and removes them", async () => {
    const { result } = renderHook(() =>
      useSecureStorage("token", "initial", {
        encryptionKey: "secret-key",
      })
    )

    await act(async () => {
      await result.current.setValue("updated")
    })

    expect(result.current.value).toBe("updated")
    const raw = window.localStorage.getItem("token")
    expect(raw).toBeTruthy()
    expect(raw).not.toContain("updated")

    act(() => {
      result.current.remove()
    })

    expect(result.current.value).toBe("initial")
    expect(window.localStorage.getItem("token")).toBeNull()
  })

  it("expires ttl-backed values and resets to the initial value", async () => {
    const { result } = renderHook(() =>
      useSecureStorage("session", "fallback", {
        encryptionKey: "secret-key",
        ttl: 500,
      })
    )

    await act(async () => {
      await result.current.setValue("short-lived")
    })

    expect(result.current.value).toBe("short-lived")

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.value).toBe("fallback")
    expect(window.localStorage.getItem("session")).toBeNull()
  })
})
