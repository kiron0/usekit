import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useFocusTrap } from "../../registry/hooks/use-focus-trap"

describe("useFocusTrap", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("autofocuses inside the trap, cycles tab focus, and restores previous focus", () => {
    const outside = document.createElement("button")
    document.body.appendChild(outside)
    outside.focus()

    const { result, rerender, unmount } = renderHook(
      ({ active }) =>
        useFocusTrap<HTMLDivElement>(active, '[data-autofocus="true"]'),
      {
        initialProps: { active: false },
      }
    )

    const container = document.createElement("div")
    const first = document.createElement("button")
    const second = document.createElement("button")
    second.setAttribute("data-autofocus", "true")
    container.append(first, second)
    document.body.appendChild(container)

    act(() => {
      result.current.current = container
    })

    rerender({ active: true })

    act(() => {
      vi.runAllTimers()
    })

    expect(document.activeElement).toBe(second)

    second.focus()
    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    })

    act(() => {
      document.dispatchEvent(tabEvent)
    })

    expect(document.activeElement).toBe(first)
    expect(tabEvent.defaultPrevented).toBe(true)

    first.focus()
    const shiftTab = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })

    act(() => {
      document.dispatchEvent(shiftTab)
    })

    expect(document.activeElement).toBe(second)

    unmount()

    expect(document.activeElement).toBe(outside)
    container.remove()
    outside.remove()
  })
})
