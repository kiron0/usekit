"use client"

import * as React from "react"
import { AlertCircle, CheckCircle2, Filter, Info, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  useConsoleCapture,
  type CaptureScope,
  type LogLevel,
} from "registry/hooks/use-console-capture"

function TestComponent({ name }: { name: string }) {
  React.useEffect(() => {
    console.log(`[${name}] Component mounted`)
    console.info(`[${name}] Info message`)
    console.warn(`[${name}] Warning message`)

    return () => {
      console.log(`[${name}] Component unmounted`)
    }
  }, [name])

  const handleClick = () => {
    console.log(`[${name}] Button clicked`)
    console.info(`[${name}] User interaction`)
  }

  const handleError = () => {
    console.error(`[${name}] Error occurred`)
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-2 font-semibold">{name}</h3>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleClick}>
          Log Click
        </Button>
        <Button size="sm" variant="destructive" onClick={handleError}>
          Log Error
        </Button>
      </div>
    </div>
  )
}

export default function UseConsoleCaptureDemo() {
  const { logs, clear, setScope, enable, disable, isEnabled, scope } =
    useConsoleCapture({
      scope: "all",
      enabled: true,
      maxLogs: 1000,
    })

  const [filterLevel, setFilterLevel] = React.useState<LogLevel | "all">("all")
  const [pathFilter, setPathFilter] = React.useState("")

  const filteredLogs = React.useMemo(() => {
    let filtered = logs

    if (filterLevel !== "all") {
      filtered = filtered.filter((log) => log.level === filterLevel)
    }

    if (pathFilter) {
      filtered = filtered.filter(
        (log) =>
          log.componentPath?.includes(pathFilter) ||
          log.componentName?.includes(pathFilter)
      )
    }

    return filtered
  }, [logs, filterLevel, pathFilter])

  const getLogIcon = (level: LogLevel) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warn":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "debug":
        return <Info className="h-4 w-4 text-gray-500" />
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
  }

  const getLogBadgeVariant = (
    level: LogLevel
  ): "default" | "destructive" | "secondary" => {
    switch (level) {
      case "error":
        return "destructive"
      case "warn":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0">
          <div>
            <CardTitle>Console Capture</CardTitle>
            <CardDescription>
              Capture browser console logs and display them in the UI. Filter by
              whole project, current component, specific path, or disable.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Switch
                id="enabled"
                checked={isEnabled}
                onCheckedChange={(checked) => {
                  if (checked) enable()
                  else disable()
                }}
              />
              <Label htmlFor="enabled" className="text-sm">
                {isEnabled ? "Enabled" : "Disabled"}
              </Label>
            </div>
            <Select
              value={scope}
              onValueChange={(value: CaptureScope) => {
                setScope(value)
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Logs</SelectItem>
                <SelectItem value="current">Current Component</SelectItem>
                <SelectItem value="path">By Path</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" onClick={clear} variant="outline" size="sm">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TestComponent name="Component A" />
            <TestComponent name="Component B" />
            <TestComponent name="Component C" />
          </div>

          <div className="rounded-xl border border-dashed border-muted-foreground/40 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <h4 className="text-sm font-semibold">Captured Logs</h4>
                <Badge variant="secondary">{filteredLogs.length} logs</Badge>
              </div>
              <div className="flex gap-2">
                <Select
                  value={filterLevel}
                  onValueChange={(value) =>
                    setFilterLevel(value as LogLevel | "all")
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="log">Log</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warn">Warn</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="text"
                  placeholder="Filter by path/name"
                  value={pathFilter}
                  onChange={(e) => setPathFilter(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                />
              </div>
            </div>

            <div className="max-h-96 space-y-2 overflow-y-auto rounded-md border p-3">
              {filteredLogs.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No logs captured. Try interacting with the components above or
                  check the scope settings.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 rounded-md border p-2 text-sm"
                  >
                    <div className="mt-0.5">{getLogIcon(log.level)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getLogBadgeVariant(log.level)}>
                          {log.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        {log.componentName && (
                          <Badge variant="outline" className="text-xs">
                            {log.componentName}
                          </Badge>
                        )}
                      </div>
                      <div className="font-mono text-xs">{log.message}</div>
                      {log.componentPath && (
                        <div className="text-xs text-muted-foreground">
                          {log.componentPath}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Total Logs</div>
              <div className="text-2xl font-bold">{logs.length}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Errors</div>
              <div className="text-2xl font-bold text-red-500">
                {logs.filter((l) => l.level === "error").length}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Warnings</div>
              <div className="text-2xl font-bold text-yellow-500">
                {logs.filter((l) => l.level === "warn").length}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="text-lg font-semibold">
                {isEnabled ? (
                  <span className="text-green-500">Active</span>
                ) : (
                  <span className="text-gray-500">Inactive</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
