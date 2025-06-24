import * as React from "react"

type TextDirection = "ltr" | "rtl" | "auto"

interface Options {
  initialDirection?: TextDirection
  watch?: boolean
  targetElement?: HTMLElement | null
}

export function useTextDirection(options?: Options): TextDirection {
  const {
    initialDirection = "auto",
    watch = true,
    targetElement = typeof document !== "undefined"
      ? document.documentElement
      : null,
  } = options || {}

  const [direction, setDirection] = React.useState<TextDirection>(() => {
    if (initialDirection !== "auto") return initialDirection
    return detectTextDirection(targetElement)
  })

  React.useEffect(() => {
    if (!watch || !targetElement) return

    const updateDirection = () => {
      const newDirection = detectTextDirection(targetElement)
      setDirection(newDirection)
    }

    updateDirection()

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "dir"
        ) {
          updateDirection()
        }
      }
    })

    observer.observe(targetElement, {
      attributes: true,
      attributeFilter: ["dir"],
    })

    return () => observer.disconnect()
  }, [watch, targetElement])

  return direction
}

function detectTextDirection(element: HTMLElement | null): TextDirection {
  if (!element) return "ltr"

  const explicitDir = element.getAttribute("dir")?.toLowerCase()
  if (explicitDir === "ltr" || explicitDir === "rtl") {
    return explicitDir
  }

  if (element.textContent?.trim()) {
    const firstStrongChar = detectFirstStrongChar(element.textContent)
    return firstStrongChar === "rtl" ? "rtl" : "ltr"
  }

  const computedDirection = window.getComputedStyle(element).direction
  return computedDirection === "rtl" ? "rtl" : "ltr"
}

function detectFirstStrongChar(text: string): "ltr" | "rtl" | null {
  const strongRtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/
  const strongLtrChars =
    /[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF\u200E\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF]/

  for (const char of text) {
    if (strongRtlChars.test(char)) return "rtl"
    if (strongLtrChars.test(char)) return "ltr"
  }

  return null
}

export function useMemoizedTextDirection(options?: Options) {
  const dir = useTextDirection(options)
  return React.useMemo(
    () => ({
      dir,
      isRtl: dir === "rtl",
      isLtr: dir === "ltr",
      styles: {
        direction: dir,
        textAlign: dir === "rtl" ? "right" : "left",
      },
    }),
    [dir]
  )
}

export const TextDirectionProvider: React.FC<{
  children: React.ReactNode
  direction?: TextDirection
}> = ({ children, direction = "auto" }) => {
  const detectedDirection = useTextDirection({ initialDirection: direction })

  return <div dir={detectedDirection}>{children}</div>
}
