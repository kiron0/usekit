import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useNetworkQuality } from "../../registry/hooks/use-network-quality"

describe("useNetworkQuality", () => {
  const originalFetch = globalThis.fetch
  let nowValues: number[] = []

  beforeEach(() => {
    nowValues = [0, 40, 100, 200, 300, 400]
    vi.spyOn(performance, "now").mockImplementation(
      () => nowValues.shift() ?? 0
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
    globalThis.fetch = originalFetch
  })

  it("measures network quality and derives a category", async () => {
    globalThis.fetch = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const method = init?.method ?? "GET"

      if (method === "HEAD") {
        return Promise.resolve(new Response(null, { status: 200 }))
      }

      if (method === "POST") {
        return Promise.resolve(new Response(null, { status: 200 }))
      }

      return Promise.resolve({
        blob: async () => new Blob([new Uint8Array(10 * 1024)]),
      } as Response)
    }) as typeof fetch

    const { result } = renderHook(() =>
      useNetworkQuality({
        sampleInterval: 0,
        testEndpoint: "/ping",
      })
    )

    await waitFor(() => expect(result.current.isMeasuring).toBe(false))

    expect(globalThis.fetch).toHaveBeenCalledTimes(3)
    expect(result.current.rtt).toBeGreaterThanOrEqual(0)
    expect(result.current.downKbps).toBeGreaterThan(0)
    expect(result.current.upKbps).toBeGreaterThan(0)
    expect(["excellent", "good", "fair", "poor"]).toContain(
      result.current.category
    )
    expect(result.current.error).toBeNull()
  })
})
