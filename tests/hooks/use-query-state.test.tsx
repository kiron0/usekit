import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useQueryState } from "../../registry/hooks/use-query-state"

let searchParams = new URLSearchParams("page=2&filter=all")
const push = vi.fn()
const replace = vi.fn()

vi.mock("next/navigation", () => ({
  useSearchParams: () => searchParams,
  useRouter: () => ({
    push,
    replace,
  }),
  usePathname: () => "/docs",
}))

describe("useQueryState", () => {
  beforeEach(() => {
    searchParams = new URLSearchParams("page=2&filter=all")
    push.mockReset()
    replace.mockReset()
  })

  it("reads query params, applies validators, and updates the url", () => {
    const { result } = renderHook(() =>
      useQueryState(["page", "filter"] as const, {
        defaults: { filter: "none" },
        validators: {
          page: (value) => (/^\d+$/.test(value) ? value : null),
        },
        normalizeEmpty: true,
      })
    )

    expect(result.current.values).toEqual({
      page: "2",
      filter: "all",
    })
    expect(result.current.hasErrors).toBe(false)

    act(() => {
      result.current.setState({ page: "3" })
    })
    expect(push).toHaveBeenCalledWith("/docs?page=3&filter=all")

    act(() => {
      result.current.deleteState("filter", { replace: true })
    })
    expect(replace).toHaveBeenCalledWith("/docs?page=2")
  })

  it("collects validation errors and falls back to defaults", () => {
    searchParams = new URLSearchParams("page=bad")

    const { result } = renderHook(() =>
      useQueryState(["page", "filter"] as const, {
        defaults: { page: "1", filter: "all" },
        validators: {
          page: (value) => (/^\d+$/.test(value) ? value : null),
        },
      })
    )

    expect(result.current.values).toEqual({
      page: "1",
      filter: "all",
    })
    expect(result.current.errors.page).toBe("Invalid value for page")
    expect(result.current.hasErrors).toBe(true)
  })
})
