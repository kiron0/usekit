"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { usePrevious } from "registry/hooks/use-previous"

function getRandomColor() {
  const colors = ["green", "blue", "purple", "red", "pink"]
  return colors[Math.floor(Math.random() * colors.length)]
}

export default function UsePreviousDemo() {
  const [color, setColor] = React.useState(getRandomColor)
  const previousColor = usePrevious(color)

  const handleClick = () => {
    let newColor: string
    do {
      newColor = getRandomColor()
    } while (color === newColor)

    setColor(newColor)
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Button className="link" onClick={handleClick}>
        Next
      </Button>
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <div
            style={{ background: `${previousColor}` }}
            className="size-40 rounded-lg border"
          />
          <p>Previous: {previousColor ?? "None"}</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div
            style={{ background: `${color}` }}
            className="size-40 rounded-lg border"
          />
          <p>Current: {color}</p>
        </div>
      </div>
    </div>
  )
}
