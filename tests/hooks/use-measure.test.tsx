import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useMeasure } from "../../registry/hooks/use-measure"

let resizeCallback:
  | ((
      entries: Array<{
        borderBoxSize?: Array<{ inlineSize: number; blockSize: number }>
        contentRect?: { width: number; height: number }
      }>
    ) => void)
  | undefined
const disconnect = vi.fn()

class MockResizeObserver {
  constructor(
    callback: (
      entries: Array<{
        borderBoxSize?: Array<{ inlineSize: number; blockSize: number }>
        contentRect?: { width: number; height: number }
      }>
    ) => void
  ) {
    resizeCallback = callback
  }

  observe = vi.fn()
  disconnect = disconnect
}

describe("useMeasure", () => {
  beforeEach(() => {
    resizeCallback = undefined
    disconnect.mockReset()
    vi.stubGlobal("ResizeObserver", MockResizeObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("updates dimensions from resize observer entries", () => {
    const { result } = renderHook(() => useMeasure())
    const element = document.createElement("div")

    act(() => {
      result.current[0](element)
    })

    act(() => {
      resizeCallback?.([
        {
          borderBoxSize: [{ inlineSize: 320, blockSize: 120 }],
        },
      ])
    })

    expect(result.current[1]).toEqual({
      width: 320,
      height: 120,
    })
  })
})
