import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useHover } from "../../registry/hooks/use-hover"

describe("useHover", () => {
  it("tracks hover state for the attached element", () => {
    const { result } = renderHook(() => useHover())
    const element = document.createElement("div")

    act(() => {
      result.current[0](element)
    })

    act(() => {
      element.dispatchEvent(new Event("mouseenter"))
    })
    expect(result.current[1]).toBe(true)

    act(() => {
      element.dispatchEvent(new Event("mouseleave"))
    })
    expect(result.current[1]).toBe(false)
  })
})
