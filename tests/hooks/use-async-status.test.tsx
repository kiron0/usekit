import { act, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useAsyncStatus } from "../../registry/hooks/use-async-status"

describe("useAsyncStatus", () => {
  it("tracks loading and success states", async () => {
    let resolvePromise: ((value: { data: string }) => void) | undefined
    const asyncFn = vi.fn(
      () =>
        new Promise<{ data: string }>((resolve) => {
          resolvePromise = resolve
        })
    )

    const { result } = renderHook(() =>
      useAsyncStatus(asyncFn, {
        loading: "Loading...",
        success: (data) => `Done: ${data}`,
      })
    )

    await act(async () => {
      void result.current[0]("hello")
    })

    await waitFor(() => {
      expect(result.current[1].state).toBe("loading")
      expect(result.current[2]).toBe("Loading...")
    })

    await act(async () => {
      resolvePromise?.({ data: "HELLO" })
    })

    expect(result.current[1]).toEqual({
      state: "success",
      data: "HELLO",
    })
    expect(result.current[2]).toBe("Done: HELLO")
  })

  it("tracks error states from result payloads", async () => {
    const asyncFn = vi.fn(async () => ({ error: "Bad request" }))

    const { result } = renderHook(() =>
      useAsyncStatus(asyncFn, {
        error: (error) => `Error: ${error}`,
      })
    )

    await act(async () => {
      await result.current[0]()
    })

    expect(result.current[1]).toEqual({
      state: "error",
      error: "Bad request",
    })
    expect(result.current[2]).toBe("Error: Bad request")
  })
})
