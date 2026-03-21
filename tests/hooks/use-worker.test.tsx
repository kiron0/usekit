import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useWorker } from "../../registry/hooks/use-worker"

class MockWorker {
  onmessage: ((event: { data: unknown }) => void) | null = null
  onerror: ((event: { message: string }) => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()

  constructor(public script: string) {}
}

describe("useWorker", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("runs worker jobs and surfaces responses and errors", () => {
    class TestWorker extends MockWorker {
      static instance: MockWorker | null = null

      constructor(script: string) {
        super(script)
        TestWorker.instance = this
      }
    }

    vi.stubGlobal("Worker", TestWorker)

    const { result } = renderHook(() => useWorker<number>("worker.js"))

    act(() => {
      result.current.run({ value: 2 })
    })

    expect(result.current.isRunning).toBe(true)
    expect(TestWorker.instance?.postMessage).toHaveBeenCalledWith({ value: 2 })

    act(() => {
      TestWorker.instance?.onmessage?.({ data: 4 })
    })

    expect(result.current.result).toBe(4)
    expect(result.current.isRunning).toBe(false)

    act(() => {
      result.current.run({ value: 3 })
      TestWorker.instance?.onerror?.({ message: "boom" })
    })

    expect(result.current.error?.message).toBe("boom")
    expect(result.current.isRunning).toBe(false)
  })
})
