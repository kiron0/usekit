import * as React from "react"
import { act, render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useScrollIntoView } from "../../registry/hooks/use-scroll-into-view"

interface ScrollIntoViewApi {
  ref: React.RefObject<HTMLDivElement | null>
  scroll: (customOptions?: Record<string, unknown>) => void
  scrollAsync: (customOptions?: Record<string, unknown>) => Promise<void>
}

interface ScrollHarnessProps {
  options?: {
    behavior?: ScrollBehavior
    block?: ScrollLogicalPosition
    inline?: ScrollLogicalPosition
    autoScrollOnMount?: boolean
  }
  onReady: (api: ScrollIntoViewApi) => void
}

function ScrollHarness({ options, onReady }: ScrollHarnessProps) {
  const api = useScrollIntoView<HTMLDivElement>(options)

  React.useEffect(() => {
    onReady(api)
  }, [api, onReady])

  return React.createElement("div", {
    "data-testid": "target",
    ref: api.ref,
  })
}

describe("useScrollIntoView", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("scrolls on mount when enabled and merges options for manual scrolling", () => {
    let api!: ScrollIntoViewApi

    render(
      React.createElement(ScrollHarness, {
        options: { autoScrollOnMount: true, behavior: "auto", block: "center" },
        onReady: (value) => {
          api = value
        },
      })
    )

    const scrollIntoView = vi.mocked(HTMLElement.prototype.scrollIntoView)
    expect(scrollIntoView).toHaveBeenCalledWith({
      autoScrollOnMount: true,
      behavior: "auto",
      block: "center",
    })

    const element = document.querySelector(
      "[data-testid='target']"
    ) as HTMLDivElement
    element.scrollIntoView = scrollIntoView

    act(() => {
      api.scroll({ inline: "nearest" })
    })

    expect(scrollIntoView).toHaveBeenCalledWith({
      autoScrollOnMount: true,
      behavior: "auto",
      block: "center",
      inline: "nearest",
    })
  })

  it("supports async scrolling and resolves after the delay", async () => {
    let api!: ScrollIntoViewApi

    render(
      React.createElement(ScrollHarness, {
        options: { behavior: "smooth" },
        onReady: (value) => {
          api = value
        },
      })
    )

    const element = document.querySelector(
      "[data-testid='target']"
    ) as HTMLDivElement
    const scrollIntoView = vi.fn()
    element.scrollIntoView = scrollIntoView

    let resolved = false

    const promise = act(async () => {
      await api.scrollAsync({ block: "end" })
      resolved = true
    })

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "end",
    })
    expect(resolved).toBe(false)

    await act(async () => {
      vi.advanceTimersByTime(500)
      await promise
    })

    expect(resolved).toBe(true)
  })
})
