import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useNativeShare } from "../../registry/hooks/use-native-share"

describe("useNativeShare", () => {
  afterEach(() => {
    delete (navigator as Navigator & { share?: unknown; canShare?: unknown })
      .share
    delete (navigator as Navigator & { share?: unknown; canShare?: unknown })
      .canShare
  })

  it("shares with the native api when supported", async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    const canShare = vi.fn().mockReturnValue(true)

    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: share,
    })
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: canShare,
    })

    const { result } = renderHook(() => useNativeShare())

    await act(async () => {
      await result.current.share({ title: "Docs", url: "https://example.com" })
    })

    expect(result.current.canShare).toBe(true)
    expect(share).toHaveBeenCalledWith({
      title: "Docs",
      url: "https://example.com",
    })
    expect(result.current.error).toBeNull()
  })

  it("uses the fallback when native share is unavailable", async () => {
    const onFallback = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useNativeShare({ onFallback }))

    await act(async () => {
      await result.current.share({ text: "copy me" })
    })

    expect(onFallback).toHaveBeenCalledWith({ text: "copy me" })
    expect(result.current.isSharing).toBe(false)
  })
})
