import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useLockBodyScroll } from "../../registry/hooks/use-lock-body-scroll"

describe("useLockBodyScroll", () => {
  it("locks body scrolling and restores the previous overflow on unmount", () => {
    document.body.style.overflow = "scroll"

    const { unmount } = renderHook(() => useLockBodyScroll())

    expect(document.body.style.overflow).toBe("hidden")

    unmount()
    expect(document.body.style.overflow).toBe("scroll")
  })

  it("keeps scrolling locked until the last consumer unmounts", () => {
    document.body.style.overflow = "scroll"

    const first = renderHook(() => useLockBodyScroll())
    const second = renderHook(() => useLockBodyScroll())

    expect(document.body.style.overflow).toBe("hidden")

    first.unmount()
    expect(document.body.style.overflow).toBe("hidden")

    second.unmount()
    expect(document.body.style.overflow).toBe("scroll")
  })
})
