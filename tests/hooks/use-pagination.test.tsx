import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { usePagination } from "../../registry/hooks/use-pagination"

describe("usePagination", () => {
  it("calculates paging state and clamps navigation", () => {
    const { result } = renderHook(() =>
      usePagination({
        totalItems: 42,
        itemsPerPage: 10,
        initialPage: 1,
        maxVisiblePages: 5,
      })
    )

    expect(result.current.totalPages).toBe(5)
    expect(result.current.pageNumbers).toEqual([1, 2, 3, 4, 5])
    expect(result.current.startIndex).toBe(0)
    expect(result.current.endIndex).toBe(10)
    expect(result.current.canPreviousPage).toBe(false)
    expect(result.current.canNextPage).toBe(true)

    act(() => result.current.goToPage(99))
    expect(result.current.currentPage).toBe(5)
    expect(result.current.startIndex).toBe(40)
    expect(result.current.endIndex).toBe(42)

    act(() => result.current.nextPage())
    expect(result.current.currentPage).toBe(5)

    act(() => result.current.prevPage())
    expect(result.current.currentPage).toBe(4)
  })

  it("resets back to page 1 when total items change", () => {
    const { result, rerender } = renderHook(
      ({ totalItems }) =>
        usePagination({
          totalItems,
          itemsPerPage: 10,
          initialPage: 3,
        }),
      {
        initialProps: { totalItems: 50 },
      }
    )

    act(() => result.current.goToPage(4))
    expect(result.current.currentPage).toBe(4)

    rerender({ totalItems: 20 })
    expect(result.current.currentPage).toBe(1)
  })
})
