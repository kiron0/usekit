"use client"

import * as React from "react"
import { useRenderCount } from "registry/hooks/use-render-count"

import { Button } from "@/components/ui/button"

export default function UseRenderCountDemo() {
  const { count, isStrictMode } = useRenderCount()
  const [numberCount, setNumberCount] = React.useState(0)

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <p>Count: {numberCount}</p>
      <p>Render Count: {count}</p>
      <Button onClick={() => setNumberCount((c) => c + 1)}>Increment</Button>
      {isStrictMode && (
        <p className="w-3/4 text-center text-muted-foreground">
          Strict Mode is enabled. This component renders twice on every render.
        </p>
      )}
    </div>
  )
}
