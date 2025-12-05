import * as React from "react"

interface UseOverflowDetectorReturn {
  hasOverflow: {
    horizontal: boolean
    vertical: boolean
    any: boolean
  }
  ref: (node: HTMLElement | null) => void
}

export function useOverflowDetector(): UseOverflowDetectorReturn {
  const [hasOverflow, setHasOverflow] = React.useState({
    horizontal: false,
    vertical: false,
    any: false,
  })

  const elementRef = React.useRef<HTMLElement | null>(null)
  const resizeObserverRef = React.useRef<ResizeObserver | null>(null)

  const checkOverflow = React.useCallback((element: HTMLElement) => {
    const horizontal = element.scrollWidth > element.clientWidth
    const vertical = element.scrollHeight > element.clientHeight
    const any = horizontal || vertical

    setHasOverflow({ horizontal, vertical, any })
  }, [])

  const ref = React.useCallback(
    (node: HTMLElement | null) => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }

      elementRef.current = node

      if (node) {
        checkOverflow(node)

        const observer = new ResizeObserver(() => {
          if (elementRef.current) {
            checkOverflow(elementRef.current)
          }
        })

        observer.observe(node)
        resizeObserverRef.current = observer
      } else {
        setHasOverflow({ horizontal: false, vertical: false, any: false })
      }
    },
    [checkOverflow]
  )

  React.useEffect(() => {
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [])

  return { hasOverflow, ref }
}
