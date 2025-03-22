"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useStopwatch } from "registry/hooks/use-stopwatch"

export default function UseStopwatchDemo() {
  const { current, isPaused, elapsedSeconds, pause, play, reset, togglePause } =
    useStopwatch()

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative size-52 rounded-full border hover:border-primary/30 dark:bg-zinc-900 dark:shadow">
        <button
          id="toggle-timer"
          title="Click to toggle the timer"
          onClick={() => togglePause()}
          className="absolute left-0 right-0 top-0 z-10 h-full w-full rounded-full bg-transparent text-2xl font-semibold"
        >
          {current}
        </button>
        <Label
          htmlFor="toggle-timer"
          className="absolute bottom-8 left-0 right-0 cursor-pointer text-center text-base capitalize"
        >
          {isPaused ? "play" : "pause"}
        </Label>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={pause} disabled={isPaused}>
          Pause
        </Button>
        <Button type="button" onClick={play} disabled={!isPaused}>
          Play
        </Button>
        <Button
          variant="destructive"
          type="button"
          onClick={reset}
          disabled={elapsedSeconds === 0}
        >
          Reset
        </Button>
        <Button type="button" onClick={togglePause}>
          Toggle Pause
        </Button>
      </div>
    </div>
  )
}
