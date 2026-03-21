import * as React from "react"
import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useMutationObserver } from "../../registry/hooks/use-mutation-observer"

const observe = vi.fn()
const disconnect = vi.fn()
let mutationCallback: MutationCallback | undefined

class MockMutationObserver {
  constructor(callback: MutationCallback) {
    mutationCallback = callback
  }

  observe = observe
  disconnect = disconnect
}

describe("useMutationObserver", () => {
  beforeEach(() => {
    observe.mockReset()
    disconnect.mockReset()
    mutationCallback = undefined
    vi.stubGlobal("MutationObserver", MockMutationObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("observes the provided element and disconnects on unmount", () => {
    const element = document.createElement("div")
    const ref = { current: element } as React.RefObject<HTMLElement | null>
    const callback = vi.fn()

    const { unmount } = renderHook(() => useMutationObserver(ref, callback))

    expect(observe).toHaveBeenCalledWith(element, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })

    act(() => {
      mutationCallback?.([], {} as MutationObserver)
    })

    expect(callback).toHaveBeenCalledTimes(1)

    unmount()

    expect(disconnect).toHaveBeenCalledTimes(1)
  })
})
