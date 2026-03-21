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

  it("keeps chunk boundaries stable when adaptive sizing changes mid-upload", async () => {
    vi.useFakeTimers()

    const performanceSamples = [0, 200, 200, 400, 400, 600]
    const lastSample = performanceSamples[performanceSamples.length - 1] ?? 0

    vi.spyOn(performance, "now").mockImplementation(() => {
      return performanceSamples.shift() ?? lastSample
    })

    const uploadedChunks: string[] = []
    const uploadedSizes: number[] = []

    const fetchMock = vi.fn().mockImplementation(async (_input, init) => {
      const chunk = (init?.body as FormData).get("chunk") as Blob
      uploadedChunks.push(await chunk.text())
      uploadedSizes.push(chunk.size)
      return { ok: true }
    })

    vi.stubGlobal("fetch", fetchMock)

    const file = new File(["abcdefghij"], "demo.txt", { type: "text/plain" })

    const { result } = renderHook(() =>
      useProgressiveUpload(file, {
        endpoint: "/upload",
        chunkSize: 4,
        minChunkSize: 2,
        maxChunkSize: 8,
        storageKey: "upload-adaptive-test",
      })
    )

    await act(async () => {
      const promise = result.current.start()
      await vi.advanceTimersByTimeAsync(500)
      await promise
    })

    expect(uploadedChunks).toEqual(["abcd", "efgh", "ij"])
    expect(uploadedSizes).toEqual([4, 4, 2])
    expect(result.current.progress).toBe(100)
  })

  it("resumes from persisted upload state using the saved chunk map", async () => {
    vi.useFakeTimers()

    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal("fetch", fetchMock)

    const file = new File(["abcdefghij"], "demo.txt", { type: "text/plain" })
    const fileId = `${file.name}-${file.size}-${file.lastModified}`

    localStorage.setItem(
      "upload-resume-test",
      JSON.stringify({
        fileId,
        totalChunks: 3,
        uploadedChunks: [0],
        chunkSize: 4,
        lastChunkIndex: 1,
      })
    )

    const { result } = renderHook(() =>
      useProgressiveUpload(file, {
        endpoint: "/upload",
        chunkSize: 4,
        storageKey: "upload-resume-test",
      })
    )

    await act(async () => {
      const promise = result.current.start()
      await vi.advanceTimersByTimeAsync(500)
      await promise
    })

    const uploadedIndices = fetchMock.mock.calls.map(([, init]) =>
      Number((init?.body as FormData).get("chunkIndex"))
    )

    expect(uploadedIndices).toEqual([1, 2])
    expect(result.current.progress).toBe(100)
    expect(localStorage.getItem("upload-resume-test")).toBeNull()
  })
})
