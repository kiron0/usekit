import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useDiffEditor } from "../../registry/hooks/use-diff-editor"

describe("useDiffEditor", () => {
  it("builds text diffs and supports merge helpers", () => {
    const { result } = renderHook(() => useDiffEditor("a\nb", "a\nc"))

    expect(result.current.kind).toBe("text")
    expect(result.current.diffs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "unchanged", leftValue: "a" }),
        expect.objectContaining({
          type: "changed",
          leftValue: "b",
          rightValue: "c",
        }),
      ])
    )
    expect(result.current.merge.acceptLeft()).toBe("a\nb")
    expect(result.current.merge.acceptRight()).toBe("a\nc")
  })

  it("builds json diffs for object changes", () => {
    const { result } = renderHook(() =>
      useDiffEditor({ a: 1, nested: { x: 1 } }, { a: 2, nested: { x: 1 } })
    )

    expect(result.current.kind).toBe("json")
    expect(result.current.diffs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "a", type: "changed" }),
      ])
    )
  })
})
