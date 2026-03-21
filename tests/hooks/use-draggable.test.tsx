import * as React from "react"
import { act, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useDraggable } from "../../registry/hooks/use-draggable"

function DraggableHarness() {
  const { ref, isDragging } = useDraggable<HTMLDivElement>()

  return React.createElement("div", {
    ref,
    "data-testid": "drag-target",
    "data-dragging": String(isDragging),
  })
}

describe("useDraggable", () => {
  it("starts dragging and updates transform on pointer movement", () => {
    render(React.createElement(DraggableHarness))

    const element = screen.getByTestId("drag-target") as HTMLDivElement
    element.getBoundingClientRect = vi.fn(() => ({
      left: 10,
      top: 20,
      right: 110,
      bottom: 120,
      width: 100,
      height: 100,
      x: 10,
      y: 20,
      toJSON: () => ({}),
    }))
    Object.defineProperty(element, "offsetWidth", {
      configurable: true,
      value: 100,
    })
    Object.defineProperty(element, "offsetHeight", {
      configurable: true,
      value: 100,
    })

    act(() => {
      element.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
          button: 0,
          clientX: 50,
          clientY: 60,
        })
      )
      document.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: 90,
          clientY: 100,
        })
      )
    })

    expect(element.dataset.dragging).toBe("true")
    expect(element.style.transform).toContain("translate")

    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }))
    })

    expect(element.dataset.dragging).toBe("false")
  })
})
