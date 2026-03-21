import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useDefault } from "../../registry/hooks/use-default"

describe("useDefault", () => {
  it("updates state and falls back to the provided default on nullish values", () => {
    const { result } = renderHook(() => useDefault("initial", "fallback"))

    expect(result.current[0]).toBe("initial")

    act(() => result.current[1]("updated"))
    expect(result.current[0]).toBe("updated")

    act(() => result.current[1](null))
    expect(result.current[0]).toBe("fallback")

    act(() => result.current[1](undefined as never))
    expect(result.current[0]).toBe("fallback")
  })
})
