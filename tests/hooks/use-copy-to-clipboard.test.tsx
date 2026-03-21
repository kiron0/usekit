import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCopyToClipboard } from "../../registry/hooks/use-copy-to-clipboard"

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        write: vi.fn().mockResolvedValue(undefined),
      },
    })
    globalThis.ClipboardItem = class ClipboardItem {
      constructor(public items: Record<string, Blob>) {}
    } as unknown as typeof ClipboardItem
  })

  it("writes to the clipboard and resets the copied state after the delay", async () => {
    const { result } = renderHook(() => useCopyToClipboard(100))

    await act(async () => {
      await result.current[0]("hello")
    })

    expect(result.current[1]).toBe(true)
    expect(navigator.clipboard.write).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current[1]).toBe(false)
  })
})
