import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useList } from "../../registry/hooks/use-list"

describe("useList", () => {
  it("supports replacing, inserting, updating, removing, and clearing items", () => {
    const { result } = renderHook(() => useList(["a", "b"]))

    expect(result.current[0]).toEqual(["a", "b"])

    act(() => result.current[1].push("c"))
    expect(result.current[0]).toEqual(["a", "b", "c"])

    act(() => result.current[1].insertAt(1, "x"))
    expect(result.current[0]).toEqual(["a", "x", "b", "c"])

    act(() => result.current[1].updateAt(2, "y"))
    expect(result.current[0]).toEqual(["a", "x", "y", "c"])

    act(() => result.current[1].removeAt(0))
    expect(result.current[0]).toEqual(["x", "y", "c"])

    act(() => result.current[1].set(["reset"]))
    expect(result.current[0]).toEqual(["reset"])

    act(() => result.current[1].clear())
    expect(result.current[0]).toEqual([])
  })
})
