"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useTaskQueue } from "registry/hooks/use-task-queue"

export default function UseTaskQueueDemo() {
  const { enqueue, cancelAll } = useTaskQueue({ concurrency: 2 })
  const [results, setResults] = React.useState<string[]>([])
  const [running, setRunning] = React.useState(0)
  const [pending, setPending] = React.useState(0)

  const createTask = React.useCallback(
    (name: string, duration: number, priority: number = 0) => {
      return async () => {
        setRunning((prev) => prev + 1)
        setPending((prev) => Math.max(0, prev - 1))

        await new Promise((resolve) => setTimeout(resolve, duration))

        setRunning((prev) => prev - 1)
        return `Task ${name} completed`
      }
    },
    []
  )

  const handleEnqueue = React.useCallback(
    (name: string, duration: number, priority: number = 0) => {
      setPending((prev) => prev + 1)
      enqueue(createTask(name, duration, priority), { priority })
        .then((result) => {
          setResults((prev) => [...prev, result])
        })
        .catch((error) => {
          setResults((prev) => [
            ...prev,
            `Task ${name} failed: ${error.message}`,
          ])
        })
        .finally(() => {
          setPending((prev) => Math.max(0, prev - 1))
        })
    },
    [enqueue, createTask]
  )

  const handleCancelAll = React.useCallback(() => {
    cancelAll()
    setPending(0)
    setResults((prev) => [...prev, "All pending tasks cancelled"])
  }, [cancelAll])

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <Label>Running: {running}</Label>
          </div>
          <div className="text-sm">
            <Label>Pending: {pending}</Label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleEnqueue("A", 1000, 1)}
            variant="outline"
            size="sm"
          >
            Enqueue Task A (Priority 1, 1s)
          </Button>
          <Button
            onClick={() => handleEnqueue("B", 1500, 2)}
            variant="outline"
            size="sm"
          >
            Enqueue Task B (Priority 2, 1.5s)
          </Button>
          <Button
            onClick={() => handleEnqueue("C", 800, 0)}
            variant="outline"
            size="sm"
          >
            Enqueue Task C (Priority 0, 0.8s)
          </Button>
          <Button
            onClick={() => handleEnqueue("D", 1200, 3)}
            variant="outline"
            size="sm"
          >
            Enqueue Task D (Priority 3, 1.2s)
          </Button>
          <Button
            onClick={() => handleEnqueue("E", 600, 1)}
            variant="outline"
            size="sm"
          >
            Enqueue Task E (Priority 1, 0.6s)
          </Button>
          <Button onClick={handleCancelAll} variant="destructive" size="sm">
            Cancel All
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Results (concurrency: 2, higher priority first):</Label>
        <div className="max-h-[300px] min-h-[200px] overflow-y-auto rounded-md border p-4">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tasks completed yet. Click buttons above to enqueue tasks.
            </p>
          ) : (
            <ul className="space-y-1 text-sm">
              {results.map((result, index) => (
                <li key={index} className="font-mono">
                  {result}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
