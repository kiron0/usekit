"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import { useIntervalWhen } from "registry/hooks/use-interval-when"

export default function UseIntervalWhenDemo() {
  const [count, setCount] = React.useState(0)
  const [when, setWhen] = React.useState(false)

  useIntervalWhen(
    () => {
      setCount((c) => c + 0.1)
    },
    { ms: 100, when, startImmediately: true }
  )

  return (
    <div className="relative size-52 rounded-full border hover:border-primary/30 dark:bg-zinc-900 dark:shadow">
      <button
        id="toggle-interval"
        title="Click to toggle the timer"
        onClick={() => setWhen(!when)}
        className="absolute left-0 right-0 top-0 z-10 h-full w-full rounded-full bg-transparent text-4xl font-semibold"
      >
        {count.toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}
      </button>
      <Label
        htmlFor="toggle-interval"
        className="absolute bottom-8 left-0 right-0 cursor-pointer text-center text-base capitalize"
      >
        {when ? "stop" : "start"}
      </Label>
    </div>
  )
}
