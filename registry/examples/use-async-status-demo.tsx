"use client"

import { Button } from "@/components/ui/button"
import { useAsyncStatus } from "registry/hooks/use-async-status"

export default function UseAsyncStatusDemo() {
  const [trigger, status, feedbackJsx] = useAsyncStatus(
    async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users")
      if (!response.ok) throw new Error("API Error")
      return { data: await response.json() }
    },
    {
      loadingJsx: <span>Loading...</span>,
      errorJsx: (error) => <span>Error: {(error as Error).message}</span>,
      successJsx: (data) => <span>Result: {JSON.stringify(data)}</span>,
    }
  )

  return (
    <div className="space-y-4 flex flex-col items-center gap-3 overflow-auto">
      <div>{feedbackJsx}</div>
      <Button onClick={trigger} disabled={status.state === "loading"}>
        {status.state === "loading" ? "Processing..." : "Click me"}
      </Button>
      <AnotherComponent />
    </div>
  )
}

export function AnotherComponent() {
  const [trigger, status] = useAsyncStatus(async (id: number) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`
    )
    if (!response.ok) throw new Error("API Error")
    return { data: await response.json() }
  })

  return (
    <div className="space-y-4 flex flex-col items-center gap-3 overflow-hidden">
      {status.state === "success" && (
        <div>Result: {JSON.stringify(status.data)}</div>
      )}
      {status.state === "loading" && <div>Loading...</div>}
      {status.state === "error" && (
        <div>Error occurred: {(status.error as Error).message}</div>
      )}
      <Button onClick={() => trigger(9)}>Fetch Data</Button>
    </div>
  )
}
