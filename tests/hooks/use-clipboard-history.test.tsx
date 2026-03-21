import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useClipboardHistory } from "../../registry/hooks/use-clipboard-history"

describe("useClipboardHistory", () => {
  const originalClipboard = navigator.clipboard

  beforeEach(() => {
    window.localStorage.clear()
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        readText: vi.fn().mockResolvedValue("from clipboard"),
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: originalClipboard,
    })
  })

  it("pushes, dedupes, pulls from the clipboard, and securely clears history", async () => {
    const { result } = renderHook(() =>
      useClipboardHistory({ size: 3, secureClear: true })
    )

    act(() => {
      result.current.push("first")
      result.current.push("second")
      result.current.push("first")
    })

    expect(result.current.list).toEqual(["first", "second"])
    expect(window.localStorage.getItem("usekit:clipboard-history")).toBe(
      JSON.stringify(["first", "second"])
    )

    await act(async () => {
      await result.current.pull()
    })

    expect(result.current.list[0]).toBe("from clipboard")

    await act(async () => {
      await result.current.clear()
    })

    await waitFor(() => expect(result.current.list).toEqual([]))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("")
  })
})
