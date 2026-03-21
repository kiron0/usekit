import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useQueue } from "../../registry/hooks/use-queue"

describe("useQueue", () => {
  it("adds, removes, and clears queue items", () => {
    const { result } = renderHook(() => useQueue(["a"]))

    expect(result.current.queue).toEqual(["a"])
    expect(result.current.first).toBe("a")
    expect(result.current.last).toBe("a")
    expect(result.current.size).toBe(1)

    act(() => {
      result.current.add("b")
      result.current.add("c")
    })
    expect(result.current.queue).toEqual(["a", "b", "c"])
    expect(result.current.first).toBe("a")
    expect(result.current.last).toBe("c")
    expect(result.current.size).toBe(3)

    act(() => {
      result.current.remove()
    })
    expect(result.current.queue).toEqual(["b", "c"])

    act(() => {
      result.current.clear()
    })
    expect(result.current.queue).toEqual([])
    expect(result.current.size).toBe(0)
  })
})
