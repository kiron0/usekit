import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useObjectState } from "../../registry/hooks/use-object-state"

describe("useObjectState", () => {
  it("merges object patches and functional updates", () => {
    const { result } = renderHook(() =>
      useObjectState({ count: 1, label: "start" })
    )

    act(() => result.current[1]({ label: "updated" }))
    expect(result.current[0]).toEqual({ count: 1, label: "updated" })

    act(() =>
      result.current[1]((prev) => ({
        count: prev.count + 1,
      }))
    )

    expect(result.current[0]).toEqual({ count: 2, label: "updated" })
  })
})
