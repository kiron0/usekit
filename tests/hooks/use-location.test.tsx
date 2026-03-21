import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useLocation } from "../../registry/hooks/use-location"

describe("useLocation", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    history.replaceState({ page: "start" }, "", "/initial?tab=one#intro")
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("tracks history changes from pushState and replaceState", async () => {
    const { result } = renderHook(() => useLocation())

    expect(result.current.pathname).toBe("/initial")
    expect(result.current.search).toBe("?tab=one")
    expect(result.current.hash).toBe("#intro")
    expect(result.current.trigger).toBe("load")

    act(() => {
      history.pushState({ page: "docs" }, "", "/docs?page=2#top")
      vi.runAllTimers()
    })

    expect(result.current.trigger).toBe("pushstate")
    expect(result.current.pathname).toBe("/docs")
    expect(result.current.search).toBe("?page=2")
    expect(result.current.hash).toBe("#top")
    expect(result.current.state).toEqual({ page: "docs" })

    act(() => {
      history.replaceState({ page: "api" }, "", "/api?section=hooks")
      vi.runAllTimers()
    })

    expect(result.current.trigger).toBe("replacestate")
    expect(result.current.pathname).toBe("/api")
    expect(result.current.search).toBe("?section=hooks")
    expect(result.current.state).toEqual({ page: "api" })
  })

  it("patches history events only once across multiple hook instances", () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent")

    const first = renderHook(() => useLocation())
    const second = renderHook(() => useLocation())

    act(() => {
      history.pushState({ page: "docs" }, "", "/docs")
      vi.runAllTimers()
    })

    const pushStateDispatches = dispatchSpy.mock.calls.filter(
      ([event]) => event.type === "pushstate"
    )

    expect(pushStateDispatches).toHaveLength(1)
    expect(first.result.current.pathname).toBe("/docs")
    expect(second.result.current.pathname).toBe("/docs")

    first.unmount()
    second.unmount()
  })
})
