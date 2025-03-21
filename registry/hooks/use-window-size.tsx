import * as React from "react"

interface WindowSize {
  innerHeight: number
  innerWidth: number
  outerHeight: number
  outerWidth: number
}

function getSize() {
  if (typeof window !== "undefined") {
    return {
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      outerHeight: window.outerHeight,
      outerWidth: window.outerWidth,
    }
  }
  return {
    innerHeight: 0,
    innerWidth: 0,
    outerHeight: 0,
    outerWidth: 0,
  }
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = React.useState(getSize())

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const handleResize = () => {
      const newSize = getSize()
      if (
        newSize.innerHeight !== windowSize.innerHeight ||
        newSize.innerWidth !== windowSize.innerWidth ||
        newSize.outerHeight !== windowSize.outerHeight ||
        newSize.outerWidth !== windowSize.outerWidth
      ) {
        setWindowSize(newSize)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [windowSize])

  return windowSize
}
