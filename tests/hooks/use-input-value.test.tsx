import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useInputValue } from "../../registry/hooks/use-input-value"

describe("useInputValue", () => {
  it("updates the stored value from input change events", () => {
    const { result } = renderHook(() => useInputValue("start"))

    expect(result.current.value).toBe("start")

    act(() => {
      result.current.onChange({
        currentTarget: { value: "next value" },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.value).toBe("next value")
  })
})
