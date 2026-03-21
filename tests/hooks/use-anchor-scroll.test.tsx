import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useAnchorScroll } from "../../registry/hooks/use-anchor-scroll"

describe("useAnchorScroll", () => {
  it("scrolls the matching element into view", () => {
    const element = document.createElement("div")
    element.id = "section-a"
    element.scrollIntoView = vi.fn()
    document.body.appendChild(element)

    const { result } = renderHook(() => useAnchorScroll())

    act(() => {
      result.current.scrollToId("section-a")
    })

    expect(element.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    })
  })
})
