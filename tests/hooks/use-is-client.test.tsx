import { renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useIsClient } from "../../registry/hooks/use-is-client"

describe("useIsClient", () => {
  it("becomes true after mount", async () => {
    const { result } = renderHook(() => useIsClient())

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })
})
