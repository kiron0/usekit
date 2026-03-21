import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { usePreventZoom } from "../../registry/hooks/use-prevent-zoom"

describe("usePreventZoom", () => {
  it("blocks global ctrl+zoom shortcuts and can toggle them back off", () => {
    const { result } = renderHook(() => usePreventZoom({ global: true }))

    const event = new KeyboardEvent("keydown", {
      key: "+",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })

    act(() => {
      document.dispatchEvent(event)
    })

    expect(event.defaultPrevented).toBe(true)
    expect(result.current.isGlobalDisabled).toBe(true)

    act(() => {
      result.current.enableGlobal()
    })

    const nextEvent = new KeyboardEvent("keydown", {
      key: "+",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })

    act(() => {
      document.dispatchEvent(nextEvent)
    })

    expect(nextEvent.defaultPrevented).toBe(false)
  })

  it("blocks element-specific wheel zoom and cleans up when re-enabled", () => {
    const { result } = renderHook(() => usePreventZoom())
    const element = document.createElement("div")
    const child = document.createElement("span")
    element.appendChild(child)
    document.body.appendChild(element)

    const cleanup = result.current.disableForElement(element)

    const wheelEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
    })
    Object.defineProperty(wheelEvent, "target", {
      configurable: true,
      value: child,
    })

    act(() => {
      element.dispatchEvent(wheelEvent)
    })

    expect(wheelEvent.defaultPrevented).toBe(true)

    act(() => {
      cleanup()
    })

    const afterCleanup = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
    })
    Object.defineProperty(afterCleanup, "target", {
      configurable: true,
      value: child,
    })

    act(() => {
      element.dispatchEvent(afterCleanup)
    })

    expect(afterCleanup.defaultPrevented).toBe(false)
  })
})
