import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useKeyPress } from "../../registry/hooks/use-key-press"

describe("useKeyPress", () => {
  it("fires matching keyboard combinations and prevents default by default", () => {
    const trigger = vi.fn()

    renderHook(() =>
      useKeyPress({
        keyPressItems: [
          {
            keys: ["Control", "KeyK"],
            event: trigger,
          },
        ],
      })
    )

    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })

    act(() => {
      document.dispatchEvent(event)
    })

    expect(trigger).toHaveBeenCalledTimes(1)
    expect(event.defaultPrevented).toBe(true)
  })

  it("ignores matching keys from ignored tags unless explicitly allowed", () => {
    const ignoredTrigger = vi.fn()
    const allowedTrigger = vi.fn()

    renderHook(() =>
      useKeyPress({
        keyPressItems: [
          {
            keys: ["KeyA"],
            event: ignoredTrigger,
          },
        ],
      })
    )

    renderHook(() =>
      useKeyPress({
        keyPressItems: [
          {
            keys: ["KeyA"],
            event: allowedTrigger,
            preventDefault: false,
          },
        ],
        tagsToIgnore: [],
        triggerOnContentEditable: true,
      })
    )

    const input = document.createElement("input")
    document.body.appendChild(input)
    input.focus()

    const inputEvent = new KeyboardEvent("keydown", {
      key: "a",
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(inputEvent, "target", {
      configurable: true,
      value: input,
    })

    act(() => {
      document.dispatchEvent(inputEvent)
    })

    expect(ignoredTrigger).not.toHaveBeenCalled()
    expect(allowedTrigger).toHaveBeenCalledTimes(1)
    expect(inputEvent.defaultPrevented).toBe(false)
  })
})
