"use client"

import * as React from "react"
import { useVisibilityChange } from "registry/hooks/use-visibility-change"

import { Badge } from "@/components/ui/badge"

export default function VisibilityTracker() {
  const documentVisible = useVisibilityChange()
  const [tabAwayCount, setTabAwayCount] = React.useState(0)

  React.useEffect(() => {
    if (!documentVisible) {
      setTabAwayCount((prev) => prev + 1)
    }
  }, [documentVisible])

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h1 className="text-5xl font-semibold pb-4">{tabAwayCount}</h1>
      <p>Number of times tabbed away</p>
      <div className="flex gap-2">
        Document is currently:{" "}
        <Badge variant={documentVisible ? "default" : "destructive"}>
          {documentVisible ? "Visible" : "Hidden"}
        </Badge>
      </div>
      <p className="text-muted-foreground text-center text-balance">
        Change tab to see the count increase
      </p>
    </div>
  )
}
