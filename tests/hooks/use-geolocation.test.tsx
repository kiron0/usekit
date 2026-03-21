import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useGeolocation } from "../../registry/hooks/use-geolocation"

describe("useGeolocation", () => {
  const originalGeolocation = navigator.geolocation
  const originalAlert = window.alert

  beforeEach(() => {
    window.alert = vi.fn()
  })

  afterEach(() => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: originalGeolocation,
    })
    window.alert = originalAlert
  })

  it("loads the current position and exposes coordinate state", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (success: PositionCallback) => {
          success({
            coords: {
              accuracy: 12,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              latitude: 23.81,
              longitude: 90.41,
              speed: null,
            },
            timestamp: 12345,
          } as GeolocationPosition)
        },
      },
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.latitude).toBe(23.81)
    expect(result.current.longitude).toBe(90.41)
    expect(result.current.error).toBeNull()
    expect(result.current.permissionDenied).toBe(false)
  })

  it("marks permission denial and alerts on retry when access is blocked", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (
          _success: PositionCallback,
          error: PositionErrorCallback
        ) => {
          error({
            code: 1,
            PERMISSION_DENIED: 1,
          } as GeolocationPositionError)
        },
      },
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.permissionDenied).toBe(true)

    act(() => {
      result.current.retry()
    })

    expect(window.alert).toHaveBeenCalledTimes(1)
  })
})
