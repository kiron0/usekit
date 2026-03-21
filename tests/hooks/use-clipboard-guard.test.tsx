import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useClipboardGuard } from "../../registry/hooks/use-clipboard-guard"

describe("useClipboardGuard", () => {
  const originalClipboard = navigator.clipboard

  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
        readText: vi.fn().mockResolvedValue("hello\u0000world"),
      },
    })
  })

  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: originalClipboard,
    })
    vi.restoreAllMocks()
  })

  it("sanitizes clipboard writes and reads with callbacks", async () => {
    const onCopy = vi.fn()
    const onPaste = vi.fn()

    const { result } = renderHook(() => useClipboardGuard({ onCopy, onPaste }))

    await expect(result.current.copy("a\u0000b")).resolves.toBe(true)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("ab")
    expect(onCopy).toHaveBeenCalledWith("ab")

    await expect(result.current.paste()).resolves.toBe("helloworld")
    expect(onPaste).toHaveBeenCalledWith("helloworld")
  })
})
