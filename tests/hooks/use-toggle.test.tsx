import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useToggle } from "../../registry/hooks/use-toggle"

describe("useToggle", () => {
  it("toggles state and exposes the setter", () => {
    const { result } = renderHook(() => useToggle(true))

    expect(result.current[0]).toBe(true)

    act(() => result.current[1]())
    expect(result.current[0]).toBe(false)

    act(() => result.current[2](true))
    expect(result.current[0]).toBe(true)
  })
})
