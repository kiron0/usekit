import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useResponsiveGrid } from "../../registry/hooks/use-responsive-grid"

describe("useResponsiveGrid", () => {
  it("calculates columns from breakpoints and exposes masonry styles", () => {
    window.innerWidth = 500

    const { result } = renderHook(() =>
      useResponsiveGrid({
        layout: "masonry",
        gap: 24,
        breakpoints: [
          { minWidth: 0, columns: 1 },
          { minWidth: 640, columns: 2 },
          { minWidth: 960, columns: 4 },
        ],
      })
    )

    expect(result.current.columns).toBe(1)
    expect(result.current.containerStyle.columnCount).toBe(1)

    act(() => {
      window.innerWidth = 1000
      window.dispatchEvent(new Event("resize"))
    })

    expect(result.current.columns).toBe(4)
    expect(result.current.containerStyle.columnCount).toBe(4)
    expect(result.current.itemStyle.marginBottom).toBe(24)
  })
})
