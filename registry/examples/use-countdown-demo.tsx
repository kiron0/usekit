"use client"

import * as React from "react"
import { useCountdown } from "registry/hooks/use-countdown"

import { Button } from "@/components/ui/button"

export default function UseCountdownDemo() {
  const [endTime, setEndTime] = React.useState(new Date(Date.now() + 10000))
  const [complete, setComplete] = React.useState(false)

  const count = useCountdown(endTime, {
    interval: 1000,
    onTick: (time) =>
      console.log(`Tick: ${Math.round(time / 1000)}s remaining`),
    onComplete: () => setComplete(true),
  })

  const handleClick = (additionalTime: number) => {
    if (complete) return
    const newEndTime = endTime.getTime() + additionalTime
    setEndTime(new Date(newEndTime))
  }

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.ceil(milliseconds / 1000)
    return `${seconds}s`
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <h3 className="text-5xl font-bold text-center">
        {complete ? "Complete!" : formatTime(count)}
      </h3>
      {!complete && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="secondary" onClick={() => handleClick(5000)}>
            +5s
          </Button>
          <Button variant="secondary" onClick={() => handleClick(10000)}>
            +10s
          </Button>
          <Button variant="secondary" onClick={() => handleClick(15000)}>
            +15s
          </Button>
        </div>
      )}
      <p className="text-balance text-center text-muted-foreground">
        Check the console to see the countdown tick every second.
      </p>
    </div>
  )
}
