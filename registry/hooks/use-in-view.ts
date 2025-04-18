import * as React from "react"

interface Options {
  threshold?: number
  rootMargin?: string
}

export default function useInView(
  ref: React.RefObject<HTMLElement>,
  { threshold = 0, rootMargin = "0px" }: Options = {}
): boolean {
  const [isInView, setIsInView] = React.useState(false)

  React.useEffect(() => {
    if (!ref.current) return

    const currentElement = ref.current

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold, rootMargin }
    )

    observer.observe(currentElement)
    return () => observer.unobserve(currentElement)
  }, [ref, threshold, rootMargin])

  return isInView
}
