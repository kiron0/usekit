"use client"

import * as React from "react"
import { Pause, Play, TimerReset } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useIdleCallback } from "registry/hooks/use-idle-callback"

export default function UseIdleCallbackDemo() {
  const [runs, setRuns] = React.useState(0)
  const [budget, setBudget] = React.useState<number | null>(null)

  const { isSupported, isPending, didTimeout, start, cancel } = useIdleCallback(
    (deadline) => {
      setRuns((count) => count + 1)
      setBudget(Math.round(deadline.timeRemaining()))
    },
    { autoStart: false, timeout: 500 }
  )

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TimerReset className="h-5 w-5" />
              Idle Callback
            </CardTitle>
            <CardDescription>
              Schedule non-urgent work when the browser has breathing room
              instead of competing with input and rendering.
            </CardDescription>
          </div>
          <Badge
            variant={isSupported ? "default" : "outline"}
            className="flex items-center gap-1"
          >
            {isPending ? "Pending idle task" : "Idle task ready"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Runs
              </p>
              <p className="mt-2 text-lg font-semibold">{runs}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Last budget
              </p>
              <p className="mt-2 text-lg font-semibold">
                {budget === null ? "Not run yet" : `${budget}ms`}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Timeout path
              </p>
              <p className="mt-2 text-lg font-semibold">
                {didTimeout ? "Timed out" : "Idle budget"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => start()}
              disabled={!isSupported || isPending}
            >
              <Play className="h-4 w-4" />
              Schedule work
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={cancel}
              disabled={!isPending}
            >
              <Pause className="h-4 w-4" />
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Good for analytics flushes, low-priority precomputation, and
            background hydration helpers that should stay out of the critical
            path.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
