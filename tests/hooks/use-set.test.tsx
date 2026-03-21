import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useSet } from "../../registry/hooks/use-set"

describe("useSet", () => {
  it("supports add, delete, and clear while preserving set semantics", () => {
    const { result } = renderHook(() => useSet(["a"]))

    expect(Array.from(result.current)).toEqual(["a"])

    act(() => {
      result.current.add("b")
      result.current.add("b")
    })
    expect(Array.from(result.current)).toEqual(["a", "b"])

    act(() => {
      result.current.delete("a")
    })
    expect(Array.from(result.current)).toEqual(["b"])

    act(() => {
      result.current.clear()
    })
    expect(Array.from(result.current)).toEqual([])
  })
})
