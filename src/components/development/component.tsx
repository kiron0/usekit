"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useErrorBoundary } from "registry/hooks/use-error-boundary"

function FaultyComponent() {
  const [count, setCount] = React.useState(0)

  if (count >= 3) {
    throw new Error("Count exceeded limit of 3")
  }

  return (
    <Button onClick={() => setCount(count + 1)}>
      Increment Count: {count}
    </Button>
  )
}

function ErrorFallback({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <h2>Something went wrong!</h2>
      <Button onClick={reset}>Try Again</Button>
    </div>
  )
}

export function Component() {
  const { ErrorBoundary, hasError, error, resetError } = useErrorBoundary()

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <ErrorBoundary fallback={<ErrorFallback reset={resetError} />}>
        <FaultyComponent />
      </ErrorBoundary>
      {hasError && error && (
        <div className="rounded-md border border-destructive p-4">
          <p>Error: {error.message}</p>
        </div>
      )}
    </div>
  )
}
