"use client"

import { iconMap } from "@/utils"

import { cn } from "@/lib/utils"
import { useLocation } from "registry/hooks/use-location"

export default function UseLocationDemo() {
  const location = useLocation()

  if (!location) {
    return (
      <div className="flex w-full items-center justify-center">
        <p className="p-8">Loading...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <header className="mb-8 text-center">
        <h2 className="mb-2 text-2xl tracking-tighter">
          📍 useLocation Hook Preview
        </h2>
        <p className="text-gray-neutral">
          Observe changes in the browser&apos;s location state in real-time.
        </p>
      </header>

      <div className="mb-4">
        <span className="inline-block rounded-full bg-secondary px-2 py-1 text-xs">
          Triggered by: {location.trigger}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(location).map(([key, value]) => {
          if (key === "trigger") {
            return null
          }

          return (
            <div
              key={key}
              className={cn(
                "flex overflow-auto rounded-xl border bg-secondary p-4",
                typeof value === "object" ? "" : "items-center"
              )}
            >
              <div className="mr-4">{iconMap[key]}</div>
              <div>
                <h3 className="text-sm font-medium capitalize tracking-tight">
                  {key}
                </h3>
                <pre className="text-xs leading-4">
                  {typeof value === "object"
                    ? JSON.stringify(value, null, 2)
                    : String(value) || "N/A"}
                </pre>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
