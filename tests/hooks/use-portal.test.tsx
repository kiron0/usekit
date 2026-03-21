import { renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { usePortal } from "../../registry/hooks/use-portal"

describe("usePortal", () => {
  it("creates a portal container and removes it on unmount", async () => {
    const { result, unmount } = renderHook(() => usePortal())

    await waitFor(() => {
      expect(result.current.container).not.toBeNull()
    })

    const container = result.current.container
    expect(container && document.body.contains(container)).toBe(true)

    unmount()
    expect(container && document.body.contains(container)).toBe(false)
  })
})
