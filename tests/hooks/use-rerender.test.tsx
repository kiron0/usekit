import * as React from "react"
import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useRerender } from "../../registry/hooks/use-rerender"

describe("useRerender", () => {
  it("forces a rerender when invoked", () => {
    const { result } = renderHook(() => {
      const renders = React.useRef(0)
      renders.current += 1

      return {
        count: renders.current,
        rerender: useRerender(),
      }
    })

    expect(result.current.count).toBe(1)

    act(() => {
      result.current.rerender()
    })

    expect(result.current.count).toBe(2)
  })
})
