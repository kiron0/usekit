import * as React from "react"

type CallbackFunction = () => void

export function usePageLeave(cb: CallbackFunction) {
  React.useEffect(() => {
    const handleMouseOut = (event: MouseEvent) => {
      if (event.relatedTarget === null) {
        cb()
      }
    }

    document.addEventListener("mouseout", handleMouseOut)

    return () => {
      document.removeEventListener("mouseout", handleMouseOut)
    }
  }, [cb])
}
