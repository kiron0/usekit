"use client"

import * as React from "react"
import { addDays, endOfDay } from "date-fns"
import { Minus, Plus, RotateCcw } from "lucide-react"
import moment from "moment"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCountdown } from "registry/hooks/use-countdown"

const UNIT_MS = {
  seconds: 1000,
  minutes: 60_000,
  hours: 3_600_000,
  days: 86_400_000,
  weeks: 7 * 86_400_000,
} as const

type CountdownUnit = keyof typeof UNIT_MS

const DEFAULT_COUNTDOWN_MS = 60_000

function clampEndTime(nextMs: number, minMs: number, maxMs: number) {
  return Math.min(maxMs, Math.max(minMs, nextMs))
}

export default function UseCountdownDemo() {
  const [endTime, setEndTime] = React.useState(
    () => new Date(Date.now() + DEFAULT_COUNTDOWN_MS)
  )
  const [complete, setComplete] = React.useState(false)
  const [amount, setAmount] = React.useState(1)
  const [unit, setUnit] = React.useState<CountdownUnit>("minutes")

  const maxDay = endOfDay(addDays(new Date(), 30))

  const { remaining, isPaused, pause, resume } = useCountdown(endTime, {
    onTick: (time) =>
      console.log(`Tick: ${Math.round(time / 1000)}s remaining`),
    onComplete: () => setComplete(true),
  })

  const applyStep = React.useCallback(() => {
    setComplete(false)
    const now = Date.now()
    const minMs = now + 1000
    const maxMs = maxDay.getTime()
    const delta = amount * UNIT_MS[unit]
    const nextMs = clampEndTime(now + delta, minMs, maxMs)
    setEndTime(new Date(nextMs))
  }, [amount, unit, maxDay])

  const resetToDefault = React.useCallback(() => {
    setComplete(false)
    const now = Date.now()
    const minMs = now + 1000
    const maxMs = maxDay.getTime()
    const nextMs = clampEndTime(now + DEFAULT_COUNTDOWN_MS, minMs, maxMs)
    setEndTime(new Date(nextMs))
    setAmount(1)
    setUnit("minutes")
  }, [maxDay])

  const handleClick = (additionalTime: number) => {
    if (complete) return
    setComplete(false)
    const now = Date.now()
    const minMs = now + 1000
    const maxMs = maxDay.getTime()
    setEndTime((prev) => {
      const nextMs = clampEndTime(prev.getTime() + additionalTime, minMs, maxMs)
      return new Date(nextMs)
    })
  }

  const formatTime = (milliseconds: number): string => {
    const d = moment.duration(Math.max(0, milliseconds))
    const hours = Math.floor(d.asHours())
    const minutes = d.minutes()
    const seconds = d.seconds()
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center space-y-6">
      <div className="w-full space-y-4">
        <div className="rounded-lg border bg-card/30 p-4">
          <p className="mb-3 text-center text-xs font-medium text-muted-foreground">
            Set countdown length — Apply starts from now
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 items-center justify-center gap-2 sm:justify-start">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 shrink-0"
                onClick={() => setAmount((n) => Math.max(1, n - 1))}
                aria-label="Decrease amount"
              >
                <Minus className="size-4" />
              </Button>
              <span className="min-w-[2.5rem] text-center text-lg font-semibold tabular-nums">
                {amount}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 shrink-0"
                onClick={() => setAmount((n) => n + 1)}
                aria-label="Increase amount"
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <div className="flex flex-1 flex-col gap-2 sm:max-w-[200px]">
              <Label className="text-xs font-medium text-muted-foreground">
                Unit
              </Label>
              <Select
                value={unit}
                onValueChange={(v) => setUnit(v as CountdownUnit)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button type="button" className="flex-1" onClick={applyStep}>
              Apply
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              disabled={complete}
              onClick={() => {
                if (isPaused) {
                  setComplete(false)
                  resume()
                } else {
                  pause()
                }
              }}
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-2 w-full gap-2"
            onClick={resetToDefault}
          >
            <RotateCcw className="size-4" aria-hidden />
            Reset — 1:00 from now & default controls
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            <strong>Reset</strong> clears completion, sets a fresh 1-minute
            countdown, and restores amount (1) and unit (minutes).{" "}
            <strong>+5s / +10s / +15s</strong> add to the current end time.{" "}
            <strong>Pause</strong> freezes the timer; <strong>Resume</strong>{" "}
            continues from the same remaining time.
          </p>
        </div>
      </div>

      <div className="space-y-1 text-center">
        <h3 className="text-5xl font-bold">
          {complete ? "Complete!" : formatTime(remaining)}
        </h3>
        {isPaused && !complete && (
          <p className="text-sm font-medium text-muted-foreground">Paused</p>
        )}
      </div>
      {!complete && !isPaused && (
        <div className="flex flex-wrap items-center justify-center gap-2">
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
      <p className="text-balance text-center text-sm text-muted-foreground">
        Check the console to see the countdown tick every second.
      </p>
    </div>
  )
}
