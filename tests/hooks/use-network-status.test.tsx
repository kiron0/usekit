import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useNetworkStatus } from "../../registry/hooks/use-network-status"

describe("useNetworkStatus", () => {
  const listeners = new Map<string, () => void>()
  const connection = {
    effectiveType: "4g",
    downlink: 10,
    addEventListener: vi.fn((type: string, listener: () => void) => {
      listeners.set(type, listener)
    }),
    removeEventListener: vi.fn((type: string) => {
      listeners.delete(type)
    }),
  }

  beforeEach(() => {
    listeners.clear()
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    })
    Object.defineProperty(window.navigator, "connection", {
      configurable: true,
      value: connection,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("tracks online state and connection changes", () => {
    const { result } = renderHook(() => useNetworkStatus())

    expect(result.current).toEqual({
      online: true,
      effectiveType: "4g",
      downlink: 10,
    })

    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false,
    })
    connection.effectiveType = "3g"
    connection.downlink = 2

    act(() => {
      window.dispatchEvent(new Event("offline"))
    })

    expect(result.current).toEqual({
      online: false,
      effectiveType: "3g",
      downlink: 2,
    })

    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    })
    connection.effectiveType = "wifi"
    connection.downlink = 50

    act(() => {
      listeners.get("change")?.()
    })

    expect(result.current).toEqual({
      online: true,
      effectiveType: "wifi",
      downlink: 50,
    })
  })
})
