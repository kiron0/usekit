import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useControlledState } from "../../registry/hooks/use-controlled-state"

describe("useControlledState", () => {
  it("uses internal state when uncontrolled", () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useControlledState({
        defaultProp: "draft",
        onChange,
      })
    )

    expect(result.current[0]).toBe("draft")

    act(() => result.current[1]("published"))

    expect(result.current[0]).toBe("published")
    expect(onChange).toHaveBeenCalledWith("published")
  })

  it("calls onChange without mutating the controlled value", () => {
    const onChange = vi.fn()
    const { result, rerender } = renderHook(
      ({ prop }) =>
        useControlledState({
          prop,
          onChange,
        }),
      {
        initialProps: { prop: "external" },
      }
    )

    act(() => result.current[1]("next"))

    expect(result.current[0]).toBe("external")
    expect(onChange).toHaveBeenCalledWith("next")

    rerender({ prop: "next" })
    expect(result.current[0]).toBe("next")
  })
})
