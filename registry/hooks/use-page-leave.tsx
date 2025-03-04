import * as React from "react"

type CallbackFunction = () => void

export function usePageLeave(
  cb: CallbackFunction,
  ref: React.RefObject<HTMLElement | null>
) {
  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseOut = (event: MouseEvent) => {
      const isLeavingElement =
        event.relatedTarget === null ||
        !element.contains(event.relatedTarget as Node)

      if (isLeavingElement) {
        cb()
      }
    }

    element.addEventListener("mouseout", handleMouseOut)

    return () => {
      element.removeEventListener("mouseout", handleMouseOut)
    }
  }, [cb, ref])
}
