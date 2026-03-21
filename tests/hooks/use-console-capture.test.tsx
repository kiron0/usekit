import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

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

  it("restores console methods and global listeners after the last session unmounts", () => {
    const originalLogDescriptor = Object.getOwnPropertyDescriptor(
      console,
      "log"
    )
    const addEventListenerSpy = vi.spyOn(window, "addEventListener")
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener")

    const first = renderHook(() => useConsoleCapture())
    const second = renderHook(() => useConsoleCapture())
    const interceptedLog = console.log

    expect(
      (interceptedLog as any)[Symbol.for("useConsoleCapture.interceptor")]
    ).toBe(true)
    expect(
      addEventListenerSpy.mock.calls.some(([type]) => type === "error")
    ).toBe(true)
    expect(
      addEventListenerSpy.mock.calls.some(
        ([type]) => type === "unhandledrejection"
      )
    ).toBe(true)

    first.unmount()
    expect(console.log).toBe(interceptedLog)

    second.unmount()

    const restoredLogDescriptor = Object.getOwnPropertyDescriptor(
      console,
      "log"
    )
    expect(
      (console.log as any)[Symbol.for("useConsoleCapture.interceptor")]
    ).not.toBe(true)
    expect(restoredLogDescriptor?.get).toBe(originalLogDescriptor?.get)
    expect(restoredLogDescriptor?.set).toBe(originalLogDescriptor?.set)
    expect(
      removeEventListenerSpy.mock.calls.some(([type]) => type === "error")
    ).toBe(true)
    expect(
      removeEventListenerSpy.mock.calls.some(
        ([type]) => type === "unhandledrejection"
      )
    ).toBe(true)
  })
})
