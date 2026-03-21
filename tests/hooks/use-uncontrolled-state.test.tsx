import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useUncontrolledState } from "../../registry/hooks/use-uncontrolled-state"

describe("useUncontrolledState", () => {
  it("stores local state and notifies on actual changes", () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useUncontrolledState({
        defaultProp: "draft",
        onChange,
      })
    )

    expect(result.current[0]).toBe("draft")

    act(() => result.current[1]("draft"))
    expect(onChange).not.toHaveBeenCalled()

    act(() => result.current[1]("published"))
    expect(result.current[0]).toBe("published")
    expect(onChange).toHaveBeenCalledWith("published")
  })
})
