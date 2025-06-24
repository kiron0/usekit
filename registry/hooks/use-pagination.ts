import * as React from "react"

interface EnhancedOptions extends Options {
  maxVisiblePages?: number
  resetOnTotalItemsChange?: boolean
}

interface Options {
  totalItems: number
  itemsPerPage: number
  initialPage?: number
}

interface EnhancedReturn extends Return {
  pageNumbers: number[]
  canPreviousPage: boolean
  canNextPage: boolean
  totalItems: number
  hasPreviousEllipsis: boolean
  hasNextEllipsis: boolean
}

interface Return {
  currentPage: number
  totalPages: number
  nextPage: () => void
  prevPage: () => void
  goToPage: (page: number) => void
  startIndex: number
  endIndex: number
}

export function usePagination({
  totalItems,
  itemsPerPage,
  initialPage = 1,
  maxVisiblePages = 5,
  resetOnTotalItemsChange = true,
}: EnhancedOptions): EnhancedReturn {
  const safeItemsPerPage = Math.max(1, itemsPerPage)
  const safeTotalItems = Math.max(0, totalItems)
  const totalPages = Math.max(1, Math.ceil(safeTotalItems / safeItemsPerPage))
  const safeInitialPage = Math.min(Math.max(1, initialPage), totalPages)

  const [currentPage, setCurrentPage] = React.useState(safeInitialPage)

  React.useEffect(() => {
    if (resetOnTotalItemsChange) {
      setCurrentPage(1)
    }
  }, [safeTotalItems, resetOnTotalItemsChange])

  const nextPage = React.useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }, [totalPages])

  const prevPage = React.useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }, [])

  const goToPage = React.useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(pageNumber)
    },
    [totalPages]
  )

  const startIndex = (currentPage - 1) * safeItemsPerPage
  const endIndex = Math.min(startIndex + safeItemsPerPage, safeTotalItems)

  const { pageNumbers, hasPreviousEllipsis, hasNextEllipsis } =
    React.useMemo(() => {
      if (totalPages <= maxVisiblePages) {
        return {
          pageNumbers: Array.from({ length: totalPages }, (_, i) => i + 1),
          hasPreviousEllipsis: false,
          hasNextEllipsis: false,
        }
      }

      const half = Math.floor(maxVisiblePages / 2)
      let start = Math.max(1, currentPage - half)
      const end = Math.min(totalPages, start + maxVisiblePages - 1)

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1)
      }

      const hasPrevious = start > 1
      const hasNext = end < totalPages

      return {
        pageNumbers: Array.from(
          { length: end - start + 1 },
          (_, i) => start + i
        ),
        hasPreviousEllipsis: hasPrevious,
        hasNextEllipsis: hasNext,
      }
    }, [currentPage, totalPages, maxVisiblePages])

  return {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    startIndex,
    endIndex,
    pageNumbers,
    canPreviousPage: currentPage > 1,
    canNextPage: currentPage < totalPages,
    totalItems: safeTotalItems,
    hasPreviousEllipsis,
    hasNextEllipsis,
  }
}
