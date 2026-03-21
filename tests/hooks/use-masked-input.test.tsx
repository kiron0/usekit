import * as React from "react"
import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useMaskedInput } from "../../registry/hooks/use-masked-input"

describe("useMaskedInput", () => {
  const originalRaf = window.requestAnimationFrame

  beforeEach(() => {
    window.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
      cb(0)
      return 1
    })
  })

  afterEach(() => {
    window.requestAnimationFrame = originalRaf
  })

  it("masks input values and calls accept/complete callbacks", () => {
    const input = document.createElement("input")
    input.setSelectionRange = vi.fn()
    const ref = { current: input } as React.RefObject<HTMLInputElement | null>
    const onAccept = vi.fn()
    const onComplete = vi.fn()

    const { result } = renderHook(() =>
      useMaskedInput(ref, "999-AAA", { onAccept, onComplete })
    )

    act(() => {
      input.value = "12xabc"
      input.dispatchEvent(new Event("input", { bubbles: true }))
    })

    expect(input.value).toBe("12")
    expect(result.current.mask("123abc")).toBe("123-abc")
    expect(result.current.unmask("123-abc")).toBe("123abc")
    expect(onAccept).toHaveBeenCalled()

    act(() => {
      input.value = "123abc"
      input.dispatchEvent(new Event("input", { bubbles: true }))
    })

    expect(input.value).toBe("123-abc")
    expect(onComplete).toHaveBeenCalledWith("123abc")
  })
})
