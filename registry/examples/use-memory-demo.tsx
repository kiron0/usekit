"use client"

import { useMemory } from "registry/hooks/use-memory"

export default function UseMemoryDemo() {
  const { isSupported, memory } = useMemory({ interval: 2000, immediate: true })

  if (!isSupported) {
    return <div>Memory API not supported in this browser.</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Memory Usage</h1>
      {memory ? (
        <ul className="text-sm">
          <li>
            JS Heap Size Limit:{" "}
            <span className="font-bold">
              {(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB
            </span>
          </li>
          <li>
            Total JS Heap Size:{" "}
            <span className="font-bold">
              {(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB
            </span>
          </li>
          <li>
            Used JS Heap Size:{" "}
            <span className="font-bold">
              {(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB
            </span>
          </li>
        </ul>
      ) : (
        <p>Loading memory info...</p>
      )}
    </div>
  )
}
