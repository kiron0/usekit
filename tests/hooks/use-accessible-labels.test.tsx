import { renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useAccessibleLabels } from "../../registry/hooks/use-accessible-labels"

describe("useAccessibleLabels", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("builds aria props from label and description", () => {
    const { result } = renderHook(() =>
      useAccessibleLabels({
        label: "Search",
        description: "Search the documentation",
        prefix: "custom",
      })
    )

    expect(result.current.id.startsWith("custom-")).toBe(true)
    expect(result.current.ariaProps).toEqual({
      id: result.current.id,
      "aria-label": "Search",
      "aria-description": "Search the documentation",
    })
    expect(result.current.missingLabel).toBe(false)
  })

  it("warns when no label or labelledBy is provided", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    const { result } = renderHook(() =>
      useAccessibleLabels({
        warn: true,
      })
    )

    await waitFor(() => {
      expect(warnSpy).toHaveBeenCalledTimes(1)
    })

    expect(result.current.missingLabel).toBe(true)
  })
})
