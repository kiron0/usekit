import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { useOnlineStatus } from "../../registry/hooks/use-online-status"

describe("useOnlineStatus", () => {
  beforeEach(() => {
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    })
  })

  it("tracks browser online and offline events", () => {
    const { result } = renderHook(() => useOnlineStatus())

    expect(result.current).toBe(true)

    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false,
    })

    act(() => {
      window.dispatchEvent(new Event("offline"))
    })
    expect(result.current).toBe(false)

    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    })

    act(() => {
      window.dispatchEvent(new Event("online"))
    })
    expect(result.current).toBe(true)
  })
})
