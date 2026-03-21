import * as React from "react"

const isClient = typeof window === "object"
const HISTORY_EVENT_PATCH_MARKER = Symbol.for("usekit.history-events.patched")

type HistoryMethod = "pushState" | "replaceState"
type HistoryFunction = History["pushState"] | History["replaceState"]

declare global {
  interface WindowEventMap {
    pushstate: CustomEvent<{ state: unknown }>
    replacestate: CustomEvent<{ state: unknown }>
  }
}

type PatchedHistoryFunction = {
  [HISTORY_EVENT_PATCH_MARKER]?: true
}

const on = (
  obj: Window,
  type: keyof WindowEventMap,
  listener: (event: Event) => void
) => obj.addEventListener(type, listener)

const off = (
  obj: Window,
  type: keyof WindowEventMap,
  listener: (event: Event) => void
) => obj.removeEventListener(type, listener)

function ensureHistoryEventsPatched(): void {
  if (!isClient) {
    return
  }

  const patchHistoryMethod = (method: HistoryMethod) => {
    const currentMethod = history[method] as HistoryFunction &
      PatchedHistoryFunction

    if (currentMethod[HISTORY_EVENT_PATCH_MARKER]) {
      return
    }

    const originalMethod = history[method]

    const patchedMethod = function (
      this: History,
      data: unknown,
      title: string,
      url?: string | null
    ) {
      const result = originalMethod.apply(this, [data, title, url])
      window.dispatchEvent(
        new CustomEvent<{ state: unknown }>(method.toLowerCase(), {
          detail: { state: data },
        })
      )
      return result
    }

    ;(patchedMethod as typeof patchedMethod & PatchedHistoryFunction)[
      HISTORY_EVENT_PATCH_MARKER
    ] = true

    history[method] = patchedMethod as History[typeof method]
  }

  patchHistoryMethod("pushState")
  patchHistoryMethod("replaceState")
}

interface LocationState {
  trigger: string
  state: unknown
  length: number
  hash: string
  host: string
  hostname: string
  href: string
  origin: string
  pathname: string
  port: string
  protocol: string
  search: string
}

const defaultLocationState: LocationState = {
  trigger: "load",
  state: null,
  length: 1,
  hash: "",
  host: "",
  hostname: "",
  href: "",
  origin: "",
  pathname: "",
  port: "",
  protocol: "",
  search: "",
}

export const useLocation = (): LocationState => {
  const buildState = React.useCallback((trigger: string): LocationState => {
    if (!isClient) {
      return defaultLocationState
    }

    const { state, length } = history
    const {
      hash,
      host,
      hostname,
      href,
      origin,
      pathname,
      port,
      protocol,
      search,
    } = window.location

    return {
      trigger,
      state,
      length,
      hash,
      host,
      hostname,
      href,
      origin,
      pathname,
      port,
      protocol,
      search,
    }
  }, [])

  const [locationState, setLocationState] = React.useState<LocationState>(
    buildState("load")
  )

  React.useEffect(() => {
    if (!isClient) {
      return
    }

    ensureHistoryEventsPatched()

    const handleChange = (trigger: string) => {
      setTimeout(() => {
        setLocationState(buildState(trigger))
      }, 0)
    }

    const handlePopState = () => handleChange("popstate")
    const handlePushState = () => handleChange("pushstate")
    const handleReplaceState = () => handleChange("replacestate")

    on(window, "popstate", handlePopState)
    on(window, "pushstate", handlePushState)
    on(window, "replacestate", handleReplaceState)

    return () => {
      off(window, "popstate", handlePopState)
      off(window, "pushstate", handlePushState)
      off(window, "replacestate", handleReplaceState)
    }
  }, [buildState])

  return locationState
}
