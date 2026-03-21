import * as React from "react"
import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useMergeRefs } from "../../registry/hooks/use-merge-refs"

describe("useMergeRefs", () => {
  it("updates object refs and callback refs with the same node", () => {
    const objectRef = React.createRef<HTMLDivElement>()
    const callbackRef = vi.fn()
    const node = document.createElement("div")

    const { result } = renderHook(() => useMergeRefs(objectRef, callbackRef))

    act(() => result.current(node))

    expect(objectRef.current).toBe(node)
    expect(callbackRef).toHaveBeenCalledWith(node)
  })
})
