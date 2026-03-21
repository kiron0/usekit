import * as React from "react"

export interface UseScrollBlockerReturn {
  block: () => void
  unblock: () => void
}

let scrollBlockCount = 0
let scrollPosition = 0
let originalBodyStyles = {
  overflow: "",
  position: "",
  top: "",
  width: "",
}

function blockScroll() {
  if (scrollBlockCount === 0) {
    scrollPosition = window.scrollY
    originalBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    }
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollPosition}px`
    document.body.style.width = "100%"
  }
  scrollBlockCount++
}

function unblockScroll() {
  if (scrollBlockCount > 0) {
    scrollBlockCount--
    if (scrollBlockCount === 0) {
      document.body.style.overflow = originalBodyStyles.overflow
      document.body.style.position = originalBodyStyles.position
      document.body.style.top = originalBodyStyles.top
      document.body.style.width = originalBodyStyles.width
      window.scrollTo(0, scrollPosition)
    }
  }
}

export function useScrollBlocker(): UseScrollBlockerReturn {
  const isBlockedRef = React.useRef(false)

  const block = React.useCallback(() => {
    if (!isBlockedRef.current) {
      blockScroll()
      isBlockedRef.current = true
    }
  }, [])

  const unblock = React.useCallback(() => {
    if (isBlockedRef.current) {
      unblockScroll()
      isBlockedRef.current = false
    }
  }, [])

  React.useEffect(() => {
    return () => {
      if (isBlockedRef.current) {
        unblockScroll()
        isBlockedRef.current = false
      }
    }
  }, [])

  return { block, unblock }
}
