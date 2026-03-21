import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useFormAutosave } from "../../registry/hooks/use-form-autosave"

describe("useFormAutosave", () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("persists drafts, restores them, and clears them", () => {
    const { result, rerender } = renderHook(
      ({ values }) =>
        useFormAutosave("profile", values, {
          debounceMs: 50,
        }),
      {
        initialProps: {
          values: { name: "Ada" },
        },
      }
    )

    rerender({ values: { name: "Grace" } })

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(result.current.hasDraft).toBe(true)
    expect(
      window.localStorage.getItem("usekit:form-autosave:profile")
    ).toContain("Grace")

    expect(result.current.restore()).toEqual({ name: "Grace" })
    expect(result.current.hydratedValues).toEqual({ name: "Grace" })

    act(() => {
      result.current.clear()
    })

    expect(result.current.hasDraft).toBe(false)
    expect(
      window.localStorage.getItem("usekit:form-autosave:profile")
    ).toBeNull()
  })
})
