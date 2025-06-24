import * as React from "react"

interface Options {
  onLoadMore: () => void
  isLoading: boolean
  hasMore: boolean
  threshold?: number
}

export function useInfiniteScroll({
  onLoadMore,
  isLoading,
  hasMore,
  threshold = 0.1,
}: Options) {
  const observerRef = React.useRef<IntersectionObserver | null>(null)
  const triggerRef = React.useRef<HTMLDivElement | null>(null)

  const handleIntersection = React.useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && !isLoading && hasMore) {
        onLoadMore()
      }
    },
    [onLoadMore, isLoading, hasMore]
  )

  React.useEffect(() => {
    if (!triggerRef.current) return

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
    })
    observerRef.current.observe(triggerRef.current)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [handleIntersection, threshold])

  return triggerRef
}
