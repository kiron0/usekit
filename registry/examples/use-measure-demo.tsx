"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useMeasure } from "registry/hooks/use-measure"

export default function UseMeasureDemo() {
  const ref = React.useRef<HTMLDivElement>(null)

  const [isStarted, setIsStarted] = React.useState(false)

  const { MeasureComponent, reset, isMobile } = useMeasure({
    ref,
    actionPosition: "top-right",
    measurementPosition: "top-right",
    startMeasure: isStarted,
  })

  if (isMobile) {
    return (
      <p className="text-balance text-center text-muted-foreground">
        This feature is not available on mobile devices
      </p>
    )
  }

  return (
    <div className="w-full space-y-8">
      <div ref={ref} className="h-[60vh] w-full rounded-md border">
        <MeasureComponent />
        <p className="pointer-events-none flex h-full items-center justify-center text-balance px-1 text-center text-muted-foreground">
          {isStarted
            ? "Press and hold to measure distances"
            : "Press the button below to start measuring"}
        </p>
      </div>
      <div className="text-center">
        <Button
          onClick={() => {
            if (isStarted) {
              reset()
            }
            setIsStarted(!isStarted)
          }}
          variant={isStarted ? "destructive" : "default"}
        >
          {isStarted ? "Stop" : "Start"} measuring
        </Button>
      </div>
    </div>
  )
}
