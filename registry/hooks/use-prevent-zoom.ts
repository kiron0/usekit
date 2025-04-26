import * as React from "react"

export const usePreventZoom = (
  scrollCheck = true,
  keyboardCheck = true,
  pinchCheck = true
) => {
  const handleKeydown = React.useCallback(
    (e: KeyboardEvent) => {
      if (
        keyboardCheck &&
        e.ctrlKey &&
        ["61", "107", "173", "109", "187", "189"].includes(e.keyCode.toString())
      ) {
        e.preventDefault()
      }
    },
    [keyboardCheck]
  )

  const handleWheel = React.useCallback(
    (e: WheelEvent) => {
      if (scrollCheck && e.ctrlKey) {
        e.preventDefault()
      }
    },
    [scrollCheck]
  )

  const handleTouchMove = React.useCallback(
    (e: TouchEvent) => {
      if (pinchCheck && e.touches.length > 1) {
        e.preventDefault()
      }
    },
    [pinchCheck]
  )

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeydown)
    document.addEventListener("wheel", handleWheel, { passive: false })
    document.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      document.removeEventListener("keydown", handleKeydown)
      document.removeEventListener("wheel", handleWheel)
      document.removeEventListener("touchmove", handleTouchMove)
    }
  }, [handleKeydown, handleWheel, handleTouchMove])
}
