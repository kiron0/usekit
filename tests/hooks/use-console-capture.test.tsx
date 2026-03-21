import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { useConsoleCapture } from "../../registry/hooks/use-console-capture"

describe("useConsoleCapture", () => {
  afterEach(() => {
    renderHook(() => useConsoleCapture()).result.current.clear()
  })

  it("captures matching console calls and supports clear/disable", async () => {
    const { result } = renderHook(() =>
      useConsoleCapture({
        levels: ["log"],
      })
    )

    act(() => {
      console.log("captured", 1)
    })

    await waitFor(() => expect(result.current.logs.length).toBeGreaterThan(0))
    expect(result.current.logs.at(-1)?.message).toContain("captured 1")

    act(() => {
      result.current.clear()
    })
    expect(result.current.logs).toEqual([])

    act(() => {
      result.current.disable()
    })

    await waitFor(() => expect(result.current.isEnabled).toBe(false))

    act(() => {
      console.log("ignored")
    })

    await waitFor(() => expect(result.current.logs).toEqual([]))
  })
})
