import * as React from "react"
import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { usePageLeave } from "../../registry/hooks/use-page-leave"

describe("usePageLeave", () => {
  it("fires when the mouse leaves the target element", () => {
    const callback = vi.fn()
    const element = document.createElement("div")
    const child = document.createElement("span")
    element.appendChild(child)
    document.body.appendChild(element)

    const ref = { current: element } as React.RefObject<HTMLElement>

    renderHook(() => usePageLeave(callback, ref))

    const stayInsideEvent = new MouseEvent("mouseout", { bubbles: true })
    Object.defineProperty(stayInsideEvent, "relatedTarget", { value: child })

    act(() => {
      element.dispatchEvent(stayInsideEvent)
    })
    expect(callback).not.toHaveBeenCalled()

    const leaveEvent = new MouseEvent("mouseout", { bubbles: true })
    Object.defineProperty(leaveEvent, "relatedTarget", { value: null })

    act(() => {
      element.dispatchEvent(leaveEvent)
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
