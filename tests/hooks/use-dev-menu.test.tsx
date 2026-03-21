import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useDevMenu } from "../../registry/hooks/use-dev-menu"

describe("useDevMenu", () => {
  it("toggles on the configured shortcut and ignores input targets", () => {
    const { result } = renderHook(() =>
      useDevMenu({ shortcut: ["Control", "Shift", "D"] })
    )

    const event = new KeyboardEvent("keydown", {
      key: "d",
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })

    act(() => {
      document.dispatchEvent(event)
    })

    expect(result.current.isOpen).toBe(true)
    expect(event.defaultPrevented).toBe(true)

    const input = document.createElement("input")
    document.body.appendChild(input)
    const ignored = new KeyboardEvent("keydown", {
      key: "d",
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(ignored, "target", {
      configurable: true,
      value: input,
    })

    act(() => {
      document.dispatchEvent(ignored)
    })

    expect(result.current.isOpen).toBe(true)
    input.remove()
  })
})
