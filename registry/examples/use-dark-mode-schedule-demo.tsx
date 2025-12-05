"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useDarkModeSchedule } from "registry/hooks/use-dark-mode-schedule"

function formatTimeUntil(ms: number | null): string {
  if (ms === null) return "Manual override"
  const minutes = Math.floor(ms / 60000)
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

export default function UseDarkModeScheduleDemo() {
  const [darkStart, setDarkStart] = React.useState("18:00")
  const [darkEnd, setDarkEnd] = React.useState("06:00")
  const [fallbackToSystem, setFallbackToSystem] = React.useState(true)
  const [smoothTransition, setSmoothTransition] = React.useState(false)

  const {
    currentTheme,
    isDarkMode,
    isScheduleActive,
    timeUntilSwitch,
    setTheme,
    reset,
  } = useDarkModeSchedule({
    darkStartTime: darkStart,
    darkEndTime: darkEnd,
    fallbackToSystem,
    smoothTransition,
  })

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="p-0">
          <CardTitle>Dark Mode Schedule</CardTitle>
          <CardDescription>
            Automatically switch themes based on custom schedules with
            system-preference fallback.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dark-start">Dark Mode Start Time</Label>
              <input
                id="dark-start"
                type="time"
                value={darkStart}
                onChange={(e) => setDarkStart(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dark-end">Dark Mode End Time</Label>
              <input
                id="dark-end"
                type="time"
                value={darkEnd}
                onChange={(e) => setDarkEnd(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={fallbackToSystem}
                onCheckedChange={(checked) =>
                  setFallbackToSystem(checked === true)
                }
              />
              Fallback to system preference
            </Label>
            <Label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={smoothTransition}
                onCheckedChange={(checked) =>
                  setSmoothTransition(checked === true)
                }
              />
              Smooth transitions
            </Label>
          </div>

          <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Current Status:</span>
              <Badge
                variant={isDarkMode ? "default" : "secondary"}
                className="uppercase"
              >
                {currentTheme === "system"
                  ? "System"
                  : isDarkMode
                    ? "Dark"
                    : "Light"}
              </Badge>
              <Badge
                variant={isScheduleActive ? "default" : "outline"}
                className="uppercase"
              >
                {isScheduleActive ? "Schedule Active" : "Schedule Inactive"}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Next switch in:{" "}
                <span className="font-semibold text-foreground">
                  {formatTimeUntil(timeUntilSwitch)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTheme("light")}
            >
              Force Light
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTheme("dark")}
            >
              Force Dark
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTheme("system")}
            >
              Use System
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={reset}>
              Reset to Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
