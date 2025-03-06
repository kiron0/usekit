"use client"

import * as React from "react"
import { useMeasure } from "registry/hooks/use-measure"

import { Button } from "@/components/ui/button"

export default function UseMeasureDemo() {
  const ref = React.useRef<HTMLDivElement>(null)

  const [isStarted, setIsStarted] = React.useState(false)

  const { MeasureComponent, reset } = useMeasure({
    ref,
    actionPosition: "top-right",
    measurementPosition: "top-right",
    startMeasure: isStarted,
  })

  return (
    <div className="w-full space-y-8">
      <div ref={ref} className="w-full h-[60vh] border rounded-md">
        <MeasureComponent />
      </div>
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground text-balance">
          {isStarted
            ? "Press and hold to measure distances"
            : "Press the button below to start measuring"}
        </p>
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
