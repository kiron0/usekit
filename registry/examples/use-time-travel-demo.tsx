"use client"

import * as React from "react"
import { Clock, History, RefreshCcw, RotateCcw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTimeTravel } from "registry/hooks/use-time-travel"

const PRIORITIES = ["low", "medium", "high"] as const

type SnapshotState = {
  form: {
    title: string
    summary: string
    priority: (typeof PRIORITIES)[number]
  }
  step: number
}

export default function UseTimeTravelDemo() {
  const [form, setForm] = React.useState<SnapshotState["form"]>({
    title: "Checkout flow polish",
    summary: "Tighten up transitions and gather notes from QA runs.",
    priority: "medium",
  })
  const [step, setStep] = React.useState(1)

  const { history, snapshot, restore, clear } = useTimeTravel<SnapshotState>(
    "use-time-travel-demo",
    {
      maxHistory: 10,
      resolver: React.useCallback(
        () => ({
          form,
          step,
        }),
        [form, step]
      ),
      onRestore: React.useCallback(
        (state: SnapshotState) => {
          setForm(state.form)
          setStep(state.step)
        },
        [setForm, setStep]
      ),
    }
  )

  const handleSnapshot = React.useCallback(() => {
    snapshot(undefined, { label: `Step ${step}` })
  }, [snapshot, step])

  const handleRestoreLatest = React.useCallback(() => {
    restore()
  }, [restore])

  const handleFullRewind = React.useCallback(() => {
    restore(0)
  }, [restore])

  const handleFieldChange = <T extends keyof SnapshotState["form"]>(
    field: T,
    value: SnapshotState["form"][T]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader className="flex flex-col justify-between gap-3 lg:flex-row">
          <div>
            <CardTitle>Time Travel Debugger</CardTitle>
            <CardDescription>
              Snapshot your component state tree and replay it when QA reports a
              bug.
            </CardDescription>
          </div>
          <Badge variant="secondary">
            <History className="h-3.5 w-3.5" />
            {history.length} snapshots
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(event) =>
                  handleFieldChange("title", event.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                rows={4}
                value={form.summary}
                onChange={(event) =>
                  handleFieldChange("summary", event.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(value: SnapshotState["form"]["priority"]) =>
                  handleFieldChange("priority", value)
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue
                    placeholder="Pick priority"
                    className="capitalize"
                  />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem
                      key={priority}
                      value={priority}
                      className="capitalize"
                    >
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="step">QA Step</Label>
              <Input
                id="step"
                type="number"
                min={1}
                value={step}
                onChange={(event) => setStep(Number(event.target.value) || 1)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleSnapshot}>
              <Clock className="h-4 w-4" />
              Snapshot
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleRestoreLatest}
              disabled={!history.length}
            >
              <RefreshCcw className="h-4 w-4" />
              Restore latest
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleFullRewind}
              disabled={!history.length}
            >
              <RotateCcw className="h-4 w-4" />
              Rewind to first
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={clear}
              disabled={!history.length}
            >
              Clear timeline
            </Button>
          </div>

          <div className="rounded-xl border border-dashed border-muted-foreground/40">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <History className="h-4 w-4" />
                Snapshot timeline
              </div>
              <span className="text-xs text-muted-foreground">
                Click an entry to restore
              </span>
            </div>
            <div className="max-h-48 space-y-1 overflow-y-auto p-3 text-sm">
              {history.length === 0 ? (
                <p className="rounded-md border border-dashed border-muted-foreground/30 p-3 text-muted-foreground">
                  No snapshots yet. Capture a state during your debugging
                  session.
                </p>
              ) : (
                history
                  .map((entry, index) => ({ entry, index }))
                  .reverse()
                  .map(({ entry, index }) => {
                    const actualIndex = history.length - 1 - index
                    return (
                      <button
                        key={`${entry.id}-${entry.version}`}
                        type="button"
                        onClick={() => restore(actualIndex)}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition hover:bg-muted"
                      >
                        <span className="font-medium">
                          {entry.label ?? `Snapshot ${entry.version}`}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                      </button>
                    )
                  })
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
