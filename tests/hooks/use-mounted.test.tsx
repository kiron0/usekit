import { renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useMounted } from "../../registry/hooks/use-mounted"

describe("useMounted", () => {
  it("becomes true after the effect runs", async () => {
    const { result } = renderHook(() => useMounted())

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })
})
