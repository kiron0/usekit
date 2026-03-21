import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { usePermission } from "../../registry/hooks/use-permission"

class MockPermissionStatus {
  state: "granted" | "denied" | "prompt"
  onchange: (() => void) | null = null
  private changeListener: (() => void) | null = null

  constructor(state: "granted" | "denied" | "prompt") {
    this.state = state
  }

  addEventListener(_type: "change", listener: () => void) {
    this.changeListener = listener
  }

  removeEventListener(_type: "change", listener: () => void) {
    if (this.changeListener === listener) {
      this.changeListener = null
    }
  }

  emit(state: "granted" | "denied" | "prompt") {
    this.state = state
    this.changeListener?.()
    this.onchange?.()
  }
}

describe("usePermission", () => {
  const originalPermissions = (
    navigator as Navigator & { permissions?: unknown }
  ).permissions

  afterEach(() => {
    if (originalPermissions) {
      Object.defineProperty(navigator, "permissions", {
        configurable: true,
        value: originalPermissions,
      })
    } else {
      delete (navigator as Navigator & { permissions?: unknown }).permissions
    }
  })

  it("loads and reacts to permission state changes", async () => {
    const status = new MockPermissionStatus("prompt")
    const query = vi.fn().mockResolvedValue(status)

    Object.defineProperty(navigator, "permissions", {
      configurable: true,
      value: { query },
    })

    const { result } = renderHook(() => usePermission("notifications"))

    await waitFor(() => expect(result.current.state).toBe("prompt"))
    expect(result.current.isSupported).toBe(true)
    expect(query).toHaveBeenCalledWith({ name: "notifications" })

    act(() => {
      status.emit("granted")
    })

    await waitFor(() => expect(result.current.state).toBe("granted"))
  })

  it("reports unsupported browsers", async () => {
    delete (navigator as Navigator & { permissions?: unknown }).permissions

    const { result } = renderHook(() => usePermission("geolocation"))

    await act(async () => {
      await result.current.refresh()
    })

    expect(result.current.isSupported).toBe(false)
    expect(result.current.state).toBeNull()
    expect(result.current.error?.message).toBe(
      "Permissions API is not supported in this browser."
    )
  })
})
