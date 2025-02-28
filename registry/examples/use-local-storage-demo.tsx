"use client"

import { useLocalStorage } from "registry/use-local-storage/use-local-storage"

import { Button } from "@/components/ui/button"

export default function UseLocalStorageDemo() {
  const [count, setCount] = useLocalStorage("local-count", 0)

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <p>Count: {count}</p>
      <div className="flex gap-2">
        <Button onClick={() => setCount((c) => c + 1)}>Increment</Button>
        <Button onClick={() => setCount(0)}>Reset</Button>
      </div>
      <p className="w-3/4 text-center text-muted-foreground">
        Click to increment the counter and watch the count persist in local
        storage!
      </p>
    </div>
  )
}
