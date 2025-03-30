import * as React from "react"

type ScrollableElement = HTMLUListElement | HTMLDivElement | HTMLOListElement

interface AutoScrollOptions {
  scrollThreshold?: number
  smoothScroll?: boolean
}

const useAutoScroll = <T extends ScrollableElement = HTMLUListElement>(
  enabled: boolean,
  deps: React.DependencyList,
  options?: AutoScrollOptions
): React.RefObject<T | null> => {
  const listRef = React.useRef<T | null>(null)
  const optionsRef = React.useRef(options)
  const cleanupRef = React.useRef<(() => void) | undefined>(undefined)

  React.useEffect(() => {
    optionsRef.current = options
  }, [options])

  React.useEffect(() => {
    if (enabled && listRef.current) {
      cleanupRef.current = autoScrollElement(
        listRef.current,
        optionsRef.current
      )
      return () => cleanupRef.current?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps])

  return listRef
}

export default useAutoScroll

export function autoScrollElement(
  element: ScrollableElement,
  options?: AutoScrollOptions
): () => void {
  const { scrollThreshold = 0.5, smoothScroll = true } = options || {}

  let shouldAutoScroll = true
  let touchStartY = 0
  let lastScrollTop = 0
  let animationFrameId: number | null = null

  const checkScrollPosition = () => {
    const { scrollHeight, clientHeight, scrollTop } = element
    const maxScrollHeight = scrollHeight - clientHeight
    const thresholdPosition = maxScrollHeight * (1 - scrollThreshold)

    if (scrollTop < lastScrollTop) {
      shouldAutoScroll = false
    } else if (maxScrollHeight - scrollTop <= thresholdPosition) {
      shouldAutoScroll = true
    }

    lastScrollTop = scrollTop
  }

  const handleWheel = (e: WheelEvent) => {
    if (e.deltaY < 0) {
      shouldAutoScroll = false
    } else {
      checkScrollPosition()
    }
  }

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY = e.touches[0].clientY
  }

  const handleTouchMove = (e: TouchEvent) => {
    const touchEndY = e.touches[0].clientY
    const deltaY = touchStartY - touchEndY

    if (deltaY < 0) {
      shouldAutoScroll = false
    } else {
      checkScrollPosition()
    }

    touchStartY = touchEndY
  }

  const scrollToBottom = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    animationFrameId = requestAnimationFrame(() => {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: smoothScroll ? "smooth" : "auto",
      })
    })
  }

  const handleMutation = () => {
    if (shouldAutoScroll) {
      scrollToBottom()
    }
  }

  // Cast to HTMLElement to access correct addEventListener overloads
  const htmlElement = element as HTMLElement

  htmlElement.addEventListener("wheel", handleWheel)
  htmlElement.addEventListener("touchstart", handleTouchStart)
  htmlElement.addEventListener("touchmove", handleTouchMove)

  const observer = new MutationObserver(handleMutation)
  observer.observe(element, {
    childList: true,
    subtree: true,
    characterData: true,
  })

  return () => {
    observer.disconnect()
    htmlElement.removeEventListener("wheel", handleWheel)
    htmlElement.removeEventListener("touchstart", handleTouchStart)
    htmlElement.removeEventListener("touchmove", handleTouchMove)
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  }
}
