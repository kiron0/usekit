import * as React from "react"

interface Options extends ScrollIntoViewOptions {
  behavior?: ScrollBehavior
  block?: ScrollLogicalPosition
  inline?: ScrollLogicalPosition
  autoScrollOnMount?: boolean
}

export function useScrollIntoView<T extends HTMLElement>(options?: Options) {
  const ref = React.useRef<T>(null)

  const scroll = React.useCallback(
    (customOptions?: Partial<Options>) => {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        ...options,
        ...customOptions,
      })
    },
    [options]
  )

  const scrollAsync = React.useCallback(
    async (customOptions?: Partial<ScrollOptions>) => {
      return new Promise<void>((resolve) => {
        if (!ref.current) return resolve()

        scroll(customOptions)
        setTimeout(resolve, 500)
      })
    },
    [scroll]
  )

  React.useEffect(() => {
    if (options?.autoScrollOnMount) {
      scroll()
    }
  }, [scroll, options?.autoScrollOnMount])

  return {
    ref,
    scroll,
    scrollAsync,
  }
}
