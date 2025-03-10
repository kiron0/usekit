import * as React from "react"

import { cn } from "@/lib/utils"
import { useIdle } from "registry/hooks/use-idle"

const time = 10000 // 10 seconds

export default function UseIdleDemo() {
  const [timer, setTimer] = React.useState(time)
  const isIdle = useIdle(timer)

  React.useEffect(() => {
    if (isIdle) {
      setTimer(time)
    } else {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 0) {
            clearInterval(interval)
            return 0
          }
          return prev - 1000
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isIdle])

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative mx-auto h-8 w-8">
        <div
          className={cn(
            "absolute left-0 top-0 size-8 animate-pulsate rounded-full border-2 opacity-0",
            isIdle ? "opacity-0" : "border-green-500 opacity-100"
          )}
        />
        <div
          className={cn(
            "absolute left-1.5 top-1.5 size-5 rounded-full",
            isIdle ? "bg-yellow-500" : "bg-green-500"
          )}
        />
      </div>
      <h2 className="text-xl font-semibold">
        User Status: {isIdle ? "⏸️ Idle" : "▶️ Active"}
      </h2>
      {/* add timer */}
      <p className="text-lg">Timer: {timer / 1000}s</p>
      <p className="text-muted-foreground">
        Move your mouse or press any key to reset the idle timer
      </p>
    </div>
  )
}
