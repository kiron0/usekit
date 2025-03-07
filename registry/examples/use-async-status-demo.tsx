"use client"

import { Button } from "@/components/ui/button"
import { useAsyncStatus } from "registry/hooks/use-async-status"

export default function UseAsyncStatusDemo() {
  const [trigger, status, data] = useAsyncStatus(
    async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users")
      if (!response.ok) throw new Error("API Error")
      return { data: await response.json() }
    },
    {
      loading: <span>Loading...</span>,
      error: (error) => <span>Error: {(error as Error).message}</span>,
      success: (data) => <span>Result: {JSON.stringify(data)}</span>,
    }
  )

  return (
    <div className="flex flex-col items-center gap-3 overflow-auto">
      <div>{data}</div>
      <Button onClick={trigger} disabled={status.state === "loading"}>
        {status.state === "loading" ? "Processing..." : "Click me"}
      </Button>
      <AnotherUseAsyncStatusDemo />
    </div>
  )
}

function AnotherUseAsyncStatusDemo() {
  const [trigger, status] = useAsyncStatus(async (id: number) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`
    )
    if (!response.ok) throw new Error("API Error")
    return { data: await response.json() }
  })

  return (
    <div className="flex flex-col items-center gap-3 overflow-auto">
      {status.state === "success" && (
        <div>Result: {JSON.stringify(status.data)}</div>
      )}
      {status.state === "loading" && <div>Loading...</div>}
      {status.state === "error" && (
        <div>Error occurred: {(status.error as Error).message}</div>
      )}
      <Button onClick={() => trigger(6)}>Click me also</Button>
    </div>
  )
}
