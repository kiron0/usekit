"use client"

import * as React from "react"
import { useHover } from "registry/hooks/use-hover"

import { cn } from "@/lib/utils"

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
        "size-60 md:min-size-96 rounded-xl flex justify-center items-center border border-[#adfa1d]",
        hovering ? "cursor-cell border-dashed" : ""
      )}
      style={{
        backgroundColor,
      }}
    >
      Hovering? {hovering ? "Yes" : "No"}
    </div>
  )
}
