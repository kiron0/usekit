"use client"

import { useTimeOfDay } from "registry/hooks/use-time-of-day"

export default function UseTimeOfDayDemo() {
  const timeOfDay = useTimeOfDay()

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <p className="text-lg">
        Current Time of Day:{" "}
        <span className="rounded-md bg-primary px-1.5 py-0.5 font-bold capitalize text-primary-foreground">
          {timeOfDay}
        </span>
      </p>
      <p className="text-balance text-center text-sm text-muted-foreground">
        This hook returns the current time of day as a string, which can be one
        of &quot;morning&quot;, &quot;afternoon&quot;, &quot;evening&quot;, or
        &quot;night&quot; based on the current time. It updates automatically as
        the time changes.
      </p>
    </div>
  )
}
