"use client"

import { useRenderDebugger } from "registry/hooks/use-render-debugger"

export function Component() {
  return (
    <AnalyticsComponent
      id="123"
      data="Hello World"
      metadata={{ key: "value" }}
    />
  )
}

interface ExpensiveComponentProps {
  id: string
  data: any
  metadata: any
}

export function AnalyticsComponent({
  id,
  data,
  metadata,
}: ExpensiveComponentProps) {
  useRenderDebugger(
    "ExpensiveComponent",
    { id, data },
    {
      trackOnly: ["id", "data"],
    }
  )

  return (
    <div>
      <p>ID: {id}</p>
      <p>Data: {JSON.stringify(data)}</p>
      <p>Metadata: {JSON.stringify(metadata)}</p>
    </div>
  )
}
