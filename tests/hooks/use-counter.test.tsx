import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useCounter } from "../../registry/hooks/use-counter"

describe("useCounter", () => {
  it("increments, decrements, resets, and allows direct assignment", () => {
    const { result } = renderHook(() => useCounter(2))

    expect(result.current.count).toBe(2)

    act(() => result.current.increment())
    expect(result.current.count).toBe(3)

    act(() => result.current.decrement())
    expect(result.current.count).toBe(2)

    act(() => result.current.setCount(9))
    expect(result.current.count).toBe(9)

    act(() => result.current.reset())
    expect(result.current.count).toBe(2)
  })
})
