import { renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useContinuousRetry } from "../../registry/hooks/use-continuous-retry"

describe("useContinuousRetry", () => {
  it("retries until the callback resolves truthy", async () => {
    const callback = vi
      .fn<() => boolean>()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)

    const { result } = renderHook(() =>
      useContinuousRetry(callback, 1, { maxRetries: 5 })
    )

    expect(result.current).toBe(false)

    await waitFor(() => expect(result.current).toBe(true))
    expect(callback).toHaveBeenCalledTimes(3)
  })
})
