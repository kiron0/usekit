import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useTimeTravel } from "../../registry/hooks/use-time-travel"

describe("useTimeTravel", () => {
  it("stores snapshots, restores entries, and clears history", () => {
    const restored: Array<{ count: number }> = []
    const { result } = renderHook(() =>
      useTimeTravel<{ count: number }>("time-travel-test", {
        maxHistory: 2,
        onRestore: (state) => restored.push(state),
      })
    )

    act(() => {
      result.current.snapshot({ count: 1 }, { label: "one" })
      result.current.snapshot({ count: 2 }, { label: "two" })
      result.current.snapshot({ count: 3 }, { label: "three" })
    })

    expect(result.current.history).toHaveLength(2)
    expect(result.current.history.map((entry) => entry.state)).toEqual([
      { count: 2 },
      { count: 3 },
    ])

    let restoredState: { count: number } | undefined

    act(() => {
      restoredState = result.current.restore(0)
    })

    expect(restoredState).toEqual({ count: 2 })
    expect(restored).toEqual([{ count: 2 }])

    act(() => {
      result.current.clear()
    })

    expect(result.current.history).toEqual([])
  })
})
