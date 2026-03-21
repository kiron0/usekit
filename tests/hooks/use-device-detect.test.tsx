import { renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useDeviceDetect } from "../../registry/hooks/use-device-detect"

describe("useDeviceDetect", () => {
  it("detects mobile user agents", async () => {
    Object.defineProperty(window.navigator, "userAgent", {
      configurable: true,
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    })

    const { result } = renderHook(() => useDeviceDetect())

    await waitFor(() => {
      expect(result.current.isMobile).toBe(true)
    })

    expect(result.current.isTablet).toBe(false)
    expect(result.current.isDesktop).toBe(false)
  })
})
