import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useFullscreen } from "../../registry/hooks/use-fullscreen"

describe("useFullscreen", () => {
  const originalExitFullscreen = document.exitFullscreen

  beforeEach(() => {
    document.exitFullscreen = vi.fn().mockResolvedValue(undefined)
  })

  afterEach(() => {
    document.exitFullscreen = originalExitFullscreen
  })

  it("requests, exits, and toggles fullscreen state", () => {
    const { result } = renderHook(() => useFullscreen<HTMLDivElement>())
    const element = document.createElement("div")
    const requestFullscreen = vi.fn().mockResolvedValue(undefined)

    ;(
      element as HTMLDivElement & { requestFullscreen: () => Promise<void> }
    ).requestFullscreen = requestFullscreen

    act(() => {
      result.current.ref.current = element
      result.current.requestFullscreen()
    })

    expect(requestFullscreen).toHaveBeenCalledTimes(1)
    expect(result.current.isFullscreen).toBe(true)

    act(() => {
      result.current.exitFullscreen()
    })

    expect(document.exitFullscreen).toHaveBeenCalledTimes(1)
    expect(result.current.isFullscreen).toBe(false)

    act(() => {
      result.current.toggleFullscreen()
    })

    expect(requestFullscreen).toHaveBeenCalledTimes(2)
    expect(result.current.isFullscreen).toBe(true)
  })
})
