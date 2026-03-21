import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useProgressiveUpload } from "../../registry/hooks/use-progressive-upload"

describe("useProgressiveUpload", () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it("uploads file chunks and completes progress", async () => {
    vi.useFakeTimers()

    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal("fetch", fetchMock)

    const file = new File(["abcdef"], "demo.txt", { type: "text/plain" })

    const { result } = renderHook(() =>
      useProgressiveUpload(file, {
        endpoint: "/upload",
        chunkSize: 2,
        storageKey: "upload-test",
      })
    )

    await act(async () => {
      const promise = result.current.start()
      await vi.advanceTimersByTimeAsync(500)
      await promise
    })

    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(result.current.progress).toBe(100)
    expect(result.current.error).toBeNull()
    expect(localStorage.getItem("upload-test")).toBeNull()
  })
})
