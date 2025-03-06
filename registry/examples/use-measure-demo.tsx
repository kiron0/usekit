"use client"

import { useMeasure } from "registry/hooks/use-measure"

export default function UseMeasureDemo() {
  const { MeasureComponent } = useMeasure({
    borderRadius: 0,
    actionPosition: "top-right",
    measurementPosition: "top-right",
  })

  return (
    <div className="space-y-4 text-center">
      <p className="text-muted-foreground text-balance">
        Press and hold to measure distances
      </p>
      <MeasureComponent />
    </div>
  )
}
