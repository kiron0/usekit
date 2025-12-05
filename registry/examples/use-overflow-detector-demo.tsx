"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useOverflowDetector } from "registry/hooks/use-overflow-detector"

export default function UseOverflowDetectorDemo() {
  const [content, setContent] = React.useState("Short content")
  const horizontalOverflow = useOverflowDetector()
  const verticalOverflow = useOverflowDetector()

  const longContent =
    "This is a very long piece of content that will definitely cause horizontal overflow when the container is narrow. It contains many words and characters that extend beyond the visible area."

  return (
    <div className="flex h-96 w-full flex-col gap-2">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Overflow Detection</h3>
        <p className="text-sm text-muted-foreground">
          Resize the container or change content to see overflow detection
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setContent(
                content === "Short content" ? longContent : "Short content"
              )
            }
            className="rounded-md border bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Toggle Content Length
          </button>
        </div>

        <div className="flex flex-1 gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">Horizontal Overflow</h4>
              <span
                className={cn(
                  "rounded px-2 py-1 text-xs",
                  horizontalOverflow.hasOverflow.horizontal &&
                    "bg-red-500/20 text-red-600",
                  !horizontalOverflow.hasOverflow.horizontal &&
                    "bg-green-500/20 text-green-600"
                )}
              >
                {horizontalOverflow.hasOverflow.horizontal ? "Yes" : "No"}
              </span>
            </div>
            <div
              ref={horizontalOverflow.ref}
              className={cn(
                "flex-1 overflow-auto rounded-md border bg-secondary/50 p-4",
                horizontalOverflow.hasOverflow.horizontal && "border-red-500"
              )}
              style={{ maxWidth: "300px" }}
            >
              <p className="whitespace-nowrap text-sm">{content}</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">Vertical Overflow</h4>
              <span
                className={cn(
                  "rounded px-2 py-1 text-xs",
                  verticalOverflow.hasOverflow.vertical &&
                    "bg-red-500/20 text-red-600",
                  !verticalOverflow.hasOverflow.vertical &&
                    "bg-green-500/20 text-green-600"
                )}
              >
                {verticalOverflow.hasOverflow.vertical ? "Yes" : "No"}
              </span>
            </div>
            <div
              ref={verticalOverflow.ref}
              className={cn(
                "flex-1 overflow-auto rounded-md border bg-secondary/50 p-4",
                verticalOverflow.hasOverflow.vertical && "border-red-500"
              )}
              style={{ maxHeight: "100px" }}
            >
              <div className="space-y-2 text-sm">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i}>Line {i + 1} of content</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
