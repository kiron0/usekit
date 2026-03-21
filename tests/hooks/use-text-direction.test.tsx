import * as React from "react"
import { act, render, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  TextDirectionProvider,
  useMemoizedTextDirection,
  useTextDirection,
} from "../../registry/hooks/use-text-direction"

describe("useTextDirection", () => {
  it("detects text direction from content and updates when dir changes", async () => {
    const element = document.createElement("div")
    element.textContent = "مرحبا"

    const { result } = renderHook(() =>
      useTextDirection({ targetElement: element })
    )

    expect(result.current).toBe("rtl")

    act(() => {
      element.setAttribute("dir", "ltr")
    })

    await waitFor(() => expect(result.current).toBe("ltr"))
  })

  it("returns memoized helpers and provides direction through the provider", () => {
    const element = document.createElement("div")
    element.setAttribute("dir", "rtl")

    const { result } = renderHook(() =>
      useMemoizedTextDirection({ targetElement: element })
    )

    expect(result.current.dir).toBe("rtl")
    expect(result.current.isRtl).toBe(true)
    expect(result.current.isLtr).toBe(false)
    expect(result.current.styles).toEqual({
      direction: "rtl",
      textAlign: "right",
    })

    const { container } = render(
      React.createElement(
        TextDirectionProvider,
        { direction: "rtl" },
        React.createElement("span", null, "content")
      )
    )

    expect(container.firstElementChild?.getAttribute("dir")).toBe("rtl")
  })
})
