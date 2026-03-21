import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useMousePosition } from "../../registry/hooks/use-mouse-position"

describe("useMousePosition", () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1024,
    })
    window.matchMedia = vi.fn().mockReturnValue({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }) as typeof window.matchMedia
    Object.defineProperty(window, "scrollX", {
      configurable: true,
      value: 10,
    })
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 20,
    })
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it("tracks page and element-relative mouse coordinates", () => {
    const { result } = renderHook(() => useMousePosition<HTMLDivElement>())
    const element = document.createElement("div")
    element.getBoundingClientRect = vi.fn(() => ({
      left: 100,
      top: 200,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }))

    act(() => {
      result.current.ref.current = element
      document.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: 0,
          clientY: 0,
          screenX: 0,
          screenY: 0,
        })
      )
    })

    const event = new MouseEvent("mousemove", { bubbles: true })
    Object.defineProperty(event, "pageX", {
      configurable: true,
      value: 150,
    })
    Object.defineProperty(event, "pageY", {
      configurable: true,
      value: 260,
    })

    act(() => {
      document.dispatchEvent(event)
    })

    expect(result.current.isSupported).toBe(true)
    expect(result.current.state).toMatchObject({
      x: 150,
      y: 260,
      elementPositionX: 110,
      elementPositionY: 220,
      elementX: 40,
      elementY: 40,
    })
  })
})
