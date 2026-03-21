import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useHistoryState } from "../../registry/hooks/use-history-state"

describe("useHistoryState", () => {
  it("supports set, undo, redo, and clear", () => {
    const { result } = renderHook(() =>
      useHistoryState({
        count: 0,
      })
    )

    expect(result.current.state).toEqual({ count: 0 })
    expect(result.current.canUndo).toBe(false)

    act(() => {
      result.current.set({ count: 1 })
      result.current.set({ count: 2 })
    })

    expect(result.current.state).toEqual({ count: 2 })
    expect(result.current.canUndo).toBe(true)

    act(() => {
      result.current.undo()
    })
    expect(result.current.state).toEqual({ count: 1 })
    expect(result.current.canRedo).toBe(true)

    act(() => {
      result.current.redo()
    })
    expect(result.current.state).toEqual({ count: 2 })

    act(() => {
      result.current.clear()
    })
    expect(result.current.state).toEqual({ count: 0 })
  })
})
