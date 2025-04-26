import * as React from "react"

export interface Return<T extends HTMLElement> {
  elementRef: React.RefObject<T>
  isFullscreen: boolean
  requestFullscreen: () => void
  exitFullscreen: () => void
  toggleFullscreen: () => void
}

export function useFullscreen<T extends HTMLElement>(): Return<T> {
  const elementRef = React.useRef<T | null>(null)
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false)

  const requestFullscreen = React.useCallback((): void => {
    const el: any = elementRef.current || document.documentElement

    const request: (() => Promise<void>) | undefined =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen

    if (request) {
      request.call(el)
      setIsFullscreen(true)
    }
  }, [])

  const exitFullscreen = React.useCallback((): void => {
    const exit: (() => Promise<void>) | undefined =
      document.exitFullscreen ||
      (document as any).webkitExitFullscreen ||
      (document as any).mozCancelFullScreen ||
      (document as any).msExitFullscreen

    if (exit) {
      exit.call(document)
      setIsFullscreen(false)
    }
  }, [])

  const toggleFullscreen = React.useCallback((): void => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      requestFullscreen()
    }
  }, [isFullscreen, requestFullscreen, exitFullscreen])

  return {
    elementRef: elementRef as React.RefObject<T>,
    isFullscreen,
    requestFullscreen,
    exitFullscreen,
    toggleFullscreen,
  }
}
