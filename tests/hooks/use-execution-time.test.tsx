import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useExecutionTime } from "../../registry/hooks/use-execution-time"

describe("useExecutionTime", () => {
  beforeEach(() => {
    vi.spyOn(performance, "now")
  })

  it("measures async execution time and exposes running state", async () => {
    const { result } = renderHook(() => useExecutionTime())
    let resolvePromise: ((value: string) => void) | undefined

    await act(async () => {
      void result.current.runWithTiming(
        () =>
          new Promise<string>((resolve) => {
            resolvePromise = resolve
          })
      )
    })

    await waitFor(() => {
      expect(result.current.isRunning).toBe(true)
    })

    await act(async () => {
      resolvePromise?.("done")
    })

    expect(result.current.isRunning).toBe(false)
    expect(result.current.time).not.toBeNull()
    expect(result.current.time!).toBeGreaterThanOrEqual(0)
  })
})
