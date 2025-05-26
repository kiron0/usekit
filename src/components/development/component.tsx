"use client"

import * as React from "react"

import { DatePicker } from "@/components/date-picker"
import { useTimeAgo } from "registry/hooks/use-time-ago"

const DEFAULT_DATE = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)

export function Component() {
  const [date, setDate] = React.useState<Date | undefined>(DEFAULT_DATE)

  const timeAgo = useTimeAgo(date || DEFAULT_DATE)

  return (
    <div className="flex w-full max-w-xs flex-col items-start gap-4">
      {timeAgo ? (
        <p className="text-sm text-muted-foreground">Last updated: {timeAgo}</p>
      ) : (
        <p className="text-sm text-muted-foreground">No updates available</p>
      )}
      <DatePicker currentDate={date} onUpdateDate={setDate} />
    </div>
  )
}
