import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useRenderDebugger } from "../../registry/hooks/use-render-debugger"

describe("useRenderDebugger", () => {
  it("logs only tracked prop changes", () => {
    const logger = vi.fn()
    const { rerender } = renderHook(
      ({ count, label }) =>
        useRenderDebugger(
          "Widget",
          { count, label },
          {
            trackOnly: ["count"],
            logger,
          }
        ),
      {
        initialProps: { count: 1, label: "alpha" },
      }
    )

    rerender({ count: 1, label: "beta" })
    expect(logger).not.toHaveBeenCalled()

    rerender({ count: 2, label: "beta" })

    expect(logger).toHaveBeenCalledWith(
      "[RenderDebugger] Widget re-rendered due to:",
      {
        count: { from: 1, to: 2 },
      }
    )
  })
})
