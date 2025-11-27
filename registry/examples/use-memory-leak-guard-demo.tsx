"use client"

import * as React from "react"
import { AlertTriangle, Cpu, PlayCircle, StopCircle, Wand2 } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useMemoryLeakGuard } from "registry/hooks/use-memory-leak-guard"

export default function UseMemoryLeakGuardDemo() {
  const [intervalCount, setIntervalCount] = React.useState(0)
  const [logs, setLogs] = React.useState<string[]>([])
  const retainedNodeRef = React.useRef<Element | null>(null)
  const leakyElementRef = React.useRef<HTMLDivElement | null>(null)
  const activeIntervals = React.useRef<number[]>([])

  useMemoryLeakGuard({
    refs: [retainedNodeRef],
    timerThresholdMs: 5000,
    domCheckIntervalMs: 2000,
  })

  const startLeakyInterval = () => {
    const id = window.setInterval(() => {
      setLogs((prev) =>
        [
          `Interval ping ${(prev.length % 50) + 1} @ ${new Date().toLocaleTimeString()}`,
          ...prev.slice(0, 4),
        ].filter(Boolean)
      )
    }, 1000)
    activeIntervals.current.push(id)
    setIntervalCount(activeIntervals.current.length)
  }

  const clearIntervals = () => {
    activeIntervals.current.forEach((id) => window.clearInterval(id))
    activeIntervals.current = []
    setIntervalCount(0)
  }

  const captureNodeLeak = () => {
    if (leakyElementRef.current) {
      retainedNodeRef.current = leakyElementRef.current
      setLogs((prev) => [
        "Captured DOM node reference without releasing it.",
        ...prev.slice(0, 4),
      ])
    }
  }

  const releaseNodeLeak = () => {
    retainedNodeRef.current = null
    setLogs((prev) => ["Released retained DOM reference.", ...prev.slice(0, 4)])
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader className="flex flex-col justify-between gap-2 lg:flex-row">
          <div>
            <CardTitle>Memory Leak Playground</CardTitle>
            <CardDescription>
              Trigger timers and detached nodes—warnings appear in the dev
              console.
            </CardDescription>
          </div>
          <Badge variant={intervalCount > 0 ? "destructive" : "secondary"}>
            {intervalCount} runaway interval{intervalCount === 1 ? "" : "s"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              Timer leak simulation
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={startLeakyInterval}>
                <PlayCircle className="h-4 w-4" />
                Start runaway interval
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={clearIntervals}
                disabled={intervalCount === 0}
              >
                <StopCircle className="h-4 w-4" />
                Clear intervals
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Guard warns when an interval lives longer than 5 seconds without
              cleanup.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Wand2 className="h-4 w-4 text-muted-foreground" />
              Detached DOM reference
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={captureNodeLeak}>
                Capture node reference
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={releaseNodeLeak}
                disabled={!retainedNodeRef.current}
              >
                Release reference
              </Button>
            </div>
            <div className="rounded-lg border bg-muted/20 p-4">
              <div
                ref={leakyElementRef}
                className="rounded-md border bg-background p-3 text-sm"
              >
                Interactive panel (capture me to simulate a detached ref leak)
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Capturing the node without releasing it simulates keeping refs to
              removed DOM nodes.
            </p>
          </section>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>
              This demo logs warnings in the dev console only. In production
              builds the guard no-ops.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">
              Recent activity
            </p>
            <ul className="text-xs text-muted-foreground">
              {logs.length === 0 && <li>No events yet.</li>}
              {logs.map((entry, index) => (
                <li key={`${entry}-${index}`}>{entry}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
