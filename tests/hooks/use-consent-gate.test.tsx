import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { useConsentGate } from "../../registry/hooks/use-consent-gate"

describe("useConsentGate", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("tracks granted features and persists them", () => {
    const { result } = renderHook(() =>
      useConsentGate(["analytics", "ads"], {
        storageKey: "consent-test",
        initialState: { analytics: true },
      })
    )

    expect(result.current.allowed("analytics")).toBe(true)
    expect(result.current.allowed("ads")).toBe(false)
    expect(result.current.allowedFeatures).toEqual(["analytics"])
    expect(result.current.allGranted).toBe(false)

    act(() => {
      result.current.request("ads", true)
    })

    expect(result.current.consents).toEqual({
      analytics: true,
      ads: true,
    })
    expect(result.current.allGranted).toBe(true)
    expect(window.localStorage.getItem("consent-test")).toBe(
      JSON.stringify({
        analytics: true,
        ads: true,
      })
    )

    act(() => {
      result.current.revoke("analytics")
    })

    expect(result.current.allowed("analytics")).toBe(false)
  })
})
