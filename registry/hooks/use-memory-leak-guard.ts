import * as React from "react"

type TimerType = "timeout" | "interval"

type TimerHandle = unknown

interface TimerRecord {
  id: TimerHandle
  type: TimerType
  createdAt: number
  delay: number
  stack?: string
  warned?: boolean
}

const isDev = process.env.NODE_ENV !== "production"

function describeHandle(handle: TimerHandle): string {
  return typeof handle === "number" ? `#${handle}` : "[object Timer]"
}

const timerRegistry: Map<TimerHandle, TimerRecord> =
  typeof window !== "undefined"
    ? ((window as any).__usekitTimerRegistry ??
      ((window as any).__usekitTimerRegistry = new Map()))
    : new Map()

let timersPatched = false

function captureStack(label: string): string | undefined {
  try {
    const error = new Error(label)
    return error.stack
  } catch {
    return undefined
  }
}

function patchTimers() {
  if (timersPatched || typeof window === "undefined") {
    return
  }

  const originalSetTimeout = window.setTimeout.bind(window)
  const originalClearTimeout = window.clearTimeout.bind(window)
  const originalSetInterval = window.setInterval.bind(window)
  const originalClearInterval = window.clearInterval.bind(window)
  const performanceNow =
    typeof performance !== "undefined" && performance.now
      ? () => performance.now()
      : () => Date.now()

  const patchedSetTimeout = function setTimeoutPatched(
    handler: TimerHandler,
    timeout?: number,
    ...args: any[]
  ): ReturnType<typeof originalSetTimeout> {
    if (typeof handler !== "function") {
      return originalSetTimeout(
        handler,
        timeout,
        ...args
      ) as unknown as ReturnType<typeof originalSetTimeout>
    }

    const stack = captureStack("Timer created")
    let timerKey: TimerHandle | null = null
    const wrappedHandler = (...cbArgs: any[]) => {
      if (timerKey) {
        timerRegistry.delete(timerKey)
      }
      handler(...cbArgs)
    }

    const handle = originalSetTimeout(
      wrappedHandler,
      timeout,
      ...args
    ) as unknown as ReturnType<typeof originalSetTimeout>

    timerKey = handle as TimerHandle

    const assuredKey = timerKey as TimerHandle

    timerRegistry.set(assuredKey, {
      id: assuredKey,
      type: "timeout",
      createdAt: performanceNow(),
      delay: typeof timeout === "number" ? timeout : 0,
      stack,
    })

    return handle
  }

  const patchedClearTimeout = function clearTimeoutPatched(
    handle: Parameters<typeof window.clearTimeout>[0]
  ): void {
    timerRegistry.delete(handle as TimerHandle)
    originalClearTimeout(handle)
  }

  const patchedSetInterval = function setIntervalPatched(
    handler: TimerHandler,
    timeout?: number,
    ...args: any[]
  ): ReturnType<typeof originalSetInterval> {
    if (typeof handler !== "function") {
      return originalSetInterval(
        handler,
        timeout,
        ...args
      ) as unknown as ReturnType<typeof originalSetInterval>
    }

    const stack = captureStack("Interval created")
    const handle = originalSetInterval(
      (...cbArgs: any[]) => {
        handler(...cbArgs)
      },
      timeout,
      ...args
    ) as unknown as ReturnType<typeof originalSetInterval>

    const timerKey = handle as unknown as TimerHandle

    timerRegistry.set(timerKey, {
      id: timerKey,
      type: "interval",
      createdAt: performanceNow(),
      delay: typeof timeout === "number" ? timeout : 0,
      stack,
    })

    return handle
  }

  const patchedClearInterval = function clearIntervalPatched(
    handle: Parameters<typeof window.clearInterval>[0]
  ): void {
    timerRegistry.delete(handle as TimerHandle)
    originalClearInterval(handle)
  }

  const wrappedSetTimeout =
    patchedSetTimeout as unknown as typeof window.setTimeout
  const wrappedSetInterval =
    patchedSetInterval as unknown as typeof window.setInterval
  const wrappedClearTimeout =
    patchedClearTimeout as unknown as typeof window.clearTimeout
  const wrappedClearInterval =
    patchedClearInterval as unknown as typeof window.clearInterval

  if ((originalSetTimeout as any).__promisify__) {
    ;(wrappedSetTimeout as any).__promisify__ = (
      originalSetTimeout as any
    ).__promisify__
  }
  if ((originalSetInterval as any).__promisify__) {
    ;(wrappedSetInterval as any).__promisify__ = (
      originalSetInterval as any
    ).__promisify__
  }

  window.setTimeout = wrappedSetTimeout
  window.clearTimeout = wrappedClearTimeout
  window.setInterval = wrappedSetInterval
  window.clearInterval = wrappedClearInterval

  timersPatched = true
}

export interface UseMemoryLeakGuardOptions {
  refs?: Array<React.RefObject<Element | null>>
  timerThresholdMs?: number
  domCheckIntervalMs?: number
  flushOnUnload?: boolean
}

export function useMemoryLeakGuard(
  options: UseMemoryLeakGuardOptions = {}
): void {
  const {
    refs = [],
    timerThresholdMs = 60000,
    domCheckIntervalMs = 3000,
    flushOnUnload = false,
  } = options

  React.useEffect(() => {
    if (!isDev || typeof window === "undefined") return
    patchTimers()

    const now =
      typeof performance !== "undefined" && performance.now
        ? () => performance.now()
        : () => Date.now()

    const checkTimers = () => {
      const current = now()
      timerRegistry.forEach((record) => {
        if (record.warned) return

        const elapsed = current - record.createdAt

        if (
          record.type === "interval" &&
          elapsed > timerThresholdMs &&
          record.delay > 0
        ) {
          record.warned = true
          console.warn(
            `[useMemoryLeakGuard] Interval (id: ${describeHandle(
              record.id
            )}) has been running for ${Math.round(
              elapsed
            )}ms without being cleared. Created with delay ${
              record.delay
            }ms.\n\n${record.stack ?? ""}`
          )
        }

        if (
          record.type === "timeout" &&
          record.delay > timerThresholdMs &&
          elapsed > timerThresholdMs
        ) {
          record.warned = true
          console.warn(
            `[useMemoryLeakGuard] Timeout (id: ${describeHandle(
              record.id
            )}) scheduled for ${
              record.delay
            }ms may indicate a leak. Consider clearing it on unmount.\n\n${
              record.stack ?? ""
            }`
          )
        }
      })
    }

    checkTimers()
    const timerId = window.setInterval(
      checkTimers,
      Math.min(timerThresholdMs, 10000)
    )

    return () => {
      window.clearInterval(timerId)
    }
  }, [timerThresholdMs])

  React.useEffect(() => {
    if (!isDev || typeof window === "undefined" || refs.length === 0) return

    const warnedNodes = new WeakSet<Element>()
    const contains = (node: Element) =>
      document.body.contains(node) || node === document.body

    const checkNodes = () => {
      refs.forEach((ref) => {
        const node = ref?.current
        if (node && !contains(node) && !warnedNodes.has(node)) {
          warnedNodes.add(node)
          const stack = captureStack("Detached ref detected")
          console.warn(
            "[useMemoryLeakGuard] A ref still points to a DOM node that is no longer in the document. Make sure to null the ref when removing the element.\n\n",
            node,
            "\n",
            stack ?? ""
          )
        }
      })
    }

    checkNodes()
    const intervalId = window.setInterval(checkNodes, domCheckIntervalMs)
    return () => window.clearInterval(intervalId)
  }, [refs, domCheckIntervalMs])

  React.useEffect(() => {
    if (
      !flushOnUnload ||
      !isDev ||
      typeof window === "undefined" ||
      !timersPatched
    )
      return

    const handleBeforeUnload = () => {
      timerRegistry.forEach((record) => {
        if (record.type === "interval" && !record.warned) {
          record.warned = true
          console.warn(
            `[useMemoryLeakGuard] Interval (id: ${describeHandle(
              record.id
            )}) was still active during unload. Clear intervals in component cleanup to avoid leaks.\n\n${
              record.stack ?? ""
            }`
          )
        }
      })
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [flushOnUnload])
}
