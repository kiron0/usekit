import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useClickAway } from "../../registry/hooks/use-click-away"

describe("useClickAway", () => {
  it("fires only when clicks happen outside the referenced element", () => {
    const callback = vi.fn()
    const inside = document.createElement("div")
    const child = document.createElement("span")
    const outside = document.createElement("button")
    inside.appendChild(child)
    document.body.appendChild(inside)
    document.body.appendChild(outside)

    const { result } = renderHook(() => useClickAway(callback))
    result.current.current = inside

    act(() => {
      child.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    })
    expect(callback).not.toHaveBeenCalled()

    act(() => {
      outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
