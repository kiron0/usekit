import { renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useFetch } from "../../registry/hooks/use-fetch"

describe("useFetch", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("fetches json data and reuses cached results for the same url", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ id: 1, name: "alpha" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ id: 2, name: "beta" }),
      })
    const options = { cache: true }

    vi.stubGlobal("fetch", fetchMock)

    const { result, rerender } = renderHook(
      ({ url }) => useFetch<{ id: number; name: string }>(url, options),
      {
        initialProps: { url: "/api/items" },
      }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual({ id: 1, name: "alpha" })
    expect(result.current.error).toBeUndefined()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    rerender({ url: "/api/other" })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual({ id: 2, name: "beta" })
    expect(fetchMock).toHaveBeenCalledTimes(2)

    rerender({ url: "/api/items" })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual({ id: 1, name: "alpha" })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("surfaces response errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    )

    const { result } = renderHook(() => useFetch("/api/fail"))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toBeUndefined()
    expect(result.current.error?.message).toBe("HTTP error! Status: 500")
  })
})
