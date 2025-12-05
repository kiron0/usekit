"use client"

/* eslint-disable no-console */
import * as React from "react"

export type LogLevel = "log" | "info" | "warn" | "error" | "debug"

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
let isCapturing = false
let currentScope: CaptureScope = "disabled"
let scopeComponentPath: string | undefined
let scopeComponentName: string | undefined
let maxLogs = 1000
let enabledLevels: LogLevel[] = ["log", "info", "warn", "error", "debug"]

const originalConsole = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  debug: console.debug.bind(console),
  trace: console.trace?.bind(console),
  table: console.table?.bind(console),
  group: console.group?.bind(console),
  groupEnd: console.groupEnd?.bind(console),
  groupCollapsed: console.groupCollapsed?.bind(console),
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
  componentPath?: string,
  componentName?: string
): boolean {
  if (!isCapturing) return false

  switch (currentScope) {
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

function captureLog(level: LogLevel, message: string, args: unknown[]): void {
  if (!shouldCapture() && currentScope !== "all") {
    const info = getComponentInfo()
    if (!shouldCapture(info.componentPath, info.componentName)) {
      return
    }
  }

  if (!enabledLevels.includes(level)) return

  const info = getComponentInfo()
  const log: ConsoleLog = {
    id: `log-${++logIdCounter}`,
    level,
    message,
    args,
    timestamp: Date.now(),
    componentPath: info.componentPath,
    componentName: info.componentName,
    stack: info.stack,
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

function createConsoleInterceptor(level: LogLevel) {
  return function interceptedConsole(...args: unknown[]) {
    if (originalConsole[level]) {
      originalConsole[level](...args)
    }

    if (isCapturing) {
      const message = serializeArgs(args)
      captureLog(level, message, args)
    }
  }
}

function setupConsoleInterception() {
  if (typeof window === "undefined") return

  if (isIntercepted) {
    try {
      Object.defineProperty(console, "log", {
        value: createConsoleInterceptor("log"),
        writable: true,
        configurable: true,
      })
      Object.defineProperty(console, "info", {
        value: createConsoleInterceptor("info"),
        writable: true,
        configurable: true,
      })
      Object.defineProperty(console, "warn", {
        value: createConsoleInterceptor("warn"),
        writable: true,
        configurable: true,
      })
      Object.defineProperty(console, "error", {
        value: createConsoleInterceptor("error"),
        writable: true,
        configurable: true,
      })
      Object.defineProperty(console, "debug", {
        value: createConsoleInterceptor("debug"),
        writable: true,
        configurable: true,
      })
    } catch {
      console.log = createConsoleInterceptor("log")
      console.info = createConsoleInterceptor("info")
      console.warn = createConsoleInterceptor("warn")
      console.error = createConsoleInterceptor("error")
      console.debug = createConsoleInterceptor("debug")
    }
    return
  }

  try {
    Object.defineProperty(console, "log", {
      value: createConsoleInterceptor("log"),
      writable: true,
      configurable: true,
    })

    Object.defineProperty(console, "info", {
      value: createConsoleInterceptor("info"),
      writable: true,
      configurable: true,
    })

    Object.defineProperty(console, "warn", {
      value: createConsoleInterceptor("warn"),
      writable: true,
      configurable: true,
    })

    Object.defineProperty(console, "error", {
      value: createConsoleInterceptor("error"),
      writable: true,
      configurable: true,
    })

    Object.defineProperty(console, "debug", {
      value: createConsoleInterceptor("debug"),
      writable: true,
      configurable: true,
    })

    if (typeof window !== "undefined") {
      const errorHandler = (event: ErrorEvent) => {
        if (isCapturing && enabledLevels.includes("error")) {
          captureLog("error", `Uncaught Error: ${event.message}`, [event.error])
        }
      }

      const rejectionHandler = (event: PromiseRejectionEvent) => {
        if (isCapturing && enabledLevels.includes("error")) {
          captureLog("error", `Unhandled Promise Rejection: ${event.reason}`, [
            event.reason,
          ])
        }
      }

      window.addEventListener("error", errorHandler)
      window.addEventListener("unhandledrejection", rejectionHandler)
      ;(window as any).__consoleCaptureErrorHandler = errorHandler
      ;(window as any).__consoleCaptureRejectionHandler = rejectionHandler
    }

    isIntercepted = true
  } catch (error) {
    console.log = createConsoleInterceptor("log")
    console.info = createConsoleInterceptor("info")
    console.warn = createConsoleInterceptor("warn")
    console.error = createConsoleInterceptor("error")
    console.debug = createConsoleInterceptor("debug")
    isIntercepted = true
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
    levels = ["log", "info", "warn", "error", "debug"],
    enabled = true,
  } = options

  const [logs, setLogs] = React.useState<ConsoleLog[]>([])
  const [isEnabledState, setIsEnabledState] = React.useState(enabled)
  const [currentScopeState, setCurrentScopeState] =
    React.useState<CaptureScope>(scope)

  const isFirstMount = React.useRef(true)

  React.useLayoutEffect(() => {
    setupConsoleInterception()
    maxLogs = maxLogsOption
    enabledLevels = levels

    if (isFirstMount.current && enabled) {
      currentScope = scope
      scopeComponentPath = componentPath
      scopeComponentName = componentName
      isCapturing = true
      isFirstMount.current = false
    }
  }, [enabled, scope, componentPath, componentName, maxLogsOption, levels])

  React.useEffect(() => {
    maxLogs = maxLogsOption
    enabledLevels = levels
  }, [maxLogsOption, levels])

  React.useEffect(() => {
    setupConsoleInterception()

    if (isEnabledState) {
      currentScope = currentScopeState
      scopeComponentPath = componentPath
      scopeComponentName = componentName
      isCapturing = true
    } else {
      isCapturing = false
    }
  }, [isEnabledState, currentScopeState, componentPath, componentName])

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
      currentScope = newScope
      scopeComponentPath = options?.componentPath ?? componentPath
      scopeComponentName = options?.componentName ?? componentName
      setCurrentScopeState(newScope)
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
