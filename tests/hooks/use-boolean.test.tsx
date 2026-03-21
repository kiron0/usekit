import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useBoolean } from "../../registry/hooks/use-boolean"

describe("useBoolean", () => {
  it("manages boolean state with helper methods", () => {
    const { result } = renderHook(() => useBoolean())

    expect(result.current.value).toBe(false)

    act(() => result.current.setTrue())
    expect(result.current.value).toBe(true)

    act(() => result.current.setFalse())
    expect(result.current.value).toBe(false)

    act(() => result.current.toggle())
    expect(result.current.value).toBe(true)

    act(() => result.current.setValue(false))
    expect(result.current.value).toBe(false)
  })

  it("rejects non-boolean defaults", () => {
    expect(() => renderHook(() => useBoolean("yes" as never))).toThrow(
      "defaultValue must be `true` or `false`"
    )
  })
})
