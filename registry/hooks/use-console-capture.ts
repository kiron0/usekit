/* eslint-disable no-console */
import * as React from "react"

export type LogLevel =
  | "log"
  | "info"
  | "warn"
  | "error"
  | "debug"
  | "trace"
  | "table"
  | "group"
  | "groupCollapsed"
  | "groupEnd"
  | "clear"

export interface ConsoleLog {
  id: string
  level: LogLevel
  message: string
  args: unknown[]
  timestamp: number
  componentPath?: string
  componentName?: string
  stack?: string
}

export type CaptureScope = "all" | "current" | "path" | "disabled"

export interface UseConsoleCaptureOptions {
  scope?: CaptureScope
  componentPath?: string
  componentName?: string
  maxLogs?: number
  levels?: LogLevel[]
  enabled?: boolean
}

export interface UseConsoleCaptureReturn {
  logs: ConsoleLog[]
  clear: () => void
  setScope: (
    scope: CaptureScope,
    options?: { componentPath?: string; componentName?: string }
  ) => void
  enable: () => void
  disable: () => void
  isEnabled: boolean
  scope: CaptureScope
}

const logStore: ConsoleLog[] = []
const listeners = new Set<() => void>()
let logIdCounter = 0
let maxLogs = 1000

type CaptureSession = {
  enabled: boolean
  scope: CaptureScope
  componentPath?: string
  componentName?: string
  levels: Set<LogLevel>
  maxLogs: number
}

const sessions = new Map<symbol, CaptureSession>()
let anySessionEnabled = false
let anySessionNeedsComponentInfo = false
let enabledLevelsSet = new Set<LogLevel>()

function recomputeDerivedSessionState() {
  anySessionEnabled = false
  anySessionNeedsComponentInfo = false
  enabledLevelsSet = new Set<LogLevel>()

  // To avoid dropping older logs too early, prefer the largest maxLogs across sessions.
  let computedMaxLogs = 0

  for (const session of sessions.values()) {
    if (!session.enabled) continue
    anySessionEnabled = true
    if (session.scope !== "all") anySessionNeedsComponentInfo = true
    for (const lvl of session.levels) enabledLevelsSet.add(lvl)
    computedMaxLogs = Math.max(computedMaxLogs, session.maxLogs)
  }

  // Keep existing default if no sessions are active
  if (computedMaxLogs > 0) maxLogs = computedMaxLogs
}

type ConsoleMethodName =
  | "log"
  | "info"
  | "warn"
  | "error"
  | "debug"
  | "trace"
  | "table"
  | "group"
  | "groupCollapsed"
  | "groupEnd"
  | "clear"

const CAPTURE_FLAG = Symbol.for("useConsoleCapture.interceptor")

// The latest underlying console methods (can be updated if something overwrites console.*)
const nativeConsole: Partial<
  Record<ConsoleMethodName, (...args: unknown[]) => void>
> = {
  log: console.log?.bind(console),
  info: console.info?.bind(console),
  warn: console.warn?.bind(console),
  error: console.error?.bind(console),
  debug: console.debug?.bind(console),
  trace: console.trace?.bind(console),
  table: console.table?.bind(console) as unknown as (
    ...args: unknown[]
  ) => void,
  group: console.group?.bind(console),
  groupCollapsed: console.groupCollapsed?.bind(console),
  groupEnd: console.groupEnd?.bind(console),
  clear: console.clear?.bind(console),
}

let isIntercepted = false

if (typeof window !== "undefined") {
  setupConsoleInterception()
}

function getComponentInfo(): {
  componentPath?: string
  componentName?: string
  stack?: string
} {
  if (typeof window === "undefined") return {}

  try {
    const stack = new Error().stack
    if (!stack) return {}

    const lines = stack.split("\n")
    const componentLine = lines.find(
      (line) =>
        line.includes("at ") &&
        !line.includes("useConsoleCapture") &&
        !line.includes("node_modules") &&
        !line.includes("Error")
    )

    if (componentLine) {
      const pathMatch = componentLine.match(/\((.+):(\d+):(\d+)\)/)
      const nameMatch = componentLine.match(/at\s+(\w+)/)

      return {
        componentPath: pathMatch ? pathMatch[1] : undefined,
        componentName: nameMatch ? nameMatch[1] : undefined,
        stack: componentLine.trim(),
      }
    }
  } catch {
    // Ignore errors
  }

  return {}
}

function shouldCapture(
  scope: CaptureScope,
  scopeComponentPath: string | undefined,
  scopeComponentName: string | undefined,
  componentPath?: string,
  componentName?: string
): boolean {
  switch (scope) {
    case "disabled":
      return false
    case "all":
      return true
    case "current":
      return (
        componentPath === scopeComponentPath ||
        componentName === scopeComponentName
      )
    case "path":
      if (!scopeComponentPath) return false
      return componentPath?.includes(scopeComponentPath) ?? false
    default:
      return false
  }
}

function captureLog(
  level: LogLevel,
  message: string,
  args: unknown[],
  info?: { componentPath?: string; componentName?: string; stack?: string }
): void {
  if (!enabledLevelsSet.has(level)) return

  const log: ConsoleLog = {
    id: `log-${++logIdCounter}`,
    level,
    message,
    args,
    timestamp: Date.now(),
    componentPath: info?.componentPath,
    componentName: info?.componentName,
    stack: info?.stack,
  }

  logStore.push(log)

  if (logStore.length > maxLogs) {
    logStore.shift()
  }

  notifyListeners()
}

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

function serializeArgs(args: unknown[]): string {
  return args
    .map((arg) => {
      if (arg === null) return "null"
      if (arg === undefined) return "undefined"
      if (typeof arg === "string") return arg
      if (typeof arg === "number" || typeof arg === "boolean")
        return String(arg)
      if (arg instanceof Error) return arg.toString()
      try {
        return JSON.stringify(arg, null, 2)
      } catch {
        try {
          return String(arg)
        } catch {
          return "[Unable to serialize]"
        }
      }
    })
    .join(" ")
}

function createConsoleInterceptor(level: ConsoleMethodName) {
  const interceptor = function interceptedConsole(...args: unknown[]) {
    // Capture first so a throwing native console implementation can't drop logs.
    // (We still call native in a try/catch to preserve typical console behavior.)
    const logLevel = level as LogLevel
    if (anySessionEnabled && enabledLevelsSet.has(logLevel)) {
      let info: ReturnType<typeof getComponentInfo> | undefined
      let didComputeInfo = false

      let shouldStore = false
      for (const session of sessions.values()) {
        if (!session.enabled) continue
        if (!session.levels.has(logLevel)) continue

        if (session.scope === "all") {
          shouldStore = true
          break
        }

        if (!anySessionNeedsComponentInfo) continue

        if (!didComputeInfo) {
          info = getComponentInfo()
          didComputeInfo = true
        }

        // If we can't resolve component info, "current/path" can't match reliably.
        if (!info) continue

        if (
          shouldCapture(
            session.scope,
            session.componentPath,
            session.componentName,
            info.componentPath,
            info.componentName
          )
        ) {
          shouldStore = true
          break
        }
      }

      if (shouldStore) {
        const message = serializeArgs(args)
        captureLog(logLevel, message, args, info)
      }
    }

    // Always call the latest underlying implementation
    const native = nativeConsole[level]
    // Guard against accidental self-reference (would cause infinite recursion)
    if (native && native !== interceptor) {
      try {
        native(...args)
      } catch {
        // Swallow to avoid breaking app code on custom/hostile console impls
      }
    }
  }
  ;(interceptor as any)[CAPTURE_FLAG] = true
  return interceptor
}

function setupConsoleInterception() {
  if (typeof window === "undefined") return

  // Idempotent, but also resilient: even if already installed, re-assert our descriptors.
  // (Some environments re-define console methods during HMR/devtools attach.)
  const methods: ConsoleMethodName[] = [
    "log",
    "info",
    "warn",
    "error",
    "debug",
    "trace",
    "table",
    "group",
    "groupCollapsed",
    "groupEnd",
    "clear",
  ]

  const installMethod = (method: ConsoleMethodName) => {
    const existingDesc = Object.getOwnPropertyDescriptor(console, method)

    // Prefer reading the data-descriptor value directly to avoid triggering our own getter.
    const existingValue =
      existingDesc && "value" in existingDesc
        ? (existingDesc as any).value
        : undefined

    // If already our interceptor via getter/setter, keep it
    if (existingDesc?.get && existingDesc?.set) {
      const current = existingDesc.get.call(console)
      if (current && (current as any)[CAPTURE_FLAG]) {
        // Still mark as intercepted so lint is satisfied and state stays consistent
        isIntercepted = true
        return
      }
    }

    // Keep the latest native implementation (only if it is not our interceptor)
    if (
      typeof existingValue === "function" &&
      !(existingValue as any)[CAPTURE_FLAG]
    ) {
      nativeConsole[method] = existingValue.bind(console)
    }

    const interceptor = createConsoleInterceptor(method)

    try {
      Object.defineProperty(console, method, {
        configurable: true,
        enumerable: true,
        get() {
          return interceptor
        },
        set(next) {
          if (typeof next === "function" && !(next as any)[CAPTURE_FLAG]) {
            nativeConsole[method] = next.bind(console)
          }
        },
      })
    } catch {
      // Fallback: direct assignment (less resilient to later overwrites)
      ;(console as any)[method] = interceptor
    }
  }

  methods.forEach(installMethod)

  // Mark interception installed (used by lint + useful signal for callers)
  isIntercepted = true

  // Add global error handlers once
  if (typeof window !== "undefined") {
    const w = window as any
    if (!w.__consoleCaptureErrorHandler) {
      const errorHandler = (event: ErrorEvent) => {
        if (anySessionEnabled && enabledLevelsSet.has("error")) {
          captureLog("error", `Uncaught Error: ${event.message}`, [event.error])
        }
      }

      const rejectionHandler = (event: PromiseRejectionEvent) => {
        if (anySessionEnabled && enabledLevelsSet.has("error")) {
          captureLog("error", `Unhandled Promise Rejection: ${event.reason}`, [
            event.reason,
          ])
        }
      }

      window.addEventListener("error", errorHandler)
      window.addEventListener("unhandledrejection", rejectionHandler)
      w.__consoleCaptureErrorHandler = errorHandler
      w.__consoleCaptureRejectionHandler = rejectionHandler
    }
  }
}

export function useConsoleCapture(
  options: UseConsoleCaptureOptions = {}
): UseConsoleCaptureReturn {
  const {
    scope = "all",
    componentPath,
    componentName,
    maxLogs: maxLogsOption = 1000,
    levels = [
      "log",
      "info",
      "warn",
      "error",
      "debug",
      "trace",
      "table",
      "group",
      "groupCollapsed",
      "groupEnd",
      "clear",
    ],
    enabled = true,
  } = options

  const [logs, setLogs] = React.useState<ConsoleLog[]>([])
  const [isEnabledState, setIsEnabledState] = React.useState(enabled)
  const [currentScopeState, setCurrentScopeState] =
    React.useState<CaptureScope>(scope)

  const initialEnabledRef = React.useRef(isEnabledState)
  const initialScopeRef = React.useRef(currentScopeState)

  const sessionIdRef = React.useRef<symbol | null>(null)
  const componentPathRef = React.useRef<string | undefined>(componentPath)
  const componentNameRef = React.useRef<string | undefined>(componentName)
  const levelsRef = React.useRef<Set<LogLevel>>(new Set(levels))
  const maxLogsRef = React.useRef<number>(maxLogsOption)

  levelsRef.current = new Set(levels)
  maxLogsRef.current = maxLogsOption

  // Keep component path/name in sync with incoming props unless user overrides via setScope().
  // We treat "override" as: componentPathRef/componentNameRef no longer equals the last provided props.
  const lastProvidedComponentPathRef = React.useRef<string | undefined>(
    componentPath
  )
  const lastProvidedComponentNameRef = React.useRef<string | undefined>(
    componentName
  )

  React.useEffect(() => {
    const prevProvidedPath = lastProvidedComponentPathRef.current
    const prevProvidedName = lastProvidedComponentNameRef.current

    if (componentPathRef.current === prevProvidedPath) {
      componentPathRef.current = componentPath
    }
    if (componentNameRef.current === prevProvidedName) {
      componentNameRef.current = componentName
    }

    lastProvidedComponentPathRef.current = componentPath
    lastProvidedComponentNameRef.current = componentName
  }, [componentPath, componentName])

  React.useLayoutEffect(() => {
    setupConsoleInterception()
    if (!sessionIdRef.current)
      sessionIdRef.current = Symbol("useConsoleCapture")

    const id = sessionIdRef.current
    sessions.set(id, {
      enabled: initialEnabledRef.current,
      scope: initialScopeRef.current,
      componentPath: componentPathRef.current,
      componentName: componentNameRef.current,
      levels: levelsRef.current,
      maxLogs: maxLogsRef.current,
    })
    recomputeDerivedSessionState()

    return () => {
      sessions.delete(id)
      recomputeDerivedSessionState()
    }
  }, [])

  React.useEffect(() => {
    const id = sessionIdRef.current
    if (!id) return
    const existing = sessions.get(id)
    if (!existing) return

    sessions.set(id, {
      ...existing,
      enabled: isEnabledState,
      scope: currentScopeState,
      componentPath: componentPathRef.current,
      componentName: componentNameRef.current,
      levels: levelsRef.current,
      maxLogs: maxLogsRef.current,
    })
    recomputeDerivedSessionState()
  }, [
    isEnabledState,
    currentScopeState,
    componentPath,
    componentName,
    maxLogsOption,
    levels,
  ])

  React.useEffect(() => {
    const updateLogs = () => {
      setLogs([...logStore])
    }

    listeners.add(updateLogs)
    updateLogs()

    return () => {
      listeners.delete(updateLogs)
    }
  }, [])

  const clear = React.useCallback(() => {
    logStore.length = 0
    notifyListeners()
  }, [])

  const setScope = React.useCallback(
    (
      newScope: CaptureScope,
      options?: { componentPath?: string; componentName?: string }
    ) => {
      // Update local state first; global session sync happens via effect.
      componentPathRef.current = options?.componentPath ?? componentPath
      componentNameRef.current = options?.componentName ?? componentName
      setCurrentScopeState(newScope)

      // Ensure we don't miss logs if scope value stays the same (no state change => no effect run).
      const id = sessionIdRef.current
      if (!id) return
      const existing = sessions.get(id)
      if (!existing) return
      sessions.set(id, {
        ...existing,
        scope: newScope,
        componentPath: componentPathRef.current,
        componentName: componentNameRef.current,
      })
      recomputeDerivedSessionState()
    },
    [componentPath, componentName]
  )

  const enable = React.useCallback(() => {
    setIsEnabledState(true)
  }, [])

  const disable = React.useCallback(() => {
    setIsEnabledState(false)
  }, [])

  return {
    logs,
    clear,
    setScope,
    enable,
    disable,
    isEnabled: isEnabledState,
    scope: currentScopeState,
  }
}
