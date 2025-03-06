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
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="relative w-8 h-8 mx-auto">
        <div
          className={cn(
            "absolute top-0 left-0 size-8 border-2 rounded-full opacity-0 animate-pulsate",
            isIdle ? "opacity-0" : "border-green-500 opacity-100"
          )}
        />
        <div
          className={cn(
            "absolute top-1.5 left-1.5 size-5 rounded-full",
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
