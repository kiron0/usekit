import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useMap } from "../../registry/hooks/use-map"

describe("useMap", () => {
  it("mutates the reactive map and reflects updates", () => {
    const { result } = renderHook(() => useMap<string, number>([["a", 1]]))

    expect(Array.from(result.current.entries())).toEqual([["a", 1]])

    act(() => {
      result.current.set("b", 2)
      result.current.set("a", 3)
    })
    expect(Array.from(result.current.entries())).toEqual([
      ["a", 3],
      ["b", 2],
    ])

    act(() => {
      result.current.delete("b")
    })
    expect(Array.from(result.current.entries())).toEqual([["a", 3]])

    act(() => {
      result.current.clear()
    })
    expect(Array.from(result.current.entries())).toEqual([])
  })
})
