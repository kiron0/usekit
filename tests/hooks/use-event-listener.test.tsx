import * as React from "react"
import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useEventListener } from "../../registry/hooks/use-event-listener"

describe("useEventListener", () => {
  it("subscribes to the target element and calls the latest handler", () => {
    const first = vi.fn()
    const second = vi.fn()
    const element = document.createElement("button")
    const ref = { current: element } as React.RefObject<HTMLButtonElement>

    const { rerender } = renderHook(
      ({ handler }) => useEventListener("click", handler, ref),
      {
        initialProps: { handler: first },
      }
    )

    act(() => {
      element.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    expect(first).toHaveBeenCalledTimes(1)

    rerender({ handler: second })

    act(() => {
      element.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    expect(second).toHaveBeenCalledTimes(1)
    expect(first).toHaveBeenCalledTimes(1)
  })
})
