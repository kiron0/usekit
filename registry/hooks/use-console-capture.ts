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

const DEFAULT_MAX_LOGS = 1000

const logStore: ConsoleLog[] = []
const listeners = new Set<() => void>()
let logIdCounter = 0
let maxLogs = DEFAULT_MAX_LOGS

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

  let computedMaxLogs = 0

  for (const session of sessions.values()) {
    if (!session.enabled) continue
    anySessionEnabled = true
    if (session.scope !== "all" && session.scope !== "disabled") {
      anySessionNeedsComponentInfo = true
    }
    for (const lvl of session.levels) enabledLevelsSet.add(lvl)
    computedMaxLogs = Math.max(computedMaxLogs, session.maxLogs)
  }

  maxLogs = computedMaxLogs > 0 ? computedMaxLogs : DEFAULT_MAX_LOGS
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
const originalConsoleDescriptors: Partial<
  Record<ConsoleMethodName, PropertyDescriptor | undefined>
> = {}

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
let globalErrorHandler: ((event: ErrorEvent) => void) | null = null
let globalRejectionHandler: ((event: PromiseRejectionEvent) => void) | null =
  null

type ComponentInfo = {
  componentPath?: string
  componentName?: string
  stack?: string
}

function parseStackToComponentInfo(stack: string | undefined): ComponentInfo {
  if (!stack) return {}

  try {
    const lines = stack.split("\n")
    const componentLine = lines.find(
      (line) =>
        line.includes("at ") &&
        !line.includes("useConsoleCapture") &&
        !line.includes("node_modules") &&
        !line.includes("Error")
    )

    if (!componentLine) return {}

    const pathMatch = componentLine.match(/\((.+):(\d+):(\d+)\)/)
    const nameMatch = componentLine.match(/at\s+(\w+)/)

    return {
      componentPath: pathMatch ? pathMatch[1] : undefined,
      componentName: nameMatch ? nameMatch[1] : undefined,
      stack: componentLine.trim(),
    }
  } catch {
    return {}
  }
}

function getComponentInfo(): ComponentInfo {
  if (typeof window === "undefined") return {}
  try {
    return parseStackToComponentInfo(new Error().stack)
  } catch {
    return {}
  }
}

function getComponentInfoFromErrorEvent(event: ErrorEvent): ComponentInfo {
  const fromError =
    event.error instanceof Error
      ? parseStackToComponentInfo(event.error.stack)
      : ({} as ComponentInfo)

  const filename = event.filename?.trim()
  return {
    componentPath: filename || fromError.componentPath,
    componentName: fromError.componentName,
    stack:
      fromError.stack ??
      (event.error instanceof Error ? event.error.stack : undefined),
  }
}

function getComponentInfoFromRejection(
  event: PromiseRejectionEvent
): ComponentInfo {
  const reason = event.reason
  if (reason instanceof Error && reason.stack) {
    return parseStackToComponentInfo(reason.stack)
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
    case "current": {
      const wantPath = scopeComponentPath?.trim()
      const wantName = scopeComponentName?.trim()
      if (!wantPath && !wantName) return false
      const gotPath = componentPath?.trim()
      const gotName = componentName?.trim()
      return (
        (!!wantPath && gotPath === wantPath) ||
        (!!wantName && gotName === wantName)
      )
    }
    case "path": {
      const needle = scopeComponentPath?.trim()
      if (!needle) return false
      const haystack = componentPath ?? ""
      return haystack.includes(needle)
    }
    default:
      return false
  }
}

function shouldStoreLog(
  logLevel: LogLevel,
  getCallerInfo: () => ComponentInfo
): boolean {
  if (!anySessionEnabled || !enabledLevelsSet.has(logLevel)) return false

  for (const session of sessions.values()) {
    if (!session.enabled) continue
    if (!session.levels.has(logLevel)) continue
    if (session.scope === "disabled") continue

    if (session.scope === "all") return true

    if (!anySessionNeedsComponentInfo) continue

    const info = getCallerInfo()

    if (session.scope === "path") {
      if (!info.componentPath?.trim()) continue
    } else if (session.scope === "current") {
      if (!info.componentPath?.trim() && !info.componentName?.trim()) continue
    }

    if (
      shouldCapture(
        session.scope,
        session.componentPath,
        session.componentName,
        info.componentPath,
        info.componentName
      )
    ) {
      return true
    }
  }

  return false
}

function captureLog(
  level: LogLevel,
  message: string,
  args: unknown[],
  info?: ComponentInfo
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

let notifyRafId: number | null = null
let notifyMicrotaskPending = false
let isDeliveringListeners = false
let pendingFlushAfterDelivery = false

function flushListenersImpl() {
  if (isDeliveringListeners) {
    pendingFlushAfterDelivery = true
    return
  }

  isDeliveringListeners = true
  try {
    listeners.forEach((listener) => listener())
  } finally {
    isDeliveringListeners = false
    if (pendingFlushAfterDelivery) {
      pendingFlushAfterDelivery = false
      notifyListeners()
    }
  }
}

function notifyListenersSync() {
  if (
    notifyRafId != null &&
    typeof window !== "undefined" &&
    typeof cancelAnimationFrame === "function"
  ) {
    cancelAnimationFrame(notifyRafId)
    notifyRafId = null
  }
  notifyMicrotaskPending = false
  pendingFlushAfterDelivery = false
  listeners.forEach((listener) => listener())
}

function notifyListeners() {
  if (
    typeof window !== "undefined" &&
    typeof requestAnimationFrame === "function"
  ) {
    if (notifyRafId != null) return
    notifyRafId = requestAnimationFrame(() => {
      notifyRafId = null
      flushListenersImpl()
    })
    return
  }

  if (notifyMicrotaskPending) return
  notifyMicrotaskPending = true
  const run = () => {
    notifyMicrotaskPending = false
    flushListenersImpl()
  }
  if (typeof queueMicrotask === "function") {
    queueMicrotask(run)
  } else {
    Promise.resolve().then(run)
  }
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
    const logLevel = level as LogLevel
    let cachedInfo: ComponentInfo | undefined
    const getCallerInfo = (): ComponentInfo => {
      if (!cachedInfo) cachedInfo = getComponentInfo()
      return cachedInfo
    }

    if (shouldStoreLog(logLevel, getCallerInfo)) {
      const message = serializeArgs(args)
      captureLog(logLevel, message, args, cachedInfo)
    }

    const native = nativeConsole[level]

    if (native && native !== interceptor) {
      try {
        native(...args)
      } catch {}
    }
  }
  ;(interceptor as any)[CAPTURE_FLAG] = true
  return interceptor
}

function setupConsoleInterception() {
  if (typeof window === "undefined" || isIntercepted) return

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
    originalConsoleDescriptors[method] = existingDesc

    const existingValue =
      existingDesc && "value" in existingDesc
        ? (existingDesc as any).value
        : (console[method] as unknown)

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
      ;(console as any)[method] = interceptor
    }
  }

  methods.forEach(installMethod)
  isIntercepted = true

  globalErrorHandler = (event: ErrorEvent) => {
    const eventInfo = getComponentInfoFromErrorEvent(event)
    const getCallerInfo = () => eventInfo
    if (shouldStoreLog("error", getCallerInfo)) {
      captureLog(
        "error",
        `Uncaught Error: ${event.message}`,
        [event.error],
        eventInfo
      )
    }
  }

  globalRejectionHandler = (event: PromiseRejectionEvent) => {
    const eventInfo = getComponentInfoFromRejection(event)
    const getCallerInfo = () => eventInfo
    if (shouldStoreLog("error", getCallerInfo)) {
      captureLog(
        "error",
        `Unhandled Promise Rejection: ${event.reason}`,
        [event.reason],
        eventInfo
      )
    }
  }

  window.addEventListener("error", globalErrorHandler)
  window.addEventListener("unhandledrejection", globalRejectionHandler)
}

function teardownConsoleInterception() {
  if (typeof window === "undefined" || !isIntercepted) {
    return
  }

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

  methods.forEach((method) => {
    const originalDescriptor = originalConsoleDescriptors[method]

    if (originalDescriptor) {
      if ("value" in originalDescriptor) {
        Object.defineProperty(console, method, {
          ...originalDescriptor,
          value: nativeConsole[method] ?? originalDescriptor.value,
        })
      } else {
        Object.defineProperty(console, method, originalDescriptor)
      }
    } else if (nativeConsole[method]) {
      ;(console as any)[method] = nativeConsole[method]
    }
  })

  if (globalErrorHandler) {
    window.removeEventListener("error", globalErrorHandler)
    globalErrorHandler = null
  }

  if (globalRejectionHandler) {
    window.removeEventListener("unhandledrejection", globalRejectionHandler)
    globalRejectionHandler = null
  }

  isIntercepted = false
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
      if (sessions.size === 0) {
        teardownConsoleInterception()
      }
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
    notifyListenersSync()
  }, [])

  const setScope = React.useCallback(
    (
      newScope: CaptureScope,
      options?: { componentPath?: string; componentName?: string }
    ) => {
      componentPathRef.current = options?.componentPath ?? componentPath
      componentNameRef.current = options?.componentName ?? componentName
      setCurrentScopeState(newScope)

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
