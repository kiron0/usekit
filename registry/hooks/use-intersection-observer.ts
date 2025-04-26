import * as React from "react"

interface Props {
  threshold?: number | number[]
  root?: Element | Document | null
  rootMargin?: string
}

export function useIntersectionObserver<T extends Element>(
  elementRef: React.RefObject<T | null>,
  { threshold = 0, root = null, rootMargin = "0%" }: Props = {}
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = React.useState<IntersectionObserverEntry>()

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry)
  }

  React.useEffect(() => {
    const node = elementRef.current
    const isSupported = !!window.IntersectionObserver

    if (!node || !isSupported) return

    const observer = new IntersectionObserver(updateEntry, {
      threshold,
      root,
      rootMargin,
    })

    observer.observe(node)

    return () => observer.disconnect()
  }, [elementRef, threshold, root, rootMargin])

  return entry
}
