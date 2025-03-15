import * as React from "react"

type EventOptions = {
  capture?: boolean
  passive?: boolean
  once?: boolean
}

export function useEventListener<
  T extends HTMLElement | Window | Document | null,
  K extends keyof HTMLElementEventMap,
>(
  target: React.RefObject<T> | T | Window | Document,
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: EventOptions
): void

export function useEventListener<
  T extends HTMLElement | Window | Document | null,
  K extends keyof WindowEventMap,
>(
  target: React.RefObject<T> | T | Window | Document,
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: EventOptions
): void

export function useEventListener<
  T extends HTMLElement | Window | Document | null,
  K extends keyof DocumentEventMap,
>(
  target: React.RefObject<T> | T | Window | Document,
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: EventOptions
): void

export function useEventListener<
  T extends HTMLElement | Window | Document | null,
  E extends Event = Event,
>(
  target: React.RefObject<T> | T | Window | Document,
  eventName: string,
  handler: (event: E) => void,
  options?: EventOptions
): void

export function useEventListener<
  T extends HTMLElement | Window | Document | null,
  E extends Event = Event,
>(
  target: React.RefObject<T> | T | Window | Document,
  eventName: string,
  handler: (event: E) => void,
  options: EventOptions = {}
) {
  const savedHandler = React.useRef(handler)

  React.useLayoutEffect(() => {
    savedHandler.current = handler
  }, [handler])

  React.useEffect(() => {
    const element = target && "current" in target ? target.current : target
    if (!element?.addEventListener) return

    const eventListener = (event: E) => savedHandler.current(event)
    const opts = {
      capture: options.capture,
      passive: options.passive,
      once: options.once,
    }

    element.addEventListener(eventName, eventListener as EventListener, opts)

    return () => {
      element.removeEventListener(
        eventName,
        eventListener as EventListener,
        opts
      )
    }
  }, [eventName, target, options.capture, options.passive, options.once])
}
