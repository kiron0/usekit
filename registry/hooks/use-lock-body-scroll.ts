import * as React from "react"

let bodyScrollLockCount = 0
let originalBodyOverflow = ""

export function useLockBodyScroll() {
  React.useLayoutEffect((): (() => void) => {
    if (bodyScrollLockCount === 0) {
      originalBodyOverflow = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = "hidden"
    }

    bodyScrollLockCount += 1

    return () => {
      bodyScrollLockCount = Math.max(bodyScrollLockCount - 1, 0)

      if (bodyScrollLockCount === 0) {
        document.body.style.overflow = originalBodyOverflow
      }
    }
  }, [])
}
