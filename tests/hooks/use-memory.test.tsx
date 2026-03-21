import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useMemory } from "../../registry/hooks/use-memory"

describe("useMemory", () => {
  const originalMemory = (performance as Performance & { memory?: unknown })
    .memory

  beforeEach(() => {
    vi.useFakeTimers()
    Object.defineProperty(performance, "memory", {
      configurable: true,
      value: {
        jsHeapSizeLimit: 1000,
        totalJSHeapSize: 500,
        usedJSHeapSize: 250,
        [Symbol.toStringTag]: "MemoryInfo",
      },
    })
  })

  afterEach(() => {
    Object.defineProperty(performance, "memory", {
      configurable: true,
      value: originalMemory,
    })
  })

  it("reports memory info and updates on the interval", async () => {
    const { result } = renderHook(() =>
      useMemory({
        interval: 100,
      })
    )

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current.memory?.usedJSHeapSize).toBe(250)

    Object.defineProperty(performance, "memory", {
      configurable: true,
      value: {
        jsHeapSizeLimit: 1000,
        totalJSHeapSize: 700,
        usedJSHeapSize: 300,
        [Symbol.toStringTag]: "MemoryInfo",
      },
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current.memory?.usedJSHeapSize).toBe(300)
  })
})
