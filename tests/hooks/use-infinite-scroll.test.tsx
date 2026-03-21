import * as React from "react"
import { act, render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useInfiniteScroll } from "../../registry/hooks/use-infinite-scroll"

let intersectionCallback:
  | ((entries: IntersectionObserverEntry[]) => void)
  | undefined
const observe = vi.fn()
const disconnect = vi.fn()

class MockIntersectionObserver {
  constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
    intersectionCallback = callback
  }

  observe = observe
  disconnect = disconnect
}

function InfiniteScrollHarness({
  isLoading,
  hasMore,
  onLoadMore,
}: {
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
}) {
  const triggerRef = useInfiniteScroll({
    onLoadMore,
    isLoading,
    hasMore,
    threshold: 0.5,
  })

  return React.createElement("div", { ref: triggerRef })
}

describe("useInfiniteScroll", () => {
  beforeEach(() => {
    intersectionCallback = undefined
    observe.mockReset()
    disconnect.mockReset()
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("loads more only when intersecting and not already loading", () => {
    const onLoadMore = vi.fn()
    const { container, rerender, unmount } = render(
      React.createElement(InfiniteScrollHarness, {
        isLoading: false,
        hasMore: true,
        onLoadMore,
      })
    )
    const trigger = container.firstElementChild as HTMLDivElement

    expect(observe).toHaveBeenCalledWith(trigger)

    act(() => {
      intersectionCallback?.([
        { isIntersecting: true, target: trigger } as IntersectionObserverEntry,
      ])
    })

    expect(onLoadMore).toHaveBeenCalledTimes(1)

    rerender(
      React.createElement(InfiniteScrollHarness, {
        isLoading: true,
        hasMore: true,
        onLoadMore,
      })
    )
    act(() => {
      intersectionCallback?.([
        { isIntersecting: true, target: trigger } as IntersectionObserverEntry,
      ])
    })

    expect(onLoadMore).toHaveBeenCalledTimes(1)

    unmount()
    expect(disconnect).toHaveBeenCalled()
  })
})
