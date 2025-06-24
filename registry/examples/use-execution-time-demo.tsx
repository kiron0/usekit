"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useExecutionTime } from "registry/hooks/use-execution-time"

export default function UseExecutionTime() {
  const { runWithTiming, time, isRunning } = useExecutionTime()
  const [data, setData] = React.useState<string | null>(null)

  const handleFetch = async () => {
    await runWithTiming(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setData("Fetched data!")
    })
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button onClick={handleFetch} disabled={isRunning}>
        {isRunning ? "Running..." : "Run Task"}
      </Button>

      {time !== null && !isRunning && (
        <div>Execution time: {time.toFixed(2)} ms</div>
      )}

      {data && !isRunning && <div>Result: {data}</div>}
    </div>
  )
}
