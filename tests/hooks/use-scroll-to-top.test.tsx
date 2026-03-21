import { renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useScrollToTop } from "../../registry/hooks/use-scroll-to-top"

describe("useScrollToTop", () => {
  const originalScrollTo = window.scrollTo

  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    window.scrollTo = originalScrollTo
  })

  it("scrolls the window to the top when mounted", () => {
    renderHook(() =>
      useScrollToTop({
        behavior: "smooth",
      })
    )

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    })
  })
})
