import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useKeyedArray } from "../../registry/hooks/use-keyed-array"

describe("useKeyedArray", () => {
  it("keeps stable keys for object references across rerenders", () => {
    const itemA = { label: "A" }
    const itemB = { label: "B" }

    const { result, rerender } = renderHook(
      ({ items }) => useKeyedArray(items),
      {
        initialProps: { items: [itemA, itemB] },
      }
    )

    const initialKeys = result.current.map((item) => item._key)

    rerender({ items: [itemA, itemB] })

    expect(result.current.map((item) => item._key)).toEqual(initialKeys)
  })

  it("uses custom keys when provided", () => {
    const { result } = renderHook(() =>
      useKeyedArray(["x", "y"], {
        getKey: (item, index) => `${item}-${index}`,
      })
    )

    expect(result.current).toEqual([
      { value: "x", _key: "x-0" },
      { value: "y", _key: "y-1" },
    ])
  })
})
