"use client"

import { cn } from "@/lib/utils"
import { useBreakpoint } from "registry/hooks/use-breakpoint"

export default function UseBreakpointDemo() {
  const { currentBreakpoint, isAbove, isBelow } = useBreakpoint()

  return (
    <div className="mx-auto w-full max-w-xl space-y-5">
      <div className="mb-5 rounded bg-secondary p-2">
        <h3>Current Breakpoint: {currentBreakpoint || "Unknown"}</h3>
        <div className="flex gap-2">
          <span>sm: {isAbove("sm") ? "✅" : "❌"}</span>
          <span>md: {isAbove("md") ? "✅" : "❌"}</span>
          <span>lg: {isAbove("lg") ? "✅" : "❌"}</span>
          <span>xl: {isAbove("xl") ? "✅" : "❌"}</span>
          <span>2xl: {isAbove("2xl") ? "✅" : "❌"}</span>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-5",
          isAbove("lg")
            ? "grid-cols-3"
            : isAbove("md")
              ? "grid-cols-2"
              : "grid-cols-1"
        )}
      >
        {Array.from({ length: 6 }, (_, i) => i + 1).map((item) => (
          <div key={item} className="rounded-md bg-blue-500 p-4">
            <h3>Item {item}</h3>
            <p>This item responds to screen size changes</p>
          </div>
        ))}
      </div>

      {isAbove("md") && (
        <div className="rounded-md bg-green-500 p-4">
          <h3>Visible only on medium screens and above</h3>
          <p>This content disappears on mobile views</p>
        </div>
      )}

      <div
        className={cn(
          "rounded-md bg-yellow-500 p-4",
          isAbove("lg") ? "p-6 text-lg" : "p-4 text-base"
        )}
      >
        <h3>Dynamically Styled Element</h3>
        <p>
          This element changes its padding and font size based on breakpoints.
          Current breakpoint: <strong>{currentBreakpoint}</strong>
        </p>
      </div>

      {isBelow("md") && (
        <div className="rounded bg-red-500 p-4 shadow-sm">
          <h3>Mobile Only Notice</h3>
          <p>This warning only appears on small screens</p>
        </div>
      )}
    </div>
  )
}
