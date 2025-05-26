"use client"

import { useClock } from "registry/hooks/use-clock"

export default function UseClockDemo() {
  const time = useClock()

  return (
    <div className="text-center">
      {time ? (
        <div className="space-y-2">
          <p className="text-4xl font-semibold">{time}</p>
          <p className="text-muted-foreground">Current Time</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No updates available</p>
      )}
    </div>
  )
}
