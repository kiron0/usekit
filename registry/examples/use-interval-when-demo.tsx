"use client"

import * as React from "react"
import { useIntervalWhen } from "registry/hooks/use-interval-when"

import { Label } from "@/components/ui/label"

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
    <div className="size-52 border dark:bg-zinc-900 dark:shadow-sm hover:border-primary/30 rounded-full relative">
      <button
        id="toggle-timer"
        title="Click to toggle the timer"
        onClick={() => setWhen(!when)}
        className="absolute top-0 left-0 right-0 text-4xl font-semibold z-10 w-full h-full bg-transparent rounded-full"
      >
        {count.toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}
      </button>
      <Label
        htmlFor="toggle-timer"
        className="absolute bottom-8 cursor-pointer right-0 left-0 text-base text-center capitalize"
      >
        {when ? "stop" : "start"}
      </Label>
    </div>
  )
}
