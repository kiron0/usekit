import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  createTinyReduxStore,
  useTinyRedux,
} from "../../registry/hooks/use-tiny-redux"

describe("useTinyRedux", () => {
  it("subscribes to store updates and exposes helpers", () => {
    const store = createTinyReduxStore({ count: 0, label: "alpha" })
    const { result } = renderHook(() =>
      useTinyRedux(store, {
        selector: (state) => state.count,
      })
    )

    expect(result.current.state).toBe(0)
    expect(result.current.get()).toEqual({ count: 0, label: "alpha" })

    act(() => {
      result.current.set((prev) => ({ ...prev, count: prev.count + 1 }))
    })

    expect(result.current.state).toBe(1)
  })
})
