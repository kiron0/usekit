"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useRenderCount } from "registry/hooks/use-render-count"

export default function UseRenderCountDemo() {
  const count = useRenderCount()
  const [numberCount, setNumberCount] = React.useState(0)

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <p>Count: {numberCount}</p>
      <p>Render Count: {count}</p>
      <Button onClick={() => setNumberCount((c) => c + 1)}>Increment</Button>
    </div>
  )
}
