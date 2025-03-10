"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useHover } from "registry/hooks/use-hover"

export default function UseHoverDemo() {
  const [ref, hovering] = useHover()
  const [backgroundColor, setBackgroundColor] = React.useState("")

  React.useEffect(() => {
    if (hovering) {
      setBackgroundColor(
        `#${Math.floor(Math.random() * 16777215).toString(16)}`
      )
    } else {
      setBackgroundColor("")
    }
  }, [hovering])

  return (
    <div
      ref={ref}
      className={cn(
        "flex size-48 items-center justify-center rounded-xl border transition-all",
        hovering
          ? `cursor-crosshair border-[${backgroundColor}]`
          : "border-primary"
      )}
      style={{
        backgroundColor,
      }}
    >
      Hovering? {hovering ? "Yes" : "No"}
    </div>
  )
}
