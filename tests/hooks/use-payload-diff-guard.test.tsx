import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { usePayloadDiffGuard } from "../../registry/hooks/use-payload-diff-guard"

describe("usePayloadDiffGuard", () => {
  it("reports changed paths and gates submission", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() =>
      usePayloadDiffGuard(
        { name: "old", tags: ["a"] },
        { name: "new", tags: ["a", "b"] }
      )
    )

    expect(result.current.hasChanges).toBe(true)
    expect(result.current.changedPaths).toEqual(["name", "tags[1]"])
    expect(result.current.changed).toHaveLength(1)
    expect(result.current.added).toHaveLength(1)

    await act(async () => {
      await expect(result.current.preventSubmit(onSubmit)).resolves.toBe(true)
    })

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})
