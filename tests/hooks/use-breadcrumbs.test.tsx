import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useBreadcrumbs } from "../../registry/hooks/use-breadcrumbs"

describe("useBreadcrumbs", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it("auto-generates items from the path and supports list operations", () => {
    const navigate = vi.fn()

    const { result } = renderHook(() =>
      useBreadcrumbs({
        basePath: "/docs",
        getPathname: () => "/docs/hooks/use-counter",
        navigate,
      })
    )

    expect(result.current.items).toEqual([
      { label: "Home", href: "/docs" },
      { label: "Hooks", href: "/docs/hooks" },
      { label: "Use Counter", href: "/docs/hooks/use-counter" },
    ])

    act(() => {
      result.current.push({ label: "Extra", href: "/docs/extra" })
    })
    expect(result.current.items.at(-1)).toEqual({
      label: "Extra",
      href: "/docs/extra",
    })

    act(() => {
      result.current.replace({ label: "Final", href: "/docs/final" })
    })
    expect(result.current.items.at(-1)).toEqual({
      label: "Final",
      href: "/docs/final",
    })

    act(() => {
      result.current.pop()
    })
    expect(result.current.items.at(-1)).toEqual({
      label: "Use Counter",
      href: "/docs/hooks/use-counter",
    })

    act(() => {
      result.current.navigate("/docs/other")
    })
    expect(navigate).toHaveBeenCalledWith("/docs/other")

    act(() => {
      result.current.setItems([{ label: "Manual", href: "/manual" }])
      result.current.reset()
    })
    expect(result.current.items[0]).toEqual({ label: "Home", href: "/docs" })
  })

  it("uses the latest navigate callback after rerender", () => {
    const firstNavigate = vi.fn()
    const secondNavigate = vi.fn()

    const { result, rerender } = renderHook(
      ({ navigate }) =>
        useBreadcrumbs({
          basePath: "/docs",
          getPathname: () => "/docs/hooks/use-counter",
          navigate,
        }),
      {
        initialProps: {
          navigate: firstNavigate,
        },
      }
    )

    act(() => {
      result.current.navigate("/docs/first")
    })

    expect(firstNavigate).toHaveBeenCalledWith("/docs/first")

    rerender({ navigate: secondNavigate })

    act(() => {
      result.current.navigate("/docs/second")
    })

    expect(secondNavigate).toHaveBeenCalledWith("/docs/second")
    expect(firstNavigate).toHaveBeenCalledTimes(1)
  })
})
